import React from "react";
import firebaseConfig from "../../firebase.json"
import firebase from 'firebase/app';
import "firebase/auth"
import {Assessment, Clinician, Patient} from "../../../common/types/types";
import moment, {Moment} from "moment";

export interface FirebaseConfig {
    "apiKey": string;
    "authDomain": string;
    "projectId": string;
    "storageBucket": string;
    "messagingSenderId": string;
    "appId": string;
}

class API {
    firebase: firebase.app.App;

    constructor(config: (FirebaseConfig | null) = firebaseConfig) {
        if (config !== null)
            this.firebase = firebase.initializeApp(config);
    }

    async cachedLogin(): Promise<void> {
        throw "Not Implemented"
    }

    async login(user: string, pass: string): Promise<void> {
        throw "Not Implemented"
    }

    async logout(): Promise<void> {
        throw "Not Implemented"
    }

    async deleteUser(): Promise<void> {
        throw "Not Implemented"
    }

    async forgotPassword(email: string): Promise<boolean> {
        throw "Not Implemented"
    }

    async signUp(email: string, pass: string): Promise<void> {
        throw "Not Implemented"
    }

    async getPatient(): Promise<Patient | null> {
        throw "Not Implemented"
    }

    async updatePatient(patient: Patient): Promise<void> {
        throw "Not Implemented"
    }

    async uploadVideo(assessment: Assessment, stat: string): Promise<void> {
        throw "Not Implemented"
    }

    async getClinician(patient: Patient): Promise<Clinician> {
        throw "Not Implemented"
    }

    async getAssessments(week: Moment = moment().startOf('day')): Promise<Assessment[]> {
        throw "Not Implemented"
    }

    isLoggedIn(): boolean {
        return false
    }
}

export const APIContext = React.createContext<API>(null);

export default API;

export const NO_CACHED_LOGIN = "No Login Cached";

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
