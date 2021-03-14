import {Assessment, AssessmentState, Clinician, Patient} from "../../../common/types/types";
import Database from "./Database";
import moment, {Moment} from "moment";
import * as fs from "fs";
import path from "path";
import config from "../../config.json";
import {pipeline} from "stream";
import * as util from "util";
import * as firebaseAdmin from 'firebase-admin';
import firebase from 'firebase/app';

const pump = util.promisify(pipeline);

class MockDatabase extends Database {

    patientDatabase: Patient[];
    clinicianDatabase: Clinician[];
    assessmentsDatabase: { [key: string]: Assessment[] };
    assessmentIDs: number;
    userIDs: number;
    firebaseClient: firebase.app.App;

    constructor(firebaseClient: firebase.app.App) {
        super();
        this.assessmentIDs = 0;
        this.userIDs = 0;
        this.firebaseClient = firebaseClient;
        this.patientDatabase = [{
            user: {
                id: this._generateUserID(),
                firebaseId: "Pcq6ISTb2scT7pC2oSonZxOyQqg2",
                name: "LabMotus User",
                email: "user@labmot.us",
            },
            phone: "1234567890",
            clinicianID: '2',
            birthday: moment().subtract(18, 'years')
        }, {
            user: {
                id: this._generateUserID(),
                firebaseId: "kYArwSdCQdgCGjuIjV19flEiolv1",
                name: "LabMotus User1",
                email: "user1@labmot.us",
            },
            phone: "1234567890",
            clinicianID: '2',
            birthday: moment().subtract(18, 'years')
        }];
        this.clinicianDatabase = [{
            user: {
                id: this._generateUserID(),
                firebaseId: "mp0eWztKWdbj0BWDN60ehEKpUj32",
                name: "LabMotus User2",
                email: "user2@labmot.us",
            },
            clinic: "Lab Motus",
            patientIDs: ['0', '1']
        }];
        this.assessmentsDatabase = {};
        for (const patient of this.patientDatabase) {
            this._generateMockAssessments(patient.user.id)
        }
    }

    _generateAssessmentID(): string {
        return (this.assessmentIDs++).toString();
    }

    _generateUserID(): string {
        return (this.userIDs++).toString();
    }

    _generateMockAssessments(id: string) {
        const assessments = [];

        const now = moment().startOf('day');
        for (let i = 0; i < 100; i++) if (i % 2 === 0) {
            const date = moment(now).subtract(i, 'd');
            assessments.push({
                id: this._generateAssessmentID(),
                patientId: id,
                name: "Squat",
                date: date,
                state: AssessmentState.COMPLETE,
                videoUrl: "https://youtu.be/dQw4w9WgXcQ",
                joints: ["Trunk", "Pelvis", "Flexion/Extension", "Valgus/Varus", "Plantarflexion", "Dorsiflexion"],
                stats: [
                    {
                        name: "Trunk",
                        joint: "Trunk",
                        currValue: Math.floor(Math.random() * 180),
                        goalValue: 180,
                        unit: '\xb0'
                    },
                    {
                        name: "Pelvis",
                        joint: "Pelvis",
                        currValue: Math.floor(Math.random() * 180),
                        goalValue: 90,
                        unit: '\xb0'
                    },
                    {
                        name: "Flexion/Extension",
                        joint: "Flexion/Extension",
                        currValue: Math.floor(Math.random() * 180),
                        goalValue: 180,
                        unit: '\xb0'
                    },
                    {
                        name: "Valgus/Varus",
                        joint: "Valgus/Varus",
                        currValue: Math.floor(Math.random() * 180),
                        goalValue: 180,
                        unit: '\xb0'
                    },
                    {
                        name: "Plantarflexion",
                        joint: "Plantarflexion",
                        currValue: Math.floor(Math.random() * 180),
                        goalValue: 180,
                        unit: '\xb0'
                    },
                    {
                        name: "Dorsiflexion",
                        joint: "Dorsiflexion",
                        currValue: Math.floor(Math.random() * 180),
                        goalValue: 180,
                        unit: '\xb0'
                    },

                ]
            });
            assessments.push({
                id: this._generateAssessmentID(),
                patientId: id,
                name: "Hip",
                date: date,
                joints: ["Hip"],
                state: AssessmentState.PENDING,
            });
            assessments.push({
                id: this._generateAssessmentID(),
                patientId: id,
                name: "Arm",
                date: date,
                joints: ["Arm"],
                state: AssessmentState.MISSING,
            });
        }

        this.assessmentsDatabase[id] = assessments;
    }

    async getPatientByFirebaseID(firebaseID: string): Promise<Patient> {
        const matches = this.patientDatabase.filter(patient => patient.user.firebaseId === firebaseID);
        if (matches.length > 0) {
            return matches[matches.length - 1];
        } else {
            return Promise.reject("No Patient With That ID")
        }
    }

    async getClinicianByFirebaseID(firebaseID: string, create: boolean = true): Promise<Clinician> {
        const matches = this.clinicianDatabase.filter(clinician => clinician.user.firebaseId === firebaseID);
        if (matches.length > 0) {
            return matches[matches.length - 1];
        } else {
            return Promise.reject("No Patient With That ID")
        }
    }

    async getPatientByID(ID: string): Promise<Patient> {
        const matches = this.patientDatabase.filter(patient => patient.user.id === ID);
        if (matches.length > 0) {
            return matches[matches.length - 1];
        } else {
            return Promise.reject("No Patient With That ID")
        }
    }

    async getClinicianByID(ID: string): Promise<Clinician> {
        const matches = this.clinicianDatabase.filter(clinician => clinician.user.id === ID);
        if (matches.length > 0) {
            return matches[matches.length - 1];
        } else {
            return Promise.reject("No Clinician With That ID")
        }
    }

    async updatePatient(ID: string, modifications: {}): Promise<Patient> {
        const patient = await this.getPatientByID(ID);
        const updated = mergeObjects(patient, modifications);
        this.patientDatabase.push(updated);
        return updated;
    }

    async updateClinician(ID: string, modifications: {}): Promise<Clinician> {
        const clinician = await this.getClinicianByID(ID);
        const updated = mergeObjects(clinician, modifications);
        this.clinicianDatabase.push(updated);
        return updated;
    }

    async getAssessmentsByPatient(ID: string, start: Moment, duration: number, unit: string): Promise<Assessment[]> {
        if (!this.assessmentsDatabase.hasOwnProperty(ID))
            return [];
        const assessments = this.assessmentsDatabase[ID];
        const end = moment(start).add(duration, unit as any);
        const startUnix = start.unix();
        const endUnix = end.unix();
        return assessments.filter(ass => startUnix <= ass.date.unix() && ass.date.unix() <= endUnix);
    }

    async getAssessmentByID(patientID: string, assessmentID: string): Promise<Assessment> {
        const matches = this.assessmentsDatabase[patientID]?.filter(ass => ass.id === assessmentID);
        if (matches.length > 0) {
            return matches[matches.length - 1];
        } else {
            return Promise.reject("No Assessment With That ID")
        }
    }

    async createAssessment(assessment: Assessment): Promise<Assessment> {
        assessment = {...assessment};
        assessment.state = AssessmentState.MISSING;
        assessment.videoUrl = undefined;
        assessment.id = this._generateAssessmentID();
        assessment.date = moment(assessment.date);
        assessment.stats = undefined;
        assessment.poseData = undefined;
        assessment.wrnchJob = undefined;
        if (!this.assessmentsDatabase.hasOwnProperty(assessment.patientId))
            this.assessmentsDatabase[assessment.patientId] = [assessment];
        else
            this.assessmentsDatabase[assessment.patientId].push(assessment);
        return assessment;
    }

    async saveVideo(assessmentID: string, video: NodeJS.ReadableStream): Promise<string> {
        await pump(video, fs.createWriteStream(path.join(config.videoPath, assessmentID + ".mp4")));
        return `/video/${assessmentID}`;
    }

    async _firebaseCreateUser(properties: firebaseAdmin.auth.CreateRequest): Promise<firebaseAdmin.auth.UserRecord> {
        return new Promise<firebaseAdmin.auth.UserRecord>((resolve, reject) => {
            firebaseAdmin.auth().createUser(properties).then(resolve).catch(reject)
        })
    }

    async _firebaseSignIn(user: string, password: string): Promise<firebase.auth.UserCredential> {
        return new Promise<firebase.auth.UserCredential>((resolve, reject) => {
            this.firebaseClient.auth().signInWithEmailAndPassword(user, password).then(resolve).catch(reject)
        })
    }

    async _firebaseSendPasswordReset(user: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.firebaseClient.auth().sendPasswordResetEmail(user).then(resolve).catch(reject)
        })
    }

    async createPatient(clinician: Clinician, patient: Patient): Promise<Patient> {
        const email = patient.user.email;
        if (this.patientDatabase.filter(p => p.user.email === email).length > 0)
            return Promise.reject("Email in use");
        patient = {...patient, birthday: moment(patient.birthday), user: {...patient.user}};
        patient.user.id = this._generateUserID();
        patient.clinicianID = clinician.user.id;
        patient.incomplete = true;
        const userRecord = await this._firebaseCreateUser({
            email: patient.user.email,
            password: '1234567890',
        });
        await this._firebaseSignIn(patient.user.email, '1234567890');
        patient.user.firebaseId = this.firebaseClient.auth().currentUser.uid;
        await this._firebaseSendPasswordReset(patient.user.email);
        this.patientDatabase.push(patient);
        clinician.patientIDs.push(patient.user.id);
        return patient;
    }

    async finalizePatient(patient: Patient): Promise<Patient> {
        const databasePatient = await this.getPatientByID(patient.user.id);
        databasePatient.incomplete = false;
        return databasePatient;
    }
}

function mergeObjects<T>(src: T, mod: {}): T {
    const res = {};
    for (const key of Object.keys(src)) {
        if (!mod.hasOwnProperty(key)) {
            res[key] = src[key]
        } else if (typeof mod[key] !== 'object') {
            res[key] = mod[key];
        } else {
            res[key] = mergeObjects(src[key], mod[key]);
        }
    }
    return res as T;
}

export default MockDatabase;
