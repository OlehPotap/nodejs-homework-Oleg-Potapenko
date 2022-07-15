const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const _ = require("lodash");
const Joi = require("joi");

const contactSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .required(),
});

const updContactSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
}).min(1);

const contactsPath = path.resolve("./models/contacts.json");

const router = express.Router();

// ===================================== Handy funcs

const parseContacts = async () => {
  return await JSON.parse(await fs.readFile(contactsPath, "utf8"));
};

// ===================================== middlwares

const sendContacts = async (req, res, next) => {
  return res.json(await parseContacts());
};

const sendContactById = async (req, res, next) => {
  const parsedContacts = await parseContacts();
  const searhedEl = parsedContacts.find((el) => {
    return el.id === req.params.contactId;
  });
  if (!searhedEl) {
    return await res.status(404).json({ message: "Not found" });
  }
  return res.json(contactSchema.validate(searhedEl));
};
const addContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const parsedContacts = await parseContacts();
  const lastContactId = parsedContacts.slice(-1).find((el) => {
    return el;
  }).id;
  const contact = {
    id: JSON.stringify(Number(lastContactId) + 1),
    name,
    email,
    phone,
  };

  if (req.body.name && req.body.email && req.body.phone) {
    if (
      parsedContacts.some(
        (el) => el.email === contact.email || el.phone === contact.phone
      )
    ) {
      return res
        .status(400)
        .json({ message: "contact with same phone or email is already exist" });
    } else {
      const newContacts = JSON.stringify([...parsedContacts, contact]);
      fs.writeFile(contactsPath, newContacts);
    }

    return res.status(201).json(contact);
  }
  return res.status(400).json({ message: "missing required name field" });
};

const deleteContact = async (req, res, next) => {
  const parsedContacts = await parseContacts();
  const newContactsArr = parsedContacts.filter((el) => {
    return String(el.id) !== String(req.params.contactId);
  });
  if (_.isEmpty(_.difference(parsedContacts, newContactsArr))) {
    return res.status(404).json({ message: "Not found" });
  } else {
    fs.writeFile(contactsPath, JSON.stringify(newContactsArr));
    return res.status(200).json({ message: "contact deleted" });
  }
};

const rewriteContact = async (req, res, next) => {
  const parsedContacts = await parseContacts();
  const searhedEl = parsedContacts.find((el) => {
    return el.id === req.params.contactId;
  });

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  } else {
    const name = req.body.name || searhedEl.name;
    const email = req.body.email || searhedEl.email;
    const phone = req.body.phone || searhedEl.phone;

    const newContact = {
      id: searhedEl.id,
      name,
      email,
      phone,
    };

    const newContactsArr = parsedContacts.filter((el) => {
      return String(el.id) !== String(req.params.contactId);
    });
    if (_.isEmpty(_.difference(parsedContacts, newContactsArr))) {
      return res.status(404).json({ message: "Not found" });
    } else {
      newContactsArr.push(newContact);
      fs.writeFile(contactsPath, JSON.stringify(newContactsArr));
      return res.json(updContactSchema.validate(newContact));
    }
  }
};

router.get("/", sendContacts);

router.get("/:contactId", sendContactById);

router.post("/", addContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", rewriteContact);

module.exports = router;
