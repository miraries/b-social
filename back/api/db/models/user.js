'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const moment = require('moment-timezone')
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        passwordMatches(password) {
            return bcrypt.compare(password, this.password);
        }

        removePassword() {
            const { password, ...user } = this.dataValues

            return user
        }

        token() {
            const payload = {
                exp: moment().add(process.env.JWT_TTL, 'minutes').unix(),
                iat: moment().unix(),
                sub: this.id,
            };
            return jwt.encode(payload, process.env.JWT_SECRET);
        }

        static async findAndGenerateToken(options) {
            const { email, password } = options;

            const user = await this.findOne({ where: { email }, attributes: { include: ['password'] } });
            let message = ''

            if (user && await user.passwordMatches(password)) {
                return { user, token: user.token() };
            }

            throw 'Incorrect email or password';
        }

        static associate(models) {
            User.hasMany(models.Post, {
                foreignKey: {
                    allowNull: false
                }
            });
            User.hasMany(models.Comment, {
                foreignKey: {
                    allowNull: false
                }
            });
            User.belongsToMany(User, { as: 'following', through: models.UserFollow, foreignKey: 'followerId' })
            User.belongsToMany(User, { as: 'followers', through: models.UserFollow, foreignKey: 'followedId' })
        }
    }

    User.init({
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        defaultScope: {
            attributes: { exclude: ['password'] },
        }
    });

    User.addHook('beforeCreate', async (user, options) => {
        user.password = await bcrypt.hash(user.password, 10);
    });

    return User;
};