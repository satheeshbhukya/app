const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function identifyRoute(fastify, options) {
  fastify.post('/identify', async (request, reply) => {
    const { email, phoneNumber } = request.body;

    if (!email && !phoneNumber) {
      return reply.code(400).send({ error: 'At least one of email or phoneNumber is required.' });
    }

    // Find all contacts with matching email or phoneNumber
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { email: email || undefined },
          { phoneNumber: phoneNumber || undefined }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    let primaryContact = null;
    let allContacts = [];
    let secondaryContactIds = [];

    if (contacts.length === 0) {
      // No contact found, create a new primary contact
      const newContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'primary'
        }
      });
      primaryContact = newContact;
      allContacts = [newContact];
    } else {
      // There are existing contacts, find the primary
      // Get all related contacts (by linkedId or id)
      const primaryIds = contacts.map(c => c.linkedId || c.id);
      const allRelatedContacts = await prisma.contact.findMany({
        where: {
          OR: [
            { id: { in: primaryIds } },
            { linkedId: { in: primaryIds } }
          ]
        },
        orderBy: { createdAt: 'asc' }
      });

      // Find the oldest (primary) contact
      primaryContact = allRelatedContacts.find(c => c.linkPrecedence === 'primary');
      allContacts = allRelatedContacts;

      // If the incoming email/phone is new, create a secondary contact
      const hasEmail = allContacts.some(c => c.email === email);
      const hasPhone = allContacts.some(c => c.phoneNumber === phoneNumber);

      if ((!hasEmail && email) || (!hasPhone && phoneNumber)) {
        const newSecondary = await prisma.contact.create({
          data: {
            email,
            phoneNumber,
            linkPrecedence: 'secondary',
            linkedId: primaryContact.id
          }
        });
        allContacts.push(newSecondary);
      }
    }

    // Prepare response
    const emails = [];
    const phoneNumbers = [];
    const secondaryIds = [];

    for (const c of allContacts) {
      if (c.linkPrecedence === 'primary') {
        if (c.email && !emails.includes(c.email)) emails.unshift(c.email);
        if (c.phoneNumber && !phoneNumbers.includes(c.phoneNumber)) phoneNumbers.unshift(c.phoneNumber);
      } else {
        if (c.email && !emails.includes(c.email)) emails.push(c.email);
        if (c.phoneNumber && !phoneNumbers.includes(c.phoneNumber)) phoneNumbers.push(c.phoneNumber);
        secondaryIds.push(c.id);
      }
    }

    return {
      contact: {
        primaryContatctId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds: secondaryIds
      }
    };
  });
}

module.exports = identifyRoute; 