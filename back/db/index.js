const {DataTypes, Sequelize} = require('sequelize');
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
    }
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

const foreignKeyOption = {
    foreignKey: {
        allowNull: false
    }
}

User.hasMany(Post, foreignKeyOption);
Post.belongsTo(User);

Post.hasMany(Comment, foreignKeyOption);
Comment.belongsTo(Post);

User.hasMany(Comment, foreignKeyOption);
Comment.belongsTo(User);

User.belongsToMany(User, {as: 'followers', through: 'user_followers', ...foreignKeyOption})

User.findAndGenerateToken = async function (options) {
    const {email, password} = options;

    const user = await this.findOne({where: {email}});
    let message = ''

    if (user && await user.passwordMatches(password)) {
        return {user, token: user.token()};
    }

    throw 'Incorrect email or password';
}

User.prototype.passwordMatches = async function (password) {
    return bcrypt.compare(password, this.password);
}

User.prototype.toJSON = function () {
    const { password, ...user } = this.dataValues

    return user
}


User.prototype.token = function () {
    const payload = {
        exp: moment().add(1440, 'minutes').unix(),
        iat: moment().unix(),
        sub: this.id,
    };
    return jwt.encode(payload, process.env.JWT_SECRET);
}

User.addHook('beforeCreate', async (user, options) => {
    user.password = await bcrypt.hash(user.password, 10);
});

module.exports = sequelize;