const multer = require('multer');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const allowExt = ['jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'hwp'];
const imgExt = ['jpg', 'jpeg', 'png', 'gif'];

const makeFolder = () => {
  const result = {err: null};
  const folder = path.join(__dirname, '../uploads', moment().format('YYMMDD'));
  result.folder = folder;
  if(!fs.existsSync(folder)) fs.mkdirSync(folder);
  return result;

/*   if(!fs.existsSync(folder)){
    const err = await fsp.mkdir(folder);
    if(err) result.err = err;
  }else return result; */

/*   if(!fs.existsSync(folder)){
    fs.mkdir(folder, (err) => {
      if(err) result.err = err;
      return result;  // result = { err: null , folder: '경로' };
    });
  }
  else return result; */
};

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  if(allowExt.indexOf(ext) > -1){
    req.allowUpload = {allow: true, ext};
    cb(null, true);
  }
  else {
    req.allowUpload = {allow: false, ext};
    cb(null, false);
  }

};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const result = makeFolder();
    result.err ? cb(err) : cb(null, result.folder);
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname); // aa.jpg에서 -> .jpg라는 확장명만 추출
    let saveName = moment().format('YYMMDD') + '-' + uuidv4() + ext;
    cb(null, saveName);
  }
});

const upload = multer({ storage, fileFilter, limits : {fileSize: 2048000}});

module.exports = { upload, allowExt, imgExt };