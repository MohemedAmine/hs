const mongoose = require('mongoose');
const DB_URL ='mongodb://localhost:27017/hs';
const Salle = require('./salle.model');
const Promotion =require('./promotion.model');
const Groupe = require('./groupe.model');
const Enseignant = require('./enseignant.model');
const Module = require('./module.model');
const Session = require('./session.model')
const moment = require('moment');

const emploiTempsSchema = new mongoose.Schema({
  promotion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion',
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
    jour: {
      type: String,
      enum: ['Samedi', 'Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi'],
      required: true
    },
    enseignant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enseignant',
      required: true
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true
   
    },
    typeSeance: {
      type: String,
      enum: ['Cours', 'TD', 'TP'],
      required: true
    },
    tempsSeance: {
      type: String, 
      required: true
    }, 
    salle: {
      type: String,
      ref: 'Salle',
      required: true
    },
    groupe: {
      type: String,
    }
});



const EmploiTemps = mongoose.model('EmploiTemps', emploiTempsSchema);


exports.ajouterEmploiTemps = async (data) => {
  try {
    // Rechercher des informations supplémentaires sur la salle, la promotion, etc.
    const salleDetails = await Salle.getSalleData(data.salle);
    const promotionDetails = await Promotion.getPromotionData(data.promotion);
    const groupeDetails = await Groupe.getGroupeData(data.groupe);
    const enseignantDetails = await Enseignant.getEnseignantData(data.enseignant);
    const moduleDetails = await Module.getModuleData(data.module);

    // Vérifier la disponibilité de la salle
    const salleOccupee = await EmploiTemps.findOne({
      session: data.session,
      jour: data.jour,
      tempsSeance: data.tempsSeance,
      salle: data.salle
    });

    if (salleOccupee) {
      throw new Error(`La ${salleDetails.numero} est déjà occupée pour cette période.`);
    }

    
      const promotionOccupee = await EmploiTemps.findOne({
        promotion: data.promotion,
        session: data.session,
        jour: data.jour,
        tempsSeance: data.tempsSeance,
        typeSeance: 'Cours'
      });

      if (promotionOccupee) {
        throw new Error(`La promotion ${promotionDetails.annee} année de ${promotionDetails.niveau}  est déjà occupée pour cette période avec un cours.`);
      }
    
      
    
    

    // Vérifier la disponibilité du groupe pour un TD ou un TP
    if (data.typeSeance === 'TD' || data.typeSeance === 'TP') {
      const groupeOccupe = await EmploiTemps.findOne({
        promotion: data.promotion,
        session: data.session,
        jour: data.jour,
        tempsSeance: data.tempsSeance,
        groupe: data.groupe,
        $or: [{ typeSeance: 'TD' }, { typeSeance: 'TP' }]
      });
      if (groupeOccupe) {
        throw new Error(`Le groupe ${groupeDetails.nom} est déjà occupé pour cette période avec un ${groupeOccupe.typeSeance}.`);
      }
    }else if(data.typeSeance === 'Cours'){
      const promotionOccupe = await EmploiTemps.findOne({
        promotion: data.promotion,
        session: data.session,
        jour: data.jour,
        tempsSeance: data.tempsSeance,
        $or: [{ typeSeance: 'TD' }, { typeSeance: 'TP' }]
      });
      if (promotionOccupe) {
        throw new Error(`Le groupe ${groupeDetails.nom} est déjà occupé pour cette période avec un ${promotionOccupe.typeSeance}.`);
      }
    }

    // Rechercher un emploi existant pour la même date, heure de début et enseignant
    const emploiExistant = await EmploiTemps.findOne({
      session: data.session,
      jour: data.jour,
      tempsSeance: data.tempsSeance,
      enseignant: data.enseignant
    });

    if (emploiExistant) {
      throw new Error(`L'enseignant ${enseignantDetails.nom} est déjà occupé pour cette période.`);
    } else {
      // Créer un nouvel emploi s'il n'existe pas encore
      const nouvelEmploiTemps = new EmploiTemps({
        promotion: data.promotion,
        session: data.session,
        jour: data.jour,
        enseignant: data.enseignant,
        typeSeance: data.typeSeance,
        tempsSeance: data.tempsSeance,
        module: data.module,
        salle: data.salle,
        ...(data.typeSeance !== 'Cours' && { groupe: data.groupe }) // Ajouter le groupe uniquement si ce n'est pas un cours
      });

      // Enregistrer le nouvel emploi
      const nouvelEmploi = await nouvelEmploiTemps.save();
      return {
        success: true,
        message: `La séance de ${data.typeSeance} pour le module ${moduleDetails.nom} a été ajoutée avec succès le ${data.jour} dans la salle ${salleDetails.numero}.`,
        emploi: nouvelEmploi
      };
    }
  } catch (err) {
    return {
      success: false,
      message: `Erreur lors de l'ajout de l'emploi du temps : ${err.message}`
    };
  }
};
// Définir la fonction de contrôleur pour récupérer les données d'emploi du temps
exports.getTimetableData = async (teacherId, session) => {
  try {
      // Utiliser le modèle EmploiTemps pour trouver toutes les entrées d'emploi du temps correspondant à l'enseignant et à la session spécifiés
      const timetableData = await EmploiTemps.find({
          enseignant: teacherId, // Filtrer par l'ID de l'enseignant
          session: session // Filtrer par l'ID de la session
      }).populate('promotion').populate('session').populate('enseignant').populate('module').populate('salle');

      return timetableData; // Renvoyer les données d'emploi du temps récupérées
  } catch (error) {
      // Gérer les erreurs
      throw new Error('Failed to fetch timetable data');
  }
};


exports.getEmploiTempsByPromotion= (idPromotion) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      EmploiTemps.find({ 'promotion': idPromotion })
      .then((emplois) => {
      
          resolve(emplois)
          
      })
      .catch((err) => {
              reject(err)
      });
    }).catch((err) => {
        reject(err);
    });
});
    
}
// Function to get the weeks of the month
function getWeeksOfMonth(month, year) {
  let startDate = moment([year, month - 1]).startOf('month');
  let endDate = moment([year, month - 1]).endOf('month');
  let currentDay = startDate.clone().day(-1); // Start from the Saturday before the first day of the month

  let weeks = [];
  let week = [];

  while (currentDay.isBefore(endDate) || currentDay.isSame(endDate, 'day')) {
    currentDay.add(1, 'day');

    if (currentDay.month() === startDate.month()) {
      week.push({
        date: currentDay.format('YYYY-MM-DD'),
        day: currentDay.format('dddd')
      });
    } else {
      week.push(null); // Fill with null if the day is from a different month
    }

    if (currentDay.day() === 5) { // If the current day is Friday
      weeks.push(week.filter(day => day !== null)); // Filter out null days
      week = [];
    }
  }

  // Handle any remaining days in the last week
  if (week.length > 0) {
    weeks.push(week.filter(day => day !== null));
  }

  return weeks;
}



const Absence = require('./absence.model');

exports.getTeacherLoad = async (enseignantId, month, year) => {
  // Function to get the weeks of the month
  function getWeeksOfMonth(month, year) {
    let startDate = moment([year, month - 1]).startOf('month');
    let endDate = moment([year, month - 1]).endOf('month');
    let currentDay = startDate.clone().day(-1); // Start from the Saturday before the first day of the month

    let weeks = [];
    let week = [];

    while (currentDay.isBefore(endDate) || currentDay.isSame(endDate, 'day')) {
      currentDay.add(1, 'day');

      if (currentDay.month() === startDate.month()) {
        week.push({
          date: currentDay.format('YYYY-MM-DD'),
          day: currentDay.format('dddd')
        });
      } else {
        week.push(null); // Fill with null if the day is from a different month
      }

      if (currentDay.day() === 5) { // If the current day is Friday
        weeks.push(week.filter(day => day !== null)); // Filter out null days
        week = [];
      }
    }

    // Handle any remaining days in the last week
    if (week.length > 0) {
      weeks.push(week.filter(day => day !== null));
    }

    return weeks;
  }

  // Get the weeks of the specified month and year
  const weeks = getWeeksOfMonth(month, year);

  // Fetch the sessions for the given month and year
  const startOfMonth = moment([year, month - 1]).startOf('month').toDate();
  const endOfMonth = moment([year, month - 1]).endOf('month').toDate();

  const sessions = await Session.fetchSessionsForTheMonth(startOfMonth, endOfMonth);
  const session = sessions[0];

  // Fetch the emploiTemps for the given enseignant, session, month, and year
  const emploiTemps = await EmploiTemps.find({
    enseignant: enseignantId,
    session: session._id
  });
  // Ensure emploiTemps is an array
  const emploiTempsArray = Array.isArray(emploiTemps) ? emploiTemps : [];

  // Fetch absences for the given enseignant, month, and year
  const absences = await Absence.FetchAbsencesForTheGivenEnseignantMonthAndYear(enseignantId,startOfMonth,endOfMonth)
 

  const calculateDurationInHours = (timeRange) => {
    const [start, end] = timeRange.split(' - ');
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const startTime = startHour + startMinute / 60;
    const endTime = endHour + endMinute / 60;

    return endTime - startTime;
  };

  const getAbsenceLoad = (absences, emploiTemps, day) => {
    const dayEmploiTemps = emploiTemps.filter(et => et.jour === day.day);
    return absences.filter(abs => moment(abs.date).format('YYYY-MM-DD') === day.date)
      .reduce((total, absence) => {
        const matchingSeance = dayEmploiTemps.find(et => et.tempsSeance === absence.tempsSeance && et.typeSeance === absence.typeSeance);
        if (matchingSeance) {
          const durationInHours = calculateDurationInHours(absence.tempsSeance);
          switch (absence.typeSeance) {
            case 'Cours':
              return total + durationInHours * 2;
            case 'TD':
              return total + durationInHours * 1;
            case 'TP':
              return total + durationInHours * 1;
            default:
              return total;
          }
        }
        return total;
      }, 0);
  };


  // Calculate the load for each week
  const weekLoads = weeks.map(week => {
    const load = week.reduce((totalLoad, day) => {
      if (!day) return totalLoad;

      const dayLoad = emploiTemps.filter(et => et.jour === day.day)
        .reduce((dayTotal, seance) => {
          const durationInHours = calculateDurationInHours(seance.tempsSeance);

          switch (seance.typeSeance) {
            case 'Cours':
              return dayTotal + durationInHours * 2;
            case 'TD':
              return dayTotal + durationInHours * 1;
            case 'TP':
              return dayTotal + durationInHours * 1;
            default:
              return dayTotal;
          }
        }, 0);

        const absenceLoad = getAbsenceLoad(absences, emploiTempsArray, day);
      return totalLoad + dayLoad - absenceLoad;
    }, 0);

    return {
      week: week.map(day => (day ? day.date : null)),
      load: load
    };
  });

  return weekLoads;
};






exports.getTeacherLoadForSession = async (enseignantId, sessionId) => {
  // Function to get the weeks of the session
  function getWeeksOfSession(sessionStart, sessionEnd) {
    let startDate = moment(sessionStart);
    let endDate = moment(sessionEnd);
    let currentDay = startDate.clone().day(-1); // Start from the Saturday before the first day of the session

    let weeks = [];
    let week = [];

    while (currentDay.isBefore(endDate) || currentDay.isSame(endDate, 'day')) {
      currentDay.add(1, 'day');

      if (currentDay.isBetween(startDate, endDate, null, '[]')) {
        week.push({
          date: currentDay.format('YYYY-MM-DD'),
          day: currentDay.format('dddd')
        });
      } else {
        week.push(null); // Fill with null if the day is out of the session period
      }

      if (currentDay.day() === 5) { // If the current day is Friday
        weeks.push(week.filter(day => day !== null)); // Filter out null days
        week = [];
      }
    }

    // Ensure the last day of the session is included in the final week
    if (week.length > 0 || currentDay.isSame(endDate, 'day')) {
      weeks.push(week.filter(day => day !== null));
    }

    return weeks;
  }

  // Fetch the session by ID
  const session = await Session.getSessionById(sessionId);
  const sessionStart = session.begin;
  const sessionEnd = session.end;

  // Get the weeks of the specified session
  const weeks = getWeeksOfSession(sessionStart, sessionEnd);

  // Fetch the emploiTemps for the given enseignant and session
  const emploiTemps = await EmploiTemps.find({
    enseignant: enseignantId,
    session: sessionId
  });
  // Ensure emploiTemps is an array
  const emploiTempsArray = Array.isArray(emploiTemps) ? emploiTemps : [];

  // Fetch absences for the given enseignant and session period
  const absences = await Absence.FetchAbsencesForTheGivenEnseignantPeriod(enseignantId, sessionStart, sessionEnd);

  const calculateDurationInHours = (timeRange) => {
    const [start, end] = timeRange.split(' - ');
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const startTime = startHour + startMinute / 60;
    const endTime = endHour + endMinute / 60;

    return endTime - startTime;
  };

  const getAbsenceLoad = (absences, emploiTemps, day) => {
    const dayEmploiTemps = emploiTemps.filter(et => et.jour === day.day);
    return absences.filter(abs => moment(abs.date).format('YYYY-MM-DD') === day.date)
      .reduce((total, absence) => {
        const matchingSeance = dayEmploiTemps.find(et => et.tempsSeance === absence.tempsSeance && et.typeSeance === absence.typeSeance);
        if (matchingSeance) {
          const durationInHours = calculateDurationInHours(absence.tempsSeance);
          switch (absence.typeSeance) {
            case 'Cours':
              return total + durationInHours * 2;
            case 'TD':
              return total + durationInHours * 1;
            case 'TP':
              return total + durationInHours * 1;
            default:
              return total;
          }
        }
        return total;
      }, 0);
  };

  // Calculate the load for each week
  const weekLoads = weeks.map(week => {
    const load = week.reduce((totalLoad, day) => {
      if (!day) return totalLoad;

      const dayLoad = emploiTempsArray.filter(et => et.jour === day.day)
        .reduce((dayTotal, seance) => {
          const durationInHours = calculateDurationInHours(seance.tempsSeance);

          switch (seance.typeSeance) {
            case 'Cours':
              return dayTotal + durationInHours * 2;
            case 'TD':
              return dayTotal + durationInHours * 1;
            case 'TP':
              return dayTotal + durationInHours * 1;
            default:
              return dayTotal;
          }
        }, 0);

      const absenceLoad = getAbsenceLoad(absences, emploiTempsArray, day);
      return totalLoad + dayLoad - absenceLoad;
    }, 0);

    return {
      week: week.map(day => (day ? day.date : null)),
      load: load
    };
  });

  return weekLoads;
};
