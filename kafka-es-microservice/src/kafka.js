const {Kafka} = require('kafkajs')

const topics = ['bsocial-comments', 'bsocial-posts', 'bsocial-registrations', 'bsocial-logins']

const createClient = function () {
    const host = process.env.KAFKA_HOST || 'kafka'
    const port = process.env.KAFKA_PORT || 9092

    return new Kafka({
        clientId: 'es-microservice',
        brokers: [`${host}:${port}`]
    })
}

const kafka = createClient()
const consumer = kafka.consumer({groupId: 'es-group'})

const errorHandler = e => console.error(`[es-microservice/consumer] ${e.message}`, e)
const logMessage = ({partition, message}) => console.log({
    partition,
    offset: message.offset,
    value: message.value.toString(),
})
const subscribeToTopic = function(consumer, topic) {
    return consumer.subscribe({
        topic,
        fromBeginning: true
    })
}

const setupConsumer = async function(callback) {
    return await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            logMessage({partition, message})
            callback(topic, message)
        },
    })
}

const run = async () => {
    await consumer.connect()
    console.log('Kafka client connected')

    await Promise.all(topics.map(topic => subscribeToTopic(consumer, topic)))
}

const start = async function() {
    return await run().catch(errorHandler)
}

module.exports = {
    setupConsumer,
    start
}