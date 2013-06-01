var model = require('../../../../../shared/model');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;

handler.registration = function(msg, session, next) {
  var user = model.factory('User');

  user.p(msg.user);


  user.save(function (err){
    if (err) {
      console.log(user.errors);
      next(null, {
        errors: user.errors,
        error: true
      });
    } else {
      next(null, {
        msg: 'registration ok!'
      });
    }
  });
};
