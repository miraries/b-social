require('dotenv').config();
const { setupConsumer, start } = require('./src/kafka');
const { Client } = require('@elastic/elasticsearch')

let client = null

const topicToIndex = topic => topic.replace('bsocial-', '')
const topicKeys = {
    comments: 'comment',
    registrations: 'user',
    posts: 'post'
}
const topicToKey = topic => topicKeys[topicToIndex(topic)]

const createElasticsearchClient = function () {
    const host = process.env.ELASTIC_HOST || 'elasticsearch'
    const port = process.env.ELASTIC_PORT || 9200

    return new Client({ node: `http://${host}:${port}` })
}

const indexData = async function (index, body) {
    return await client.index({
        index,
        body
    })
}

const handleKafkaMessage = function (topic, message) {
    const data = JSON.parse(message.value.toString())

    const body = data[topicToKey(topic)]
    const index = topicToIndex(topic)
    console.log('Indexing data', {index, body})

    indexData(index, body)
}


;(async () => {
    await start()
    await setupConsumer(handleKafkaMessage)

    client = await createElasticsearchClient()
    console.log(`Elasticsearch client connected`)
    console.log(`Kafka-to-elasticsearch indexing service running`)
})()

