const httpStatus = require('http-status');
const {models} = require('../../db');
const validators = require('../validations/post.validations');


const index = async function (req, res, next) {
    const page = req.query.page || 0

    const posts = await models.post.findAll({
        offset: page * 5,
        limit: 5
    })

    return res.json(posts)
}

const show = async function (req, res, next) {
    // TODO
}

const create = async function (req, res, next) {
    const {error, value} = validators.create.validate(req.body)
    if (error) {
        res.status(httpStatus.BAD_REQUEST)
        return res.json(error);
    }

    const post = await new models.post({
        userId: req.user.id,
        ...value
    }).save();

    res.status(httpStatus.CREATED)
    return res.json(post)
}

const destroy = async function (req, res, next) {
    const post = await models.post.findByPk(req.params.id)

    if (!post) {
        res.status(httpStatus.NOT_FOUND)
        return res.json({error: 'No post with that id'});
    }

    if (post.userId !== req.user.id) {
        res.status(httpStatus.FORBIDDEN)
        return res.json({error: 'Cannot delete post you did not make'});
    }

    await post.destroy();
    return res.json({message: 'Deleted successfully', post})
}

module.exports = {
    index,
    show,
    create,
    destroy
}