const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.twm2yvw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCollection = client.db('laptopHut').collection('products');
        const bookingCollection = client.db('laptopHut').collection('booking');

        app.get('/products', async (req, res) => {
            const category = req.query.category;
            const query = { category: category };
            const options = await productsCollection.find(query).toArray();
            res.send(options);
        })
        app.post('/booking', async (req, res) => {
            const body = req.body;
            const options = await bookingCollection.insertOne(body);
            res.send(options);
        })
    }
    finally {

    }
}
run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('laptop hut server is running');
})

app.listen(port, () => console.log(`Laptop hut running on ${port}`))