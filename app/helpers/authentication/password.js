const crypto = require('crypto');

const SALT_LEN = 64;
const ITERATIONS = 10000;
const LEN = 256;
const DIGEST = 'sha256';

exports.encrypt = password =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SALT_LEN).toString('base64');

    crypto.pbkdf2(password, salt, ITERATIONS, LEN, DIGEST, (err, key) => {
      if (err) {
        reject(new Error(err));
      }

      resolve({ salt, hash: key.toString('hex') });
    });
  });

exports.validate = (hash, salt, password) =>
  new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, LEN, DIGEST, (err, key) => {
      if (err) {
        reject(new Error(err));
      }

      resolve(hash === key.toString('hex'));
    });
  });
