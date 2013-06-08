var model = require('../../../../../shared/model');
var utils = require('../../../../../shared/utils');
module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;


var User = model.model('User');

handler.signup = function(msg, session, next) {
  var user = new User(msg.user);

  user.energy = 100;

  user.save(function (err){
    if (err) {
      console.log('user save error!');
      next(null, {
        code: 501,
        error: err
      });
    } else {
      next(null, {
        user: user,
        msg: 'registration ok!',
        code: 200
      });
    }
  });
};

var onUserLeave = function (app, session, reason) {
  var uid = session.get('uid');
  var User = model.model('User');
  user.findById(uid, function(err,u){
    u.isOnline = false;
    u.save(function (err){
      console.log(u.name+":is leaving");
    });
  })
};


handler.login = function(msg, session, next) {
  var app = this.app;
  var User = model.model('User');
  User.findOne({email: msg.user.email}, function(err, user) {
    if (err || user == null) {
      next(null, {code: 502, error:{email: "no such user:"+msg.user.email}});
    } else {
      if (err || user.passwordHashed != utils.passwordHashed(msg.user.password)) {
        next(null, {code: 503, error:{auth: 'can not authorize!'}});
      } else {
        var uid = user._id;
        //var token = utils.hashedPassword(uid);
        //console.log('uid:', uid);
        //session.bind(uid,function(err){console.log(err)});
        session.set('uid', uid);
        session.on('closed', onUserLeave.bind(null, app));
        session.pushAll();
        user.isOnline = true;
        user.save(function(err) {
          next(null, {code: 200, user: user});
        });
      }
    }
  });
}
