const express = require('express');
const router = express.Router();
const chargeEnseignement = require('../controllers/chargeEnseignement.controller');
const authGuard = require('./guards/auth.guard')
const roleGuard = require('./guards/role.guard')


// Route pour rendre le dashboard
router.get('/',authGuard.isAuth, (req, res) => {
  res.render('dashboard',{
    role : req.session.role ,
  });
});

// Route pour obtenir la liste des enseignants
router.get('/gestion-emploi-temps/enseignants',authGuard.isAuth,roleGuard.isGestionnaire ,chargeEnseignement.getListEnseignants);

// Route pour obtenir les enseignants par promotion et session
router.get('/getEnseignants',authGuard.isAuth,roleGuard.isGestionnaire, chargeEnseignement.getEnseignantsByPromotionAndSession);

// Route pour obtenir les modules par promotion, session et enseignant
router.get('/getModules',authGuard.isAuth,roleGuard.isGestionnaire, chargeEnseignement.getModulesByPromotionSessionAndEnseignant);

// Route pour obtenir les groupes par promotion
router.get('/getGroupes',authGuard.isAuth,roleGuard.isGestionnaire,chargeEnseignement.getGroupesByPromotion);

router.get('/emploi-du-temps',authGuard.isAuth,chargeEnseignement.getTimetable)
router.get('/charge',authGuard.isAuth,chargeEnseignement.getChargePage)
router.get('/getTeacherLoad',authGuard.isAuth,roleGuard.isEnseignant,chargeEnseignement.getTeacherLoad );
router.get('/getTeacherLoadBySession',authGuard.isAuth,roleGuard.isEnseignant,chargeEnseignement.getTeacherLoadBySession );
router.get('/getSessions',authGuard.isAuth,roleGuard.isEnseignant,chargeEnseignement.getSessions );

// Exporter le routeur
module.exports = router;
