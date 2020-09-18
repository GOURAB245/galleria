//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const multer=require("multer");
const path= require("path");
const app = express();

app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb+srv://product-gourav:test-123@cluster0.zyvzc.mongodb.net/productDB" , {useNewUrlParser:true , useUnifiedTopology:true});
var Storage = multer.diskStorage({
  destination :"./public/uploads/",
  filename : (req, file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage : Storage
}).single('file');

var userId;

const userSchema =( {
  email:String,
   username:String,
  password:String

});

const User = new mongoose.model("User", userSchema);

const productSchema = ({
  myuser:String,
  file: String,
  gadget: String,
  brand: String,
  username: String,
  old: String,
  price: String,
  phone: Number,
  Whatsapp:Number,
  location:String,
  textarea: String

});

const Product = new mongoose.model("Product" , productSchema);
//get request
app.get("/", function(req, res){
  res.render("home");
});
app.get("/submit", function(req, res){
//  Product.find({} , function(err ,foundProducts){
//    res.render("products" , {title:" Avaiale products" , newProducts:foundProducts});
res.render("submit");
  });

//});
app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});
app.get("/products" ,function(req,res){

  res.render("products");
});




// post request for login and register route //
app.post("/register", function(req , res){
  const newUser = new User({
    email:req.body.useremail,
    username:req.body.username,
    password:req.body.password

  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    }
    else {
      res.render("login");
    }
  });
});

app.post("/login" , function(req , res){
  const useremail = req.body.useremail;
  const password = req.body.password;
  User.findOne({email:useremail} , function(err , foundUser){
    if(err){
      console.log(err);
    }
    else {
      if (foundUser) {
        if(foundUser.password===password){
          userId=foundUser._id;
          Product.find({} , function(err ,foundProducts){
            res.render("products" , {title:" Avaiale products" , newProducts:foundProducts});
          });
        }

      }
    }
  });
});

// post request for product DETAILS

app.post("/submit" ,upload, function(req, res){
  var newProduct = new Product ({
    myuser: userId,
     file: req.file.filename,
     gadget: req.body.gadget,
     brand: req.body.brand,
    username: req.body.username,
      old: req.body.old,
    price: req.body.price,
    phone: req.body.phone,
    Whatsapp:req.body.Whatsapp,
    location:req.body.location,
    textarea: req.body.textarea

  });
  newProduct.save(function(err){
    if (err) {
      console.log(err);
    }
  else {
    Product.find({} , function(err ,foundProducts){
      res.render("products" , {title:" Avaiale products" , newProducts:foundProducts});
    });
  }
  });
});

app.get("/myad", function(req,res){
  Product.find({myuser:userId}, function(err, foundProducts){
    if(err){
      console.log(err);
    }else{
        res.render("myad", {my:foundProducts});
    }

  })
});
app.post("/delete", function(req,res){
  const deleteItemId=req.body.del;



    Product.findByIdAndRemove(deleteItemId, function(err){
      if(!err){
        console.log("Successfully deleted checked item");
        res.redirect("/myad");
      }
    });



});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}




app.listen(port , function(){
  console.log("server has started Successfully")
});
