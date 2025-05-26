const fastify = require('./App');

const port = Number(process.env.PORT) || 3000;
const host = process.env.RENDER ? '0.0.0.0' : 'localhost';

fastify.listen({ host, port }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Fastify server running at ${address}`);
  console.log(`Route index: /`);
  console.log(`Route identify: /identify`);
  console.log(`Swagger UI: /documentation`);
});
