const Joi = require('@hapi/joi');

module.exports = {
    create: Joi.object({
        text: Joi.string()
        .max(500)
        .required()
    })
};