import "firebase/auth"
import {Assessment, Clinician, Patient} from "../../../common/types/types";
import API from "../api/API";
import moment, {Moment} from "moment";

const FakeUser: Patient = {
    user: {
        id: "1",
        name: "John Smith"
    },
    birthday: moment(),
    clinicianID: "2",
    phone: "123-456-7890",
};

const FakeClinician: Clinician = {
    user: {
        id: "2",
        name: "Alfonzo"
    },
    clinic: "UofTears"
};

class MockAPI extends API {
    user?: Patient;

    constructor() {
        super(null);
        this.user = null;
    }

    async cachedLogin(): Promise<void> {
        if (this.user !== null)
            throw "Already logged In.";
        this.user = FakeUser;
    }

    async login(user: string, pass: string): Promise<void> {
        if (this.user !== null)
            throw "Already logged In.";
        this.user = FakeUser;
    }

    async logout(): Promise<void> {
        if (this.user === null)
            throw "Not logged In.";
        this.user = null;
    }

    async deleteUser(): Promise<void> {
        throw "Not Implemented"
    }

    async getPatient(): Promise<Patient | null> {
        return this.user;
    }

    async updatePatient(patient: Patient): Promise<void> {
        if (this.user === null)
            throw "Not logged In.";
        this.user = patient;
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
