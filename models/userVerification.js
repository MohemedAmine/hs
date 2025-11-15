const mongoose = require('mongoose')


const userVerificationSchema = mongoose.Schema({
    userId : String , 
    uniqueString :String ,
    createdAt : Date,
    expiresAt: Date ,
    
})

const userVerification = mongoose.model('userVerification' , userVerificationSchema)
module.exports = userVerification ; 