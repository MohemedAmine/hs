const { default: mongoose } = require('mongoose');
const authModel = require('../models/auth.model');
const userVerification = require('../models/userVerification')
const user  = require('../models/user.model').User
const validationResult = require('express-validator').validationResult
const path = require('path');
const bcrypt = require('bcrypt');
const DB_URL ='mongodb://localhost:27017/hs'

exports.getSignUp = (req,res,next)=>{

   res.render('signUp',{
      'authError' : req.flash('authError')[0] , 
      'validationErrors' : req.flash('validationErrors'),
      isUser :false ,
      isAdmin : false ,
      myId : req.session.userId
    })
}
exports.postSignUp = async (req, res, next) => {
   try {
       if (validationResult(req).isEmpty()) {
           // Créer un nouvel utilisateur et récupérer son ID
           const userId = await authModel.createNewUser(req.body.username, req.body.email, req.body.password);

           // Envoyer un email de vérification en utilisant l'ID de l'utilisateur
           
           await authModel.sendVerificationEmail({ _id: userId._id, email: req.body.email }, res);
       } else {
           // Rediriger vers la page d'inscription avec les erreurs de validation
           req.flash('validationErrors', validationResult(req).array());
           res.redirect('/signUp');
       }
   } catch (err) {
       // Gérer les erreurs
       
       req.flash('authError', err);
       res.redirect('/signUp');
   }
}

exports.getLogin = (req,res,next)=>{
            console.log(req.session.userId)
    res.render('login',{
      'authError' : req.flash('authError')[0],
      'validationErrors' : req.flash('validationErrors'),
      isUser : false , 
      isAdmin : false,
       myId : req.session.userId
    })
    
}
exports.postLogin = (req,res,next)=>{
   if(validationResult(req).isEmpty()){
authModel.login(req.body.email, req.body.password).then((result)=>{
   req.session.userId  = String(result._id)
   req.session.name = result.username
   req.session.image = result.image
   req.session.enseignantId = result.id,
   req.session.role= result.role
   console.log(req.session)
      res.redirect('/')
 
}).catch((err)=>{
   req.flash('authError', err)
   res.redirect('/login')

})     }else {
     req.flash('validationErrors' , validationResult(req).array())
     res.redirect('/login')

}
   
}
exports.getEmailVerification = async (req,res,next)=>{
   let {userId , uniqueString} = req.params;

   
      mongoose.connect(DB_URL).then(()=>{
         userVerification.find({userId}).then((result)=>{
            if(result.length > 0 ){
                     const {expiresAt} = result[0] ; 
                     const hashedUniqueString = result[0].uniqueString;
                     if(expiresAt < Date.now()){
                        userVerification.deleteOne({userId}).then((result)=>{
                                user.deleteOne({_id : userId}).then(()=>{
                         let message = "Link has expired. Please sign up again.";
                         res.redirect(`/verified?error=true&message=${encodeURIComponent(message)}`);

                                })
                        }).catch((err)=>{
                          
                           let message = "An error occured while clearing expired user verification record";
                           res.redirect(`/verified?error=true&message=${encodeURIComponent(message)}`);
                        })
                     }else{
                        bcrypt.compare(uniqueString,hashedUniqueString).then(result=>{
                           if(result){
                                   user.updateOne({_id:userId},{verified:true}).then(()=>{
                                      userVerification.deleteOne({userId}).then(()=>{
                                       res.sendFile(path.join(__dirname , '/views/verified.html'))
                                      }).catch(err=>{
                                  
                                       let message = "An error occured while finalizing verification successful verification.";
                                       res.redirect(`/verified?error=true&message=${encodeURIComponent(message)}`);
                                      })
                                   }).catch(err=>{
                                   
                                    let message = "An error occured while updating user record to show verified.";
                                    res.redirect(`/verified?error=true&message=${encodeURIComponent(message)}`);
                                   })
                           }else{
                              
                           let message = "Invalid verification details passed. check your inbox.";
                           res.redirect(`/verified?error=true&message=${encodeURIComponent(message)}`);
                           }
                        }).catch((err)=>{
                   
                           let message = "An error occured while comparing unique strings.";
                           res.redirect(`/verified?error=true&message=${encodeURIComponent(message)}`);
                        })

                     }
            }else{
               let message = "Account record doesn't exist or has been verified already. Please sign up or log in.";
               res.redirect(`/verified?error=true&message=${encodeURIComponent(message)}`);
       
            }
         }


            ).catch((err)=>{
             let message = 'An error occured while checking for existing user verification record';
             res.redirect(`/verified?error=true&message=${encodeURIComponent(message)}`);
       
            })
      })
   
  
   
   



}
exports.getVerifiedPage = (req, res, next) => {
   res.render('verified')
}
exports.getverificationEmailSent = (req, res, next) => {
   res.render('verificationEmailSent')
}
exports.logout = (req,res,next)=>{
   req.session.destroy(()=>{
         res.redirect('/')
   })

}