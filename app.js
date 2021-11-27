const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const studentRoute = require('./routes/studentRoute');
const pageRoute = require('./routes/pageRoute');
const bookRoute = require('./routes/bookRoute');
const categoryRoute = require('./routes/categoryRoute');
const teacherRoute = require('./routes/teacherRoute');

const app = express();

const PORT = 5555;

// Connect DB
mongoose
  .connect('mongodb://localhost/nefl-library')
  .then(() => console.log('DB connected successfully.'));

// Template Engine
app.set('view engine', 'ejs');

// Global Variable
global.userIN = null;

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);
app.use(
  session({
    secret: 'NEFLYAZILIM',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/nefl-library' }),
  })
);

// Routes
app.use('*', (req, res, next) => {
  userIN = req.session.teacherID;
  next();
});

app.use('/', pageRoute);
app.use('/books', bookRoute);
app.use('/categories', categoryRoute);
app.use('/teachers', teacherRoute);
app.use('/students', studentRoute);

// Start the app on the specified port
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
