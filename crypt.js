// crypt: 단방향 암호화
// cipher: 양방향 암호화
// session: 서버가 가지는 전역변수
// cookie: 클라이언트가 가지는 전역변수
// CORS (Cross Origin Resource Share) - 통신규칙
// proxy - forward proxy
// proxy - reverse proxy

const crypto = require('crypto');
const bcrypt = require('bcrypt');

let password = 'abcd1234';
let salt = 'asfsafgmvFDLSD564++)_S=-sa-=_+';
let hash = crypto.createHash('sha512').update(password+salt).digest('base64');
hash = crypto.createHash('sha512').update(hash).digest('base64');
hash = crypto.createHash('sha512').update(hash).digest('base64');
hash = crypto.createHash('sha512').update(hash).digest('base64');
// console.log(hash);

const cipher = crypto.createCipher('aes-256-cbc', salt);
let result = cipher.update('아버지를 아버지라...', 'utf-8', 'base64');
result += cipher.final('base64');
console.log(result);

let decipher = crypto.createDecipher('aes-256-cbc', salt);
let result2 = decipher.update(result, 'base64', 'utf-8');
result2 += decipher.final('utf-8');
console.log(result2);

async function bcryptTest(){
  let bcryptHash = await bcrypt.hash(password + salt, 8);
  let bcryptHash2 = await bcrypt.hash(password + salt, 8);
  let bcryptCompare = await bcrypt.compare(password, bcryptHash);
  console.log(bcryptHash, bcryptHash2, bcryptCompare);
}

bcryptTest();