'use strict'
const express = require('express')
require('dotenv').config()
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser')
const app = express()

const PORT = process.env.PORT || 3000
const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
let database = null

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
  const places = await database.collection('places').find({}).toArray()
  res.render('index', { places })
})
app.get('/admin', (req, res) => {
  res.render('admin')
})

// This is an example route to demonstrate mongodb
// remove this
app.post('/add', async (req, res) => {
  try {
    const { place, pincode } = req.body
    console.log(req.body)

    if (!place || !pincode) {
      return res.status(400).json({ error: 'Both name and email are required' })
    }

    const usersCollection = database.collection('places') // Use your collection name

    const result = await usersCollection.insertOne({ place, pincode })

    res.render('added')
  } catch (error) {
    console.error('Error adding place to MongoDB', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

async function connectToDatabase() {
  try {
    await client.connect()
    database = client.db()
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB', error)
  }
}
connectToDatabase()

app.listen(PORT, () =>
  console.log(
    `listening on PORT ${PORT} \nOn localhost open http://localhost:${PORT}`,
  ),
)
