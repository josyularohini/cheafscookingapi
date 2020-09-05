const express = require('express');
const app = express();
const port = 8900
const bodyParser=require('body-parser');
const mongo = require('mongodb');
const MongoClient=mongo.MongoClient;
const mongourl="mongodb+srv://<username>:<password>@cluster0.lepud.mongodb.net/<dbname>?retryWrites=true&w=majority";
var cors = require('cors');
let db;
app.use(cors());


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



app.get('/restaurentshome',(req,res) => {
    var query = {}
    if(req.query.city && req.query.mealtype){
        query={city:req.query.city,"type.mealtype":req.query.mealtype}
    }
    else if(req.query.city){
        query={city:req.query.city}
    }else if(req.query.mealtype){
        query={"type.mealtype": req.query.mealtype}
    }
    db.collection('restaurents').find(query).toArray((err,result) => {
        if (err) throw err;
        res.send(result)
    })

})

app.get('/restaurentsdetails/:id',(req,res) => {
    console.log(req.params.id)
    var query = {_id:req.params.id}
    db.collection('restaurents').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurentslist/:city/:mealtype',(req,res) => {
    var query = {}
    var sort = {cost:1}
    if(req.query.cuisine&&req.query.lcost && req.query.hcost&&req.query.sort){
        query = {city:req.params.city,"type.mealtype": req.params.mealtype,"Cuisine.cuisine":req.query.cuisine,cost:{$lt:parseInt(req.query.hcost),$gt:parseInt(req.query.lcost)}}
        sort={cost:parseInt(req.query.sort)} 
    }
    else if(req.query.cuisine&&req.query.lcost && req.query.hcost){
        query = {city:req.params.city,"type.mealtype": req.params.mealtype,"Cuisine.cuisine":req.query.cuisine,cost:{$lt:parseInt(req.query.hcost),$gt:parseInt(req.query.lcost)}}
    }
    else if(req.query.cuisine&&req.query.sort){
        query = {city:req.params.city,"type.mealtype": req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
        sort={cost:parseInt(req.query.sort)} 
    }
    else if(req.query.lcost && req.query.hcost){
        query = {city:req.params.city,"type.mealtype": req.params.mealtype,cost:{$lt:parseInt(req.query.hcost),$gt:parseInt(req.query.lcost)}}
        sort={cost:1} 
    }
    else if(req.query.cuisine){
        query = {city:req.params.city,"type.mealtype": req.params.mealtype,"Cuisine.cuisine":req.query.cuisine} 
    }else if(req.query.lcost && req.query.hcost){
        query={city:req.params.city,"type.mealtype": req.params.mealtype,cost:{$gt:parseInt(req.query.hcost),$lt:parseInt(req.query.lcost)}}
    }else if(req.query.sort){
        query={city:req.params.city,"type.mealtype": req.params.mealtype}
        sort={cost:parseInt(req.query.sort)}
    }else{
        query = {city:req.params.city,"type.mealtype": req.params.mealtype}
        sort = {cost:1}
    }
    db.collection('restaurents').find(query).sort(sort).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//City List
app.get('/location',(req,res) => {
    db.collection('city').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//cuisine
app.get('/cuisine',(req,res) => {
    db.collection('cuisine').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//mealtype
app.get('/mealtype',(req,res) => {
    db.collection('mealtype').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/allOrder',(req,res)=>{
    db.collection('orders').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//postcall
app.post('/placeOrder',(req,res)=>{
    console.log(">>>>>>>",req.body);
    var data={
        _id:req.body.order_id,
        name:req.body.name,
        phone:req.body.phone,
        email:req.body.email,
        address:req.body.address,
        rest_id:req.body.rest_id,
        person:req.body.person,
    }
    db.collection('orders').insert(data,(err,result)=>{
        if(err){
            throw err
        }else {
            console.log('Order Places')
        }
    });


});



MongoClient.connect(mongourl,(err,client)=> {
    if(err) console.log(err);
    db=client.db('edurekainternship')
    app.listen(port,(err)=> {
        if(err) throw err;
        console.log(`Server is running on port ${port}`)
    })
})
