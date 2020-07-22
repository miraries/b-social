const JwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const {models} = require('../../db');


const jwtOptions = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload, done) => {
    try {
        const user = await models.user.findByPk(payload.sub);
        if (user) return done(null, user);

        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}

module.exports = () => {
    return new JwtStrategy(jwtOptions, jwt)
}