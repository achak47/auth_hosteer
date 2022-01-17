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
/*
const activate_api_key = "@achak47";
//const res = require("express/lib/response");
CLIENT_URL="http://localhost:5000";
app.post('/register',(req,res)=>{
    const { email,name,password,phone,college } = req.body ;
    if(!email || !name || !password || !phone || !college){
        return res.status(200).json('Pls Enter the credentials properly') ;
    }
    Users.find({'email':email},(err,result)=>{
        if(result.length){
            res.status(200).json("User with same mail already exists !") ;
        }
        else{
        const token = jwt.sign ({name, email, password, phone , college}, activate_api_key, {expiresIn : '20m'});
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'hosteer177@gmail.com', // generated ethereal user
              pass: 'Bekarapp123#', // generated ethereal password
            }
          });
            let mailOptions = {
                from : 'hosteer177@gmail.com',
                to:email,
                subject: "Verification mail from Hosteer",
                text : "Welcome to Hosteer ! ",
                html : `
                <h2>Please click on the given link to activate your account</h2>
                <a href="${CLIENT_URL}/authentication/${token}">Click Here to verify</a>
                <p>Pls do it within 20 min</p>
                <p>If the above link is not working then browse to ${CLIENT_URL}/authentication/${token} </p>
                `
              }
              let info = transporter.sendMail (mailOptions, (error, info) => {
                if(error) {
                  console.log (error);
                  res.status(500).json ({yo : 'error'});
                }else {
                  console.log ('Message sent : ' + info.response);
                  res.status(200).json ('Mail sent successfully !');
                };
                return res.end();
              });
        }
    })
})
app.get('/authentication/:token',(req,res)=>{
  const {token} = req.params;
  if(token){
      jwt.verify(token, activate_api_key, (err, decodedToken)=>{
        if(err){
          res.status(200).json("Session timed out , Pls try again") ;
        }
        else{
          const {name, email, password, phone, college} = decodedToken;
          Users.find({'email':email},(err,result)=>{
            if(result.length){
              res.status(200).json('You are already registered , Pls go and login') ;
            }
            else{
              const hash = bcrypt.hashSync(password) ;
              new Users({
                name,
                email,
                password:hash,
                phone,
                college
              }).save((err,result)=>{
                 if(err){
                   console.log(err)
                 }
                 return res.status(200).json("Your Account is verified , login to our app") ;
              })
            }
          })
        }
      })
  }
  else{
    res.status(200).json("Invalid token , Pls Register again") ;
  }
})
*/
//For login
app.post('/login',(req,res)=>{Login.login(req,res,bcrypt,jwt,dotenv)}) ;
app.get('/verifytoken/:token',(req,res)=>{Login.getuser(req,res,jwt,dotenv)}) ;
/*
app.post('/login',(req,res)=>{
  const {email, password} = req.body ;
  Users.find({'email':email},(err,result)=>{
    if(result.length)
    {
      if(bcrypt.compareSync(password , result[0].password))
      {
        const {phone,college,name} = result[0] ;
        const api_key = "achak47" ;
        const token = jwt.sign ({name, email, password, phone , college}, api_key, {expiresIn : '60m'});
        res.status(200).json({token,api_key}) ;
      }
      else res.status(400).json("Wrong Password") ;
    }
    else{
      return res.status(200).json('No such user exists , Pls register !') ;
    }
  })
})
app.get('/verifytoken/:token/:api_key',(req,res)=>{
  const {token,api_key} = req.params ;
  if(token){
    jwt.verify(token,api_key,(err, decodedToken)=>{
      if(err){
        res.status(200).json("Your current Session is timed out, Pls Login Again") ;
      }
      else{
      res.status(200).json(decodedToken) ;
      }
    })
  }
  else{
    res.status(400).json("Invalid token") ;
  }
})
*/
app.listen(process.env.PORT || 5000 , ()=> {
    mongoose.connect(process.env.mongopath,{
        useNewUrlParser: true ,
        useUnifiedTopology: true
    }).then(()=>{
        console.log('Connection Succesful !!!')
    }).catch((err)=> console.log(err))
  })
