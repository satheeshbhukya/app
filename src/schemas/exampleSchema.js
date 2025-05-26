const { z } = require('zod');

const exampleSchema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
});

module.exports = exampleSchema; 