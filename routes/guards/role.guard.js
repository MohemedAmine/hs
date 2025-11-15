// Middleware to check if the user is an "enseignant"
exports.isEnseignant = (req, res, next) => {
    if (req.session.role === 'enseignant') {
        next(); // If the role is "enseignant", proceed to the next middleware
    } else {
        res.status(403).send('Access denied. You are not an enseignant.');
    }
};

// Middleware to check if the user is a "gestionnaire"
exports.isGestionnaire = (req, res, next) => {
    if (req.session.role === 'gestionnaire') {
        next(); // If the role is "gestionnaire", proceed to the next middleware
    } else {
        res.status(403).send('Access denied. You are not a gestionnaire.');
    }
};
