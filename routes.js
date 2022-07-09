
const cookieParser = require('cookie-parser')
const express = require('express')
const crypto  = require('crypto-js')
const multer = require('multer')
const body_parser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')
const app = express()
const chart = require('chart.js');
const port = 8001

const image_storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./assets/img/')
    },
    filename : function(req,file,cb){
        let filename_arr = file.originalname.split(".");
        let filename     = crypto.SHA256(filename_arr[0])+'.'+filename_arr[filename_arr.length-1];
        cb(null,filename)
    }
})
const image_filter = (req,file,cb)=>{
    if(file.mimetype=='image/jpeg'||file.mimetype=='image/jpg'||file.mimetype=='image/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const image_upload = multer({
    storage:image_storage,
    fileFilter:image_filter
})
const runRoutes = (mongoclient,db_name,ObjectId)=>{     
    const db = mongoclient.db(db_name)
    app.set('view engine','ejs')
    app.use('/assets',express.static(path.join(__dirname,'assets/')))
    app.use('/node_modules',express.static(path.join(__dirname,'node_modules/')))
    app.use(body_parser.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(methodOverride('_method'))

    // 1. Login page
    app.get('/',(req,res)=>{
        if(req.cookies.session_cookie_id){
            try{
                db.collection('admin')
                .findOne({_id: ObjectId(req.cookies.session_cookie_id )},(error,result)=>{
                    if(result){
                        res.redirect('/home')
                    }
                })
            }catch(err){
                res.render('v_login',{alert:false})
            }
        }else{
            res.render('v_login',{alert:false})
        }
    })

    // 2. Post Login
    app.post('/',(req,res)=>{
        db.collection('admin').findOne({
            username:req.body.username,
            password:req.body.password
        },(error,result)=>{ 
            if(result){   
                res.cookie("session_cookie_id",result._id.toString())
                res.redirect('/home') 
            }else{
                res.render('v_login',{alert:true})
            }
        });
    })

    // 3. Home Page
    app.get('/home',(req,res)=>{
        if(req.cookies.session_cookie_id){
            try{
                db.collection('admin')
                .findOne({_id: ObjectId(req.cookies.session_cookie_id )},(error,result)=>{
                    if(result){
                        res.render('v_home')
                    }
                })
            }catch(err){
                res.redirect('/')
            }
        }else{
            res.redirect('/')
        }
    })

    // 3. Dvd Page
    app.get('/dvd',(req,res)=>{
        const thousands = require('thousands');
        db.collection('dvd').find().toArray()
        .then((result)=>{
            res.render('v_dvd',{dvd:result,thousands:thousands})
        })
        .catch((error)=>{
            console.log(error)
        });
    })

    // 4. Insert Data Dvd 
    app.post('/add/dvd',image_upload.single('gambar'),(req,res)=>{
        db.collection('dvd').insertOne({
            judul:req.body.judul,
            gambar:req.file.filename,
            stok:req.body.stok,
            harga_sewa:req.body.harga
        })
        res.redirect('/dvd')
    })

    // 5. Delete Data Dvd
    app.delete('/delete/dvd',(req,res)=>{
        db.collection('dvd').deleteOne({
            _id : ObjectId(req.body.id)
        })
        //res.send(req.body)
        res.redirect('/dvd')
    })

    app.get('/logout',(req,res)=>{
        res.clearCookie('session_cookie_id')
        res.redirect('/')    
    })
    app.get('/genre',(req,res)=>{
        res.render('v_genre')   
    })
    app.listen(port,()=>{
        console.log(`Listening to port ${port}`)
    })

}


module.exports = {runRoutes}

