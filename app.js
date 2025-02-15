var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studentRouter = require('./routes/students');

const http = require("http");

// Importations liés à la BD
var mongo = require('mongoose');
var mongoConn = require('./config/database.json');

// Importation des contrôleurs pour Socket.IO
const { initSocket } = require('./controllers/studentController');

var app = express();

// Création du serveur HTTP
const server = http.createServer(app);

// Configuration du port avec fallback
const port = process.env.PORT || 3001;
server.listen(port, () => console.log('Server is running on port ${port}'));

// Initialiser Socket.IO pour les contrôleurs
const io = require("socket.io")(server);
initSocket(io);

// Connexion à la base de données MongoDB
mongo.connect(mongoConn.url).then(() => {
  console.log("connected to db");
}).catch(() => {
  console.log("error connecting to db");
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/students', studentRouter);

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Un client est connecté');

  socket.on('disconnect', () => {
    console.log('Un client s’est déconnecté');
  });
});

// Gestion des erreurs 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Gestion des erreurs
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Exporter app et server pour démarrer avec Socket.IO
module.exports = app;