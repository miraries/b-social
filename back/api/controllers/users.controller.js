const httpStatus = require('http-status');
const {models: {user}} = require('../../db');

const index = async function (req, res, next) {
    const users = await user.findAll();

    return res.json(users)
}

const profile = async function (req, res, next) {
    return res.json(req.user);
}

const show = async function (req, res, next) {
    // TODO
}

const isFollowing = async function (req, res, next) {
    const followable = await user.findByPk(req.params.userId)
    const {user: follower} = req

    if (!followable) {
        res.status(httpStatus.NOT_FOUND)
        return res.json({error: 'No user with that id'});
    }

    console.log({followable, follower})
    if (followable.id === follower.id) {
        res.status(httpStatus.CONFLICT)
        return res.json({message: 'You cannot follow yourself'})
    }

    return res.json({'isFollowing': await followable.hasFollowers(follower)})
}

const follow = async function (req, res, next) {
    const followable = await user.findByPk(req.params.userId)
    const {user: follower} = req

    if (!followable) {
        res.status(httpStatus.NOT_FOUND)
        return res.json({error: 'No user with that id'});
    }

    const alreadyFollows = await followable.hasFollowers(follower)
    const sameUser = followable.id === follower.id

    if (alreadyFollows) {
        res.status(httpStatus.CONFLICT)
        return res.json({message: 'You already follow this user', user: followable})
    } else if (sameUser) {
        res.status(httpStatus.CONFLICT)
        return res.json({message: 'You cannot follow yourself', user: followable})
    }

    await followable.addFollower(follower)

    res.status(httpStatus.OK)
    return res.json({message: 'Followed sucessfully', user: followable})
}

const unfollow = async function (req, res, next) { //TODO: Refactor
    const followable = await user.findByPk(req.params.userId)
    const {user: follower} = req

    if (!followable) {
        res.status(httpStatus.NOT_FOUND)
        return res.json({error: 'No user with that id'});
    }

    const alreadyUnfollowed = ! await followable.hasFollowers(follower)
    const sameUser = followable.id === follower.id

    if (alreadyUnfollowed) {
        res.status(httpStatus.CONFLICT)
        return res.json({message: 'You do not follow this user', user: followable})
    } else if (sameUser) {
        res.status(httpStatus.CONFLICT)
        return res.json({message: 'You cannot unfollow yourself', user: followable})
    }

    await followable.removeFollower(follower)

    res.status(httpStatus.OK)
    return res.json({message: 'Unfollowed sucessfully', user: followable})
}

module.exports = {
    profile,
    index,
    isFollowing,
    follow,
    unfollow
}