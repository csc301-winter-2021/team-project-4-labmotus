import React from "react";
import config from "../../config.json"
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

class API {
    _firebase: firebase.app.App;
    _firebaseUser?: firebase.User;
    _credentials: firebase.auth.UserCredential;
    _user?: Patient;

    authChangeListeners: Set<(loggedIn: boolean) => void>;

    // @ts-ignore
    constructor(fbConfig: (FirebaseConfig | null) = firebaseConfig) {
        this._user = null;
        this.authChangeListeners = new Set();
        if (fbConfig !== null) {
            this._firebase = firebase.initializeApp(fbConfig);
            this._firebase.auth().onAuthStateChanged(async a => {
                this._firebaseUser = a;
                if (this._firebaseUser) {
                    this._user = await this.getPatient();
                    console.log(this._user);
                }
                this.authChangeListeners.forEach(listener => listener(!!(a as any)))
            })
        }
    }

    async _firebaseSignInWithEmailAndPassword(user: string, pass: string): Promise<firebase.auth.UserCredential> {
        return new Promise<firebase.auth.UserCredential>((resolve, reject) => {
            this._firebase.auth().signInWithEmailAndPassword(user, pass).then(resolve).catch(reject)
        })
    }

    async login(user: string, pass: string): Promise<void> {
        try {
            this._credentials = await this._firebaseSignInWithEmailAndPassword(user, pass);
        } catch (e) {
            console.log(e);
        }
    }

    async _firebaseSignOut(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._firebase.auth().signOut().then(resolve).catch(reject)
        })
    }

    async logout(): Promise<void> {
        await this._firebaseSignOut();
    }

    async deleteUser(): Promise<void> {
        throw Error("Not Implemented")
    }

    async _firebaseSendPasswordResetEmail(email: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._firebase.auth().sendPasswordResetEmail(email).then(resolve).catch(reject)
        })
    }

    async forgotPassword(email: string): Promise<boolean> {
        try {
            this._firebaseSendPasswordResetEmail(email);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async _firebaseCreateUserWithEmailAndPassword(email: string, pass: string): Promise<firebase.auth.UserCredential> {
        return new Promise<firebase.auth.UserCredential>((resolve, reject) => {
            this._firebase.auth().createUserWithEmailAndPassword(email, pass).then(resolve).catch(reject)
        })
    }

    async signUp(email: string, pass: string): Promise<void> {
        try {
            await this._firebaseCreateUserWithEmailAndPassword(email, pass);
        } catch (e) {
            console.log(e);
        }
    }

    async getPatient(patientID?: string): Promise<Patient> {
        const token = await firebase.auth().currentUser.getIdToken() as any;
        // @ts-ignore
        const response = await fetch(config.api + `/patient/${patientID === undefined ? '-1' : patientID}`, {
            method: "GET",
            mode: 'cors',
            headers: {
                "Authorization": "Bearer " + token,
            }
        });
        if (response.ok) {
            const body = JSON.parse(await response.text()).body;
            return {...body, birthday: moment(body?.birthday)}
        } else {
            console.error(response);
        }
    }

    async updatePatient(patient: Patient): Promise<void> {
        throw Error("Not Implemented")
    }

    async uploadVideo(assessmentID: string, url: string): Promise<void> {
        throw Error("Not Implemented")
    }

    async getClinician(patient: Patient): Promise<Clinician> {
        throw Error("Not Implemented")
    }

    async getAssessments(week: Moment = moment().startOf('day')): Promise<Assessment[]> {
        if (!this.isLoggedIn())
            return Promise.reject("Not Logged In");
        const token = await firebase.auth().currentUser.getIdToken() as any;
        // @ts-ignore
        const response = await fetch(config.api + `/patient/${this._user.user.id}/assessments?start=${week.toISOString()}`, {
            method: "GET",
            mode: 'cors',
            headers: {
                "Authorization": "Bearer " + token,
            }
        });
        if (response.ok) {
            const body: [] = JSON.parse(await response.text()).body;
            return body.map((ass: { date: string }) => ({...ass, date: moment(ass.date)})) as Assessment[];
        } else {
            console.error(response);
        }
    }

    addLoginListener(listener: (loggedIn: boolean) => void) {
        this.authChangeListeners.add(listener);
        listener(this.isLoggedIn());
    }

    removeLoginListener(listener: (loggedIn: boolean) => void) {
        this.authChangeListeners.delete(listener);
    }

    getCurrentUser(): Patient | null {
        return this._user;
    }

    isLoggedIn(): boolean {
        return !!(this._firebaseUser as any)
    }
}

export const APIContext = React.createContext<API>(null);

export default API;

export const INVALID_ASSESSMENT_ID = "Invalid Assessment ID";

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
