const express = require('express');
const router = express.Router();
const chargeEnseignement = require('../controllers/chargeEnseignement.controller')
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const authGuard = require('./guards/auth.guard')
const roleGuard = require('./guards/role.guard')



router.get('/',authGuard.isAuth,roleGuard.isGestionnaire,(req, res) => {
  res.render('gestion-emploi-temps')
});
router.get('/saisir-emploi-temps',authGuard.isAuth,roleGuard.isGestionnaire, chargeEnseignement.saisie_emploi_temps_enseignant)
router.post('/saisir-emploi-temps',authGuard.isAuth,roleGuard.isGestionnaire,chargeEnseignement.ajouterEmploiTemps)
router.get('/emploi-du-temps',authGuard.isAuth,chargeEnseignement.getDashboardEnseignant)
module.exports = router;
