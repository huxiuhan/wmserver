var crypto = require('crypto');

module.exports = {
    hashedPassword: function (value) {
    var md5sum = crypto.createHash('md5');
    return md5sum.update(value + 'wmsalt').digest('hex'); // 
  }
};
