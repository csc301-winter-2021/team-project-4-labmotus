import * as fastify from 'fastify'
import moment from 'moment'
import {Assessment, AssessmentState, Response} from '../../../../common/types/types'
import {RequestHeaders} from '../../types'


interface AssessmentIdParams {
    assessmentId: string
}

export default async function (server: fastify.FastifyInstance, options: fastify.FastifyPluginOptions, done: () => void) {
    /**
     * POST /video
     *
     * Create new assessment document associated w/ uploaded video
     *
     * Upload File: Video
     * Response: Assessment document (no pose data or stats)
     */
    server.post<{
        Headers: RequestHeaders
    }>('/video', {}, async (request, reply) => {
        const mockResponse: Response<Assessment> = {
            success: true,
            body: {
                id: "0",
                patientId: "0",
                name: "General Assessment",
                state: AssessmentState.PENDING,
                date: moment(),
                videoUrl: "https://video.url/"
            }
        };
        reply
            .code(200)
            .header('Content-Type', 'application/json')
            .send(mockResponse)
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
        const mockResponse: Response<unknown> = {
            success: false,
            error: "Video not yet implemented"
        };
        reply
            .code(501)
            .header('Content-Type', 'application/json')
            .send(mockResponse)
    })
}
