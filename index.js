const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
// console.log(process.env.DB_PASS);


const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 7000

app.get('/', (req, res) => {
  res.send('Heroku is working')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mhth.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db(`${process.env.DB_NAME}`).collection("events");
  
  console.log('connected successfully');

  app.post('/addEvent',(req,res)=>
  {
      const newEvent = req.body;
      eventsCollection.insertOne(newEvent)
      .then(result =>
        {
            res.send(result.insertedCount>0)
        })
  })


  app.get('/events',(req,res)=>
  {
      eventsCollection.find({})
      .toArray((err,items)=>
      {
          res.send(items);
      })
  })

});

app.listen(port)