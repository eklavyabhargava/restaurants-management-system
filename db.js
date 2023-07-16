require('dotenv').config()
const { Client } = require('pg')

const connnectDb = () => {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    client.connect().then(() =>
        console.log("Connected to database")
    ).catch((error) => {
        console.error('Error connecting to databse: ', error)
        process.exit(1)
    })

    return client;
}

module.exports = connnectDb