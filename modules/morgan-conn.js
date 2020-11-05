const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');

const logStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, '../logs')
}); // access.log라는 파일을 매일매일 logs에 저장되게한다는 의미

const logger = morgan('combined', {stream: logStream});

module.exports = logger;
