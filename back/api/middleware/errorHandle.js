const httpStatus = require('http-status')

const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(httpStatus.NOT_FOUND)
    next(error)
}

const printStack = (error, req, res, next) => {
    const statusCode = res.statusCode === httpStatus.OK ? httpStatus.INTERNAL_SERVER_ERROR : res.statusCode;
    res.status(statusCode)
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.stack
    })
}

module.exports = {
    notFound,
    printStack
}