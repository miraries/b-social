const {Kafka} = require('kafkajs')

const TOPIC = {
    REGISTRATIONS: 'bsocial-registrations',
    POSTS: 'bsocial-posts',
    COMMENTS: 'bsocial-comments'
}

const createClient = function () {
    const host = process.env.KAFKA_HOST || 'kafka'
    const port = process.env.KAFKA_PORT || 9092

    return new Kafka({
        clientId: 'backend',
        brokers: [`${host}:${port}`]
    })
}

const errorHandler = e => console.error(`[backend/producer] ${e.message}`, e)

const kafka = createClient()
const producer = kafka.producer()
const run = async () => {
    await producer.connect()
    console.log('Kafka client connected')
}

const sendMessage = (value, topic) => {
    const messages = [{value: JSON.stringify(value)}]

    return producer
        .send({
            topic,
            messages,
        })
        .then(console.log)
        .catch(errorHandler)
}

run().catch(errorHandler)

module.exports = {
    sendMessage,
    TOPIC
}