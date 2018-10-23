const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport');
const passportPolicy = require('./policies/AuthencationServices')

//mongoDB 설정 파일
const dbconfig = require('./config/database');

//index, admin , client 라우트 파일
const indexRouter = require('./routes/index');
const clientRouter = require('./routes/client');
const adminRouter = require('./routes/admin');

//page 라우트 파일
const clientmainRouter = require('./routes/client_main');
const developermainRouter = require('./routes/developer_main');
const appstatusRouter = require('./routes/app_status');
const clusterRouter = require('./routes/cluster');
const hdfsRouter = require('./routes/hdfs');
const yarnRouter = require('./routes/yarn');
const zooRouter = require('./routes/zoo');
const historyRouter = require('./routes/history')

//member 라우트 파일
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

//mongoDB 설정
mongoose.set('useCreateIndex', true)
mongoose.connect(dbconfig.meta_collection, { useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function (callback) {
  console.log('mongo db connected..')
})

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages/'));
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
// /index hosting
app.use('/', indexRouter);
// /admin hosting
app.use('/admin', adminRouter)
// /client hosting
app.use('/client', clientRouter);

//user pages hosting
app.use('/client_main',clientmainRouter);
app.use('/developer_main',developermainRouter);
app.use('/app_status', appstatusRouter);
app.use('/cluster', clusterRouter);
app.use('/hdfs', hdfsRouter);
app.use('/yarn', yarnRouter);
app.use('/zoo', zooRouter);
app.use('/history', historyRouter);

//member ages hosting
app.use('/login',loginRouter);
app.use('/register',registerRouter);

//admin router
//spark 앱 저장
app.use('/saveApp', adminRouter)
//spark 앱 리스트
app.use('/appList', adminRouter)
//spark 앱 상세 데이터
app.use('/appData', adminRouter)
//spark 앱 삭제
app.use('/delApp',adminRouter)

//HDFS에 Data 파일을 업로드
app.use('/dataUpload', clientRouter)
//HDFS에 업로드된 Data 파일 삭제
app.use('/dataDelete', clientRouter)
//HDFS에 업로드된 Data 파일 List를 받는다.
app.use('/makeList', clientRouter)
//App 선택시 해당 App에서 필요한 Parameter를 입력하는 빈칸을 생성
app.use('/makeParamaterBlank', clientRouter)

//yarn 전체 상태
app.use('/yarnAllState', clientRouter)
//yarn 상세 데이터
app.use('/appState', clientRouter)

//login router
app.use('/service', indexRouter);
app.use('/register', indexRouter)
//로그인시 로그인 유무 판단
app.use('/profile', indexRouter)
//로그아웃
app.use('/logout',indexRouter)

//css&js&data
app.use('/css', express.static(__dirname +'/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname +'/node_modules/bootstrap/dist/js'));
app.use('/img', express.static(__dirname +'/node_modules/bootstrap/dist/img'));
app.use('/fonts', express.static(__dirname +'/node_modules/bootstrap/dist/fonts'));
app.use('/vendor', express.static(__dirname +'/node_modules/bootstrap/vendor'));
app.use('/data', express.static(__dirname +'/node_modules/bootstrap/data'));
app.use('/dist', express.static(__dirname +'/node_modules/bootstrap/dist'));
app.use('/scss', express.static(__dirname +'/node_modules/bootstrap/scss'));

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
const SparkPolicy = require('./policies/SparkPolicy')
app.listen(process.env.PORT || 3000,function() {
  SparkPolicy.startCount()
	console.log("server running")
})
module.exports = app;

