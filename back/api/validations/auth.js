const Joi = require('@hapi/joi');

module.exports = {
    register: Joi.object({
        name: Joi.string()
        .max(128)
        .required(),
        email: Joi.string()
        .email()
        .required(),
        password: Joi.string()
        .required()
        .min(8)
        .max(128)
    }),
    
    login: Joi.object({
        email: Joi.string()
        .email()
        .required(),
        password: Joi.string()
        .required()
        .max(128),
    }),
    
    refresh: Joi.object({
        refreshToken: Joi.string().required()
    })
};