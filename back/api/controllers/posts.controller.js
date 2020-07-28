const httpStatus = require('http-status');
const {models} = require('../../db');
const validators = require('../validations/post.validations');
const { Op } = require("sequelize");


const index = async function (req, res, next) {
    const rows = await models.post
    .findAll({
        attributes: {
            include: {
                model: models.user,
                include: {
                    model: models.user,
                    as: 'followers',
                    required: true
                },
            }
        }
    });

    return res.json({rows});

    return res.json({
        count,
        data: all ? rows : rows.map(({user, ...post}) => post)
    });
}

const show = async function (req, res, next) {
    const post = await models.post.findByPk(req.params.id, {include: 'comments'})

    if (!post) {
        res.status(httpStatus.NOT_FOUND)
        return res.json({error: 'No post with that id'});
    }

    return res.json(post.comments);
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