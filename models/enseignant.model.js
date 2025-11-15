const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/hs';
const Module = require('./module.model');

// Définition du schéma de l'enseignant
const enseignantSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    enum: [
      'Professeur',
      'Maître de conférences A',
      'Maître de conférences B',
      'Maître assistant A',
      'Maître assistant B',
    ],
    required: true,
  },
  modules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
    },
  ],
  hourlyRate: {
    type: Number,
    required: true,
  },
});

const Enseignant = mongoose.model('Enseignant', enseignantSchema);

// Exports des méthodes pour récupérer les enseignants
exports.getListEnseignants = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      Enseignant.find()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

exports.getEnseignantData = (id) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      Enseignant.findById(id)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

exports.getEnseignantsByPromotionAndSession = async (
  promotionId,
  sessionId
) => {
  try {
    await mongoose.connect(DB_URL);
    // Récupérer les modules associés à la promotion et à la session spécifiées
    const modules = await Module.getModulesByPromotionAndSession(
      promotionId,
      sessionId
    );
    // Récupérer tous les enseignants
    const allEnseignants = await Enseignant.find();

    // Filtrer les enseignants en fonction des modules récupérés
    const enseignants = allEnseignants.filter((enseignant) => {
      // Vérifier si l'enseignant a au moins un module correspondant à ceux récupérés
      return enseignant.modules.some((moduleId) =>
        modules.some((module) => module._id.toString() === moduleId.toString())
      );
    });

    return enseignants;
  } catch (error) {
    console.log(
      "Une erreur s'est produite lors de la récupération des enseignants :",
      error
    );
    throw error;
  }
};
const { Types } = require('mongoose');

exports.getModulesByPromotionSessionAndEnseignant = async (
  promotionId,
  sessionId,
  enseignantId
) => {
  try {
    // Vérifier si l'ID de l'enseignant est défini et valide
    if (!Types.ObjectId.isValid(enseignantId)) {
      return [];
    }

    // Connexion à la base de données
    await mongoose.connect(DB_URL);

    // Récupérer les modules par promotion et session
    const modulesByPromotionAndSession =
      await Module.getModulesByPromotionAndSession(promotionId, sessionId);

    // Récupérer les modules enseignés par l'enseignant spécifique
    const enseignant = await Enseignant.findById(enseignantId).populate(
      'modules'
    );

    if (!enseignant) {
      return [];
    }

    // Filtrer les modules par promotion, session et modules enseignés par l'enseignant
    const filteredModules = modulesByPromotionAndSession.filter((module) =>
      enseignant.modules.some((enseignantModule) =>
        enseignantModule.equals(module._id)
      )
    );
    return filteredModules;
  } catch (error) {
    throw new Error(
      'Erreur lors de la récupération des modules par promotion, session et enseignant : ' +
        error.message
    );
  } finally {
  }
};

exports.Enseignant = Enseignant;
