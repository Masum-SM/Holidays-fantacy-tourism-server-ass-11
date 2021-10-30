const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000
const ObjectId = require('mongodb').ObjectId;

// Middlewire 
app.use(cors())
app.use(express.json())


const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rhkgk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

        await client.connect();
        console.log('database connected')
        const database = client.db('Holidays_Fantacy');
        const servicesCollection = database.collection('services')
        const orderCollection = database.collection('orders')
        // get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()

            res.send(services)
        })
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const services = await cursor.toArray()

            res.send(services)
        })

        app.post('/services', async (req, res) => {

            const service = req.body
            console.log('hit the post api', service)




            const result = await servicesCollection.insertOne(service)
            console.log(result);

            res.json(result)
        });

        // get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(qurey)
            res.json(service)
        })

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: ObjectId(id) };
            const order = await orderCollection.findOne(qurey)
            res.json(order)
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);


            res.json(result)


        })


    }
    finally {
        //  await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Listening form port : ', port)
})