import {fastify, FastifyInstance} from 'fastify'
import {IncomingMessage, Server, ServerResponse} from 'http'
import * as firebaseAdmin from 'firebase-admin';
import serviceAccount from "../firebase-service-key.json";
import config from "../config.json"
import * as fs from "fs";

import patient from "./routes/v1/patient";
import clinician from "./routes/v1/clinician";
import assessment from "./routes/v1/assessment";
import Database from "./data/Database";
import MockDatabase from "./data/MockDatabase";

import fastify_cors from "fastify-cors";

import fastify_formbody from "fastify-formbody";

import fastify_multipart from "fastify-multipart";

import fastify_static from "fastify-static";
import path from "path";

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify();

server.get('/', async (request, reply) => {
    reply
        .code(200)
        .header('Content-Type', 'text/plain')
        .send("online");
});

server.register(fastify_formbody);
server.register(fastify_multipart);
server.register(fastify_static, {
    root: __dirname
});
server.register(fastify_cors, {origin: true});
server.register(patient, {prefix: 'v1'});
server.register(clinician, {prefix: 'v1'});
server.register(assessment, {prefix: 'v1'});
let database: Database;

function init() {
    firebaseAdmin.initializeApp({credential: firebaseAdmin.credential.cert(serviceAccount as firebaseAdmin.ServiceAccount)});
    if (config.mock) {
        database = new MockDatabase();
    } else {
        database = new Database();
    }
    server.decorate('database', database);
    fs.mkdirSync(path.join(config.videoPath), {recursive: true});
}

init();

server.listen(5000, '0.0.0.0', (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1)
    }
    console.log("Saving videos to: " + path.resolve(config.videoPath));
    console.log(`Server listening at ${address}`);
});
