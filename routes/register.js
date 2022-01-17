const Users = require("../Models/users");
//const activate_api_key = "@achak47";
CLIENT_URL="http://localhost:5000";
const register = (req,res,nodemailer,jwt,dotenv)=>{
    const { email,name,password,phone,college } = req.body ;
    if(!email || !name || !password || !phone || !college){
        return res.status(200).json('Pls Enter the credentials properly') ;
    }
    Users.find({'email':email},(err,result)=>{
        if(result.length){
            res.status(200).json("User with same mail already exists !") ;
        }
        else{
        const token = jwt.sign ({name, email, password, phone , college}, process.env.activate_api_key, {expiresIn : '20m'});
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'hosteer177@gmail.com', // generated ethereal user
              pass: process.env.password, // generated ethereal password
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
}
const verify = (req,res,bcrypt,jwt,dotenv)=>{
    const {token} = req.params;
    if(token){
        jwt.verify(token, process.env.activate_api_key, (err, decodedToken)=>{
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
}
module.exports = {
    register,
    verify
}