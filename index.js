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

const express = require('express')
app.set('view engine','ejs')

const app = express()
const port = 8001

app.get('/',(req,res)=>{
    res.send("home")
})

app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})