import {FastifyInstance, FastifyPluginOptions} from 'fastify'
import moment from 'moment'
import {Assessment, AssessmentState, Patient, Response, User} from '../../../../common/types/types'
import {RequestHeaders} from '../../types';
import {authenticateUser} from "../../auth/Authenticator";
import Database from "../../data/Database";


interface PatientCodeParams {
    patientCode: string
}

interface PatientIdParams {
    patientId: string
}

export default async function (server: FastifyInstance & { database: Database }, options: FastifyPluginOptions, done: () => void) {
    /**
     * POST /patientcode
     *
     * Create a new patient document, with a patient invite code instead of a Firebase ID
     *
     * Body: Partial patient document (no id, invite code, or Firebase ID)
     * Response: Patient document (w/ id and invite code)
     */
    server.post<{
        Headers: RequestHeaders,
        Body: Patient
    }>('/patientcode', async (request, reply) => {
        const patient = request.body;
        patient.user.id = "0";
        patient.patientCode = "01234567";

        const mockResponse: Response<Patient> = {
            success: true,
            body: patient
        };
        reply
            .code(200)
            .header('Content-Type', 'application/json')
            .send(mockResponse)
    });

    /**
     * POST /patient/:patientCode
     *
     * Assign Firebase ID to patient document with given patient invite code
     *
     * Parameters:
     *  patientCode: Patient invite code
     * Response: Patient document
     */
    server.post<{
        Headers: RequestHeaders,
        Params: PatientCodeParams
    }>('/patient/:patientCode', {}, async (request, reply) => {
        const mockResponse: Response<Patient> = {
            success: true,
            body: {
                user: {
                    id: "0",
                    firebaseId: "firebase:0",
                    username: "labmotus",
                    name: "LabMotus User",
                    email: "user@labmot.us"
                },
                clinicianID: "0",
                phone: "1234567890",
                birthday: moment().subtract(18, 'years')
            }
        };
        reply
            .code(200)
            .header('Content-Type', 'application/json')
            .send(mockResponse)
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
        const patientUser: User = {
            id: request.params.patientId,
            firebaseId: "firebase:0",
            username: "labmotus",
            name: "LabMotus User",
            email: "user@labmot.us"
        };
        const patient: Patient = {
            user: patientUser,
            phone: "1234567890",
            clinicianID: '0',
            birthday: moment().subtract(18, 'years')
        };
        Object.assign(patientUser, request.body.user);
        Object.assign(patient, request.body);
        Object.assign(patient.user, patientUser);

        const mockResponse: Response<Patient> = {
            success: true,
            body: patient
        };
        reply
            .code(200)
            .header('Content-Type', 'application/json')
            .send(mockResponse)
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
        let patientID = Number.isSafeInteger(request.params.patientId) &&
        Number(request.params.patientId) >= 0 ? request.params.patientId : undefined;
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
                        const results = await server.database.getAssessments(patientID, moment(start), Number(duration), unit);
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

        const assessments: Assessment[] = [
            {
                id: "0",
                name: "General Assessment",
                state: AssessmentState.COMPLETE,
                patientId: request.params.patientId,
                date: moment().subtract(3, 'days'),
                videoUrl: "https://video.url/",
                stats: [
                    {
                        name: "Angle 0",
                        joint: "Joint 0",
                        unit: "\xb0",
                        currValue: Math.random() * Math.PI,
                        goalValue: Math.random() * Math.PI
                    },
                    {
                        name: "Angle 1",
                        joint: "Joint 0",
                        unit: "\xb0",
                        currValue: Math.random() * Math.PI,
                        goalValue: Math.random() * Math.PI
                    },
                    {
                        name: "Angle 2",
                        joint: "Joint 1",
                        unit: "\xb0",
                        currValue: Math.random() * Math.PI,
                        goalValue: Math.random() * Math.PI
                    },
                    {
                        name: "Angle 3",
                        joint: "Joint 1",
                        unit: "\xb0",
                        currValue: Math.random() * Math.PI,
                        goalValue: Math.random() * Math.PI
                    }
                ]
            }
        ];

        const mockResponse: Response<Assessment[]> = {
            success: true,
            body: assessments
        };
        reply
            .code(200)
            .header('Content-Type', 'application/json')
            .send(mockResponse)
    })
}
