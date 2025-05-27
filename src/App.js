const Fastify = require('fastify');
const swagger = require('./plugins/swagger');
const validator = require('./plugins/validator');
const prisma = require('./plugins/prisma.js');
const publicFiles = require('./plugins/publicFiles');
const routes = require('./routes');
// const identifyRoute = require('./identify'); // Comment this out if included in routes

const fastify = Fastify({ logger: true });

// Register plugins
fastify.register(swagger);
fastify.register(validator);
fastify.register(prisma);
fastify.register(publicFiles);

// Register routes
fastify.register(routes); // Ensure this does not include identifyRoute

// Define a root route
fastify.get('/', async (request, reply) => {
    return { message: 'Welcome to the API!' };
});

fastify.get('/test', async (request, reply) => {
    return { message: 'Test route is working!' };
});

module.exports = fastify;
