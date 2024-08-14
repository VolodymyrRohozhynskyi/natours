const crypto = require('crypto');

const generateCryptoToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = generateCryptoToken;
