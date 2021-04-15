const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const objectId = require('mongodb').ObjectID;

const password ='pw.D53LA@EpivPt';


const uri = "mongodb+srv://projectNatural:pw.D53LA@EpivPt@cluster0.gnls9.mongodb.net/projectNatural?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
    res.sendFile(__dirname+ '/index.html');
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db("projectNatural").collection("products");
  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    });
  })

app.get('/product/:id', (req, res) => {
  productCollection.find({_id: objectId(req.params.id)})
  .toArray((err, documents) => {
    res.send(documents[0]);
})
})

  app.post("/addProduct", (req, res) => {
            const products = req.body;
            productCollection.insertOne(products)
            .then(result => {
                res.redirect('/');
            })
  })

app.patch('/update/:id', (req, res) => {
  productCollection.updateOne({_id: objectId(req.params.id)},
  {
    $set:{price: req.body.price, quantity: req.body.quantity}
  })
  .then((result) => {
    res.send(result.modifiedCount > 0);
  })
})

  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({_id: objectId(req.params.id)})
    .then((result) => {
      res.send(result.deletedCount > 0);

    })
  })
});

app.listen(3000)