const routes = require('./routes.js')
const {MongoClient} = require('mongodb')
const url = "mongodb://127.0.0.1:27017"
const client = new MongoClient(url)
const db_name = 'rental_dvd'

client.connect((error,client)=>{
    if(error){
        console.log(error)
    }else{
        console.log("Koneksi database:OK")
    }
})

routes.runRoutes(client,db_name)
