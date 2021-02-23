import * as fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'

// Create a http server. We pass the relevant typings for our http version used.
// By passing types we get correctly typed access to the underlying http objects in routes.
// If using http2 we'd pass <http2.Http2Server, http2.Http2ServerRequest, http2.Http2ServerResponse>
const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify.fastify()

server.get('/', async (request, reply) => {
  console.log(reply.raw) // this is the http.ServerResponse with correct typings!
  // reply.code(200).send("")
  return "Hello World"
})

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})



//Server Features
// /user API calls (all use auth token passed through Authorization header) 
//     post /patientcode (clinician registers patient)
//         clinician authorization
//         takes info for new signup, clinician ID
//         returns patient document (send email to patient)
//     post /patient (patient sign up)
//         takes info for new signup (whatever's still needed)
//         returns patient document
//     get /login 
//         creates login session and returns patient/doctor document
//     get /logout
//         logs out of session
//     delete /patient
//         takes ID
//     deletes patient account
//     patch /patient (update patient)
//     takes patient ID and new changes
//     update patient document
//     post /video 
//         takes video
//         returns url
//     post /assessment 
//         takes assessment info
//     get /clinician (get clinician info)
//         takes clinician ID
//         returns clinician document
//     get /video
//         takes url
//         returns video 
//     get /assessments
//         takes patient ID
//         returns assessments of patient
//     post /doctor (sign up doctor)
//         takes info for new signup
//         returns doctor document
//     get /patients
//         takes clinician ID
//         returns all documents of clinician’s patients