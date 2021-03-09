import {Clinician, Patient} from "../../../common/types/types";

class Database {
    // tslint:disable-next-line:no-empty
    constructor() {
    }

    async getPatientByFirebaseID(firebaseID: string): Promise<Patient> {
        throw new Error("Not Implemented")
    }

    async getClinicianByFirebaseID(firebaseID: string): Promise<Clinician> {
        throw new Error("Not Implemented")
    }

    async getPatientByID(ID?: string): Promise<Patient> {
        throw new Error("Not Implemented")
    }

    async getClinicianByID(ID?: string): Promise<Clinician> {
        throw new Error("Not Implemented")
    }
}

export default Database;
