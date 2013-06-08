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
  var meid = msg.fights.myselfID ;
  console.log(meid);
  var enermyid = msg.fights.enermyID ;

  var meenergy ;
  var enermyenergy ;

  //qiao
  var user0 = new User();
  user0.load(meid, function (err, properties) {
    if (err) {
      console.log(user0.errors);
      next(null, {
        errors: user0.errors,
        error: true
      });
    } else {
      meenergy = properties.energy;
//      console.log(meenergy);
      
      var user1 = model.factory('User');
      user1.load(enermyid, function (err, properties) {
      if (err) {
        console.log(user1.errors);
        next(null, {
          errors: user1.errors,
          error: true
      });
      } else {
        enermyenergy = properties.energy;
 //       console.log(enermyenergy);
        var tmp = Math.floor(Math.random()*20-9);
        var result = meenergy - enermyenergy + tmp ;
 //       console.log(result);
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
  });
};
