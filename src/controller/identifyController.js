const z = require("zod");
const { categorize, getContactDetails, getPrimaryContactId } = require("../utils");

const IDENTIFY_SCHEMA = z.object({
  phoneNumber: z.string().describe("Phone Number of the user").nullable(),
  email: z.string().email().describe("Email of the user account").nullable(),
}).refine((data) => data.phoneNumber !== null || data.email !== null, {
  message: "Either phoneNumber or email must be provided",
});

/**
 * Register /identify route
 * @param {import('fastify').FastifyInstance} fastify
 */
async function identifyController(fastify) {
  fastify.route({
    method: "POST",
    url: "/identify",
    schema: {
      body: IDENTIFY_SCHEMA,
      security: [],
      tags: ["identify"],
      description: "Identify a user",
    },
    handler: async (request, reply) => {
      const { email, phoneNumber } = request.body;

      if (!email && !phoneNumber) {
        return reply.code(400).send("Either email or phoneNumber must be provided");
      }

      try {
        const contactWithEmail = await fastify.prisma.contact.findFirst({
          where: { email: email || undefined },
          include: { linkedContact: true },
        });

        const contactWithPhone = await fastify.prisma.contact.findFirst({
          where: { phoneNumber: phoneNumber || undefined },
          include: { linkedContact: true },
        });

        // Case 1: Both are unique
        if (!contactWithPhone && !contactWithEmail) {
          const newContact = await fastify.prisma.contact.create({
            data: {
              phoneNumber,
              email,
              linkPrecedence: "primary",
            },
          });
          return reply.code(200).send(await getContactDetails(newContact.id, fastify.prisma));
        }

        // Case 2: Both exist
        else if (contactWithEmail && contactWithPhone) {
          const sameContact = contactWithEmail.id === contactWithPhone.id ? contactWithEmail : null;

          // Case 2A: Same contact
          if (sameContact) {
            const primaryId = await getPrimaryContactId(sameContact.id, fastify.prisma);
            return reply.code(200).send(await getContactDetails(primaryId, fastify.prisma));
          }

          // Case 2B: Different contacts
          const { category, primary, secondary } = categorize(contactWithEmail, contactWithPhone);

          if (category === "primaryAndSecondary") {
            await fastify.prisma.contact.update({
              where: { id: secondary.id },
              data: { linkedId: primary.id },
            });
            return reply.code(200).send(await getContactDetails(primary.id, fastify.prisma));
          } else {
            // bothPrimary or bothSecondary
            let primaryID, secondaryID;

            const emailCreated = contactWithEmail.linkedContact?.createdAt || contactWithEmail.createdAt;
            const phoneCreated = contactWithPhone.linkedContact?.createdAt || contactWithPhone.createdAt;

            if (emailCreated < phoneCreated) {
              primaryID = contactWithEmail.linkedContact?.id || contactWithEmail.id;
              secondaryID = contactWithPhone.linkedContact?.id || contactWithPhone.id;
            } else {
              primaryID = contactWithPhone.linkedContact?.id || contactWithPhone.id;
              secondaryID = contactWithEmail.linkedContact?.id || contactWithEmail.id;
            }

            await fastify.prisma.contact.updateMany({
              where: { linkedId: secondaryID },
              data: { linkedId: primaryID },
            });

            await fastify.prisma.contact.update({
              where: { id: secondaryID },
              data: {
                linkPrecedence: "secondary",
                linkedId: primaryID,
              },
            });

            return reply.code(200).send(await getContactDetails(primaryID, fastify.prisma));
          }
        }

        // Case 3: Only one exists
        else {
          const existing = contactWithEmail || contactWithPhone;
          const primaryId = await getPrimaryContactId(existing.id, fastify.prisma);

          await fastify.prisma.contact.create({
            data: {
              phoneNumber,
              email,
              linkPrecedence: "secondary",
              linkedId: primaryId,
            },
          });

          return reply.code(200).send(await getContactDetails(primaryId, fastify.prisma));
        }
      } catch (e) {
        console.error("Error:", e);
        return reply.code(500).send(e);
      }
    },
  });
}

module.exports = identifyController;
