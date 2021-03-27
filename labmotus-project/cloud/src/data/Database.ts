import {Assessment, AssessmentState, Clinician, Patient, SignUpParams, User} from "../../../common/types/types";
import moment, {Moment} from "moment";
import AWS from 'aws-sdk';
import {ReadStream} from "fs";

const awsParams = { region: 'us-east-1' };

const DynamoDB = new AWS.DynamoDB.DocumentClient(awsParams);
const PATIENTS_TABLE = "labmotus-patients";
const CLINICIANS_TABLE = "labmotus-clinicians";
const ASSESSMENTS_TABLE = "labmotus-assessments";
const FIREBASE_ID_COLUMN = "firebaseId";

const S3 = new AWS.S3(awsParams);
const VIDEO_BUCKET = "labmotus-videos";

class Database {
    // tslint:disable-next-line:no-empty
    constructor() {
    }

    private static _readStringArray(dbArray: any): string[] {
        if(dbArray && dbArray.length == 1 && !dbArray[0]) {
            return [];
        }
        return dbArray;
    }

    private static _buildUserFromItem(item: AWS.DynamoDB.DocumentClient.AttributeMap): User {
        return {
            id: item.id,
            firebaseId: item.firebaseId || undefined,
            name: item.name,
            email: item.email || undefined
        }
    }

    private static _buildPatientFromItem(item: AWS.DynamoDB.DocumentClient.AttributeMap): Patient {
        return {
            user: Database._buildUserFromItem(item),
            patientCode: item.patientCode || undefined,
            clinicianID: item.clinicianID,
            phone: item.phone,
            birthday: moment(item.birthday),
            incomplete: item.incomplete
        }
    }

    private static _buildClinicianFromItem(item: AWS.DynamoDB.DocumentClient.AttributeMap): Clinician {
        return {
            user: Database._buildUserFromItem(item),
            clinic: item.clinic,
            patientIDs: Database._readStringArray(item.patientIDs)
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
            poseData: item.poseData ? JSON.parse(item.poseData) : undefined,
            joints: Database._readStringArray(item.joints),
            stats: Database._readStringArray(item.stats).map(s => JSON.parse(s))
        }
    }

    private static _buildUpdateExpression(modifications: any): string {
        let updateStrings: string[] = [];
        for(let key in modifications) {
            if(key != "user") {
                updateStrings.push(`${key} = "${modifications[key].toString().replace('"', '\\"')}"`);
            }
        }
        if(modifications.user) {
            for(let key in modifications) {
                updateStrings.push(`${key} = "${modifications.user[key].toString().replace('"', '\\"')}"`);
            }
        }

        let updateExpression = "";
        if(updateStrings.length > 0) {
            updateExpression = "set "+updateStrings[0];
            if(updateStrings.length > 1) {
                for(let i = 1; i < updateStrings.length; i++) {
                    updateExpression += ", " + updateStrings[i];
                }
            }
        }
        return updateExpression;
    }

    async getPatientByFirebaseID(firebaseID: string): Promise<Patient> {
        try {
            let data = await DynamoDB.scan({
                TableName: PATIENTS_TABLE,
                FilterExpression: '#F = :f',
                ExpressionAttributeNames: {
                    '#F': FIREBASE_ID_COLUMN
                },
                ExpressionAttributeValues: {
                    ':f': firebaseID
                },
                Limit: 1
            }).promise();
            if(data.Items.length < 1) {
                throw `Patient with given Firebase ID not found`;
            }else {
                return Database._buildPatientFromItem(data.Items[0]);
            }
        }catch(err) {
            console.error(err);
            throw "Database query failed";
        }
    }

    async getClinicianByFirebaseID(firebaseID: string): Promise<Clinician> {
        try {
            let data = await DynamoDB.scan({
                TableName: CLINICIANS_TABLE,
                FilterExpression: '#F = :f',
                ExpressionAttributeNames: {
                    '#F': FIREBASE_ID_COLUMN
                },
                ExpressionAttributeValues: {
                    ':f': firebaseID
                },
                Limit: 1
            }).promise();
            if(data.Items.length < 1) {
                throw `Clinician with given Firebase ID not found`;
            }else {
                return Database._buildClinicianFromItem(data.Items[0]);
            }
        }catch(err) {
            console.error(err);
            throw "Database query failed";
        }
    }

    async getPatientByID(id: string): Promise<Patient> {
        try {
            let data = await DynamoDB.get({
                TableName: PATIENTS_TABLE,
                Key: { id }
            }).promise();
            if(data.Item) {
                return Database._buildPatientFromItem(data.Item);
            }else {
                throw `Patient with given ID not found`
            }
        }catch(err) {
            console.error(err);
            throw "Database query failed";
        }
    }

    async getClinicianByID(id: string): Promise<Clinician> {
        try {
            let data = await DynamoDB.get({
                TableName: CLINICIANS_TABLE,
                Key: { id }
            }).promise();
            if(data.Item) {
                return Database._buildClinicianFromItem(data.Item)
            }else {
                throw `Clinician with given ID not found`
            }
        }catch(err) {
            console.error(err);
            throw "Database query failed";
        }
    }

    async updatePatient(id: string, modifications: {}): Promise<Patient> {
        try {
            let updateExpression = Database._buildUpdateExpression(modifications);
            if(updateExpression) {
                await DynamoDB.update({
                    TableName: PATIENTS_TABLE,
                    Key: { id },
                    ConditionExpression: "attribute_exists(id)",
                    UpdateExpression: updateExpression,
                }).promise();
            }
            return await this.getPatientByID(id);
        }catch(err) {
            console.error(err);
            throw "Failed to update database";
        }
    }

    async updateClinician(id: string, modifications: {}): Promise<Clinician> {
        try {
            let updateExpression = Database._buildUpdateExpression(modifications);
            if(updateExpression) {
                await DynamoDB.update({
                    TableName: CLINICIANS_TABLE,
                    Key: { id },
                    ConditionExpression: "attribute_exists(id)",
                    UpdateExpression: updateExpression,
                }).promise();
            }
            return await this.getClinicianByID(id);
        }catch(err) {
            console.error(err);
            throw "Failed to update database";
        }
    }

    async createAssessment(assessment: Assessment): Promise<Assessment> {
        throw new Error("Not Implemented")
    }

    async getAssessmentsByPatient(ID: string, start: Moment, duration: number, unit: string): Promise<Assessment[]> {
        throw new Error("Not Implemented")
    }

    async getAssessmentByID(patientID: string, assessmentID: string): Promise<Assessment> {
        throw new Error("Not Implemented")
    }

    async updateAssessment(patientID: string, assessmentID: string, changes: any): Promise<void> {
        throw new Error("Not Implemented")
    }

    async saveVideo(userId: string, assessmentID: string, video: NodeJS.ReadableStream): Promise<string> {
        const assessment = await this.getAssessmentByID(userId, assessmentID);
        const params = {Bucket: VIDEO_BUCKET, Key: assessmentID, Body: video};
        const options = {partSize: 10 * 1024 * 1024, queueSize: 1};
        await S3.upload(params, options).promise();
        await this.updateAssessment(userId, assessmentID, {
            "videoUrl": `/video/${assessmentID}`,
            "state": AssessmentState.PENDING
        });
        return assessment.videoUrl;
    }

    async getVideo(userId: string, assessmentID: string): Promise<string | ReadStream> {
        const params = {Bucket: VIDEO_BUCKET, Key: assessmentID, Expires: 300};
        return S3.getSignedUrlPromise('getObject', params);
    }

    async createPatient(clinician: Clinician, patient: Patient): Promise<Patient> {
        throw new Error("Not Implemented")
    }

    async createClinician(newClinician: Clinician): Promise<Clinician> {
        throw new Error("Not Implemented")
    }

    async finalizePatient(params: SignUpParams): Promise<string> {
        throw new Error("Not Implemented")
    }
}

export default Database;
