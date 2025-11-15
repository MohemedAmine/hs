require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const flash = require('./middleware/flash');
const authRouter = require('./routes/auth.route');
const emploiTempsRouter = require('./routes/emploiTempsRouter.route');
const dashboardRouter = require('./routes/dashboard.route');
const absenceRoutes = require('./routes/absence.route');
const paymentRoutes = require('./routes/payment.route');

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'images')));

// Suppress favicon 404 error
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Session store configuration
const STORE = new SessionStore({
  uri: process.env.DB_URL || 'mongodb://localhost:27017/hs',
  collection: 'sessions',
});

// Session middleware
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      'This is my secret to hash express sessions ......',
    saveUninitialized: false,
    resave: false,
    store: STORE,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Flash middleware
app.use(flash());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/', authRouter);
app.use('/', dashboardRouter);
app.use('/gestion-emploi-temps', emploiTempsRouter);
app.use('/teacher-absence', absenceRoutes);
app.use('/', paymentRoutes);

app.get('/error', (req, res, next) => {
  res.status(500);
  res.render('error', {
    pageTitle: 'Error',
  });
});
app.use((err, req, res, next) => {
  res.redirect('/error');
});
app.use((req, res, next) => {
  res.status(404);
  res.render('not-found', {
    pageTitle: 'Page Not Found',
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Server listen on port ' + port);
});
