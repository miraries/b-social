const { DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const moment = require('moment-timezone')

const sequelize = new Sequelize('bsocial', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = sequelize.define('user', {
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
    },
});

const Post = sequelize.define('post', {
    text: {
        allowNull: false,
        type: DataTypes.TEXT
    }
});

const Comment = sequelize.define('comment', {
    text: {
        allowNull: false,
        type: DataTypes.TEXT
    }
});

User.hasMany(Post);
Post.belongsTo(User);

Post.hasMany(Comment);
Comment.belongsTo(Post);

User.belongsToMany(User, { as: 'followers', through: 'user_followers' })

User.findAndGenerateToken = async function(options) {
    const { email, password, refreshObject } = options;

    const user = await this.findOne({ email }).exec();
    const err = {
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
    };
    if (password) {
        if (user && await user.passwordMatches(password)) {
            return { user, accessToken: user.token() };
        }
        err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
        if (moment(refreshObject.expires).isBefore()) {
            err.message = 'Invalid refresh token.';
        } else {
            return { user, accessToken: user.token() };
        }
    } else {
        err.message = 'Incorrect email or refreshToken';
    }
    throw err;
}

User.passwordMatches = async function(password) {
    return bcrypt.compare(password, this.password);
}

User.addHook('beforeCreate', async (user, options) => {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
});

User.prototype.token = function() {
    const playload = {
        exp: moment().add(1440, 'minutes').unix(),
        iat: moment().unix(),
        sub: this._id,
    };
    return jwt.encode(playload, '498heri98eriodf49reoidjf');
}

module.exports = sequelize;