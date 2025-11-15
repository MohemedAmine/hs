const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/hs';

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const paymentSchema = new mongoose.Schema({
  enseignantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
  },
  hoursWorked: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

exports.addOrUpdatePayment= async (paymentData) => {
  const { enseignantId, sessionId, date, description, hoursWorked, amount } = paymentData;

  const payment = await Payment.findOneAndUpdate(
    { enseignantId, sessionId },
    { date, description, hoursWorked, amount },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return payment;
}


exports.getPayment = async ({ enseignantId, sessionId })=>{

      
    try {
      const payments = await Payment.find({ enseignantId, sessionId });
      return payments ;
    } catch (error) {
        throw new Error(`An error occurred while fetching payment slip : ${error.message}`);
    }
    
  }

exports.getPaymentSlip = async ({ enseignantId, sessionId })=>{

      
        try {
          const payments = await Payment.find({ enseignantId, sessionId });
          return payments ;
        } catch (error) {
            throw new Error(`An error occurred while fetching payment slip : ${error.message}`);
        }
        
      }

exports.addNewPaymentEntry = async ({ enseignantId, sessionId, date, description, amount })=>{
    try {
      const newPayment = new Payment({ enseignantId, sessionId, date, description, amount });
      await newPayment.save();
      return newPayment;
    } catch (error) {
          throw new Error(`An error occurred while adding a payment entry : ${error.message}`)
    }
}


exports.Payment = Payment;