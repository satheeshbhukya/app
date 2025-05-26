const fp = require("fastify-plugin");
const {
  serializerCompiler,
  validatorCompiler,
} = require("fastify-type-provider-zod");

const plugin = fp(
  async (fastify) => {
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);
  },
  { name: "validator" }
);

module.exports = plugin;
