const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
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
        const userCollection = client.db('laptopHut').collection('user');

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
        app.get('/myorders', async (req, res) => {
            const email = req.query.email;
            const query = { buyerEmail: email };
            const options = await bookingCollection.find(query).toArray();
            res.send(options);
        })
        app.get('/myproducts', async (req, res) => {
            const email = req.query.email;
            const query = { sellerEmail: email };
            const options = await productsCollection.find(query).toArray();
            res.send(options);
        })
        //add & update  user
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user
            }
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const options = await userCollection.findOne(query);
            res.send(options);
        })
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
                return res.send({ ccessToken: token });
            }
            console.log(user);
            res.status(403).send({ accessToken: '' })
        })
        app.post('/addProduct', async (req, res) => {
            const body = req.body;
            const options = await productsCollection.insertOne(body);
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