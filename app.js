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
const passportPolicy = require('./policies/AuthencationServices');
const favicon = require('express-favicon');

//mongoDB 설정 파일
const dbconfig = require('./config/database');

//index, admin , client 라우트 파일
const indexRouter = require('./routes/index');
const clientRouter = require('./routes/client');
const adminRouter = require('./routes/admin');
//page 라우트 파일
const pagesRouter = require('./routes/pages');

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

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')))
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')))
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "abc", resave:true, saveUninitialized: false}));
app.use(passport.initialize())
app.use(passport.session())
passportPolicy.service()

// /index hosting
app.use('/', indexRouter);
// /admin hosting
app.use('/admin', adminRouter)
// /client hosting
app.use('/client', clientRouter);
// pages
app.use('/pages', pagesRouter)
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
//result save and load
app.use('/resultSave', clientRouter)
app.use('/resultLoad', clientRouter)
//yarn 전체 상태
app.use('/yarnAllState', clientRouter)
//yarn 상세 데이터
app.use('/appState', clientRouter)
//login router
//app.use('/service', indexRouter);
app.use('/register', indexRouter)
//로그인시 로그인 유무 판단
app.use('/profile', indexRouter)
//로그아웃
app.use('/logout',indexRouter)
//code stub download
app.get('/download/:fileName',adminRouter)
// api document
app.get('/apiDoc/',adminRouter)

//css&js&data
app.use('/bootstrap', express.static(__dirname +'/node_modules/bootstrap'));
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

