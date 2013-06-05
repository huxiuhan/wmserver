var model = require('../../../../../shared/model');
var utils = require('../../../../../shared/utils');
module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;


handler.moveTo = function(msg, session, next) {
  var app = this.app;
  var user = model.factory('User');
  var point = model.factory('Point');
}
