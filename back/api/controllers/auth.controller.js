const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { User } = require('../db/models');
const { revoke } = require("../common/redis")
const { sendMessage, TOPIC } = require('../common/kafka')

const validators = require('../validations/auth.validations');

const register = async function (req, res, next) {
    try {
        const { error, value } = validators.register.validate(req.body, { abortEarly: false })
        if (error) {
            res.status(httpStatus.BAD_REQUEST)
            return res.json(error);
        }

        const user = await new User(value).save();
        const token = user.token()

        await sendMessage({
            date: new Date().toISOString(),
            user: user.removePassword()
        }, TOPIC.REGISTRATIONS)

        res.status(httpStatus.CREATED)
        res.json({ user, token });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(httpStatus.BAD_REQUEST);
            return res.json({ error: 'Email already registered' });
        }

        return next(error);
    }
}

const login = async function (req, res, next) {
    try {
        const { user, token } = await User.findAndGenerateToken(req.body);

        await sendMessage({
            user,
            timestamp: moment().format('YYYY-MM-DD')
        }, TOPIC.LOGINS)

        return res.json({ user, token });
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED)
        return res.json({ error })
    }
}

const logout = async function (req, res, next) {
    await revoke(req.headers.authorization.replace('Bearer ', ''))

    return res.json({ message: 'Logged out successfully' });
}

module.exports = {
    register,
    login,
    logout
}