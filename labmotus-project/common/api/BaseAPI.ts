import firebase from 'firebase/app';
import "firebase/auth"
import { Patient } from "../types";
import moment from "moment";

export interface FirebaseConfig {
    "apiKey": string;
    "authDomain": string;
    "projectId": string;
    "storageBucket": string;
    "messagingSenderId": string;
    "appId": string;
}

export interface APIConfig {
    mock: boolean
    api: string
}

export class BaseAPI {
    _config: APIConfig;
    _firebase: firebase.app.App;
    _firebaseUser?: firebase.User;
    _credentials: firebase.auth.UserCredential;

    authChangeListeners: Set<(loggedIn: boolean) => void>;

    constructor(fbConfig: (FirebaseConfig | null), apiConfig: APIConfig) {
        this._config = apiConfig
        this.authChangeListeners = new Set();

        if(fbConfig !== null) {
            this._firebase = firebase.initializeApp(fbConfig);
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
        const response = await fetch(this._config.api + `/patient/${patientID === undefined ? '-1' : patientID}`, {
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

    async uploadVideo(assessmentID: string, url: string): Promise<void> {
        throw Error("Not Implemented")
    }

    async _firebaseChangePassword(newPassword: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._firebase.auth().currentUser.updatePassword(newPassword).then(resolve).catch(reject)
        })
    }

    addLoginListener(listener: (loggedIn: boolean) => void) {
        this.authChangeListeners.add(listener);
        listener(this.isLoggedIn());
    }

    removeLoginListener(listener: (loggedIn: boolean) => void) {
        this.authChangeListeners.delete(listener);
    }

    isLoggedIn(): boolean {
        return !!(this._firebaseUser as any)
    }
}