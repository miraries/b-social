require('dotenv').config()
const sequelize = require('./db');
const express = require('./api');

const PORT = process.env.PORT || 8080;

async function connectDatabase() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connected to DB');
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
