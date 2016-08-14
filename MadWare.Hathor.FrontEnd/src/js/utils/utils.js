import md5 from 'js-md5';

const generateRandomString = function (length, chars = '#aA') {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

const generateRandomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createSignature = function( baseString, signingKey ){
  let hash = md5.create();
  hash.update(baseString);
  hash.update(signingKey);

  return hash.hex();
}

export {
  generateRandomString,
  generateRandomNumber,
  createSignature }
