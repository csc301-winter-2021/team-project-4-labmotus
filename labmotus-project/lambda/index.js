import config from "./config.json";

const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const AWS = require('aws-sdk');

const awsParams = { region: 'us-east-1' };
const S3 = new AWS.S3(awsParams);
const DynamoDB = new AWS.DynamoDB.DocumentClient(awsParams);

const KEY_PREFIX = "assessment_";
const ASSESSMENTS_TABLE = config.assessmentTable;
const JOB_ID_COLUMN = "wrnchJob";
const ASSESSMENTS_STATE_COLUMN = "state";
const WRNCH_API = "https://api.wrnch.ai/v1/";

function checkAssessment(id) {
    return new Promise((resolve, reject) => {
        console.log(`Checking if assessment ${id} exists`);
        DynamoDB.get({
            TableName: ASSESSMENTS_TABLE,
            Key: { id }
        }).send((err, data) => {
            if(err) {
                reject(err);
            }else if(data.Item) {
                console.log(`Assessment ${id} exists!`);
                resolve();
            }else {
                reject(`Assessment ${id} does not exist`);
            }
        });
    });
}

function getVideoFile(bucket, key) {
    return new Promise((resolve, reject) => {
        console.log(`Retrieving ${key} from ${bucket}`);
        S3.getObject({
            Bucket: bucket,
            Key: key
        }).send((err, data) => {
            if(err) {
                reject(err);
            }else {
                console.log(`${key} retrieved!`);
                resolve(data.Body);
            }
        });
    });
}

function uploadToWrnch(file, filename) {
    return new Promise((resolve, reject) => {
        console.log(`Creating new wrnch job for ${filename}`);
        fs.readFile("WRNCH_API_KEY", (err, data) => {
            if(err) {
                reject(err);
            }else {
                /* global URLSearchParams */
                var loginParams = new URLSearchParams();
                loginParams.append('api_key', data.toString());

                var jobParams = new FormData();
                jobParams.append('media', file, { filename });
                jobParams.append('work_type', 'json');
                jobParams.append('est_3d', 'true');

                fetch(WRNCH_API + "login", {
                    method: 'POST',
                    body: loginParams
                })
                .then(r => r.json())
                .then(res => res["access_token"])
                .then(token => fetch(WRNCH_API + "jobs", {
                    method: 'POST',
                    headers: {
                        'Authorization': "Bearer " + token
                    },
                    body: jobParams
                }))
                .then(r => r.json())
                .then(res => {
                    console.log(`Job for ${filename} created!`);
                    resolve(res["job_id"])
                })
                .catch(reject);
            }
        });
    });
}

function updateAssessment(assessmentId, jobId) {
    return new Promise((resolve, reject) => {
        console.log(`Updating state for assessment ${assessmentId}`);
        DynamoDB.update({
            TableName: ASSESSMENTS_TABLE,
            Key: {
                id: assessmentId
            },
            UpdateExpression: 'set #J = :j, #S = :s',
            ExpressionAttributeNames: {
                '#J': JOB_ID_COLUMN,
                '#S': ASSESSMENTS_STATE_COLUMN
            },
            ExpressionAttributeValues: {
                ':j': jobId,
                ':s': "PENDING"
            }
        }).send((err, _) => {
            if(err) {
                reject(err);
            }else {
                console.log(`Assessment ${assessmentId} updated!`);
                resolve();
            }
        });
    });
}

exports.handler = async (event) => {
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

    if(srcKey.startsWith(KEY_PREFIX)) {
        const assessmentId = srcKey.substring(KEY_PREFIX.length, srcKey.length - 4);
        try {
            await checkAssessment(assessmentId);
            let video = await getVideoFile(srcBucket, srcKey);
            let jobId = await uploadToWrnch(video, srcKey);
            await updateAssessment(assessmentId, jobId);
        }catch(e) {
            console.log(e);
        }
    }else {
        console.log(`${srcKey} is not an assessment`);
    }
};
