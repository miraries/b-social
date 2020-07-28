require('dotenv').config()
const sequelize = require('./api/db/models');
const express = require('./api');

const PORT = process.env.PORT || 8080;

async function connectDatabase() {
    try {
        // await sequelize.authenticate();
        console.log('Connected to DB');
        // await sequelize.sync();
        // console.log(sequelize)
    } catch (error) {
        console.log('Unable to connect to DB', error.message);
        process.exit(1);
    }
}

;(async () => {
    await connectDatabase();

    console.log(`Starting api service, reserving port ${PORT}`);

    express.listen(PORT, () => console.log(`Api service started on port ${PORT}`));
})()
