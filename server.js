require("dotenv").config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const File = require('./models/File');

mongoose.connect(process.env.DATABASE_URL)

const app = express();
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res) => {
    res.render("index",{fileLink:""});
});

const upload = multer({dest:"uploads"})

app.post('/upload',upload.single("file"),async (req,res)=> {
    const FileData= {
        path:req.file.path,
        original_name:req.file.originalname
    }
    if(req.body.password != null && req.body.password !=""){
        FileData.password =await bcrypt.hash(req.body.password,11);
    }
    const fileuploaded = await File.create(FileData);
    console.log(`${req.headers.origin}/file/${fileuploaded.id}`);
    res.render("index", {fileLink :`${req.headers.origin}/file/${fileuploaded.id}`}  );
});

app.route("/file/:id").get(handledownload).post(handledownload);

async function handledownload(req,res) {
    const id = req.params.id;
    
    const file1 = await File.findById(id);
    if(file1.password !=null){
        if(req.body.password== null){
            res.render("password" ,{error:false});
            return;
        }
        
        
        if(!(await bcrypt.compare(req.body.password,file1.password))){
            res.render("password",{error:true});
            return;
        }
    }
    file1.download_count++;
    await file1.save();
    res.download(file1.path,file1.original_name);
}
app.listen(process.env.PORT);