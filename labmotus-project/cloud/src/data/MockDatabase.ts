import {Clinician, Patient} from "../../../common/types/types";
import Database from "./Database";
import moment from "moment";

class MockDatabase extends Database {

    patientDatabase: Patient[];
    clinicianDatabase: Clinician[];

    constructor() {
        super();
        this.patientDatabase = [{
            user: {
                id: "0",
                firebaseId: "Pcq6ISTb2scT7pC2oSonZxOyQqg2",
                username: "labmotus",
                name: "LabMotus User",
                email: "user@labmot.us",
            },
            phone: "1234567890",
            clinicianID: '0',
            birthday: moment().subtract(18, 'years')
        }, {
            user: {
                id: "1",
                firebaseId: "kYArwSdCQdgCGjuIjV19flEiolv1",
                username: "labmotus1",
                name: "LabMotus User1",
                email: "user1@labmot.us",
            },
            phone: "1234567890",
            clinicianID: '0',
            birthday: moment().subtract(18, 'years')
        }, {
            user: {
                id: "2",
                firebaseId: "mp0eWztKWdbj0BWDN60ehEKpUj32",
                username: "labmotus2",
                name: "LabMotus User2",
                email: "user2@labmot.us",
            },
            phone: "1234567890",
            clinicianID: '0',
            birthday: moment().subtract(18, 'years')
        }]
    }

    async getPatientByFirebaseID(firebaseID: string): Promise<Patient> {
        const matches = this.patientDatabase.filter(patient => patient.user.firebaseId === firebaseID);
        if (matches.length > 0) {
            return matches[0];
        } else {
            return Promise.reject("No Patient With That ID")
        }
    }

    async getClinicianByFirebaseID(firebaseID: string, create: boolean = true): Promise<Clinician> {
        const matches = this.clinicianDatabase.filter(clinician => clinician.user.firebaseId === firebaseID);
        if (matches.length > 0) {
            return matches[0];
        } else {
            return Promise.reject("No Patient With That ID")
        }
    }

    async getPatientByID(ID?: string): Promise<Patient> {
        const matches = this.patientDatabase.filter(patient => patient.user.id === ID);
        if (matches.length > 0) {
            return matches[0];
        } else {
            return Promise.reject("No Patient With That ID")
        }
    }

    async getClinicianByID(ID?: string): Promise<Clinician> {
        const matches = this.clinicianDatabase.filter(clinician => clinician.user.id === ID);
        if (matches.length > 0) {
            return matches[0];
        } else {
            return Promise.reject("No Patient With That ID")
        }
    }
}

export default MockDatabase;
