const httpStatus = require('http-status');
const {models} = require('../../db');
const validators = require('../validations/comment.validations');
const {sendMessage, TOPIC} = require('../common/kafka')

const index = async function (req, res, next) {
    const post = await models.post.findByPk(req.params.id)

    if (!post) {
        res.status(httpStatus.NOT_FOUND)
        return res.json({error: 'No post with that id'});
    }

    const comments = await models.comment.findAll({
        where: {
            postId: post.id
        }
    })

    return res.json(comments)
}

const create = async function (req, res, next) {
    const post = await models.post.findByPk(req.params.id)
    const {user} = req

    if (!post) {
        res.status(httpStatus.NOT_FOUND)
        return res.json({error: 'No post with that id'});
    }

    const {error, value} = validators.create.validate(req.body)
    if (error) {
        res.status(httpStatus.BAD_REQUEST)
        return res.json(error);
    }

    const comment = await new models.comment({
        userId: req.user.id,
        postId: post.id,
        ...value
    }).save();

    await sendMessage({
        comment,
        post,
        user
    }, TOPIC.COMMENTS)

    res.status(httpStatus.CREATED)
    return res.json({user, ...comment.toJSON()})
}

const destroy = async function (req, res, next) {
    const comment = await models.comment.findByPk(req.params.id)

    if (!comment) {
        res.status(httpStatus.NOT_FOUND)
        return res.json({error: 'No comment with that id'});
    }

    if (comment.userId !== req.user.id) {
        res.status(httpStatus.FORBIDDEN)
        return res.json({error: 'Cannot delete comment you did not make'});
    }

    await comment.destroy();
    return res.json({message: 'Deleted successfully', comment})
}

module.exports = {
    index,
    create,
    destroy
}