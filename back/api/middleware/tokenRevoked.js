const httpStatus = require("http-status");
const { isRevoked } = require("../common/redis")

module.exports = async function (req, res, next) {
    if(!req.headers.authorization || !req.headers.authorization.length)
        return next()

    const key = req.headers.authorization.replace('Bearer ', '')

    if(await isRevoked(key)) {
        res.status(httpStatus.FORBIDDEN)
        return res.json({message: 'Token revoked'})
    }

    next()
};