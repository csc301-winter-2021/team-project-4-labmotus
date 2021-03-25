import {Assessment, AssessmentState, Clinician, Patient, SignUpParams} from "../../../common/types/types";
import Database from "./Database";
import moment, {Moment} from "moment";
import config from "../../config.json";
import {pipeline} from "stream";
import * as util from "util";
import * as firebaseAdmin from 'firebase-admin';
import firebase from 'firebase/app';
import * as fs from "fs";
import {ReadStream} from "fs";
import path from "path";

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
            phone: "416-123-1234",
            clinicianID: '2',
            birthday: moment().subtract(18, 'years')
        }, {
            user: {
                id: this._generateUserID(),
                firebaseId: "kYArwSdCQdgCGjuIjV19flEiolv1",
                name: "LabMotus User1",
                email: "user1@labmot.us",
            },
            phone: "123-456-7890",
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
                date,
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
                date,
                joints: ["Hip"],
                state: AssessmentState.PENDING,
            });
            assessments.push({
                id: this._generateAssessmentID(),
                patientId: id,
                name: "Arm",
                date,
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

    async updateAssessment(patientID: string, assessmentID: string, changes: any): Promise<void> {
        const matches = this.assessmentsDatabase[patientID]?.filter(ass => ass.id === assessmentID);
        if (matches.length > 0) {
            Object.assign(matches[matches.length - 1], changes);
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

    async saveVideo(userId: string, assessmentID: string, video: NodeJS.ReadableStream): Promise<string> {
        const assessment = await this.getAssessmentByID(userId, assessmentID);
        const loc = path.join(config.videoPath, assessmentID + ".mp4");
        await pump(video, fs.createWriteStream(loc));
        assessment.state = AssessmentState.PENDING;
        return `/video/${assessmentID}`;
    }

    async getVideo(userId: string, assessmentID: string): Promise<string | ReadStream> {
        const assessment = await this.getAssessmentByID(userId, assessmentID);
        return fs.createReadStream(path.join(config.videoPath, assessmentID + ".mp4"));
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

    async _firebaseSendEmailVerification(user: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.firebaseClient.auth().currentUser.sendEmailVerification().then(resolve).catch(reject)
        })
    }

    async _firebaseSendSignInLinkToEmail(user: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.firebaseClient.auth().sendSignInLinkToEmail(user, {
                url: config.actionAddress + "?email=" + user,
                handleCodeInApp: true
            }).then(resolve).catch(reject)
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
        await this._firebaseSendSignInLinkToEmail(patient.user.email);
        firebaseAdmin.auth().updateUser(userRecord.uid, {disabled: true});
        this.patientDatabase.push(patient);
        clinician.patientIDs.push(patient.user.id);
        return patient;
    }

    async createClinician(newClinician: Clinician): Promise<Clinician> {
        newClinician = {...newClinician, user: {...newClinician.user, id: this._generateUserID()}, patientIDs: []};
        this.clinicianDatabase.push(newClinician);
        return newClinician;
    }

    async _firebaseLinkSignIn(email: string, params: string): Promise<firebase.auth.UserCredential> {
        return new Promise<firebase.auth.UserCredential>((resolve, reject) => {
            this.firebaseClient.auth().signInWithEmailLink(email, params).then(resolve).catch(reject)
        })
    }

    async finalizePatient(params: SignUpParams): Promise<string> {
        const user = await firebaseAdmin.auth().getUserByEmail(params.email);
        await firebaseAdmin.auth().updateUser(user.uid, {disabled: false});
        const databasePatient = await this.getPatientByFirebaseID(user.uid);
        if (databasePatient) {
            try {
                await this._firebaseLinkSignIn(params.email, config.actionAddress + "?" + new URLSearchParams(params as any).toString());
                databasePatient.incomplete = false;
                return await firebaseAdmin.auth().generateSignInWithEmailLink(params.email, {
                    url: config.actionAddress,
                    handleCodeInApp: true
                });
            } catch (e) {
                firebaseAdmin.auth().updateUser(user.uid, {disabled: true});
                throw e
            }
        } else {
            firebaseAdmin.auth().updateUser(user.uid, {disabled: true});
            throw Error("No Such User")
        }
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
