const routes = require('./routes.js')
const {MongoClient} = require('mongodb')
const ObjectId= require('mongodb').ObjectId;
//const url = "mongodb://127.0.0.1:27017"
const url = "mongodb+srv://paramaadmaja:ATtJyTUjrQ8eHydV@cluster0.hk0n3.mongodb.net/rental_dvd?retryWrites=true&w=majority"
const client = new MongoClient(url)
const db_name = 'rental_dvd'

client.connect((error,client)=>{
    if(error){
        console.log(error)
    }else{
        console.log("Database Connection : OK")
    }
})

routes.runRoutes(client,db_name,ObjectId)

