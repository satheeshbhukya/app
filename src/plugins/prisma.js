const fastifyPrisma = require("@joggr/fastify-prisma");
const { PrismaClient } = require("@prisma/client");
const fp = require("fastify-plugin");

const plugin = fp(
  async (fastify) => {
    fastify.register(fastifyPrisma, {
      client: new PrismaClient(),
      prefix: "prisma",
      clientConfig: {
        log: [{ emit: "event", level: "query" }],
      },
    });
  },
  { name: "prisma" }
);

module.exports = plugin;
