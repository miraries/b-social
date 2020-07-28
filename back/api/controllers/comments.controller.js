const httpStatus = require('http-status');
const {Post, Comment} = require('../db/models');
const validators = require('../validations/comment.validations');
const {sendMessage, TOPIC} = require('../common/kafka')

const index = async function (req, res, next) {
    const post = await Post.findByPk(req.params.id)

    if (!post) {
        res.status(httpStatus.NOT_FOUND)
        return res.json({error: 'No post with that id'});
    }

    const comments = await Comment.findAll({
        where: {
            postId: post.id
        }
    })

    return res.json(comments)
}

const create = async function (req, res, next) {
    const post = await Post.findByPk(req.params.id)
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

    const comment = await new Comment({
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
    const comment = await Comment.findByPk(req.params.id)

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