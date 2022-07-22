const Joi = require("joi");

exports.contactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .required(),
  favorite: Joi.boolean(),
});

exports.updContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string(),
}).min(1);

exports.schemaUpdateFavorite = Joi.object({
  favorite: Joi.bool().required(),
});
