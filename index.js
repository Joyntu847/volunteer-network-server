require('dotenv').config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;

const port = 4200;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmh2w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('thank you for calling me')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("volunteerNetwork").collection("typeOfWorks");
    const volunteerCollection = client.db("volunteerNetwork").collection("volunteers");
    console.log('database connect successfuly')

    app.post('/addWorks', (req,res) => {
        const eventDetails = req.body;
        collection.insertOne(eventDetails)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    

    app.get('/works', (req, res)=> {
        collection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/register', (req, res) => {
        collection.find()
          .toArray((err , document)=>{
              res.send(document)
          })
      })
    
      app.get('/register/:key' , (req, res) =>{
        const regId = parseInt(req.params.key) 
        collection.find({ key : regId})
        .toArray((err , documents) =>{
          res.send(documents)
        })
      })

      app.post('/addVolunteer' , (req , res) =>{
        const volunteer = req.body;
        volunteerCollection.insertOne(volunteer)
        .then(result => {
          res.send(result.insertedCount > 0)
        })
      })

      app.get('/user' , (req ,res) => {
    
        volunteerCollection.find({email : req.query.email})
        .toArray((err , documents) => {
          res.send(documents)
        })
      })
    
      app.delete('/delete/:id' ,(req, res) => {
        volunteerCollection.deleteOne({ _id : ObjectId(req.params.id)})
        .then(result => {
          res.send(result.insertedCount > 0)
        })
      })


    

});


app.listen(process.env.PORT || port);