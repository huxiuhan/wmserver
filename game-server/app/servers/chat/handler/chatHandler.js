var chatRemote = require('../remote/chatRemote');
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

/**
 * Send messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
handler.sendMsg = function(msg, session,next) {
	var rid = session.get('rid');
	var username = session.uid.split('*')[0];
	var channelService = this.app.get('channelService');
	var param = {
		route: 'onMsg',
		msg: msg.msg,
		from: username,
		to: msg.to
	};
  console.log(msg);
  console.log(rid);
	channel = channelService.getChannel(rid, false);

	//the target is all users
	if(msg.to == '*') {
		channel.pushMessage(param);
    console.log(param);
	}
	//the target is specific user
	else {
		var tuid = msg.to + '*' + rid;
		var tsid = channel.getMember(tuid)['sid'];
		channelService.pushMessageByUids(param, [{
			uid: tuid,
			sid: tsid
		}]);
	}
	next(null, {
		msg: username
	});

//  console.log('123');
}

//friends handler
handler.getFriendsList = function(msg, session, next) {
	var uid = session.get('u_id');

	User.findById(uid, function(err, u){
        if(err){
        	console.log('find wr');
        	next(null,{
        		code: 500
        	});
        }
        else{
          var friends = [];
          var complete = function(err, friend) {
            if (err) {
              console.log(err);
              next(null, {
                code :505
              });

            }
            if (friend!=null) friends.push(friend);
            if (!u.friendsId.length) {
              next(null,{
                code: 200,
                friends: friends
              });
              return;
            }
            var fid = u.friendsId.shift();
            User.findById(fid, complete);
          }
          complete(null,null);
        }
      });
}

handler.newFriendRequest = function(msg, session, next) {
	var uid = session.get('u_id');
	var friend_name = msg.friendname ;
//	console.log(friend_name);

	User.findOne({name: friend_name}, function(err, friend) {
	if(err){
	  console.log("find wr");
	  next(null,{
	  	code: 500
	  });
	}
	else{
//		console.log(friend);
		var f_id = friend._id ;
	  	User.findById(uid, function(err, u){
	    	u.friendsId.push(f_id);
	    	u.save(function(err){
	    		if(err){
	    			console.log('save error');
	    			next(null,{
	    				code: 500 
	    			});
	    		}
	    		else{
	    			next(null,{
	    				code: 200,
	    				msg: 'add friend ' + f_id + ' sucsess'
	    			});
	    		}
	    	});
	    });
	  }
	});
}

handler.acceptFriendRequest = function(msg, session, next) {

}
