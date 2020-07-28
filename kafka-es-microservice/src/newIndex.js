const indexDataNew = async function (client, body) {
    if(!body.hasOwnProperty('newUser'))
        return

    console.log('Indexing to users_new', body.newUser)

    return await client.index({
        index: 'users_new',
        id: body.newUser.id,
        body: body.newUser
    })
}

const putMapping = async function (client) {
    try {
        await client.indices.create({
            index: 'users_new',
            body: {
                mappings: {
                    properties: {
                        posts: {
                            type: "nested",
                            properties: {
                                comments: {
                                    type: "nested"
                                }
                            }
                        }
                    }
                }
            }
        })
        console.log('Added mapping')
    } catch (err) {
        console.log('Mapping already added')
    }
}

module.exports = {
    indexDataNew,
    putMapping
}