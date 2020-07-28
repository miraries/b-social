const redis = require('redis');

const host = process.env.REDIS_HOST || '127.0.0.1';
const port = process.env.REDIS_PORT || 6379;

let client = redis.createClient(port, host, {});
client.on('connect', function() {
    console.log('Redis client connected');
});
client.on('error', console.log);

const prefixKey = key => 'jwt-blacklist:' + key

const isRevoked = function (key) {
    if (!client.connected)
        client = redis.createClient(port, host, {});

    return new Promise((resolve, reject) => {
        client.hgetall(prefixKey(key), function (err, res) {
            console.log({err, res})
            resolve(!!res)
        })
    });
}

const revoke = function (key) {
    const prefixedKey = prefixKey(key)

    return new Promise((resolve, reject) => {
        client.hmset(prefixedKey, 'revoked', 'true', function (err, res) {
            client.expire(prefixedKey, process.env.JWT_TTL * 60);
            if(err) reject(err)
            else resolve(res)
        });
    })
}

module.exports = {
    isRevoked,
    revoke
}