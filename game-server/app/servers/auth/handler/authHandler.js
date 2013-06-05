var model = require('../../../../../shared/model');
var utils = require('../../../../../shared/utils');
module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;



handler.signup = function(msg, session, next) {
  var user = model.factory('User');

  user.p(msg.user);
  user.p('energy',100);

  user.save(function (err){
    if (err) {
      console.log(user.errors);
      next(null, {
        errors: user.errors,
        code: 501
      });
    } else {
      next(null, {
        msg: 'registration ok!',
        code: 200
      });
    }
  });
};

var onUserLeave = function (app, session, reason) {
  var uid = session.get('uid');
  var user = model.factory('User');
  user.load(uid, function(err){
    this.p('isOnline', false);
    this.save(function (err){
      console.log(user.p("name")+":is leaving");
    });
  })
};


handler.login = function(msg, session, next) {
  var app = this.app;
  var user = model.factory('User');
  user.find({email: msg.user.email}, function(err, ids) {
    if (err || ids.length === 0) {
      next(null, {code: 502, errors:{email: "no such user:"+msg.user.email}});
    } else {
      user.load(ids[0], function(err, props) {
        var props = this.allProperties();
        var hp = utils.hashedPassword(utils.hashedPassword(msg.user.password));
        if (err || hp != props.password) {
          next(null, {code: 503, errors:{auth: 'can not authorize!', hp:hp, ps: props.password}});
        } else {
          var uid = props.id;
          var token = utils.hashedPassword(uid);
          //console.log('uid:', uid);
          //session.bind(uid,function(err){console.log(err)});
          session.set('uid', uid);
          session.set('token', token);
          session.on('closed', onUserLeave.bind(null, app));
          session.pushAll();
          this.p("isOnline",true);
          this.save(function() {next(null, {code: 200, user: props, token: token});});
        }
      }); 
    }
  });
}
