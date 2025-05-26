const identifyController = require('./controller/identifyController');

async function router(fastify) {
  fastify.register(identifyController);
}

module.exports = router;
