// node_modules
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const createErrors = require('http-errors');
const {upload} = require('./modules/multer-conn');
const session = require('express-session');

// modules
const logger = require('./modules/morgan-conn');
const {pool} = require('./modules/mysql-conn');
const boardRouter = require('./routes/board');
const galleryRouter = require('./routes/gallery');
const userRouter = require('./routes/user');

// server
app.listen(process.env.PORT, () => {console.log(`http://127.0.0.1:${process.env.PORT}`)});

// Initialize
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
app.locals.pretty = true;

// middleware
app.use(logger);
/* app.use((req, res, next) => {
  express.json()(req,res,next);
}); 
app.use(express.json()); -> 위와 같음
*/
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: process.env.SESSION_SALT,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


// router
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/storage', express.static(path.join(__dirname, './uploads')));
app.use('/board', boardRouter);
app.use('/gallery', galleryRouter);
app.use('/user', userRouter);
/* 
  서버가 다운됬을경우를 만들어본것
  app.get('/err', (req,res,next) => {
  const err = new Error();
  next(err);
}); */

app.get('/test/upload', (req,res,next) => {
  res.render('test/upload');
});

app.post('/test/save', upload.single('upfile'), (req,res,next) => {
  // const {title, upfile} = req.body;
  // res.redirect('/board');
  // res.json(req.allowUpload);
  res.json(req.file);
});

// 예외처리
app.use((req,res,next) => {
  next(createErrors(404, '요청하신 페이지를 찾을 수 없습니다.'));
});

app.use((err, req, res, next) => {
  let code = err.status || 500;
  let message = err.status == 404 ? "페이지를 찾을 수 없습니다." : '서버 내부 오류입니다. 관리자에게 문의하세요.';
  let msg = process.env.SERVICE != 'production' ? err.message || message : message;
  res.render('./error.pug', {code, msg});
});