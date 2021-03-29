import {FastifyInstance, FastifyPluginOptions} from 'fastify'
import moment from 'moment'
import validateUUID from 'uuid-validate';
import {Assessment, Patient, Response, SignUpParams} from '../../../../common/types/types'
import {RequestHeaders} from '../../types';
import {authenticateUser} from "../../auth/Authenticator";
import Database from "../../data/Database";
import {computePatientMods} from "../../data/Util";


interface PatientCodeParams {
    patientCode: string
}

interface PatientIdParams {
    patientId: string
}

export default async function (server: FastifyInstance & { database: Database }, options: FastifyPluginOptions, done: () => void) {
    /**
     * POST /patient
     *
     * Create a new patient document, with a patient invite code instead of a Firebase ID
     *
     * Body: Partial patient document (no id, invite code, or Firebase ID)
     * Response: Patient document (w/ id and invite code)
     */
    server.post<{
        Headers: RequestHeaders,
        Body: Patient
    }>('/patient', async (request, reply) => {
        const headers: { authorization?: string } = request.headers as any;
        try {
            const permissions = await authenticateUser(server.database, headers.authorization.split('Bearer ')[1]);
            const patient = request.body;
            try {
                if (permissions.createPatient()) {
                    const clinician = await server.database.getClinicianByID(permissions.getUserID());
                    const result = await server.database.createPatient(clinician, patient);
                    const response: Response<Patient> = {
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
                reply.code(403).send("Creation Failed");
            }
        } catch (e) {
            reply.code(401).send("Not Authorized");
            return;
        }
    });

    /**
     * POST /patient/finalize
     *
     * Finalize Patient Sign Up
     *
     * Body: Patient
     * Response: signin link
     */
    server.post<{
        Headers: RequestHeaders,
        Body: SignUpParams
    }>('/patient/finalize', async (request, reply) => {
        const params = request.body;
        try {
            const result = await server.database.finalizePatient(params);
            const response: Response<string> = {
                success: true,
                body: result
            };
            reply.code(200)
                .header('Content-Type', 'application/json')
                .send(response)
        } catch (e) {
            reply.code(403).send("Creation Failed");
        }
    });

    /**
     * PATCH /patient/:patientId
     *
     * Update patient document with given patient ID
     *
     * Parameters:
     *  patientId: Patient ID
     * Body: Partial patient document
     * Response: Patient document
     */
    server.patch<{
        Headers: RequestHeaders,
        Params: PatientIdParams,
        Body: Patient
    }>('/patient/:patientId', {}, async (request, reply) => {
        const headers: { authorization?: string } = request.headers as any;
        let patientID = validateUUID(request.params.patientId) ? request.params.patientId : undefined;
        try {
            const permissions = await authenticateUser(server.database, headers.authorization.split('Bearer ')[1]);
            if (patientID === undefined)
                patientID = permissions.getUserID();
            const newPatient = request.body;
            try {
                const patient = await server.database.getPatientByID(patientID);
                if (newPatient.hasOwnProperty('birthday'))
                    newPatient.birthday = moment(newPatient.birthday);
                const mods = computePatientMods(patient, newPatient);
                if (permissions.modifyPatient(patient, mods)) {
                    const result = await server.database.updatePatient(patientID, mods);
                    const response: Response<Patient> = {
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
     * GET /patient/:patientId
     *
     * Returns patient document with given patient ID
     *
     * Parameters:
     *  patientId: Patient ID
     * Response: Patient document
     */
    server.get<{
        Headers: RequestHeaders,
        Params: PatientIdParams
    }>('/patient/:patientId', {}, async (request, reply) => {
        const headers: { authorization?: string } = request.headers as any;
        let patientID = validateUUID(request.params.patientId) ? request.params.patientId : undefined;
        try {
            const permissions = await authenticateUser(server.database, headers.authorization.split('Bearer ')[1]);
            if (patientID === undefined)
                patientID = permissions.getUserID();
            try {
                const patient = await server.database.getPatientByID(patientID);
                const response: Response<Patient> = {
                    success: true,
                    body: patient
                };
                if (permissions.getPatient(patient)) {
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
     * GET /patient/:patientId/assessments
     *
     * Returns a list of assessments of patient with given patient ID
     *
     * Parameters:
     *  patientId: Patient ID
     *  start: Start of Query
     *  duration: Duration of query range
     *  unit: Units of duration. Default 1w
     * Response: List of patient assessments
     */
    server.get<{
        Query: { start: string, duration: string, unit: string }
        Headers: RequestHeaders,
        Params: { patientId: string },
    }>('/patient/:patientId/assessments', {}, async (request, reply) => {
        const headers: { authorization?: string } = request.headers as any;
        const patientID = request.params.patientId;
        const query: { start: string, duration: string, unit: string } = request.query as any;
        const start = query?.start;
        const duration = query?.duration === undefined ? "1" : query.duration;
        const unit = query?.unit === undefined ? "w" : query?.unit;
        if (start === undefined) {
            reply.code(400).send("No Start Time specified")
        }
        try {
            const permissions = await authenticateUser(server.database, headers.authorization.split('Bearer ')[1]);
            try {
                const patient = await server.database.getPatientByID(patientID);
                if (permissions.getAssessments(patient)) {
                    try {
                        const results = await server.database.getAssessmentsByPatient(patientID, moment(start), Number(duration), unit);
                        const response: Response<Assessment[]> = {
                            success: true,
                            body: results
                        };
                        reply.code(200)
                            .header('Content-Type', 'application/json')
                            .send(response)
                    } catch (e) {
                        reply.code(400).send("Bad Request")
                    }
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
    })
}
