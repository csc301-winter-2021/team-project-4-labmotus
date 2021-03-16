import {Context, createContext} from "react";

import firebase from 'firebase/app';
import "firebase/auth"
import {Assessment, Clinician, Patient} from "../../../common/types/types";
import moment, {Moment} from "moment";
import {APIConfig, BaseAPI, FirebaseConfig} from "../../../common/api/BaseAPI";

class API extends BaseAPI {

    _user?: Patient;

    // @ts-ignore
    constructor(fbConfig: (FirebaseConfig | null), apiConfig: APIConfig) {
        super(fbConfig, apiConfig)

        this._user = null;

        if (fbConfig !== null) {
            this._firebase.auth().onAuthStateChanged(async (a: any) => {
                this._firebaseUser = a;
                if (this._firebaseUser) {
                    this._user = await this.getPatient();
                }
                this.authChangeListeners.forEach(listener => listener(!!(a as any)))
            })
        }
    }

    async updatePatient(patient: Patient): Promise<Patient> {
        const token = await firebase.auth().currentUser.getIdToken() as any;
        // @ts-ignore
        const response = await fetch(this._config.api + `/patient/${(patient ?? this._user).user.id ?? '-1'}`, {
            method: "PATCH",
            mode: 'cors',
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patient)
        });
        if (response.ok) {
            const newPatient = JSON.parse(await response.text()).body;
            this._user = newPatient;
            return newPatient;
        } else {
            console.error(response);
        }
    }

    async uploadVideo(assessmentID: string, url: string): Promise<void> {
        if (url !== '/some/file/path') {
            const token = await firebase.auth().currentUser.getIdToken() as any;
            const videoResp = await fetch(url);
            const video = await videoResp.blob();
            const formData = new FormData();
            formData.append("file", video);
            fetch(this._config.api + `/video/${assessmentID}`, {
                method: "POST",
                mode: 'cors',
                body: formData,
                headers: {
                    "Authorization": "Bearer " + token,
                }
            });
        }
    }

    async getClinician(patient?: Patient): Promise<Clinician> {
        const token = await firebase.auth().currentUser.getIdToken() as any;
        // @ts-ignore
        const response = await fetch(this._config.api + `/clinician/${(patient ?? this._user).clinicianID ?? '-1'}`, {
            method: "GET",
            mode: 'cors',
            headers: {
                "Authorization": "Bearer " + token,
            }
        });
        if (response.ok) {
            return JSON.parse(await response.text()).body;
        } else {
            console.error(response);
        }
    }

    async getCurrUsersAssessments(week: Moment = moment().startOf('day')): Promise<Assessment[]> {
        return this.getAssessments(this._user.user.id, week)
    }

    getCurrentUser(): Patient | null {
        if (this._user != null)
            return {...this._user, user: {...this._user.user}, birthday: moment(this._user.birthday)};
        return null;
    }

    async changePassword(currPassword: string, newPassword: string): Promise<string> {
        try {
            await this._firebaseSignInWithEmailAndPassword(this._user?.user.email, currPassword);
            await this._firebaseChangePassword(newPassword);
            await this.logout();
            return "success";
        } catch (e) {
            return e.code.slice(5);
        }
    }
}

const APIContext: Context<API> = createContext<API>(null);
export function getAPIContext(): Context<API> {
    return APIContext
}

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
