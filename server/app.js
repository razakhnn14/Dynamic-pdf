const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const templatesRouter = require('./routes/templates')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI)
.then(()=> console.log('Connected to MongoDB'))
.catch(err => {
  console.error('Mongo connection error', err)
})

app.use('/api/templates', templatesRouter)
app.get('/', (req, res) => res.json({ ok: true, msg: 'Dynamic PDF Builder API' }))
app.listen(PORT, () => console.log("APP is Listening"))