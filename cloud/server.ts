const fastify = require('fastify')({
    logger: true
  })
  
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })
  
  const start = async () => {
    try {
      await fastify.listen(3000)
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()

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