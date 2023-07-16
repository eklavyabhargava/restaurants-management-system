require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connectDb = require('./db');
const port = process.env.PORT

const db = connectDb()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', require('./Routes/authRoute')(db));
app.use('/staff', require('./Routes/staffRoute')(db));
app.use('/customer', require('./Routes/customerRoute')(db))

app.listen(port, () => console.log(`Server listening on port ${port}!`))