const httpStatus = require('http-status');
const { models } = require('../../db');
const Joi = require('@hapi/joi');

const validators = require('../validations/auth');

const register = async function (req, res, next) {
    try {
        const { error, value } = validators.register.validate(req.body)
        if (error) {
            res.status(httpStatus.BAD_REQUEST)
            return res.json(error);
        }

        
        const user = await new models.user(value).save();
        const token = user.token()

        res.json({ ok: true, user, token });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(httpStatus.BAD_REQUEST);
            return res.json({error: 'Email already registered'});
        }
        return next(error);
    }
    
}

const login = async function (req, res) {
    try {
        return res.json({ hello })
        const { user, accessToken } = await User.findAndGenerateToken(req.body);
        const token = generateTokenResponse(user, accessToken);
        const userTransformed = user.transform();
        return res.json({ token, user: userTransformed });
    } catch (error) {
        return next(error);
    }
}

const refresh = async function (req, res) {
    try {
        const { email, refreshToken } = req.body;
        const refreshObject = await RefreshToken.findOneAndRemove({
            userEmail: email,
            token: refreshToken,
        });
        const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
        const response = generateTokenResponse(user, accessToken);
        return res.json(response);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    register,
    login,
    refresh
}