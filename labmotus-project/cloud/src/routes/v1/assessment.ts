import * as fastify from 'fastify'
import {Assessment, AssessmentState, Response} from '../../../../common/types/types'
import {RequestHeaders} from '../../types'
import {authenticateUser} from "../../auth/Authenticator";
import Database from "../../data/Database";
import path from "path";
import config from "../../../config.json";


interface AssessmentIdParams {
    assessmentId: string
}

export default async function (server: fastify.FastifyInstance & { database: Database }, options: fastify.FastifyPluginOptions, done: () => void) {
    /**
     * POST /assessments
     *
     * Create new assessment for a patient
     *
     * Response: Completed assessment document
     */
    server.post<{
        Headers: RequestHeaders,
        Body: Assessment
    }>('/assessments', {}, async (request, reply) => {
        const headers: { authorization?: string } = request.headers as any;
        try {
            const permissions = await authenticateUser(server.database, headers.authorization.split('Bearer ')[1]);
            const assessment = request.body;
            try {
                if (permissions.createAssessment(assessment)) {
                    const completeAssessment = await server.database.createAssessment(assessment);
                    const response: Response<Assessment> = {
                        success: true,
                        body: completeAssessment
                    };
                    reply
                        .code(200)
                        .header('Content-Type', 'application/json')
                        .send(response)
                } else {
                    reply.code(403).send("Forbidden");
                }
            } catch (e) {
                if (permissions.getAssessments()) {
                    reply.code(404).send("No Such Assessment");
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
     * POST /video/:assessmentId
     *
     * Uploaded video
     *
     * Upload File: Video
     * Response: Assessment document (no pose data or stats)
     */
    server.post<{
        Headers: RequestHeaders,
        Params: AssessmentIdParams
    }>('/video/:assessmentId', {}, async (request, reply) => {
        const headers: { authorization?: string } = request.headers as any;
        const assessmentId = Number.isSafeInteger(Number(request.params.assessmentId)) &&
        Number(request.params.assessmentId) >= 0 ? request.params.assessmentId : undefined;
        try {
            const permissions = await authenticateUser(server.database, headers.authorization.split('Bearer ')[1]);
            try {
                const assessment = await server.database.getAssessmentByID(permissions.getUserID(), assessmentId);
                if (permissions.uploadVideo(assessment)) {
                    const data = await request.file();
                    assessment.videoUrl = await server.database.saveVideo(assessmentId, data.file);
                    assessment.state = AssessmentState.PENDING;
                    const response: Response<Assessment> = {
                        success: true,
                        body: assessment
                    };
                    reply
                        .code(200)
                        .header('Content-Type', 'application/json')
                        .send(response)
                } else {
                    reply.code(403).send("Forbidden");
                }
            } catch (e) {
                if (permissions.getAssessments()) {
                    reply.code(404).send("No Such Assessment");
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
     * GET /video/:assessmentId
     *
     * Returns a video associated with assessment with given assessment ID
     *
     * Parameters:
     *  assessmentId: Assessment ID
     * Response: Video
     */
    server.get<{
        Headers: RequestHeaders,
        Params: AssessmentIdParams
    }>('/video/:assessmentId', {}, async (request, reply) => {
        const headers: { authorization?: string } = request.headers as any;
        const assessmentId = Number.isSafeInteger(Number(request.params.assessmentId)) &&
        Number(request.params.assessmentId) >= 0 ? request.params.assessmentId : undefined;
        try {
            const permissions = await authenticateUser(server.database, headers.authorization.split('Bearer ')[1]);
            try {
                const assessment = await server.database.getAssessmentByID(permissions.getUserID(), assessmentId);
                if (permissions.viewVideo(assessment)) {
                    reply.code(200).sendFile(assessmentId + ".mp4", path.resolve(config.videoPath))
                } else {
                    reply.code(403).send("Forbidden");
                }
            } catch (e) {
                if (permissions.getPatient()) {
                    reply.code(404).send("No Such Assessment");
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
