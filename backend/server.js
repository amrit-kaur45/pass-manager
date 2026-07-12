const express = require('express')
require('dotenv').config()
// console.log(process.env.MONGO_URI)
const {MongoClient} = require('mongodb')
const bodyparser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())

const url = process.env.MONGO_URI
const client = new MongoClient(url)
const dbName = 'pw-manager'



const port = 3000

app.use(bodyparser.json())
// app.use(express.json()) simply without body-parser

client.connect()


// get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('pw')
    const getResult = await collection.find({}).toArray()
    res.json(getResult)
})

// save a password
app.post('/', async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('pw')

    const password = req.body

    const result = await collection.insertOne(password)

    res.json({success : true})
})

// delete a password
app.delete('/', async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('pw')
    const {id} = req.body
    const result = await collection.deleteOne({id : id})       // Destructures just the id from the request body
    res.send({success : true})
})

app.listen(port, () => {
    console.log(`Example app running on port ${port}`)
})