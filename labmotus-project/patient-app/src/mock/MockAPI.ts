import "firebase/auth"
import {Assessment, Clinician, Patient} from "../../../common/types/types";
import API from "../api/API";
import moment, {Moment} from "moment";

const FakeUser: Patient = {
    user: {
        id: "1",
        name: "John Smith",
        username: "john"
    },
    birthday: moment(),
    clinicianID: "2",
    phone: "123-456-7890",
};

const FakeClinician: Clinician = {
    user: {
        id: "2",
        name: "Alfonzo",
        username: "alfonzo_poggers"
    },
    clinic: "UofTears"
};

class MockAPI extends API {
    constructor() {
        super(null);
        this._user = null;
    }

    async login(user: string, pass: string): Promise<void> {
        if (this._user !== null)
            throw "Already logged In.";
        this._user = FakeUser;
        this._user.user.email = user;
        this.authChangeListeners.forEach(listener => listener(true))
    }

    async logout(): Promise<void> {
        if (this._user === null)
            throw "Not logged In.";
        this._user = null;
        this.authChangeListeners.forEach(listener => listener(false))
    }

    async forgotPassword(email: string): Promise<boolean> {
        return true;
    }

    async signUp(email: string, pass: string): Promise<void> {
        if (this._user !== null)
            throw "Already logged In.";
        this._user = FakeUser;
        this._user.user.email = email;
        console.log(this._user)
    }

    async deleteUser(): Promise<void> {
        throw "Not Implemented"
    }

    async updatePatient(patient: Patient): Promise<void> {
        if (this._user === null)
            throw "Not logged In.";
        this._user = patient;
    }

    async uploadVideo(assessment: Assessment, stat: string): Promise<void> {

    }

    async getClinician(patient: Patient): Promise<Clinician> {
        return FakeClinician;
    }

    async getAssessments(week: Moment = moment().startOf('day')): Promise<Assessment[]> {
        const data: Assessment[] = [];
        for (let i = 0; i < 7; i++) {
            const date = moment(week).startOf('week').add(i, 'd');
            if (i % 2 == 0)
                data.push({
                    id: "",
                    patientId: "",
                    date: date,
                    stats: [
                        {
                            name: "Knee",
                            joint: "Knee",
                            currValue: Math.floor(Math.random() * 180),
                            goalValue: 180,
                        },
                        {
                            name: "Shoulder",
                            joint: "Shoulder",
                            currValue: Math.floor(Math.random() * 90),
                            goalValue: 90,
                        },
                        {
                            name: "Hip",
                            joint: "Hip",
                            currValue: -5,
                            goalValue: 0,
                            minValue: -10,
                        }
                    ]
                })
        }
        return data;
    }

    getCurrentUser(): Patient | null {
        return this._user;
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
