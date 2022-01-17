const mongoose = require('mongoose') ;
const schema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone : String ,
    college : String 
},{
    timestamps:true
}
)
module.exports = mongoose.model('users',schema) ;