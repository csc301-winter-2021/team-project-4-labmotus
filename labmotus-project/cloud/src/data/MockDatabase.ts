import {Assessment, AssessmentState, Clinician, Patient} from "../../../common/types/types";
import Database from "./Database";
import moment, {Moment} from "moment";

class MockDatabase extends Database {

    patientDatabase: Patient[];
    clinicianDatabase: Clinician[];
    assessmentsDatabase: { [key: string]: Assessment[] };

    constructor() {
        super();
        this.patientDatabase = [{
            user: {
                id: "0",
                firebaseId: "Pcq6ISTb2scT7pC2oSonZxOyQqg2",
                username: "labmotus",
                name: "LabMotus User",
                email: "user@labmot.us",
            },
            phone: "1234567890",
            clinicianID: '2',
            birthday: moment().subtract(18, 'years')
        }, {
            user: {
                id: "1",
                firebaseId: "kYArwSdCQdgCGjuIjV19flEiolv1",
                username: "labmotus1",
                name: "LabMotus User1",
                email: "user1@labmot.us",
            },
            phone: "1234567890",
            clinicianID: '2',
            birthday: moment().subtract(18, 'years')
        }];
        this.clinicianDatabase = [{
            user: {
                id: "2",
                firebaseId: "mp0eWztKWdbj0BWDN60ehEKpUj32",
                username: "labmotus2",
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

    _generateMockAssessments(id: string) {
        const assessments = [];

        const now = moment().startOf('day');
        for (let i = 0; i < 100; i++) if (i % 2 === 0) {
            const date = moment(now).subtract(i, 'd');
            assessments.push({
                id: Math.floor(Math.random() * 1000000).toString(),
                patientId: "",
                name: "Squat",
                date: date,
                state: AssessmentState.COMPLETE,
                videoUrl: "https://youtu.be/dQw4w9WgXcQ",
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
                id: Math.floor(Math.random() * 1000000).toString(),
                patientId: "",
                name: "Hip",
                date: date,
                state: AssessmentState.PENDING,
            });
            assessments.push({
                id: Math.floor(Math.random() * 1000000).toString(),
                patientId: "",
                name: "Arm",
                date: date,
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

    async getPatientByID(ID?: string): Promise<Patient> {
        const matches = this.patientDatabase.filter(patient => patient.user.id === ID);
        if (matches.length > 0) {
            return matches[matches.length - 1];
        } else {
            return Promise.reject("No Patient With That ID")
        }
    }

    async getClinicianByID(ID?: string): Promise<Clinician> {
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

    async getAssessments(ID: string, start: Moment, duration: number, unit: string): Promise<Assessment[]> {
        if (!this.assessmentsDatabase.hasOwnProperty(ID))
            return [];
        const assessments = this.assessmentsDatabase[ID];
        const end = moment(start).add(duration, unit as any);
        const startUnix = start.unix();
        const endUnix = end.unix();
        return assessments.filter(ass => startUnix <= ass.date.unix() && ass.date.unix() <= endUnix);
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
