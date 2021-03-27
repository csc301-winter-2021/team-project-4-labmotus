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
        let patientIDs: string[] = item.patientIDs;
        if(patientIDs && patientIDs.length == 1 && !patientIDs[0]) {
            patientIDs = [];
        }
        return {
            user: Database._buildUserFromItem(item),
            clinic: item.clinic,
            patientIDs: patientIDs
        }
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

    async updatePatient(ID: string, modifications: {}): Promise<Patient> {
        throw new Error("Not Implemented")
    }

    async updateClinician(ID: string, modifications: {}): Promise<Clinician> {
        throw new Error("Not Implemented")
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
