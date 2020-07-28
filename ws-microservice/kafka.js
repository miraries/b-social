const {Kafka} = require('kafkajs')

const createClient = function () {
    const host = process.env.KAFKA_HOST || 'kafka'
    const port = process.env.KAFKA_PORT || 9092

    return new Kafka({
        clientId: 'backend',
        brokers: [`${host}:${port}`]
    })
}

const errorHandler = e => console.error(`[backend/producer] ${e.message}`, e)
const logMessage = ({partition, message}) => console.log({
    partition,
    offset: message.offset,
    value: message.value.toString(),
})

const kafka = createClient()
const consumer = kafka.consumer({groupId: 'ws-group'})

const run = async () => {
    await consumer.connect()
    console.log('Kafka client connected')
    await consumer.subscribe({
        topic: 'bsocial-comments',
        fromBeginning: true
    })
}

const setupConsumer = async function(callback) {
    return await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            logMessage({partition, message})
            callback(message)
        },
    })
}

const start = async function() {
    return await run().catch(errorHandler)
}

module.exports = {
    setupConsumer,
    start
}