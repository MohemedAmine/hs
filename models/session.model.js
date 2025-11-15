const mongoose = require('mongoose');
const DB_URL ='mongodb://localhost:27017/hs'
const sessionSchema = new mongoose.Schema({
  begin: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  }
});

const Session = mongoose.model('Session', sessionSchema);
exports.getSessions = ()=>{
  return new Promise((resolve,reject)=>{
      mongoose.connect(DB_URL).then(()=>{
        Session.find().then(data=>{
              resolve(data)
          }).catch((err)=>{
              
              reject(err)
          })
      })
  })
}
exports.getSessionById = (id)=>{
  return new Promise((resolve,reject)=>{
      mongoose.connect(DB_URL).then(()=>{
        Session.findById(id).then(data=>{
              resolve(data)
          }).catch((err)=>{
              
              reject(err)
          })
      })
  })
}
exports.getSessionFromDate = async (date) => {
  try {
    await mongoose.connect(DB_URL); // Connexion à la base de données
     
    const session = await Session.findOne({ begin: { $lte: date }, end: { $gte: date } });
    return session;
  } catch (err) {
    throw new Error(`Erreur lors de la récupération de la session à partir de la date : ${err.message}`);
  }
};
exports.getSessionId = async (date) => {
  try {
    await mongoose.connect(DB_URL); // Connexion à la base de données
    const session = await Session.findOne({ begin: { $lte: date }, end: { $gte: date } });
    return session._id.toString();
  } catch (err) {
    throw new Error(`Erreur lors de la récupération de la session à partir de la date : ${err.message}`);
  }
};
exports.fetchSessionsForTheMonth =async (startDate,endDate)=>{
  try {
  await mongoose.connect(DB_URL); // Connexion à la base de données
  const sessions = await Session.find({
    begin: { $lte: endDate },
    end: { $gte: startDate }
  });
  return sessions;
  }catch (err) {
    throw new Error(`Erreur lors de la récupération de les session à partir de le mois : ${err.message}`);
  }
}
exports.Session = Session;
