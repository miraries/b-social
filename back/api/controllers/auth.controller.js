const httpStatus = require('http-status');
const { models } = require('../../db');
const { revoke } = require("../common/redis")

const validators = require('../validations/auth.validations');

const register = async function (req, res, next) {
    try {
        const { error, value } = validators.register.validate(req.body, {abortEarly: false})
        if (error) {
            res.status(httpStatus.BAD_REQUEST)
            return res.json(error);
        }

        const user = await new models.user(value).save();
        const token = user.token()

        res.status(httpStatus.CREATED)
        res.json({ user, token });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(httpStatus.BAD_REQUEST);
            return res.json({error: 'Email already registered'});
        }

        return next(error);
    }
}

const login = async function (req, res, next) {
    try {
        const { user, token } = await models.user.findAndGenerateToken(req.body);

        return res.json({ user, token });
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED)
        return res.json({error})
    }
}

const logout = async function (req, res, next) {
    await revoke(req.headers.authorization.replace('Bearer ', ''))

    return res.json({ message: 'Logged out successfully'});
}

module.exports = {
    register,
    login,
    logout
}