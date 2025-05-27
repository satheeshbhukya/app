const fastifySwagger = require("@fastify/swagger");
const fastifySwaggerUI = require("@fastify/swagger-ui");
const fp = require("fastify-plugin");
const { createJsonSchemaTransform } = require("fastify-type-provider-zod");

const plugin = fp(
  async (fastify) => {
    fastify.register(fastifySwagger, {
      swagger: {
        info: {
          title: 'API Documentation',
          description: 'API documentation for your Fastify application',
          version: '1.0.0'
        },
        host: 'localhost:3000', // Adjust as necessary
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json']
      }
    });

    fastify.register(fastifySwaggerUI, {
      routePrefix: "/documentation",
    });
  },
  { name: "swagger" }
);

module.exports = plugin;
