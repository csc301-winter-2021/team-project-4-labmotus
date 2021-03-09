import {Clinician, Patient} from "../../../common/types/types";

export abstract class Permissions {
    /**
     * Whether or not access should be granted for target. If undefined,
     * access to patients in general.
     * @param target The patient to query access for.
     */
    abstract getPatient(target?: Patient): boolean;

    /**
     * Returns the UserID this permissions belongs to.
     */
    abstract getUserID(): string;
}

export class PatientPermissions extends Permissions {
    patient: Patient;

    constructor(patient: Patient) {
        super();
        this.patient = patient;
    }

    getPatient(target?: Patient): boolean {
        if (target === undefined)
            return false;
        return this.patient.user.id === target.user.id;
    }

    getUserID(): string {
        return this.patient.user.id;
    }
}

export class ClinicianPermissions extends Permissions {
    clinician: Clinician;

    constructor(clinician: Clinician) {
        super();
        this.clinician = clinician;
    }

    getPatient(target?: Patient): boolean {
        if (target === undefined)
            return false;
        return this.clinician.user.id === target.clinicianID;
    }

    getUserID(): string {
        return this.clinician.user.id;
    }
}
