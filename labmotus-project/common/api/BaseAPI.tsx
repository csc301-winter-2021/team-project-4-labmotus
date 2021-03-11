// import {Context, createContext} from "react";

import firebase from 'firebase/app';
import "firebase/auth"
// import {Assessment, Clinician, Patient} from "@labmotus/types";
// import moment, {Moment} from "moment";

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
}