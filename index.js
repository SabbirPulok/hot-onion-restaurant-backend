const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const uri = process.env.DB_PATH;

let client = new MongoClient(uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

app.get('/',(req,res)=>{
    res.send("Thank You!");
});
app.get('/chooseUs',(req,res)=>{
    client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });
    const limit = req.query.limit;
    client.connect(error=>{
        const collection = client.db("redOnion").collection("chooseUs");
        collection.find().limit(parseInt(limit)).toArray((err,documents)=>{
            if(err)
            {
                res.status(500).send({message:err});
            }
            else
            {
                res.send(documents);
            }
            client.close();
        })
    })
})

app.get('/products',(req,res)=>{
    client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });
    const limit = req.query.limit;
    client.connect(error=>{
        const collection = client.db("redOnion").collection("products");
        collection.find().limit(parseInt(limit)).toArray((err,documents)=>{
            if(err)
            {
                res.status(500).send({message:err});
            }
            else
            {
                res.send(documents);
            }
            client.close();
        })
    })
})
app.get('/products/:type',(req,res)=>{
    const type = req.params.type;
    client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });
    client.connect(error=>{
        const collection = client.db("redOnion").collection("products");
        collection.find({type}).toArray((err,documents)=>{
            if(err)
            {
                res.status(500).send({message:err});
            }
            else
            {
                res.send(documents);
            }
            client.close();
        })
    })
})
app.get('/products-details/:key',(req,res)=>{
    const key = req.params.key;
    client = new MongoClient(uri, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });
    client.connect(error=>{
        const collection = client.db("redOnion").collection("products");
        console.log("key");
        collection.find({key}).toArray((err,documents)=>{
            if(err)
            {
                console.log(err);
                res.status(500).send({message:err});
            }
            else
            {
                //console.log(documents);
                res.send(documents[0]);
            }
            client.close();
        })
    })
})
app.post('/placeOrder',(req,res)=>{
    client = new MongoClient(uri, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
     });
     const order = req.body;
     order.placedAt = new Date();
     console.log(order);
     client.connect(err => {
        const collection = client.db("redOnion").collection("orders");
         collection.insertOne(order,(err,result)=>{
             if(err)
             {
                res.status(500).send({message:err})
             }
             else
             {
                res.send(result.ops[0])
             }
         });
         //console.log("database connected....");
         //client.close();
     });
});

app.post('/addAllProducts',(req,res)=>{
    client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });
    const products = req.body;
    //console.log(products);
    client.connect(error => {
    const collection = client.db("redOnion").collection("products");
    collection.insert(products,(err,result)=>{
        if(err)
        {
            res.status(500).send({message:err})
            console.log(err);
        }
        else
        {
            res.send(result.ops[0]);
            //console.log(result.ops[0]);
        }
        //console.log(err);
        client.close();
    });
    
    });
});
app.post('/addAllChooseUs',(req,res)=>{
    client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });
    const chooseUs = req.body;
    console.log(chooseUs);
    client.connect(error => {
    const collection = client.db("redOnion").collection("chooseUs");
    collection.insert(chooseUs,(err,result)=>{
        if(err)
        {
            res.status(500).send({message:err})
            console.log(err);
        }
        else
        {
            res.send(result.ops[0]);
            //console.log(result.ops[0]);
        }
        //console.log(err);
        client.close();
    });
    
    });
});

const port =process.env.port || 4000;
app.listen(port,()=>console.log("Listening to port ",port));