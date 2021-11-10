const express = require('express')
const { MongoClient, CURSOR_FLAGS } = require("mongodb");
const ObjectId = require('mongodb').ObjectId

require("dotenv").config();
const cors = require('cors')

const app = express();
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

const uri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vcyde.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        console.log("connect to database fahim");
        const database1 = client.db("HikingTours");
        const hotelList = database1.collection("hotelList");

        const database2 = client.db("HikingTours");
        const tourList = database2.collection("tourList");

        const database3 = client.db("HikingTours");
        const services = database3.collection("services");

        const database4 = client.db("HikingTours");
        const offers = database4.collection("offers");

        const database5 = client.db("HikingTours");
        const orders = database5.collection("orders");

        //get api for hotel
        app.get("/hotels", async (req, res) => {
            const cursor = hotelList.find({});
            const hotels = await cursor.toArray();
            res.send(hotels);
        });

        //get api for tour
        app.get("/tours", async (req, res) => {
            const cursor = tourList.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        });

        //get api for services
        app.get("/services", async (req, res) => {
            const cursor = services.find({});
            const service = await cursor.toArray();
            res.send(service);
        });

        //get api for offers
        app.get("/offers", async (req, res) => {
            const cursor = offers.find({});
            const offer = await cursor.toArray();
            res.send(offer);
        });

        //get api for orders
        app.get("/orders", async (req, res) => {
            const cursor = orders.find({});
            const order = await cursor.toArray();
            res.send(order);
        });

        //get single api for offers
        app.get("/offers/:id", async (req, res) => {
            const id = req.params.id;
            console.log("getting the id", id);
            const query = { _id: ObjectId(id) };
            const offer = await offers.findOne(query);
            res.json(offer);
        });

        //post api for offers
        app.post("/offers", async (req, res) => {
            const offer = req.body;
            console.log("hit the post", offer);
            const result = await offers.insertOne(offer);
            console.log(result);
            res.json(result);
        });

        //delete api for orders
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orders.deleteOne(query);
            res.json(result);
        });
        //post api for orders
        app.post("/orders", async (req, res) => {
            const order = req.body;
            console.log("hit the post", order);
            const result = await orders.insertOne(order);
            console.log(result);
            res.json(result);
        });
        // update api for orders
        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: true,
                },
            };
            const result = await orders.updateOne(
                query,
                updateDoc,
                options
            );
            res.json(result);
        });
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', async (req, res) => {
    res.send('Running assignment 11 Server running here')
})

app.get("/hello", async (req, res) => {
    res.send("hello updated here");
});

app.listen(port, () => {
    console.log("running database", port)
})

