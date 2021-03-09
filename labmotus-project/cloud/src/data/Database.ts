import {Assessment, Clinician, Patient} from "../../../common/types/types";
import {Moment} from "moment";

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

    async getAssessments(ID: string, start: Moment, duration: number, unit: string): Promise<Assessment[]> {
        throw new Error("Not Implemented")
    }
}

export default Database;
