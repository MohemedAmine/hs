const EmploiTemps = require('../models/emploiTemps.model');
// Contrôleur pour saisir l'emploi du temps de l'enseignant
const Promotion = require('../models/promotion.model');
const Session = require('../models/session.model');
const Enseignant = require('../models/enseignant.model');
const Module = require('../models/module.model');
const Groupe = require('../models/groupe.model');
const Salle = require('../models/salle.model');
const bcrypt = require('bcrypt');

// Logique pour ajouter un emploi du temps
// Logique pour ajouter un emploi du temps
exports.ajouterEmploiTemps = async (req, res) => {
    try {
        const result = await EmploiTemps.ajouterEmploiTemps(req.body);
        const enseignant = await Enseignant.getEnseignantData(req.body.enseignant);
        const groupe = await Groupe.getGroupeData(req.body.groupe);
        const matiere = await Module.getModuleData(req.body.module);
        console.log(req.body.salle)
        const salle = await Salle.getSalleData(req.body.salle);
        bcrypt.hash('ben39093148ben',10).then((hashedPassword)=>{
             console.log(hashedPassword)
        
    })
        if(!result.message){
            result.message = `La séance de ${result.typeSeance} pour le module ${matiere.nom} a été ajoutée avec succès le ${result.jour} dans la salle ${salle.numero}.`;
        }
        if (result.emploi){res.status(200).json({
        success: true,
        data: {
            jour: result.emploi.jour,
            enseignant: enseignant.nom,
            module: matiere.nom,
            typeSeance: result.emploi.typeSeance,
            tempsSeance: result.emploi.tempsSeance,
            salle: salle.numero,
            groupe: groupe.nom,  
        },
        message : result.message
    });}else{ res.status(200).json({
        success: false,
     
        message : result.message
    });
   }

       
    
    } catch (error) {
   
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });

      

       
    }
};


exports.getListEnseignants = async (req, res) => {
    try {
        // Récupérer la liste des enseignants
        const enseignants = await Enseignant.getListEnseignants();
        const sessions = await Session.getSessions();
        
        // Récupérer la liste des sessions
    
        // Rendre la vue avec la liste des enseignants et des sessions
        res.render('enseignants', {
            enseignantsList: enseignants,
            sessions: sessions,
            
             
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des données' });
    }
};






exports.saisie_emploi_temps_enseignant  =  async (req, res) => {
    try {
        const promotions = await Promotion.getPromotions ();
        const sessions = await Session.getSessions();
        const salles = await Salle.getSalles();
        res.render('saisie_emploi_temps_enseignant',{
            'promotions':promotions,
            'sessions':sessions,
            'salles' : salles,
           
           
        }
        );
    
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des données' });
    }
};




// Fonction pour obtenir le tableau de bord de l'enseignant
exports.getDashboardEnseignant = async (req, res, next) => {
    try {
        // Récupérer toutes les sessions disponibles depuis la base de données ou toute autre source
        const sessions = await Session.getSessions(); // Assurez-vous d'avoir une méthode appropriée pour obtenir les sessions dans votre modèle

        // Rendre la vue 'emploiTemps' avec les données nécessaires
        res.render('emploiTemps', {
            enseignantId: req.session.enseignantId, // L'ID de l'enseignant extrait de la session
            sessions: sessions // Les sessions disponibles récupérées de la base de données
        });
    } catch (error) {
        // Gérer les erreurs en les passant à la fonction next() ou en les envoyant comme réponse HTTP
        next(error);
    }
};
exports.getTimetable = async (req, res, next) => {
    try {
        const teacherId = req.query.teacherId;
        const session = req.query.session;
        // Utilisez les paramètres pour récupérer les données d'emploi du temps depuis votre modèle
        const timetableData = await EmploiTemps.getTimetableData(teacherId, session);
        // Renvoyer les données récupérées au client
        res.json(timetableData);
    } catch (error) {
        // Gérer les erreurs
        next(error);
    }
};
exports.getEnseignantsByPromotionAndSession = async (req,res,next)=>{
    try{
    const promotion = req.query.promotion;
    const session = req.query.session;
    const enseignants = await Enseignant.getEnseignantsByPromotionAndSession(promotion,session);
    res.json({ 
        promotion: promotion,
        session: session,
        enseignants: enseignants
    });
} catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données' });
}


}
exports.getModulesByPromotionSessionAndEnseignant = async (req, res, next) => {
    try {
        const promotion = req.query.promotion;
        const session = req.query.session;
        const enseignant = req.query.enseignant;

        let modules;
        if (enseignant) {
            modules = await Enseignant.getModulesByPromotionSessionAndEnseignant(promotion, session, enseignant);
        } else {
            modules = await Module.getModulesByPromotionAndSession(promotion,session);
        }
        res.json({
            promotion: promotion,
            session: session,
            modules: modules
        });
    } catch (err) {
        console.error("Error while fetching modules:", err);
        res.status(500).json({ message: 'Erreur lors de la récupération des données' });
    }
};

exports.getGroupesByPromotion = async (req, res, next) => {
    try {
        const promotionId = req.query.promotion; // Récupérer l'ID de la promotion depuis la requête
        const groupes = await Groupe.getGroupesByPromotion(promotionId );
        res.json({ groupes:groupes });
    } catch (error) {
        console.error('Error fetching groupes by promotion:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des groupes par promotion.' });
    }
};

exports.getChargePage=(req,res,next)=>{
    try {
        res.render('charge', {
            enseignantId: req.session.enseignantId,
        });
    } catch (error) {
        next(error);
    }
}
exports.getTeacherPaymentSlipPage=(req,res,next)=>{
    try {
        res.render('teacherPaymentSlip', {
            enseignantId: req.session.enseignantId,
        });
    } catch (error) {
        next(error);
    }
}

exports.getTeacherLoad=async(req,res,next)=>{
    const enseignantId = req.query.enseignantId;
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    const teacherLoad = await EmploiTemps.getTeacherLoad(enseignantId, month, year)
    res.json(teacherLoad);
}
// Route to get teacher load by session
exports.getTeacherLoadBySession = async (req, res, next) => {
    const enseignantId = req.query.enseignantId;
    const sessionId = req.query.sessionId;
    const teacherLoadSession = await EmploiTemps.getTeacherLoadForSession(enseignantId, sessionId);
    res.json(teacherLoadSession);
  };


exports.getSessions =async (req,res,next)=>{
    const sessions = await Session.getSessions();
    res.json(sessions);
}



const Payment = require('../models/payment.model')
exports.getPaymentSlip = async (req, res, next) => {
    const { enseignantId, sessionId } = req.query;

    try {
        // Récupérer la charge horaire de l'enseignant pour la session
    
        const teacherLoadSession = await EmploiTemps.getTeacherLoadForSession(enseignantId, sessionId);
       
        let hoursWorked = 0;
        teacherLoadSession.forEach((element) => {
            hoursWorked += element.load;
        });

        // Récupérer le taux horaire de l'enseignant
        const teacher = await Enseignant.getEnseignantData(enseignantId);
        const amount = teacher.hourlyRate * hoursWorked;
        console.log('Amount:', amount);

        // Obtenir la date et l'heure actuelles
        const currentDate = new Date();

        // Préparer les données du paiement
        const paymentData = {
            enseignantId,
            sessionId,
            date: currentDate,
            description: ` `,
            amount
        };

        // Ajouter ou mettre à jour le paiement dans la base de données
        await Payment.addOrUpdatePayment(paymentData);

        // Récupérer le bulletin de paie
        const paymentSlip = await Payment.getPaymentSlip({ enseignantId, sessionId });
        
        res.json(paymentSlip);
    } catch (error) {
        console.error("Erreur lors de la génération du bulletin de paie :", error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la génération du bulletin de paie' });
    }
};


exports.addNewPaymentEntry = async (req,res,next)=>{
    const { enseignantId, sessionId, date, description, amount } = req.body;
    try{
        const newPayment = await Payment.addNewPaymentEntry({ enseignantId, sessionId, date, description, amount });
        res.json(newPayment);
    }catch (error) {
        res.status(500).json({ error: 'An error occurred while adding a payment entry' });
      }
}























