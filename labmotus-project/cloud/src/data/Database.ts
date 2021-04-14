import AWS from "aws-sdk";
import * as firebaseAdmin from "firebase-admin";
import firebase from "firebase/app";
import fs, {ReadStream} from "fs";
import moment, {Moment} from "moment";
import fetch from "node-fetch";
import {v4 as uuid} from 'uuid';

import config from "../../config.json";
import {Assessment, AssessmentState, Clinician, Patient, PoseData, SignUpParams, Stats, User} from "../../../common/types/types";

import processWrnchData from "../wrnch/processWrnch";


const awsParams = {region: 'us-east-1'};

const DynamoDB = new AWS.DynamoDB.DocumentClient(awsParams);
const PATIENTS_TABLE = config.patientsTable;
const CLINICIANS_TABLE = config.cliniciansTable;
const ASSESSMENTS_TABLE = config.assessmentsTable;
const DATE_COLUMN = "date";
const FIREBASE_ID_COLUMN = "firebaseId";
const PATIENT_ID_COLUMN = "patientId";
const FIREBASE_ID_INDEX = "firebaseId-index";
const PATIENT_ID_INDEX = "patientId-index";

const S3 = new AWS.S3(awsParams);
const VIDEO_BUCKET = config.videoBucket;
const VIDEO_KEY_PREFIX = "assessment_";
const VIDEO_KEY_SUFFIX = ".mp4";

const WRNCH_API = "https://api.wrnch.ai/v1/";
const WRNCH_PROCESSED = "Processed";

interface UpdateParams {
    UpdateExpression: string,
    ExpressionAttributeNames: { [key: string]: any },
    ExpressionAttributeValues: { [key: string]: any }
}

class Database {

    firebaseClient: firebase.app.App;

    constructor(firebaseClient: firebase.app.App) {
        this.firebaseClient = firebaseClient;
    }

    private static _buildUserFromItem(item: any): User {
        return {
            id: item.id,
            firebaseId: item.firebaseId || undefined,
            name: item.name,
            email: item.email || undefined
        }
    }

    private static _buildPatientFromItem(item: any): Patient {
        return {
            user: Database._buildUserFromItem(item),
            patientCode: item.patientCode || undefined,
            clinicianID: item.clinicianID,
            phone: item.phone,
            birthday: moment(item.birthday),
            incomplete: item.incomplete
        }
    }

    private static _buildClinicianFromItem(item: any): Clinician {
        return {
            user: Database._buildUserFromItem(item),
            clinic: item.clinic,
            patientIDs: item.patientIDs
        }
    }

    private static _buildAssessmentFromItem(item: AWS.DynamoDB.DocumentClient.AttributeMap): Assessment {
        return {
            id: item.id,
            patientId: item.patientId,
            name: item.name,
            date: moment(item.date),
            state: item.state,
            videoUrl: item.videoUrl || undefined,
            wrnchJob: item.wrnchJob || undefined,
            poseData: item.poseData || undefined,
            joints: item.joints,
            stats: item.stats || undefined,
            notes: item.notes
        }
    }

    private static _buildUpdateParams(modifications: any): UpdateParams {
        const updateNameValuePairs: string[][] = [];
        for (const key in modifications) {
            if (key !== "user" && modifications[key] !== undefined) {
                updateNameValuePairs.push([key, modifications[key]]);
            }
        }
        if (modifications.user) {
            for (const key in modifications.user) {
                if (modifications.user[key] !== undefined) {
                    updateNameValuePairs.push([key, modifications.user[key]]);
                }
            }
        }

        let updateExpression = "";
        if (updateNameValuePairs.length > 0) {
            updateExpression = "set #k0 = :v0";
            if (updateNameValuePairs.length > 1) {
                for (let i = 1; i < updateNameValuePairs.length; i++) {
                    updateExpression += `, #k${i} = :v${i}`
                }
            }
        }
        return {
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: updateNameValuePairs.reduce((prev, kv, i) => {
                prev['#k' + i] = kv[0];
                return prev;
            }, {}),
            ExpressionAttributeValues: updateNameValuePairs.reduce((prev, kv, i) => {
                prev[':v' + i] = kv[1];
                return prev;
            }, {})
        };
    }

    private static async _checkAssessmentJob(assessment: Assessment): Promise<{ poseData: PoseData, stats: Stats[] }> {
        if (assessment.state === AssessmentState.PENDING && assessment.wrnchJob) {
            const api_key = await fs.promises.readFile("WRNCH_API_KEY");
            const loginParams = new URLSearchParams();
            loginParams.append('api_key', api_key.toString());
            const token = await fetch(WRNCH_API + "login", {
                method: 'POST',
                body: loginParams
            })
                .then(r => r.json())
                .then(res => res["access_token"]);

            const status = await fetch(WRNCH_API + `status/${assessment.wrnchJob}`, {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + token
                }
            })
                .then(r => r.json());

            if (status === WRNCH_PROCESSED) {
                const data = await fetch(WRNCH_API + `jobs/${assessment.wrnchJob}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': "Bearer " + token
                    }
                })
                    .then(r => r.json());
                return processWrnchData(data, assessment.joints);
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    async getPatientByFirebaseID(firebaseID: string): Promise<Patient> {
        try {
            const data = await DynamoDB.query({
                TableName: PATIENTS_TABLE,
                IndexName: FIREBASE_ID_INDEX,
                KeyConditionExpression: '#F = :f',
                ExpressionAttributeNames: {
                    '#F': FIREBASE_ID_COLUMN
                },
                ExpressionAttributeValues: {
                    ':f': firebaseID
                },
                Limit: 1
            }).promise();
            if (data.Items.length < 1) {
                throw `Patient with given Firebase ID not found`;
            } else {
                return Database._buildPatientFromItem(data.Items[0]);
            }
        } catch (err) {
            console.error(err);
            throw "Database query failed";
        }
    }

    async getClinicianByFirebaseID(firebaseID: string): Promise<Clinician> {
        try {
            const data = await DynamoDB.query({
                TableName: CLINICIANS_TABLE,
                IndexName: FIREBASE_ID_INDEX,
                KeyConditionExpression: '#F = :f',
                ExpressionAttributeNames: {
                    '#F': FIREBASE_ID_COLUMN
                },
                ExpressionAttributeValues: {
                    ':f': firebaseID
                },
                Limit: 1
            }).promise();
            if (data.Items.length < 1) {
                throw `Clinician with given Firebase ID not found`;
            } else {
                return Database._buildClinicianFromItem(data.Items[0]);
            }
        } catch (err) {
            console.error(err);
            throw "Database query failed";
        }
    }

    async getPatientByID(id: string): Promise<Patient> {
        try {
            const data = await DynamoDB.get({
                TableName: PATIENTS_TABLE,
                Key: {id}
            }).promise();
            if (data.Item) {
                return Database._buildPatientFromItem(data.Item);
            } else {
                throw `Patient with given ID not found`;
            }
        } catch (err) {
            console.error(err);
            throw "Database query failed";
        }
    }

    async getClinicianByID(id: string): Promise<Clinician> {
        try {
            const data = await DynamoDB.get({
                TableName: CLINICIANS_TABLE,
                Key: {id}
            }).promise();
            if (data.Item) {
                return Database._buildClinicianFromItem(data.Item);
            } else {
                throw `Clinician with given ID not found`;
            }
        } catch (err) {
            console.error(err);
            throw "Database query failed";
        }
    }

    async updatePatient(id: string, modifications: {}): Promise<Patient> {
        try {
            const updateParams = Database._buildUpdateParams(modifications);
            if (updateParams) {
                await DynamoDB.update({
                    TableName: PATIENTS_TABLE,
                    Key: {id},
                    ConditionExpression: "attribute_exists(id)",
                    UpdateExpression: updateParams.UpdateExpression,
                    ExpressionAttributeNames: updateParams.ExpressionAttributeNames,
                    ExpressionAttributeValues: updateParams.ExpressionAttributeValues
                }).promise();
            }
            return await this.getPatientByID(id);
        } catch (err) {
            console.error(err);
            throw "Failed to update database";
        }
    }

    async updateClinician(id: string, modifications: {}): Promise<Clinician> {
        try {
            const updateParams = Database._buildUpdateParams(modifications);
            if (updateParams) {
                await DynamoDB.update({
                    TableName: CLINICIANS_TABLE,
                    Key: {id},
                    ConditionExpression: "attribute_exists(id)",
                    UpdateExpression: updateParams.UpdateExpression,
                    ExpressionAttributeNames: updateParams.ExpressionAttributeNames,
                    ExpressionAttributeValues: updateParams.ExpressionAttributeValues
                }).promise();
            }
            return await this.getClinicianByID(id);
        } catch (err) {
            console.error(err);
            throw "Failed to update database";
        }
    }

    async createAssessment(assessment: Assessment): Promise<Assessment> {
        if (!assessment.patientId || !assessment.name || !assessment.joints || !assessment.joints.length) {
            throw "Incomplete assessment data"
        }

        let assessmentRow = {
            id: undefined,
            patientId: assessment.patientId,
            name: assessment.name,
            date: assessment.date,
            state: AssessmentState.MISSING,
            joints: assessment.joints,
            notes: ""
        }

        // Generate unique assessment id
        const MAX_ITERATIONS = 5; // We will make 5 attempts to generate a UUID, which is generous since we expect **very** few collision to occur
        for (let i = 0; i < MAX_ITERATIONS; i++) {
            assessmentRow.id = uuid();
            try {
                const data = await DynamoDB.get({
                    TableName: ASSESSMENTS_TABLE,
                    Key: {id: assessmentRow.id}
                }).promise();
                if (data.Item) {
                    assessmentRow.id = undefined;
                } else {
                    break;
                }
            } catch (err) {
                console.error(err);
                throw "Failed to generate assessment ID";
            }
        }
        if (assessmentRow.id === undefined) {
            throw "Failed to generate assessment ID";
        }

        // Create row in database
        try {
            await DynamoDB.put({
                TableName: ASSESSMENTS_TABLE,
                Item: assessmentRow
            }).promise();
        } catch (err) {
            console.error(err);
            throw "Failed to create assessment database entry";
        }

        return Database._buildAssessmentFromItem(assessmentRow);
    }

    async getAssessmentsByPatient(ID: string, start: Moment, duration: number, unit: string): Promise<Assessment[]> {
        const end = moment(start).add(duration, unit as any);
        try {
            const data = await DynamoDB.query({
                TableName: ASSESSMENTS_TABLE,
                IndexName: PATIENT_ID_INDEX,
                KeyConditionExpression: '#P = :p',
                FilterExpression: '#D between :start and :end',
                ExpressionAttributeNames: {
                    '#D': DATE_COLUMN,
                    '#P': PATIENT_ID_COLUMN
                },
                ExpressionAttributeValues: {
                    ':p': ID,
                    ':start': start.toISOString(),
                    ':end': end.toISOString()
                }
            }).promise();
            const ret = data.Items.map(Database._buildAssessmentFromItem);
            for (const assessment of ret) {
                const processed = await Database._checkAssessmentJob(assessment);
                if (processed) {
                    await this.updateAssessment(assessment.patientId, assessment.id, {
                        ...processed,
                        state: AssessmentState.COMPLETE
                    });
                    assessment.poseData = processed.poseData;
                    assessment.stats = processed.stats;
                }
            }
            return ret;
        } catch (err) {
            console.error(err);
            throw "Database query failed";
        }
    }

    async getAssessmentByID(patientID: string, assessmentID: string): Promise<Assessment> {
        try {
            const data = await DynamoDB.get({
                TableName: ASSESSMENTS_TABLE,
                Key: {id: assessmentID}
            }).promise();
            if (data.Item) {
                const assessment = Database._buildAssessmentFromItem(data.Item);
                const processed = await Database._checkAssessmentJob(assessment);
                if (processed) {
                    await this.updateAssessment(assessment.patientId, assessment.id, {
                        ...processed,
                        state: AssessmentState.COMPLETE
                    });
                    assessment.poseData = processed.poseData;
                    assessment.stats = processed.stats;
                }
                return assessment;
            } else {
                throw `Assessment with given ID not found`;
            }
        } catch (err) {
            console.error(err);
            throw "Database query failed";
        }
    }

    async updateAssessment(patientID: string, assessmentID: string, changes: any): Promise<void> {
        try {
            const updateParams = Database._buildUpdateParams(changes);
            if (updateParams) {
                await DynamoDB.update({
                    TableName: ASSESSMENTS_TABLE,
                    Key: {id: assessmentID},
                    ConditionExpression: "attribute_exists(id)",
                    UpdateExpression: updateParams.UpdateExpression,
                    ExpressionAttributeNames: updateParams.ExpressionAttributeNames,
                    ExpressionAttributeValues: updateParams.ExpressionAttributeValues
                }).promise();
            }
        } catch (err) {
            console.error(err);
            throw "Failed to update database";
        }
    }

    async saveVideo(userId: string, assessmentID: string, video: NodeJS.ReadableStream): Promise<string> {
        const params = {Bucket: VIDEO_BUCKET, Key: VIDEO_KEY_PREFIX + assessmentID + VIDEO_KEY_SUFFIX, Body: video};
        const options = {partSize: 10 * 1024 * 1024, queueSize: 1};
        try {
            await this.getAssessmentByID(userId, assessmentID); // Check that assessment exists
            const videoUrl = `/video/${assessmentID}`
            await S3.upload(params, options).promise();
            await this.updateAssessment(userId, assessmentID, {
                "videoUrl": videoUrl,
                "state": AssessmentState.PENDING
            });
            return videoUrl;
        } catch (err) {
            console.error(err);
            throw "Video upload failed";
        }
    }

    async getVideo(userId: string, assessmentID: string): Promise<string | ReadStream> {
        const params = {Bucket: VIDEO_BUCKET, Key: VIDEO_KEY_PREFIX + assessmentID + VIDEO_KEY_SUFFIX, Expires: 300};
        return S3.getSignedUrlPromise('getObject', params);
    }

    async createPatient(clinician: Clinician, patient: Patient): Promise<Patient> {
        if (!patient.user || !patient.user.name || !patient.phone || !patient.birthday) {
            throw "Patient data incomplete"
        }

        const patientRow = {
            id: undefined,
            firebaseId: undefined,
            name: patient.user.name,
            email: patient.user.email,
            clinicianID: clinician.user.id,
            phone: patient.phone,
            birthday: patient.birthday,
            incomplete: true
        }

        // Generate unique user id
        const MAX_ITERATIONS = 5; // We will make 5 attempts to generate a UUID, which is generous since we expect **very** few collision to occur
        for (let i = 0; i < MAX_ITERATIONS; i++) {
            patientRow.id = uuid();
            try {
                const data = await DynamoDB.get({
                    TableName: PATIENTS_TABLE,
                    Key: {id: patientRow.id}
                }).promise();
                if (data.Item) {
                    patientRow.id = undefined;
                } else {
                    break;
                }
            } catch (err) {
                console.error(err);
                throw "Failed to generate patient ID";
            }
        }
        if (patientRow.id === undefined) {
            throw "Failed to generate patient ID";
        }

        // Create Firebase user
        const tempPassword = Math.random().toString(36).substring(2, 12); // Random 10-character alphanumeric (lowercase) string
        try {
            const userRecord = await firebaseAdmin.auth().createUser({
                email: patientRow.email,
                password: tempPassword,
            });
            await this.firebaseClient.auth().signInWithEmailAndPassword(patientRow.email, tempPassword);
            patientRow.firebaseId = this.firebaseClient.auth().currentUser.uid;
            await firebaseAdmin.auth().updateUser(userRecord.uid, {disabled: true});
            await this.firebaseClient.auth().sendSignInLinkToEmail(patientRow.email, {
                url: config.actionAddress + "?email=" + patientRow.email,
                handleCodeInApp: true
            });
        } catch (err) {
            console.error(err);
            throw "Failed to create patient credentials";
        }

        // Create row in database
        try {
            await DynamoDB.put({
                TableName: PATIENTS_TABLE,
                Item: patientRow
            }).promise();
        } catch (err) {
            console.error(err);
            throw "Failed to create patient database entry";
        }

        // Add patient to clinician
        clinician.patientIDs.push(patientRow.id);
        await this.updateClinician(clinician.user.id, {patientIDs: clinician.patientIDs});

        return Database._buildPatientFromItem(patientRow);
    }

    async createClinician(newClinician: Clinician): Promise<Clinician> {
        if (!newClinician.user || !newClinician.user.name || !newClinician.clinic || !newClinician.user.email || !newClinician.user.firebaseId) {
            throw "Clinician data incomplete";
        }

        const clinicianRow = {
            id: undefined,
            firebaseId: newClinician.user.firebaseId,
            name: newClinician.user.name,
            email: newClinician.user.email,
            clinic: newClinician.clinic,
            patientIDs: []
        };

        // Generate unique user id
        const MAX_ITERATIONS = 5; // We will make 5 attempts to generate a UUID, which is generous since we expect **very** few collision to occur
        for (let i = 0; i < MAX_ITERATIONS; i++) {
            clinicianRow.id = uuid();
            try {
                const data = await DynamoDB.get({
                    TableName: CLINICIANS_TABLE,
                    Key: {id: clinicianRow.id}
                }).promise();
                if (data.Item) {
                    clinicianRow.id = undefined;
                } else {
                    break;
                }
            } catch (err) {
                console.error(err);
                throw "Failed to generate clinician ID";
            }
        }
        if (clinicianRow.id === undefined) {
            throw "Failed to generate clinician ID";
        }

        // Create row in database
        try {
            await DynamoDB.put({
                TableName: CLINICIANS_TABLE,
                Item: clinicianRow
            }).promise();
        } catch (err) {
            console.error(err);
            throw "Failed to create clinician";
        }

        return Database._buildClinicianFromItem(clinicianRow);
    }

    async finalizePatient(params: SignUpParams): Promise<string> {
        try {
            const user = await firebaseAdmin.auth().getUserByEmail(params.email);
            await firebaseAdmin.auth().updateUser(user.uid, {disabled: false});
            try {
                const databaseUser = await this.getPatientByFirebaseID(user.uid);
                await this.firebaseClient.auth().signInWithEmailLink(params.email, config.actionAddress + "?" + new URLSearchParams(params as any).toString());
                await this.updatePatient(databaseUser.user.id, {incomplete: false});
                return await firebaseAdmin.auth().generateSignInWithEmailLink(params.email, {
                    url: config.actionAddress,
                    handleCodeInApp: true
                });
            } catch (err) {
                await firebaseAdmin.auth().updateUser(user.uid, {disabled: true});
                throw err;
            }
        } catch (err) {
            console.error(err);
            throw "Failed to finalize patient";
        }
    }
}

export default Database;
