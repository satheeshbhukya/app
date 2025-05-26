const fp = require("fastify-plugin");
const path = require("path");

const plugin = fp(
  async (fastify) => {
    fastify.register(require("@fastify/static"), {
      root: path.join(__dirname, "../public"),
    });
  },
  { name: "publicFiles" }
);

module.exports = plugin;
