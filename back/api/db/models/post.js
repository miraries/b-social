'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        isByFollowed(userId) {
            this.getFollowers({ where: { user: userId } })
        };

        static associate(models) {
            Post.belongsTo(models.User);
            Post.hasMany(models.Comment, {
                foreignKey: {
                    allowNull: false
                }
            });
        }
    };
    Post.init({
        text: {
            allowNull: false,
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Post',
        tableName: 'posts'
    });

    Post.addScope('fromFollowed', userId => ({
        include: [{
            model: sequelize.User,
            include: {
                model: sequelize.User,
                as: 'followers',
                where: {
                    id: userId
                },
                through: { attributes: [] },
                attributes: []
            },
            required: true
        }, { model: sequelize.Comment, include: sequelize.User }]
    }));

    Post.addScope('withRelations', userId => ({
        include: [sequelize.User, { model: Comment, include: sequelize.User }]
    }));

    return Post;
};