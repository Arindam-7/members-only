const mongoose = require('mongoose')
require('dotenv').config()

const db_uri = `mongodb+srv://arindam:${process.env.PASS}@cluster0.jtibas8.mongodb.net/?retryWrites=true&w=majority`

const connectToDb = mongoose.connect(db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Database connected')
})
.catch((err) => {
    console.log('Failed to connect to database', err)
})

module.exports = { connectToDb }