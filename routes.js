
const cookieParser = require('cookie-parser')
const express = require('express')
const body_parser = require('body-parser')
const path = require('path')
const app = express()
const port = 8001
const runRoutes = (mongoclient,db_name)=>{     
    const db = mongoclient.db(db_name)
    app.set('view engine','ejs')
    app.use('/assets',express.static(path.join(__dirname,'assets/')))
    app.use('/node_modules',express.static(path.join(__dirname,'node_modules/')))
    app.use(body_parser.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.get('/',(req,res)=>{
        if(req.cookies.session_cookie_id){
            res.redirect('/home') 
        }else{
            res.render('v_login',{alert:false})
        }
    })
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
    app.get('/home',(req,res)=>{
        if(!req.cookies.session_cookie_id){
            res.render('v_login',{alert:false})
        }
        res.render('v_home')
        
    })
    app.get('/logout',(req,res)=>{
        res.clearCookie('session_cookie_id')
        res.render('v_login',{alert:false})    
    })
    app.listen(port,()=>{
        console.log(`Listening to port ${port}`)
    })
}


module.exports = {runRoutes}

