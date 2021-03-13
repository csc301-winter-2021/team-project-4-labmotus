import * as fastify from 'fastify'
import moment from 'moment'
import {Clinician, Patient, Response} from '../../../../common/types/types'
import {RequestHeaders} from '../../types';
import {authenticateUser} from "../../auth/Authenticator";
import Database from "../../data/Database";
import {computeClinicianMods} from "../../data/Util";


interface ClinicianIdParams {
    clinicianId: string
}

export default async function (server: fastify.FastifyInstance & { database: Database }, options: fastify.FastifyPluginOptions, done: () => void) {
    /**
     * POST /clinician
     *
     * Create new clinician document
     *
     * Body: Clinician document (no ID or Firebase ID)
     * Response: Clinician document (w/ clinician ID and Firebase ID)
     */
    server.post<{
        Headers: RequestHeaders,
        Body: Clinician
    }>('/clinician', {}, async (request, reply) => {
        const clinician = request.body;
        clinician.user.id = "0";
        clinician.user.firebaseId = "firebase:0";

        const mockResponse: Response<Clinician> = {
            success: true,
            body: clinician
        };
        reply
            .code(200)
            .header('Content-Type', 'application/json')
            .send(mockResponse)
    });

    /**
     * PATCH /clinician/:clinicianId
     *
     * Update clinician document with given clinician ID
     *
     * Parameters:
     *  clinicianId: Clinician ID
     * Body: Partial clinician document
     * Response: Clinician document
     */
    server.patch<{
        Headers: RequestHeaders,
        Params: ClinicianIdParams,
        Body: Clinician
    }>('/clinician/:clinicianId', {}, async (request, reply) => {
        const headers: { authorization?: string } = request.headers as any;
        let clinicianId = Number.isSafeInteger(Number(request.params.clinicianId)) &&
        Number(request.params.clinicianId) >= 0 ? request.params.clinicianId : undefined;
        try {
            const permissions = await authenticateUser(server.database, headers.authorization.split('Bearer ')[1]);
            if (clinicianId === undefined)
                clinicianId = permissions.getUserID();
            const newClinician = request.body;
            try {
                const clinician = await server.database.getClinicianByID(clinicianId);
                const mods = computeClinicianMods(clinician, newClinician);
                if (permissions.modifyClinician(clinician, mods)) {
                    const result = await server.database.updateClinician(clinicianId, mods);
                    const response: Response<Clinician> = {
                        success: true,
                        body: result
                    };
                    reply.code(200)
                        .header('Content-Type', 'application/json')
                        .send(response)
                } else {
                    reply.code(403).send("Forbidden");
                }
            } catch (e) {
                if (permissions.getPatient()) {
                    reply.code(404).send("No Such Patient");
                } else {
                    reply.code(403).send("Forbidden");
                }
            }
        } catch (e) {
            reply.code(401).send("Not Authorized");
            return;
        }
    });

    /**
     * GET /clinician/:clinicianId
     *
     * Returns clinician document with given clinician ID
     *
     * Parameters:
     *  clinicianId: Clinician ID
     * Response: Clinician document
     */
    server.get<{
        Headers: RequestHeaders,
        Params: ClinicianIdParams
    }>('/clinician/:clinicianId', {}, async (request, reply) => {
        const headers: { authorization?: string } = request.headers as any;
        let clinicianId = Number.isSafeInteger(Number(request.params.clinicianId)) &&
        Number(request.params.clinicianId) >= 0 ? request.params.clinicianId : undefined;
        try {
            const permissions = await authenticateUser(server.database, headers.authorization.split('Bearer ')[1]);
            if (clinicianId === undefined)
                clinicianId = permissions.getUserID();
            try {
                const clinician = await server.database.getClinicianByID(clinicianId);
                const response: Response<Clinician> = {
                    success: true,
                    body: clinician
                };
                if (permissions.getClinician(clinician)) {
                    reply.code(200)
                        .header('Content-Type', 'application/json')
                        .send(response)
                } else {
                    reply.code(403).send("Forbidden");
                }
            } catch (e) {
                if (permissions.getClinician()) {
                    reply.code(404).send("No Such Patient");
                } else {
                    reply.code(403).send("Forbidden");
                }
            }
        } catch (e) {
            reply.code(401).send("Not Authorized");
            return;
        }
    });

    /**
     * GET /clinician/:clinicianId/patients
     *
     * Returns a list of patients served by clinician with given clinician ID
     *
     * Parameters:
     *  clinicianId: Clinician ID
     * Response: List of patients
     */
    server.get<{
        Headers: RequestHeaders,
        Params: ClinicianIdParams
    }>('/clinician/:clinicianId/patients', {}, async (request, reply) => {
        const patients: Patient[] = new Array(5).fill(undefined).map((_, i) => {
            return {
                user: {
                    id: "" + i,
                    firebaseId: "firebase:" + i,
                    username: "patient" + i,
                    name: "Patient " + i,
                    email: "patient" + i + "@labmot.us"
                },
                phone: "000000000" + i,
                clinicianID: "0",
                birthday: moment().subtract(18 + i, 'years').subtract(Math.round(Math.random() * 364), 'days')
            }
        });

        const mockResponse: Response<Patient[]> = {
            success: true,
            body: patients
        };
        reply
            .code(200)
            .header('Content-Type', 'application/json')
            .send(mockResponse)
    })
}
