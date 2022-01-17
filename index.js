var express = require("express")
var app = express() ;
var dotenv = require('dotenv') ;
const mongoose = require('mongoose')
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const jwt = require ('jsonwebtoken');
const nodemailer = require('nodemailer');
const Register = require('./routes/register');
const Login = require('./routes/login');
dotenv.config() ;
//Starting middleware
app.use(express.json()) ;
app.use(cors()) ;
//End of middlewares
app.get('/',(req,res)=>{
    res.json("Success") ;
})
//the register functionality 
app.post('/register',(req,res)=>{Register.register(req,res,nodemailer,jwt,dotenv)}) ;
app.get('/authentication/:token',(req,res)=>{Register.verify(req,res,bcrypt,jwt,dotenv)}) ;
//For login
app.post('/login',(req,res)=>{Login.login(req,res,bcrypt,jwt,dotenv)}) ;
app.get('/verifytoken/:token',(req,res)=>{Login.getuser(req,res,jwt,dotenv)}) ;
app.listen(process.env.PORT || 5000 , ()=> {
    mongoose.connect(process.env.mongopath,{
        useNewUrlParser: true ,
        useUnifiedTopology: true
    }).then(()=>{
        console.log('Connection Succesful !!!')
    }).catch((err)=> console.log(err))
  })
