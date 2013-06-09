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
var Area = model.model('Area');
var Point = model.model('Point');


handler.completeMission = function(msg, session, next) {
  var u_id = session.get('u_id');
  var missionId = msg.mission.missionId ;

  Misson.findById(missionId, function(err, mission) {
    if(err){
      console.log("find wr");
    } else { 
      var bonus = mission.bonus ;
      User.findById(u_id, function(err, u){
        u.energy += bonus ;
        u.finishedMissionsId.push(missionId);
        u.save(function(err){
          if(err){
            console.log("save wr");
          } else {
            next(null, {
              msg: 'finished mission' + missionId 
                    +'! now energy =' + u.energy ,
              code: 200
            });
          }
        });
      });
    }
  });
}

handler.getMission = function(msg, session, next) {
  var u_id = session.get('u_id');
  
  User.findById(u_id, function(err, u){
    if(err){
      console.log("find wr !") ;
    }
    else{
      var finished = u.finishedMissionsId ;
      var unfinished ;
      var i , j ;
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


var check = function (obj, conditions) {
  for (k in conditions) {
    if (obj[k]!=conditions[k]) {
      return false;
    }
  }
  return true;
}
var findOneBy = function(objs, conditions){
  for (i in objs) {
    if (check(objs[i], conditions)) {
      return i;
    }
  }
}



handler.getAreas = function(msg, session, next) {
  Area.find({},function(err, areas){
    var areasd = [];
    for (var i = 0; i<areas.length; i++) {
      areasd.push({areaId: areas[i]._id});
    }
    var i = 0;
    var complete = function(err, points) {
      if (points!=null) areasd[i-1].points = points;
      if (i >= areas.length){
        next(null, {
          code: 200,
          areas: areasd
        });
        return;
      } 
      var a = areas[i];
      i++;
      console.log(points);
      Point.find({areaId: a._id}, complete);
    }
    complete(null,null);
  });
}
