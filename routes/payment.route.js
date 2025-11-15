const express = require('express');
const router = express.Router();
const chargeEnseignement = require('../controllers/chargeEnseignement.controller');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const authGuard = require('./guards/auth.guard')
const roleGuard = require('./guards/role.guard')
router.get('/getPaymentSlip', chargeEnseignement.getTeacherPaymentSlipPage)
router.get('/paymentSlip', chargeEnseignement.getPaymentSlip)
  
  


module.exports = router;
