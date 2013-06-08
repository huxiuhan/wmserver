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

handler.battle = function(msg, session, next) {
  var meid = session.get('uid');
  console.log(meid);
  var enermyid = msg.fights.enermyId ;
  console.log(enermyid);

  var meenergy ;
  var enermyenergy ;

  User.findById(meid, function(err,u){
    meenergy = u.energy ;
    if(err){
      console.log("find wr");
    }
    else{
      User.findById(enermyid, function(err,u){
        if(err){
          console.log("find wr");
        }
        else{
          enermyenergy = u.energy
          var tmp = Math.floor(Math.random()*20-9);
          var result = meenergy - enermyenergy + tmp ;
          console.log(result);
          if(tmp < 0)
             next(null, {
              msg: 'me:' + meenergy + '\n he:' + enermyenergy + 
                    '\n random:' + tmp + '\n result:' + result + 
                    '\n so u lose'
            });
          else
            next(null, {
              msg: 'me:' + meenergy + '\n he:' + enermyenergy + 
                    '\n random:' + tmp + '\n result:' + result + 
                    '\n so u win'
            });
        }
      });
    }
  })
};

