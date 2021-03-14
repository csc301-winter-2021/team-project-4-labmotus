import {Clinician, Patient} from "../../../common/types";

export function computePatientMods(patient: Patient, newPatient: Patient) {
    const mods: any = {};
    for (const key of Object.keys(patient)) if (key !== 'user') {
        if (key === 'birthday') {
            if (patient.birthday.format("YYYY-MM-DD") !== newPatient.birthday.format("YYYY-MM-DD")) {
                mods.birthday = newPatient[key];
            }
        } else {
            if (patient[key] !== newPatient[key]) {
                mods[key] = newPatient[key];
            }
        }
    }
    for (const key of Object.keys(patient.user)) {
        if (patient.user[key] !== newPatient.user[key]) {
            if (mods.user === undefined) {
                mods.user = {};
            }
            mods.user[key] = newPatient.user[key];
        }
    }
    return mods
}

export function computeClinicianMods(clinician: Clinician, newClinician: Clinician) {
    const mods: any = {};
    for (const key of Object.keys(clinician)) if (key !== 'user') {
        if (clinician[key] !== newClinician[key]) {
            mods[key] = newClinician[key];
        }
    }
    for (const key of Object.keys(clinician.user)) {
        if (clinician.user[key] !== newClinician.user[key]) {
            if (mods.user === undefined) {
                mods.user = {};
            }
            mods.user[key] = newClinician.user[key];
        }
    }
    return mods
}
