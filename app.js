// node_modules
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// modules
const {pool} = require('./modules/mysql-conn');
const boardRouter = require('./routes/board');
const galleryRouter = require('./routes/gallery');

// server
app.listen(process.env.PORT, () => {console.log(`http://127.0.0.1:${process.env.PORT}`)});

// Initialize
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
app.locals.pretty = true;

// moddleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// router
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/board', boardRouter);
app.use('/gallery', galleryRouter);
/* 
  서버가 다운됬을경우를 만들어본것
  app.get('/err', (req,res,next) => {
  const err = new Error();
  next(err);
}); */

// 예외처리
app.use((req,res,next) => {
  const err = new Error();
  err.code = 404;
  err.msg = '요청하신 페이지를 찾을 수 없습니다.';
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  const code = err.code || 500;
  const msg = err.msg || '서버 내부 오류입니다. 관리자에게 문의하세요.';
  res.render('./error.pug', {code, msg});
});