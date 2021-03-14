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
        super(fbConfig, apiConfig);

        this._user = null;

        if (fbConfig !== null) {
            this._firebase.auth().onAuthStateChanged(async (a: any) => {
                this._firebaseUser = a;
                if (this._firebaseUser) {
                    this._user = await this.getClinician();
                }
                this.authChangeListeners.forEach(listener => listener(!!(a as any)))
            })
        }
    }

    async createPatient(patient: Patient): Promise<Patient> {
        const token = await firebase.auth().currentUser.getIdToken() as any;
        // @ts-ignore
        const response = await fetch(this._config.api + `/patient`, {
            method: "POST",
            mode: 'cors',
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patient)
        });
        if (response.ok) {
            const newPatient: Patient = JSON.parse(await response.text()).body;
            newPatient.birthday = moment(newPatient.birthday);
            return newPatient;
        } else {
            console.error(response);
        }
    }

    async _firebaseConfirmPasswordReset(code: string, pass: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._firebase.auth().confirmPasswordReset(code, pass).then(resolve).catch(reject)
        })
    }

    async finishSignUp(user: string, pass: string, code: string): Promise<Patient> {
        await this._firebaseConfirmPasswordReset(code, pass);
        await this._firebaseSignInWithEmailAndPassword(user, pass);
        const token = await firebase.auth().currentUser.getIdToken() as any;
        // @ts-ignore
        const response = await fetch(this._config.api + `/patient/finalize`, {
            method: "POST",
            mode: 'cors',
            headers: {
                "Authorization": "Bearer " + token,
            },
        });
        if (response.ok) {
            const newPatient: Patient = JSON.parse(await response.text()).body;
            newPatient.birthday = moment(newPatient.birthday);
            return newPatient;
        } else {
            console.error(response);
        }
    }

    async updatePatient(patient: Patient): Promise<Patient> {
        const token = await firebase.auth().currentUser.getIdToken() as any;
        // @ts-ignore
        const response = await fetch(this._config.api + `/patient/${patient?.user?.id ?? '-1'}`, {
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

    async getClinician(clinicianId?: string): Promise<Clinician> {
        const token = await firebase.auth().currentUser.getIdToken() as any;
        // @ts-ignore
        const response = await fetch(this._config.api + `/clinician/${clinicianId ?? (this._user?.clinicianID ?? '-1')}`, {
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

    async updateClinician(clinician: Clinician) {
        const token = await firebase.auth().currentUser.getIdToken() as any;
        // @ts-ignore
        const response = await fetch(this._config.api + `/clinician/${clinician?.user?.id ?? '-1'}`, {
            method: "PATCH",
            mode: 'cors',
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clinician)
        });
        if (response.ok) {
            const newClinician = JSON.parse(await response.text()).body;
            this._user = newClinician;
            return newClinician;
        } else {
            console.error(response);
        }
    }

    async createAssessment(assessment: Assessment): Promise<Assessment> {
        const token = await firebase.auth().currentUser.getIdToken() as any;
        // @ts-ignore
        const response = await fetch(this._config.api + `/assessments`, {
            method: "POST",
            mode: 'cors',
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assessment)
        });
        if (response.ok) {
            const res = JSON.parse(await response.text()).body;
            return {...res, date: moment(res)};
        } else {
            console.error(response);
        }
    }

    getCurrentUser(): Clinician | null {
        return this._user != null ? {...this._user, user: {...this._user.user}} : null
    }

    async getAllPatients(): Promise<Patient[]> {
        const patients: Patient[] = [];
        if (this._user != null) {
            const promises = [];
            const patientIds = this._user.patientIDs;
            for (const id of patientIds) {
                promises.push(this.getPatient(id).then(patient => patients.push(patient)));
            }
            await Promise.allSettled(promises);
        }
        return patients;
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
