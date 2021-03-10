import {Clinician, Patient} from "../../../common/types/types";

export abstract class Permissions {
    /**
     * Whether or not access should be granted for target. If undefined,
     * access to patients in general.
     * @param target The patient to query access for.
     */
    abstract getPatient(target?: Patient): boolean;

    /**
     * Whether or not access should be granted for target's assessment
     * @param target The patient to query access for.
     */
    abstract getAssessments(target: Patient): boolean;

    /**
     * Whether or not access should be granted for target clinician
     * @param target The clinician to query access for.
     */
    abstract getClinician(target?: Clinician): boolean;

    /**
     * Whether or not access should be granted for this patient modification
     * @param target The patient to modify
     * @param updates The updates to make
     */
    abstract modifyPatient(target: Patient, updates: {}): boolean;

    /**
     * Returns the UserID this permissions belongs to.
     */
    abstract getUserID(): string;
}

function checkModification(modification: {}, perms: {}): boolean {
    for (const mod of Object.keys(modification)) {
        if (!perms.hasOwnProperty(mod)) return false;
        if (typeof perms[mod] === 'object') {
            if (typeof modification[mod] !== 'object')
                return false;
            if (!checkModification(modification[mod], perms[mod]))
                return false;
        } else if (perms[mod] === false) {
            return false;
        }
    }
    return true;
}

export class PatientPermissions extends Permissions {
    patient: Patient;
    editablePatientFields: {} = {
        user: {
            id: false,
            firebaseId: false,
            username: false,
            name: true,
            email: true
        },
        patientCode: false,
        clinicianID: false,
        phone: true,
        birthday: true
    };

    constructor(patient: Patient) {
        super();
        this.patient = patient;
    }

    getPatient(target?: Patient): boolean {
        if (target === undefined)
            return false;
        return this.patient.user.id === target.user.id;
    }

    getAssessments(target?: Patient): boolean {
        if (target === undefined)
            return false;
        return this.patient.user.id === target.user.id;
    }

    getClinician(target?: Clinician): boolean {
        if (target === undefined)
            return false;
        return this.patient.clinicianID === target.user.id;
    }

    modifyPatient(target: Patient, updates: {}): boolean {
        if (target.user.id !== this.patient.user.id)
            return false;
        return checkModification(updates, this.editablePatientFields);
    }

    getUserID(): string {
        return this.patient.user.id;
    }
}

export class ClinicianPermissions extends Permissions {
    clinician: Clinician;
    editablePatientFields: {} = {
        user: {
            id: false,
            firebaseId: false,
            username: false,
            name: true,
            email: true
        },
        patientCode: false,
        clinicianID: true,
        phone: true,
        birthday: true
    };

    constructor(clinician: Clinician) {
        super();
        this.clinician = clinician;
    }

    getPatient(target?: Patient): boolean {
        if (target === undefined)
            return false;
        return this.clinician.user.id === target.clinicianID;
    }

    getAssessments(target?: Patient): boolean {
        if (target === undefined)
            return false;
        return this.clinician.user.id === target.clinicianID;
    }

    getClinician(target?: Clinician): boolean {
        if (target === undefined)
            return false;
        return this.clinician.user.id === target.user.id;
    }

    modifyPatient(target: Patient, updates: {}): boolean {
        if (target.clinicianID !== this.clinician.user.id)
            return false;
        return checkModification(updates, this.editablePatientFields);
    }

    getUserID(): string {
        return this.clinician.user.id;
    }
}
