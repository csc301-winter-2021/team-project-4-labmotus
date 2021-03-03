import React from "react";
import firebaseConfig from "../../firebase.json"
import firebase from 'firebase/app';
import "firebase/auth"
import {Assessment, Clinician, Patient} from "../../../common/types/types";

class API {
    firebase: firebase.app.App;

    constructor() {
        this.firebase = firebase.initializeApp(firebaseConfig);
    }

    async cachedLogin(): Promise<boolean> {
        return true;
    }

    async login(user: string, pass: string): Promise<boolean> {
        return true
    }

    async logout(): Promise<boolean> {
        return true
    }

    async deleteUser(): Promise<boolean> {
        return true
    }

    async getPatient(): Promise<Patient> {
        return null;
    }

    async updatePatient(patient: Patient): Promise<boolean> {
        return true;
    }

    async uploadVideo(assessment: Assessment, stat: string): Promise<boolean> {
        return true;
    }

    async getClinician(patient: Patient): Promise<Clinician> {
        return null;
    }

    async getAssessments(patient: Patient): Promise<Assessment[]> {
        return null;
    }
}

export const APIContext = React.createContext<API>(null);

export default API;

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
