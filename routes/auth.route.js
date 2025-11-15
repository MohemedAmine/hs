const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const check = require('express-validator').check
const bodyParserMW = bodyParser.urlencoded({
  extended : true,
});


const authController = require('../controllers/auth.controller')

const authGuard = require('./guards/auth.guard')


  router.get('/signUp',authGuard.notAuth,authController.getSignUp)
  router.get('/login',authGuard.notAuth,authController.getLogin)
  router.post('/signUp',authGuard.notAuth,bodyParserMW,check('username').not().isEmpty().withMessage('User name is required'),
   check('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Invalid format'),
   check('password').not().isEmpty().withMessage('password is required').isLength({min:6}).withMessage('Invalid format'),
   check('confirmPassword').custom((value,{req})=>{
             if(value === req.body.password){
              return true
             }else throw 'Paswords not equals'
   }),
     authController.postSignUp)
  router.post('/login',authGuard.notAuth,bodyParserMW, check('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Invalid format'),
  check('password').not().isEmpty().withMessage('password is required').isLength({min:6}).withMessage('Invalid format'),
  authController.postLogin)
  router.get('/verify/:userId/:uniqueString' ,authController.getEmailVerification )
  router.get('/verified' ,authController.getVerifiedPage )
  router.get('/verificationEmailSent' ,authController.getverificationEmailSent )
  router.all('/logout',authGuard.isAuth,authController.logout)


  module.exports = router;




