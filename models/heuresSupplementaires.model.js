const mongoose = require('mongoose');

const heuresSupplementairesSchema = new mongoose.Schema({
  enseignant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enseignant',
    required: true
  },
  heures: {
    type: Number,
    required: true
  }, 
  month: {
    type: Number,
    required: true
  },
  week : {
    type: Number,
    required: true
  }
});

const HeuresSupplementaires = mongoose.model('HeuresSupplementaires', heuresSupplementairesSchema);

module.exports = HeuresSupplementaires;
