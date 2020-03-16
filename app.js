const express = require('express');
const createError = require('http-errors');
const mysql = require('mysql');
const models = require('./models/index');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser  = require('body-parser');
const logger = require('morgan');
const expusr = require('express-useragent');
const exphbs  = require('express-handlebars');
const dbconfig = require(path.join(__dirname,'config/database'));
const connection = mysql.createConnection(dbconfig);
const cors = require('cors');

//Router class
const appRouter = require('./app/routes/appRoutes');
const appSocket = require('./app/socket/appSocket');

//객체 만들기
// connection.connect();
models.sequelize.sync().then(() =>{
  console.log("DB 연결 성공");
}).catch(err => {
  console.log("DB 연결 실패");
  console.log(err);
});

const app = express();
// const io = require('socket.io')(require('http').Server(app));


// view engine setup
app.engine('.handlebars', exphbs({
  extname : '.handlebars',
  defaultLayout: 'main',
  layoutsDir : __dirname +'/views/layouts/',
  partialsDir: __dirname +'/views/partials/'
}));

app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expusr.express());
app.use(cors());

//Routers
appRouter(app);
// appSocket(io);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(res.locals.message);
  res.render('error');
});

module.exports = app;
