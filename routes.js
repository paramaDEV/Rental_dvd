
const cookieParser = require('cookie-parser')
const express = require('express')
const crypto  = require('crypto-js')
const multer = require('multer')
const body_parser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')
const app = express()
const chart = require('chart.js');
const Swal = require('sweetalert2')
const port = process.env.PORT || 8001

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
    app.use(body_parser.urlencoded({ extended: true }))
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
        const date = new Date();
        db.collection('admin').findOne({
            username:req.body.username,
            password:req.body.password
        },(error,result)=>{ 
            if(result){   
                res.cookie("session_cookie_id",result._id.toString())
                res.redirect('/home')
                db.collection('admin').updateOne(
                {_id:ObjectId(result._id)}
                ,{$set:{
                        last_login : date.getFullYear()+"-"+(parseInt(date.getMonth())+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
                }}) 
            }else{
                res.render('v_login',{alert:true})
            }
        });
    })

    // 3. Home Page
    app.get('/home',(req,res)=>{
        const thousands = require('thousands');

        let peminjaman
        let dvd
        let keuangan
        let getData = async ()=>{
            peminjaman =  await db.collection('peminjaman').find().toArray()
            dvd = await db.collection('dvd').find().toArray()
            keuangan = await db.collection('keuangan').find().toArray()
        }
        if(req.cookies.session_cookie_id){
            try{
                db.collection('admin')
                .findOne({_id: ObjectId(req.cookies.session_cookie_id )},(error,result)=>{
                    if(result){
                         getData()
                        .then(()=>{
                            res.render('v_home',{peminjaman:peminjaman,dvd:dvd,keuangan:keuangan,thousands:thousands}) 
                        })
                            
                        
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
        let dvd
        let getData = async ()=>{
            dvd = await db.collection('dvd').find().toArray()
        }
        if(req.cookies.session_cookie_id){
                db.collection('admin')
                .findOne({_id: ObjectId(req.cookies.session_cookie_id )},(error,result)=>{
                    if(result){
                        getData()
                        .then(()=>{
                            res.render('v_dvd',{dvd:dvd,thousands:thousands})
                        })
                        .catch((error)=>{
                            console.log(error)
                        });
                    }
                })
        }else{
            res.redirect('/')
        }
    })

    // 4. Insert Data Dvd 
    app.post('/add/dvd',image_upload.single('gambar'),(req,res)=>{
        db.collection('dvd').insertOne({
            judul:req.body.judul,
            gambar:req.file.filename,
            stok:parseInt(req.body.stok),
            harga_sewa:req.body.harga
        }).then(()=>{   
         res.redirect('/dvd')
        })
    })

    // 5. Delete Data Dvd
    app.delete('/delete/dvd',(req,res)=>{
        db.collection('dvd').deleteOne({
            _id : ObjectId(req.body.id)
        }).then(()=>{  
            res.redirect('/dvd')
        })
    })

    // 6. Update Data DVD
    app.put('/update/dvd',image_upload.single('gambar'),(req,res)=>{
        if(req.file){
            db.collection('dvd').updateOne({
                _id : ObjectId(req.body.id)},
                {$set:{
                    judul : req.body.judul,
                    stok : parseInt(req.body.stok),
                    harga_sewa : req.body.harga,
                    gambar: req.file.filename
                }
            }).then(()=>{  
                res.redirect('/dvd')
            })
        }else{
            db.collection('dvd').updateOne({
                _id : ObjectId(req.body.id)},
                {$set:{
                    judul : req.body.judul,
                    stok : req.body.stok,
                    harga_sewa : req.body.harga
                }
            }).then(()=>{  
                res.redirect('/dvd')
            })
        }
    })

     // 7. Admin Page
     app.get('/admin',(req,res)=>{
        if(req.cookies.session_cookie_id){
                db.collection('admin')
                .findOne({_id: ObjectId(req.cookies.session_cookie_id )},(error,result)=>{
                    if(result){
                        db.collection('admin').find().toArray()
                        .then((result)=>{
                            res.render('v_admin',{admin:result})
                        })
                        .catch((error)=>{
                            console.log(error)
                        });
                    }
                })
        }else{
            res.redirect('/')
        }
    })

    // 8. Insert Data Admin
    app.post('/add/admin',(req,res)=>{
        db.collection('admin').insertOne({
            nama:req.body.nama,
            username:req.body.username,
            password:req.body.password,
            last_login : "",
            last_logout : ""
        }).then(()=>{
            res.redirect('/admin')
        })
    })

    // 9. Delete Data Admin
    app.delete('/delete/admin',(req,res)=>{
        db.collection('admin').deleteOne({
            _id : ObjectId(req.body.id)
        }).then(()=>{
            res.redirect('/admin')
        })
    })

    // 10. Update Data Admin
    app.put('/update/admin',(req,res)=>{
        db.collection('admin').updateOne({
        _id:ObjectId(req.body.id)},{
            $set:{
               nama : req.body.nama,
               username : req.body.username,
               password : req.body.password 
            }
        }).then(()=>{
            res.redirect('/admin')
        })
    })

    // 11. Peminjaman Page
    app.get('/peminjaman',(req,res)=>{
        let thousands = require('thousands')
        if(req.cookies.session_cookie_id){
            db.collection('admin')
            .findOne({_id: ObjectId(req.cookies.session_cookie_id )},(error,result)=>{
                if(result){
                    db.collection('peminjaman').find().toArray()
                    .then((result)=>{
                        res.render('v_peminjaman',{peminjaman:result,thousands:thousands})
                    })
                    .catch((error)=>{
                        console.log(error)
                    });
                }
            })
        }else{
            res.redirect('/')
        }
    })

    // 12. Tambah Peminjaman Page
    app.get('/v_add_peminjaman',(req,res)=>{
        const thousands = require('thousands');
        if(req.cookies.session_cookie_id){
            try{
                db.collection('admin')
                .findOne({_id: ObjectId(req.cookies.session_cookie_id )},(error,result)=>{
                    if(result){
                        db.collection('dvd').find().toArray()
                        .then((result)=>{
                            res.render('v_add_peminjaman',{dvd:result,thousands:thousands})
                        })
                        .catch((error)=>{
                            console.log(error)
                        });
                    }
                })
            }catch(err){
                res.send(error)
            }
        }else{
            res.redirect('/')
        }
    })

    // 13. Tambah Peminjaman
    app.post('/add_peminjaman',(req,res)=>{
        let item_dvd = []
        let total = 0
        let date= new Date()
        if(!req.body.judul_item){
            res.redirect('/add_peminjaman')
        }

        req.body.judul_item.forEach((e,i)=>{
            let total_temp = req.body.harga_item[i].split(".").join("")
            
            total+=parseInt(total_temp)
            db.collection('dvd').updateOne(
                {_id:ObjectId(req.body.id[i])},
                {$set:{
                    stok : parseInt(req.body.stok[i])-parseInt(req.body.jumlah_item[i])
                }}
            ).then(()=>{
                item_dvd.push({
                    "id" : req.body.id[i],
                    "judul" : e,
                    "jumlah" : req.body.jumlah_item[i],
                    "harga" : req.body.harga_item[i].split(".").join("")
                 })
            })
        })
        db.collection('peminjaman').insertOne({
            peminjam : req.body.nama,
            telepon  : req.body.telp,
            alamat   : req.body.alamat,
            tanggal_pinjam : req.body.tgl_pinjam,
            batas_pinjam : req.body.bts_pinjam,
            item : item_dvd,
            total_harga : total
        })
        db.collection('keuangan').insertOne({
            kategori : "Peminjaman",
            status  : "Pemasukan",
            catatan : "",
            tanggal :  date.getFullYear()+"-"+(parseInt(date.getMonth())+1)+"-"+date.getDate(),
            jumlah  : total
        }).then(()=>{    
            res.redirect('/peminjaman')
        })
            
       
    })

    // 14. Detail Peminjaman
    app.get('/detail_peminjaman/:id',(req,res)=>{
        const thousands = require('thousands');
        db.collection('peminjaman').findOne({
            _id : ObjectId(req.params)
        }).then((result)=>{
           res.render('v_detail_peminjaman',{peminjaman:result,thousands:thousands})
        })
    })

    // 15. Selesai Peminjaman
    app.post('/selesai_peminjaman',(req,res)=>{
        let peminjaman = db.collection('peminjaman').findOne({_id:ObjectId(req.body.id)}).then(result=>{
            result.item.forEach(e=>{
                db.collection('dvd').findOne({_id:ObjectId(e.id)}).then(result2=>{
                    db.collection('dvd').updateOne(
                        {_id:ObjectId(e.id)},
                        {$set:{
                            stok : parseInt(result2.stok)+parseInt(e.jumlah)
                        }}
                    )
                })
            })
        }).then(()=>{
            const date = new Date();
            db.collection('peminjaman').updateOne(
                {_id:ObjectId(req.body.id)}
                ,{$set:{
                    status : req.body.status,
                    denda : req.body.denda
                }})
            if(parseInt(req.body.denda)>0){
                    db.collection('keuangan').insertOne({
                        kategori : "Denda",
                        status  : "Pemasukan",
                        catatan : "",
                        tanggal :  date.getFullYear()+"-"+(parseInt(date.getMonth())+1)+"-"+date.getDate(),
                        jumlah  : req.body.denda
                    })
                }
        }).then(()=>{
            res.redirect(`/detail_peminjaman/${req.body.id}`)
        })
    })

    // 16. Keuangan Page
    app.get('/keuangan',(req,res)=>{
        const thousands = require('thousands');
        if(req.cookies.session_cookie_id){
            try{
                db.collection('admin')
                .findOne({_id: ObjectId(req.cookies.session_cookie_id )},(error,result)=>{
                    if(result){
                        db.collection('keuangan').find().toArray()
                        .then((result)=>{
                            res.render('v_keuangan',{keuangan:result,thousands:thousands})
                        })
                        .catch((error)=>{
                            console.log(error)
                        });
                    }
                })
            }catch(err){
                res.send(error)
            }
        }else{
            res.redirect('/')
        }
    })

    // 17. Tambah Keuangan
    app.post('/tambah_keuangan',(req,res)=>{
        let date = new Date(req.body.tanggal)
        db.collection('keuangan').insertOne({
            kategori : req.body.kategori,
            status: req.body.status,
            catatan : req.body.catatan,
            tanggal : date.getFullYear()+"-"+(parseInt(date.getMonth())+1)+"-"+date.getDate(),
            jumlah : parseInt(req.body.jumlah)
        }).then(()=>{
            res.redirect('/keuangan')
        })
    })

    // 18. Data Keuangan
    app.post('/get/keuangan',(req,res)=>{
        db.collection('keuangan').find().toArray().then(result=>{
            res.json(result)
        })
    })

    app.get('/logout',(req,res)=>{
        const date = new Date();
        db.collection('admin').updateOne(
            {_id:ObjectId(req.cookies.session_cookie_id)}
            ,{$set:{
                last_logout : date.getFullYear()+"-"+(parseInt(date.getMonth())+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
            }}).then(()=>{
                res.clearCookie('session_cookie_id')
                res.redirect('/') 
            })
           
    })
    app.listen(port,()=>{
        console.log(`Listening to port ${port}`)
    })
}

module.exports = {runRoutes}

