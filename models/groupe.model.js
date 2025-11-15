const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/hs';
const groupeSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
   
    },
    nombreEtudiants: {
        type: Number,
        required: true
    },
    promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion',
        required: true
    },
});

const Groupe = mongoose.model('Groupe', groupeSchema);
exports.getGroupeData = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            Groupe.findById(id).then(data => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    });
};
exports.getGroupesByPromotion = async (promotionId) => {
    try {
        await mongoose.connect(DB_URL);
        const groupes = await Groupe.find({ promotion: promotionId });
        return groupes;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des groupes par promotion : ' + error.message);
    }
};
exports.Groupe = Groupe;