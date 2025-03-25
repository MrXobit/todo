require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI
const cors = require('cors');

const app = express()


app.use(cors({
    origin: 'http://localhost:3000' 
}));
app.use(express.json()) 
app.use('/api',router)
app.use(errorHandler)

const start = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB')
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
    } catch(e) {
        console.log(e)
    }
}


start()