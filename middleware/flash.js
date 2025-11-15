/**
 * Simple Flash Messages Middleware
 * Replaces deprecated connect-flash package
 * Stores messages in session and retrieves them once
 */

module.exports = function flashMiddleware() {
  return function (req, res, next) {
    // Initialize flash object in session if not exists
    if (!req.session.flash) {
      req.session.flash = {};
    }

    // Flash method to store messages
    req.flash = function (type, message) {
      if (arguments.length === 1) {
        // Get flash messages
        const messages = req.session.flash[type] || [];
        // Clear the messages after retrieving
        delete req.session.flash[type];
        return messages;
      } else {
        // Store flash message
        if (!req.session.flash[type]) {
          req.session.flash[type] = [];
        }
        if (Array.isArray(message)) {
          req.session.flash[type] = req.session.flash[type].concat(message);
        } else {
          req.session.flash[type].push(message);
        }
      }
    };

    next();
  };
};
