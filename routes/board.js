const express = require('express');
const moment = require('moment');
const path = require('path');
const router = express.Router();
const {pool} = require('../modules/mysql-conn');
const {alert} = require('../modules/util');
const {upload, imgExt} = require('../modules/multer-conn');

router.get(['/', '/list'], async (req,res,next) => {
  const pug = {
    title: '게시판 리스트',
    js: 'board',
    css: 'board'
  };
  try {
    const sql = 'SELECT * FROM board ORDER BY id DESC';
    const connect = await pool.getConnection();
    const rs = await connect.query(sql);
    pug.lists = rs[0];
    pug.lists.forEach((v) => {
      v.wdate = moment(v.wdate).format('YYYY-MM-DD');
    });
    connect.release();
    res.render('./board/list.pug', pug);
  }catch(e) {
    next(e);
  }
});

router.get('/write', (req,res,next) => {
  const pug = {
    title: '게시판 리스트',
    js: 'board',
    css: 'board'
  };
  res.render('./board/write.pug', pug);
});

router.post('/save', upload.single('upfile'), async (req,res,next) => {
  const {title, content, writer} = req.body;
  var values = [title,content,writer];
  var sql = 'INSERT INTO board SET title=?, content=?, writer=?';

  if(req.allowUpload) {
    if(req.allowUpload.allow){
      sql += ', savefile=?, realfile=?';
      values.push(req.file.filename);
      values.push(req.file.originalname);
    }else{
      res.send(alert(`${req.allowUpload.ext}은(는) 업로드 할 수 없습니다.`, '/board'));
    }
  }else{

  }

  try{
    const connect = await pool.getConnection();
    const rs = await connect.query(sql, values);
    connect.release();
    // res.json(rs);
    res.redirect('/board');
  }
  catch(err){
    next(err);
  }

});

router.get('/view/:id', async (req, res, next) => {
  try{
    const pug = {
      title: '게시판 상세보기',
      js: 'board',
      css: 'board'
    };
    const sql = "SELECT * FROM board WHERE id=?";
    const values = [req.params.id];
    const connect = await pool.getConnection();
    const rs = await connect.query(sql, values);
    pug.list = rs[0][0];
    pug.list.wdate = moment(pug.list.wdate).format('YYYY-MM-DD HH:mm:ss');
    if(pug.list.savefile){
      var ext = path.extname(pug.list.savefile).toLowerCase().replace(".", "");
      if(imgExt.indexOf(ext) > -1){
        pug.list.imgSrc = `/storage/${pug.list.savefile.substr(0, 6)}/${pug.list.savefile}`;
      }
      pug.list.download = `/storage/${pug.list.savefile.substr(0, 6)}/${pug.list.savefile}`;
    };
    connect.release();
    res.render('./board/view.pug', pug);
  }catch(e) {
    next(e);
  }
});

router.get('/delete/:id', async (req, res, next) => {
  try{
    const sql = "DELETE FROM board WHERE id=?";
    const values = [req.params.id];
    const connect = await pool.getConnection();
    const rs = await connect.query(sql, values);
    connect.release();
    res.send(alert('삭제되었습니다.', '/board'));
  }catch(e){
    next(e);
  }
});

router.get('/update/:id', async (req,res,next) => {
  try{
    const pug = {
      title: '게시글 수정',
      js: 'board',
      css: 'board'
    };
    const sql = "SELECT * FROM board WHERE id=?";
    const values = [req.params.id];
    const connect = await pool.getConnection();
    const rs = await connect.query(sql, values);
    pug.list = rs[0][0];
    connect.release();
    res.render('./board/write.pug', pug);
  }catch(e) {
    next(e);
  }
});

router.post('/saveUpdate', async (req,res,next) => {
  const {id ,title, content, writer} = req.body;
  try{
    const sql = "UPDATE board SET title=?, content=?, writer=? WHERE id=?";
    const values = [title,content,writer,id];
    const connect = await pool.getConnection();
    const rs = await connect.query(sql, values);
    connect.release();
    if(rs[0].affectedRows == 1) res.send(alert('수정되었습니다','/board'));
    else res.send(alert('수정이 실패하였습니다.','/board'));
  }
  catch(e){
    next(e);
  }

});

module.exports = router;