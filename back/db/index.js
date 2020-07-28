const {DataTypes, Sequelize} = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const moment = require('moment-timezone')

const sequelize = new Sequelize(
    process.env.DB,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

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
}, {
    defaultScope: {
        attributes: {exclude: ['password']},
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
}, {
    defaultScope: {
        include: User
    }
});

const foreignKeyOption = {
    foreignKey: {
        allowNull: false
    }
}

const UserFollow = sequelize.define('UserFollow', {}, {
    defaultScope: {
        attributes: {exclude: ['password']},
    }
});

User.hasMany(Post, foreignKeyOption);
Post.belongsTo(User);

Post.hasMany(Comment, foreignKeyOption);
Comment.belongsTo(Post);

User.hasMany(Comment, foreignKeyOption);
Comment.belongsTo(User);

User.belongsToMany(User, {as: 'following', through: UserFollow, foreignKey: 'followerId'})
User.belongsToMany(User, {as: 'followers', through: UserFollow, foreignKey: 'followedId'})

User.findAndGenerateToken = async function (options) {
    const {email, password} = options;

    const user = await this.findOne({where: {email}, attributes: {include: ['password']}});
    let message = ''

    if (user && await user.passwordMatches(password)) {
        return {user, token: user.token()};
    }

    throw 'Incorrect email or password';
}

User.prototype.passwordMatches = async function (password) {
    return bcrypt.compare(password, this.password);
}

User.prototype.token = function () {
    const payload = {
        exp: moment().add(process.env.JWT_TTL, 'minutes').unix(),
        iat: moment().unix(),
        sub: this.id,
    };
    return jwt.encode(payload, process.env.JWT_SECRET);
}

User.addHook('beforeCreate', async (user, options) => {
    user.password = await bcrypt.hash(user.password, 10);
});

Post.prototype.isByFollowed = function (userId) {
    this.getFollowers({where: {user: userId}})
};

Post.addScope('fromFollowed', userId => ({
    include: [{
        model: User,
        include: {
            model: User,
            as: 'followers',
            where: {
                id: userId
            },
            through: {attributes: []},
            attributes: []
        },
        required: true
    }, {model: Comment, include: User}]
}));

Post.addScope('withRelations', userId => ({
    include: [User, {model: Comment, include: User}]
}));

// F*** this, I'm never using sequelize again
// Post.addScope('withFollowed', userId => ({
//     include: [{
//         model: User,
//         include: {
//             model: User,
//             as: 'followers',
//             through: {attributes: []},
//             attributes: []
//         },
//         attributes: ['id','name','email','createdAt',
//             [sequelize.fn('COUNT', sequelize.col('user.followers.id')), 'following']
//         ],
//         duplicating: false
//     }],
//     group : ['post.id', 'user.followers.id'],
// }));

module.exports = sequelize;