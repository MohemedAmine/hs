const mongoose = require('mongoose')
const DB_URL ='mongodb://localhost:27017/hs'
const userSchema = mongoose.Schema({
    username : String , 
    email :String ,
    password : String,
    verified: Boolean ,
    image : {type:String , default : "default-user-image.png"} ,
    role: {
        type: String,
        enum: ['enseignant', 'gestionnaire'],
        default: 'enseignant'
    },
    id: {
        type: String,
        unique: true
    }
})
const User = mongoose.model('user' , userSchema)
exports.getUserData = (id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            User.findById(id).then(data=>{
     
                resolve(data)
            }).catch((err)=>{
                
                reject(err)
            })
        })
    })
}



exports.User = User