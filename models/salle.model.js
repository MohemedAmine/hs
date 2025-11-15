const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/hs';
// Schéma pour la table salle
const salleSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true,
        unique: true
    },
    capacite: {
        type: Number,
        required: true
    }
});
const Salle = mongoose.model('Salle', salleSchema);
exports.getSalleData = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            Salle.findById(id).then(data => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    });
};
exports.getSalles = async () => {
    try {
        await mongoose.connect(DB_URL);
        const salles = await Salle.find();
        return salles;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des groupes par promotion : ' + error.message);
    }
};
exports.Salle = Salle;