import {Context, createContext} from "react";

import firebase from 'firebase/app';
import "firebase/auth"
import {Assessment, Clinician, Patient} from "../../../common/types/types";
import moment, {Moment} from "moment";
import {APIConfig, BaseAPI, FirebaseConfig} from "../../../common/api/BaseAPI";

class API extends BaseAPI {

    _user?: Clinician;

    // @ts-ignore
    constructor(fbConfig: (FirebaseConfig | null), apiConfig: APIConfig) {
        super(fbConfig, apiConfig)

        this._user = null;

        if (fbConfig !== null) {
            this._firebase.auth().onAuthStateChanged(async (a: any) => {
                this._firebaseUser = a;
                if (this._firebaseUser) {
                    this._user = await this.getClinician(this._firebaseUser.uid);
                }
                this.authChangeListeners.forEach(listener => listener(!!(a as any)))
            })
        }
    }

    async createPatient(patient: Patient): Promise<Response> {
        throw Error("Not Implemented")
    }

    async updatePatient(patient: Patient): Promise<Patient> {
        throw Error("Not Implemented")
        // const mods = {};
        // for (const key of Object.keys(patient)) if (key !== 'user') {
        //     // @ts-ignore
        //     if (key === 'birthday') {
        //         if (this._user.birthday.format("YYYY-MM-DD") !== patient.birthday.format("YYYY-MM-DD")) {
        //             // @ts-ignore
        //             mods.birthday = patient[key];
        //         }
        //     } else {
        //         // @ts-ignore
        //         if (this._user[key] !== patient[key]) {
        //             // @ts-ignore
        //             mods[key] = patient[key];
        //         }
        //     }
        // }
        // for (const key of Object.keys(patient.user)) {
        //     // @ts-ignore
        //     if (this._user.user[key] !== patient.user[key]) {
        //         // @ts-ignore
        //         if (mods.user === undefined) {
        //             // @ts-ignore
        //             mods.user = {};
        //         }
        //         // @ts-ignore
        //         mods.user[key] = patient.user[key];
        //     }
        // }
        // const token = await firebase.auth().currentUser.getIdToken() as any;
        // // @ts-ignore
        // const response = await fetch(this._config.api + `/patient/${(patient ?? this._user).user.id ?? '-1'}`, {
        //     method: "PATCH",
        //     mode: 'cors',
        //     headers: {
        //         "Authorization": "Bearer " + token,
        //     },
        //     body: JSON.stringify(mods)
        // });
        // if (response.ok) {
        //     const newPatient = JSON.parse(await response.text()).body;
        //     this._user = newPatient;
        //     console.log(this._user);
        //     return newPatient;
        // } else {
        //     console.error(response);
        // }
    }

    async getClinician(clinicianFirebaseId: string): Promise<Clinician> {
        throw Error("Not Implemented")
        // const token = await firebase.auth().currentUser.getIdToken() as any;
        // // @ts-ignore
        // const response = await fetch(this._config.api + `/clinician/${(patient ?? this._user).clinicianID ?? '-1'}`, {
        //     method: "GET",
        //     mode: 'cors',
        //     headers: {
        //         "Authorization": "Bearer " + token,
        //     }
        // });
        // if (response.ok) {
        //     return JSON.parse(await response.text()).body;
        // } else {
        //     console.error(response);
        // }
    }

    async updateClinician(clinician: Clinician) {
        throw Error("Not Implemented")
    }

    async createAssessment(patientID: string, assessment: Assessment): Promise<Response> {
        throw Error("Not Implemented")
    }

    async getAssessments(patientID: string, week: Moment = moment().startOf('day')): Promise<Assessment[]> {
        if (!this.isLoggedIn())
            return Promise.reject("Not Logged In");
        const token = await firebase.auth().currentUser.getIdToken() as any;
        // @ts-ignore
        const response = await fetch(this._config.api + `/patient/${patientID}/assessments?start=${week.toISOString()}`, {
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

    getCurrentUser(): Clinician | null {
        throw Error("Not Implemented")
        //
        // if (!this.isLoggedIn()) {
        //
        // }
        // if (this._user == null) {
        //     return null
        // }
        //
        //
        //     return Promise.reject("Not Logged In");
        // const token = await firebase.auth().currentUser.getIdToken() as any;
        // // @ts-ignore
        // const response = await fetch(this._config.api + `/patient/${this._user.user.id}/assessments?start=${week.toISOString()}`, {
        //     method: "GET",
        //     mode: 'cors',
        //     headers: {
        //         "Authorization": "Bearer " + token,
        //     }
        // });
        // if (response.ok) {
        //     const body: [] = JSON.parse(await response.text()).body;
        //     return body.map((ass: { date: string }) => ({...ass, date: moment(ass.date)})) as Assessment[];
        // } else {
        //     console.error(response);
        // }
        //
        //
        // return null;
    }

    async getAllPatients(): Promise<Patient[]> {
        throw Error()
    }

    async changePassword(currPassword: string, newPassword: string): Promise<void> {
        try {
            await this._firebaseSignInWithEmailAndPassword(this._user?.user.email, currPassword);
            await this._firebaseChangePassword(newPassword);
            await this.logout();
        } catch (e) {
            return Promise.reject("Authentication Failed")
        }
    }
}

const APIContext: Context<API> = createContext<API>(null);
export function getAPIContext(): Context<API> {
    return APIContext
}

export default API;