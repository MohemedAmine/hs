const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/hs';

const moduleSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    promotion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promotion',
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    }
});

const Module = mongoose.model('Module', moduleSchema);

// Function to connect to the database
const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Database connected');
        } catch (error) {
            console.error('Database connection error:', error);
        }
    }
};
exports.getModuleData = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            Module.findById(id).then(data => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        });
    });
};
// Function to get list of all modules
exports.getListModules = async () => {
    try {
        await connectDB();
        const modules = await Module.find();
        return modules;
    } catch (error) {
        throw new Error('Error fetching modules: ' + error.message);
    }
};

// Function to get modules by promotion and session
exports.getModulesByPromotionAndSession = async (promotionId, sessionId) => {
    try {
        await connectDB();
        const modules = await Module.find({ promotion: promotionId, session: sessionId });
        return modules;
    } catch (error) {
        throw new Error('Error fetching modules by promotion and session: ' + error.message);
    }
};



exports.Module = Module;
