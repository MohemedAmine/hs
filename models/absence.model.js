const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DB_URL = 'mongodb://localhost:27017/hs';
const AbsenceSchema = new Schema({
  enseignantId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
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
  reason: {
    type: String,
    required: true
  }
});
const Absence = mongoose.model('Absence', AbsenceSchema);
exports.FetchAbsencesForTheGivenEnseignantMonthAndYear = async (enseignantId,startOfMonth,endOfMonth)=>{
    try {
        await mongoose.connect(DB_URL); // Connexion à la base de données
        const absences = await Absence.find({
            enseignantId: enseignantId,
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          });
        return absences;
        }catch (err) {
          throw new Error(`Erreur lors de la récupération de les absences à partir de l'enseignant et mois et année : ${err.message}`);
        }
}
exports.createAbsence = async (req, res) => {
    const { enseignantId, date, typeSeance, tempsSeance, reason } = req.body;
    if (!enseignantId || !date || !typeSeance || !tempsSeance || !reason) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    const absence = new Absence({
      enseignantId,
      date: new Date(date),
      typeSeance,
      tempsSeance,
      reason
    });
  
    try {
      const newAbsence = await absence.save();
      res.status(201).json(newAbsence);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

  exports.FetchAbsencesForTheGivenEnseignantPeriod = async (enseignantId, startDate, endDate) => {
    try {
      const absences = await Absence.find({
        enseignantId: enseignantId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      });
      return absences;
    } catch (error) {
      console.error('Error fetching absences:', error);
      throw error;
    }
  };
  