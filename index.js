const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))




app.use(express.json());












const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1qruita.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;





// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftCollection = client.db('craftDB').collection('craft')

    app.get('/craft', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/craft/:id', async (req, res) =>{
         const id = req.params.id;
         const query =  {_id: new ObjectId(id)};
         const result = await craftCollection.findOne(query);
         res.send(result);
    })

    app.post('/addCraftItem', async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    })

    app.get("/myList/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await craftCollection.find({email:req.params.email}).toArray();
      res.send(result);
    
    })

    app.put('/craft/:id', async (req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedCraft = req.body;
      const craft = {
        $set:{
          itemName: updatedCraft.itemName, 
          image: updatedCraft.image, 
          subcategoryName: updatedCraft.subcategoryName, 
          shortDescription: updatedCraft.shortDescription, 
          price: updatedCraft.price, 
          rating: updatedCraft.rating, 
          stockStatus: updatedCraft.stockStatus, 
          customization: updatedCraft.customization, 
          processingTime: updatedCraft.processingTime,
        }
      }
      const result = await craftCollection.updateOne(filter, craft, options);
      res.send(result);
    })

    app.delete('/craft/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })

   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//  Middleware




app.get('/', (req, res) => {
  res.send('EcoCrafts hub server is running');

})


app.listen(port, () => {
  console.log(`EcoCrafts server is running on port:${port}`);
})



