const express = require('express')
const { connectToDb } = require('./db/db')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Access server on http://localhost:${PORT}`)
})