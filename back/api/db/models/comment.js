'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Comment.belongsTo(models.Post);
            Comment.belongsTo(models.User);
        }
    };
    Comment.init({
        text: {
            allowNull: false,
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments',
        defaultScope: {
            include: sequelize.User
        }
    });
    return Comment;
};