import {fastify, FastifyInstance} from 'fastify'
import {IncomingMessage, Server, ServerResponse} from 'http'

import patient from "./routes/v1/patient";
import clinician from "./routes/v1/clinician";
import assessment from "./routes/v1/assessment";

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify();

server.register(patient, {prefix: 'v1'});
server.register(clinician, {prefix: 'v1'});
server.register(assessment, {prefix: 'v1'});

function init() {
  server.decorate("test", {test: true});
}

init();

server.listen(5000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1)
  }
  console.log(`Server listening at ${address}`);
});
