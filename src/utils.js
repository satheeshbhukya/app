const { PrismaClient } = require('@prisma/client');

/**
 * Categorize two contacts based on their link precedence.
 */
function categorize(firstContact, secondContact) {
  if (firstContact.linkPrecedence === "primary" && secondContact.linkPrecedence === "primary") {
    return { category: "bothPrimary" };
  } else if (firstContact.linkPrecedence === "primary" && secondContact.linkPrecedence === "secondary") {
    return { category: "primaryAndSecondary", primary: firstContact, secondary: secondContact };
  } else if (firstContact.linkPrecedence === "secondary" && secondContact.linkPrecedence === "primary") {
    return { category: "primaryAndSecondary", primary: secondContact, secondary: firstContact };
  } else {
    return { category: "bothSecondary" };
  }
}

/**
 * Returns the primary contact ID for a given contact.
 */
async function getPrimaryContactId(id, prisma) {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });
  if (contact && contact.linkPrecedence === "secondary") {
    return contact.linkedId;
  }
  return id;
}

/**
 * Get all contact details including secondary linked contacts.
 */
async function getContactDetails(id, prisma) {
  const currentContact = await prisma.contact.findUnique({
    where: { id },
    include: {
      contacts: {
        select: {
          id: true,
          phoneNumber: true,
          email: true,
        },
      },
    },
  });

  if (!currentContact) return null;

  return formatContactDetails(currentContact);
}

/**
 * Format the response payload for a contact and its linked contacts.
 */
function formatContactDetails(currentContact) {
  return {
    contact: {
      primaryContactId: currentContact.linkedId || currentContact.id,
      emails: [...new Set(currentContact.contacts.map((c) => c.email).concat(currentContact.email))],
      phoneNumbers: [...new Set(currentContact.contacts.map((c) => c.phoneNumber).concat(currentContact.phoneNumber))],
      secondaryContactIds: [...new Set(currentContact.contacts.map((c) => c.id))],
    },
  };
}

module.exports = {
  categorize,
  getPrimaryContactId,
  getContactDetails,
};
