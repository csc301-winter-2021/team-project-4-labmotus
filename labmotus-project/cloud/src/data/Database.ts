import {Assessment, Clinician, Patient, SignUpParams, User} from "../../../common/types/types";
import moment, {Moment} from "moment";
import AWS from 'aws-sdk';

const DynamoDB = new AWS.DynamoDB({region: 'us-east-1'});
const s3 = new AWS.S3({region: 'us-east-1'});
const PATIENTS_TABLE = "labmotus-patients";
const CLINICIANS_TABLE = "labmotus-clinicians";
const ASSESSMENTS_TABLE = "labmotus-assessments";

class Database {
    // tslint:disable-next-line:no-empty
    constructor() {
    }

    private static _buildUserFromItem(item: AWS.DynamoDB.AttributeMap): User {
        return {
            id: item.id.S,
            firebaseId: item.firebaseId.S || undefined,
            name: item.name.S,
            email: item.email.S || undefined
        }
    }

    private static _buildPatientFromItem(item: AWS.DynamoDB.AttributeMap): Patient {
        return {
            user: Database._buildUserFromItem(item),
            patientCode: item.patientCode.S || undefined,
            clinicianID: item.clinicianId.S,
            phone: item.phone.S,
            birthday: moment(item.birthday.S)
        }
    }

    private static _buildClinicianFromItem(item: AWS.DynamoDB.AttributeMap): Clinician {
        return {
            patientIDs: [],
            user: Database._buildUserFromItem(item),
            clinic: item.clinic.S
        }
    }

    async getPatientByFirebaseID(firebaseID: string): Promise<Patient> {
        return new Promise<Patient>((fulfill, reject) => {
            DynamoDB.scan({
                TableName: PATIENTS_TABLE,
                FilterExpression: 'firebaseId = :f',
                ExpressionAttributeValues: {
                    ':f': {
                        S: firebaseID
                    }
                },
                Limit: 1
            }, (err, data) => {
                if(err || data.Items.length < 1) {
                    console.error(err);
                    reject("Database query failed");
                }else {
                    fulfill(Database._buildPatientFromItem(data.Items[0]));
                }
            });
        });
    }

    async getClinicianByFirebaseID(firebaseID: string): Promise<Clinician> {
        return new Promise<Clinician>((fulfill, reject) => {
            DynamoDB.scan({
                TableName: CLINICIANS_TABLE,
                FilterExpression: 'firebaseId = :f',
                ExpressionAttributeValues: {
                    ':f': {
                        S: firebaseID
                    }
                },
                Limit: 1
            }, (err, data) => {
                if(err || data.Items.length < 1) {
                    console.error(err);
                    reject("Database query failed");
                }else {
                    fulfill(Database._buildClinicianFromItem(data.Items[0]));
                }
            });
        });
    }

    async getPatientByID(ID: string): Promise<Patient> {
        return new Promise<Patient>((fulfill, reject) => {
            DynamoDB.getItem({
                TableName: PATIENTS_TABLE,
                Key: {
                    'id': {
                        S: ID
                    }
                }
            }, (err, data) => {
                if(err) {
                    console.error(err);
                    reject("Database query failed");
                }else {
                    fulfill(Database._buildPatientFromItem(data.Item));
                }
            });
        });
    }

    async getClinicianByID(ID: string): Promise<Clinician> {
        return new Promise<Clinician>((fulfill, reject) => {
            DynamoDB.getItem({
                TableName: CLINICIANS_TABLE,
                Key: {
                    'id': {
                        S: ID
                    }
                }
            }, (err, data) => {
                if(err) {
                    console.error(err);
                    reject("Database query failed");
                } else {
                    fulfill(Database._buildClinicianFromItem(data.Item));
                }
            });
        });
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

    async saveVideo(assessmentID: string, video: NodeJS.ReadableStream): Promise<string> {
        const params = {Bucket: 'labmotus-videos', Key: assessmentID, Body: video};
        const options = {partSize: 10 * 1024 * 1024, queueSize: 1};
        s3.upload(params, options, (err, data) => {
            console.log(err, data);
        });
        return `/video/${assessmentID}`;
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
