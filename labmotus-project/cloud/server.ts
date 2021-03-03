import * as fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'

const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify.fastify()

server.register(require('./routes/v1/patient'), { prefix: 'v1' })
server.register(require('./routes/v1/clinician'), { prefix: 'v1' })
server.register(require('./routes/v1/assessment'), { prefix: 'v1' })

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
