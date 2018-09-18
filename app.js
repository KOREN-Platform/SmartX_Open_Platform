var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session')
var passport = require('passport');
var passportPolicy = require('./policies/AuthencationServices')

//config
var dbconfig = require('./config/database');

//index, admin , client routes file
var indexRouter = require('./routes/index');
var clientRouter = require('./routes/client');
var adminRouter = require('./routes/admin');


var clientmainRouter = require('./routes/client_main');
var appstatusRouter = require('./routes/app_status');
var clusterRouter = require('./routes/cluster');
var hdfsRouter = require('./routes/hdfs');
var yarnRouter = require('./routes/yarn');
var zooRouter = require('./routes/zoo');


var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

mongoose.set('useCreateIndex', true)
mongoose.connect(dbconfig.meta_collection, { useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function (callback) {
  console.log('mongo db connected..')
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "abc", resave:true, saveUninitialized: false}));
app.use(passport.initialize())
app.use(passport.session())
passportPolicy.service()

// default
app.use('/', indexRouter);
app.use('/admin', adminRouter)
app.use('/client', clientRouter);
app.use('/client_main',clientmainRouter);

app.use('/app_status', appstatusRouter);
app.use('/cluster', clusterRouter);
app.use('/hdfs', hdfsRouter);
app.use('/yarn', yarnRouter);
app.use('/zoo', zooRouter);

app.use('/login',loginRouter);
app.use('/register',registerRouter);

//admin page
app.use('/saveApp', adminRouter)
app.use('/appList', adminRouter)
app.use('/appData', adminRouter)
app.use('/delApp',adminRouter)

//client page 
app.use('/dataUpload', clientRouter)
app.use('/dataDelete', clientRouter)
app.use('/makeList', clientRouter)
app.use('/makeParamaterBlank', clientRouter)
app.use('/yarnAllState', clientRouter)
app.use('/appState', clientRouter)
app.use('/clientYarnAll', clientRouter)

//login route
app.use('/service', indexRouter);
app.use('/register', indexRouter)
app.use('/profile', indexRouter)
app.use('/logout',indexRouter)

//css&js
app.use('/css', express.static(__dirname +'/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname +'/node_modules/bootstrap/dist/js'));
app.use('/img', express.static(__dirname +'/node_modules/bootstrap/dist/img'));
app.use('/fonts', express.static(__dirname +'/node_modules/bootstrap/dist/fonts'));

app.use('/vendor', express.static(__dirname +'/node_modules/bootstrap/vendor'));
app.use('/data', express.static(__dirname +'/node_modules/bootstrap/data'));
app.use('/dist', express.static(__dirname +'/node_modules/bootstrap/dist'));
app.use('/scss', express.static(__dirname +'/node_modules/bootstrap/scss'));

app.use('/slack', clientRouter)
app.use('/slacklist', clientRouter)

app.use('/slackTest',indexRouter)
app.use('/schema', indexRouter)
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
  res.render('error');
});
app.listen(process.env.PORT || 3000, function() {
	console.log("server running")
})
module.exports = app;

