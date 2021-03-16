import "firebase/auth"
import {Assessment, AssessmentState, Clinician, Patient} from "../../../common/types/types";
import API from "./API";
import moment, {Moment} from "moment";
import {APIConfig} from "../../../common/api/BaseAPI";
import {FakeClinician, patientList} from "../../../common/api/MockAPIData";

class MockAPI extends API {
    mockAssessments: { [key: string]: Assessment[] };

    constructor(config: APIConfig) {
        super(null, config);
        this._user = FakeClinician;
        this.mockAssessments = {}
    }

    async login(user: string, pass: string): Promise<string> {
        if (this._user !== null)
            throw Error("Already logged In. ");
        this._user = FakeClinician;
        this._user.user.email = user;
        this.authChangeListeners.forEach(listener => listener(true));
        return "success";
    }

    async logout(): Promise<void> {
        if (this._user === null)
            throw Error("Not logged In.");
        this._user = null;
        this.authChangeListeners.forEach(listener => listener(false))
    }

    async forgotPassword(email: string): Promise<string> {
        return "success";
    }

    async signUp(email: string, pass: string): Promise<string> {
        if (this._user !== null)
            throw Error("Already logged In.");
        this._user = FakeClinician;
        this._user.user.email = email;
        console.log(this._user);
        return "success";
    }

    async createPatient(patient: Patient): Promise<Patient> {
        // TODO
        throw Error("Not Implemented")
    }

    async updatePatient(patient: Patient): Promise<Patient> {
        throw Error("Not Implemented")
    }

    async getClinician(clinicianId?: string): Promise<Clinician> {
        throw Error("Not Implemented")
    }

    async updateClinician(clinician: Clinician) {
        throw Error("Not Implemented")
    }

    async createAssessment(assessment: Assessment): Promise<Assessment> {
        // TODO
        throw Error("Not Implemented")
    }

    async getAssessments(patientID: string, week: Moment = moment().startOf('day')): Promise<Assessment[]> {
        const weekStart = moment(week).startOf('week');
        if (this.mockAssessments.hasOwnProperty(weekStart.format("YYYY-MM-DD")))
            return this.mockAssessments[weekStart.format("YYYY-MM-DD")];
        const data: Assessment[] = [];
        for (let i = 0; i < 7; i++) {
            const date = moment(weekStart).startOf('week').add(i, 'd');
            if (i % 2 === 0) {
                data.push({
                    id: Math.floor(Math.random() * 1000000).toString(),
                    patientId: "",
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
                data.push({
                    id: Math.floor(Math.random() * 1000000).toString(),
                    patientId: "",
                    name: "Hip",
                    date: date,
                    joints: ["Hip"],
                    state: AssessmentState.PENDING,
                });
                data.push({
                    id: Math.floor(Math.random() * 1000000).toString(),
                    patientId: "",
                    name: "Arm",
                    date: date,
                    joints: ["Arm"],
                    state: AssessmentState.MISSING,
                });
            }
        }
        this.mockAssessments[weekStart.format("YYYY-MM-DD")] = data;
        return data;
    }

    getCurrentUser(): Clinician | null {
        return this._user;
    }

    async getAllPatients(): Promise<Patient[]> {
        return patientList;
    }

    async getPatient(patientID?: string): Promise<Patient> {
        for (let patient of patientList) {
            if (patient.user.id === patientID) {
                return patient
            }
        }
        throw Error("Patient not found")
    }

    isLoggedIn(): boolean {
        return this._user !== null
    }
}

export default MockAPI;

/*
/user API calls (all use auth token passed through Authorization header)
post /patient (sign up patient)
    clinician authentication
    takes info for new signup, and clinician ID
    returns patient document
get /login
    creates login session and returns patient/doctor document
get /logout
    logs out of session
delete /patient
    takes ID
    deletes patient account
patch /patient (update patient)
    takes patient ID and new changes
    update patient document
post /video
    takes video
    returns url
post /assessment
    takes assessment info
get /clinician (get clinician info)
    takes clinician ID
    returns clinician document
get /video
    takes url
    returns video
get /assessments
    takes patient ID
    returns assessments of patient
post /doctor (sign up doctor)
    takes info for new signup
    returns doctor document
get /patients
    takes clinician ID
    returns all documents of clinician’s patients
 */
