import * as fastify from 'fastify'
import moment from 'moment'
import {Clinician, Patient, Response, User} from '../../../common/types/types'
import {RequestHeaders} from '../../types';


interface ClinicianIdParams {
    clinicianId: string
}

export default async function (server: fastify.FastifyInstance, options: fastify.FastifyPluginOptions, done: () => void) {
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
        const clinicianUser: User = {
            id: request.params.clinicianId,
            firebaseId: "firebase:0",
            username: "labmotus",
            name: "LabMotus Clinician",
            email: "clinician@labmot.us"
        };
        const clinician: Clinician = {
            user: clinicianUser,
            clinic: "LabMotus Clinic"
        };
        Object.assign(clinicianUser, request.body.user);
        Object.assign(clinician, request.body);
        Object.assign(clinician.user, clinicianUser);

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
        const clinician: Clinician = {
            user: {
                id: request.params.clinicianId,
                firebaseId: "firebase:0",
                username: "labmotus",
                name: "LabMotus Clinician",
                email: "clinician@labmot.us"
            },
            clinic: "LabMotus Clinic"
        };

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