var crypto = require('crypto');

module.exports = {
    passwordHashed: function (value) {
    var md5sum = crypto.createHash('md5');
    return md5sum.update(value + 'wmsalt').digest('hex'); // 
  }
};
