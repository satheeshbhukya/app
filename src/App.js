const Fastify = require('fastify');
const swagger = require('./plugins/swagger');
const validator = require('./plugins/validator');
const prisma = require('./plugins/prisma.js');
const publicFiles = require('./plugins/publicFiles');
const routes = require('./routes');

const fastify = Fastify({ logger: true });

// Register plugins
fastify.register(swagger);
fastify.register(validator);
fastify.register(prisma);
fastify.register(publicFiles);

// Register routes
fastify.register(routes);

module.exports = fastify;
