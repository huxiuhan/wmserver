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
/*
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
*/

handler.login = function(msg, session, next) {
  var app = this.app;
  var User = model.model('User');
  /////////////////////////////////////
  var self = this;
  var rid = '1';
  var sessionService = self.app.get('sessionService');
  
  User.findOne({email: msg.user.email}, function(err, user) {
    if (err || user == null) {
      next(null, {code: 502, error:{email: "no such user:"+msg.user.email}});
    } else {
      if (err || user.passwordHashed != utils.passwordHashed(msg.user.password)) {
        next(null, {code: 503, error:{auth: 'can not authorize!'}});
      } else {
        /////////////////////////////////////////////////////////////////
        //add by anbo 2013-6-8
        var u_id = user._id;
        var uid = user.name + '*' + rid;
        if( !! sessionService.getByUid(uid)) {
               next(null, {
                       code: 500,
                       error: true
                });
            return;
        }
        session.bind(uid)
        session.set('rid', rid);
        session.push('rid', function(err) {
            if(err) {
                   console.error('set rid for session service failed! error is : %j', err.stack);
             }
        });
         //session.on('closed', onUserLeave.bind(null, self.app));
         //put user into channel
         self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(uid){
              //next(null, {code: 200, user: uid});
         });


        var u_id = user._id;
        session.set('u_id', u_id);
        //session.on('closed', onUserLeave.bind(null, app));
        session.pushAll();
        user.isOnline = true;
        user.save(function(err) {
          next(null, {code: 200, user:{_id:user._id,name:user.name}});
        });
      }
    }
  });
}

handler.logout = function(msg, session, next) {
    var app = this.app;
     //add by anbo 2013-6-8
    if(!session || !session.uid ){
      return;
    }

    app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);

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





