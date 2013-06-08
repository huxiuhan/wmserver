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
var Misson = model.model('Mission');
var Finished = model.model('Finished');


handler.completeMission = function(msg, session, next) {
  var uid = session.get('uid');
  var missionId = msg.mission.missionId ;

  Misson.findById(missionId, function(err, mission) {
    if(err){
      console.log("find wr");
    }
    else{
      var bonus = mission.bonus ;
      User.findById(uid, function(err, u){
        u.energy += bonus ;
        u.finishedMissionsId.push(missionId);
        u.save(function(err){
          if(err){
            console.log("save wr");
          }
          else{
            next(null, {
              msg: 'finished mission' + missionId 
                    +'! now energy =' + u.energy ,
              code: 200
            });
          }
        }
      });
    }
  });
}

handler.getMission = function(msg, session, next) {
  var uid = session.get('uid');
  
  User.findById(uid, function(err, u){
    if(err){
      console.log("find wr !") ;
    }
    else{
      var finished = u.finishedMissionsId ;
      var unfinished ;
      int i , j ;
      Mission.find({}, function(err, all){
        for(i = 0 ; i < all.length ; i++){
          for(j = 0 ; j < finished.length ; j++){
            if(all[i]._id == finished[j])
              break ;
          }
          if(j == finished.length)
            unfinished.push(all[i]);
        }
        next(null, {
              msg: unfinished ,
              code: 200
            });
      });
    }
  });
}
