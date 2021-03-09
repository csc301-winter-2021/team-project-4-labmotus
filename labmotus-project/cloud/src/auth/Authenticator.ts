import * as firebaseAdmin from 'firebase-admin';
import Database from "../data/Database";
import {ClinicianPermissions, PatientPermissions, Permissions} from "./Permissions";

async function firebaseVerifyIdToken(token: string): Promise<firebaseAdmin.auth.DecodedIdToken> {
    return new Promise<firebaseAdmin.auth.DecodedIdToken>((resolve, reject) => {
        firebaseAdmin.auth().verifyIdToken(token).then(resolve).catch(reject)
    })
}

export async function authenticateUser(database: Database, token: string): Promise<Permissions> {
    try {
        const decodedIdToken = await firebaseVerifyIdToken(token);
        try {
            const patient = await database.getPatientByFirebaseID(decodedIdToken.uid);
            return new PatientPermissions(patient);
        } catch (e) {
        }
        try {
            const clinician = await database.getClinicianByFirebaseID(decodedIdToken.uid);
            return new ClinicianPermissions(clinician);
        } catch (e) {
        }
    } catch (e) {
        console.error(e);
    }
    return Promise.reject("Failed To Authenticate User");
}
