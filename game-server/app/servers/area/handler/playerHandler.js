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
var Point = model.model('Point');

handler.moveTo = function(msg, session, next) {
  var u_id = session.get('u_id');
  User.findById(u_id, function(err, user){
    Point.findOne({x: msg.point.x, y: msg.point.y}, function(err, point){
      user.pointId = point._id;
      user.save(function(){
        console.log('user',user.name,'location updated to',point.x+','+point.y);
        next(null, {
          code: 200,
          areaId: point.areaId
        });
      });
    });
  });
}
