const mongoose = require('mongoose');
const DB_URL ='mongodb://localhost:27017/hs'
const promotionSchema = new mongoose.Schema({
    niveau: {
      type: String,
      required: true
    },
    annee: {
      type: Number,
      required: true
    }
  });
  const Promotion = mongoose.model('Promotion', promotionSchema);
  exports.getPromotionData = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
          Promotion.findById(id).then(data => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    });
};
  exports.getPromotions = ()=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
          Promotion.find().then(data=>{
                resolve(data)
            }).catch((err)=>{
                
                reject(err)
            })
        })
    })
  }
  exports.Promotion = Promotion;
 