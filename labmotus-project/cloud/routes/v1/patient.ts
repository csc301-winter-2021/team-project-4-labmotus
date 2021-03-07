import * as fastify from 'fastify'
import moment from 'moment'
import {Assessment, AssessmentState, Patient, Response, User} from '../../../common/types/types'
import {RequestHeaders} from '../../types';


interface PatientCodeParams {
    patientCode: string
}

interface PatientIdParams {
    patientId: string
}

export default async function (server: fastify.FastifyInstance, options: fastify.FastifyPluginOptions, done: () => void) {
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
        const patient: Patient = {
            user: {
                id: request.params.patientId,
                firebaseId: "firebase:0",
                username: "labmotus",
                name: "LabMotus User",
                email: "user@labmot.us",
            },
            phone: "1234567890",
            clinicianID: '0',
            birthday: moment().subtract(18, 'years')
        };

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
     * GET /patient/:patientId/assessments
     *
     * Returns a list of assessments of patient with given patient ID
     *
     * Parameters:
     *  patientId: Patient ID
     * Response: List of patient assessments
     */
    server.get<{
        Headers: RequestHeaders,
        Params: PatientIdParams
    }>('/patient/:patientId/assessments', {}, async (request, reply) => {
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
