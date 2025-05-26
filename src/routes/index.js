const identifyRoute = require('./identify');

async function routes(fastify, options) {
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok' };
  });
  fastify.register(identifyRoute);
}

module.exports = routes; 