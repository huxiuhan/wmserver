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
  var u_id = session.get('u_id');
  var User = model.model('User');
  User.findById(u_id, function(err,u){
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
        var u_id = user._id;

        session.set('u_id', u_id);
        session.on('closed', onUserLeave.bind(null, app));
        session.pushAll();
        user.isOnline = true;
        user.save(function(err) {
          next(null, {code: 200, userId: user._id});
        });
      }
    }
  });
}

handler.logout = function(msg, session, next) {
  var app = this.app;
  var User = model.model('User');
  u_id = session.get('u_id');
  User.findById(u_id, function(err, user){
    user.isOnline = false;
    user.save(function(err) {
      //console.log(err);
      session.set('u_id', null);
      session.pushAll();
      next(null, {code: 200, msg:user.email+":is leaving"});
    });
  });

}
