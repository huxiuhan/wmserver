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
var Mission = model.model('Mission');
var Area = model.model('Area');
var Point = model.model('Point');

handler.battle = function(msg, session, next) {
  var meid = session.get('u_id');
//  console.log(meid);
  var enermyid = msg.fights.enermyId ;
//  console.log(enermyid);

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
      //    console.log(result);
          if(result < 0)
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

handler.battleArea = function(msg, session, next) {
  var meid = session.get('u_id');
//  console.log(meid);
  var areaid = msg.fights.areaId ;
//  console.log(enermyid);

  Area.findById(areaid, function(err,area){
    if(err){
      console.log("find wr");
      next(null,{
        code:500
      });
    }
    else{
    //  console.log(area);
      User.findById(meid,function(err,u){
        if(err){
          console.log('find wr');
          next(null,{
            code:500
          });
        }
        else{
          var meenergy = u.energy;
          if(!area.ownerId){
            area.ownerId = u._id ;
            console.log(u._id);
            area.save(function(err){
              if(err){
                console.log('save wr');
                next(null,{
                  code:500,
                });
              }
              else{
                next(null,{
                  code:200,
                  msg: 'Empty area. \nAnd now it belongs to ' + u._id
                });
              }
            });
          }
          else{
            User.findById(area.ownerId,function(err,u0){
              if(err){
                console.log('find wr');
                next(null,{
                  code:500
                });
              }
              else{
                var areaenergy = u0.energy;
                var tmp = Math.floor(Math.random()*20-9);
                var result = meenergy - areaenergy + tmp ;
                if(result < 0){
                  next(null,{
                    msg:'u lose ' + '\nowner: ' + u.name + ' win'
                  });
                }
                else{
                  area.ownerId = u._id ;
                  area.save(function(err){
                    if(err){
                      console.log('save wr');
                      next(null,{
                        code:500
                      });
                    }
                    else{
                      next(null,{
                        code:200,
                        msg:'u win'+ '\nold owner ' + u.name +' lose \nnow area owner '+meid
                      }); 
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  })
}

handler.completeMission = function(msg, session, next) {
  var u_id = session.get('u_id');
  //注意，这里验证是否登录！
  if (!u_id) {
    next(null, {code: 500, msg: 'not login!'});
    return;
  }
  var missionId = msg.mission.missionId ;

  Mission.findById(missionId, function(err, mission) {
    if(err){
      console.log("find wr");
    }
    else{
      var bonus = mission.bonus ;
      User.findById(u_id, function(err, u){
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
        });
      });
    }
  });
}

handler.getMissions = function(msg, session, next) {
  var u_id = session.get('u_id');
  //注意，这里验证是否登录！
  if (!u_id) {
    next(null, {code: 500, msg: 'not login!'});
    return;
  }
  
  User.findById(u_id, function(err, u){
    if(err){
      console.log("find wr !") ;
    }
    else{
//      console.log(typeof(u.finishedMissionsId));
//      console.log(u.finishedMissionsId.toString());
      var finished = u.finishedMissionsId ;
      console.log('finished  ' + finished) ;
      var unfinished = [];
      var i , j ;
      Mission.find({}, function(err, all){
        for(i = 0 ; i < all.length ; i++){
          for(j = 0 ; j < finished.length ; j++){
 //           console.log('i  ' + i + '  '  + all[i]._id );
 //           console.log('j  ' + j + '  '  +finished[j] );
            if(all[i]._id.toString() == finished[j].toString())
            {
              //console.log('break' + j)
              break ;
            }
          }
 //         console.log('wai ' + j)
          if(j == finished.length)
          {
 //           console.log(j);
            unfinished.push(all[i]);
          }
        }
        next(null, {
              msg: unfinished ,
              code: 200
            });
      });
    }
  });
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
      Point.find({areaId: a._id},'x y', complete);
    }
    complete(null,null);
  });
}


handler.getAllMissions = function(msg, session, next) {
  Mission.find({},function(err, missions){
    next(null, {
      missions: missions,
      code: 200
    });
  });
}
