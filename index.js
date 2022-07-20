const routes = require('./routes.js')
const {MongoClient} = require('mongodb')
const ObjectId= require('mongodb').ObjectId;
const uri = process.env.MONGO_URI||"mongodb://127.0.0.1:2701/sewa_dvd"
const client = new MongoClient(uri,{useNewUrlParser:true, useUnifiedTopology:true})
const db_name = 'rental_dvd'

client.connect((error,client)=>{
    if(error){
        console.log(error)
    }else{
        console.log("Database Connection : OK")
    }
})

routes.runRoutes(client,db_name,ObjectId)
