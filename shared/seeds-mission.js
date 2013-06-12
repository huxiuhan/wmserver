var model = require('./model');
var missions_info = require('./missions');
var Mission = model.model('Mission');
var Area = model.model('Area');
var User = model.model('User');

var mission = missions_info[0];
Area.findOne({name: mission.name},function(err , area){
  var m = new Mission({name: mission.name});
  m.description = mission.description;
  m.bonus = mission.bonus;
  m.areaId = area._id;
  console.log(m);
  m.save();
});

var mission1 = missions_info[1];
Area.findOne({name: mission1.name},function(err , area){
  var m1 = new Mission({name: mission1.name});
  m1.description = mission1.description;
  m1.bonus = mission1.bonus;
  m1.areaId = area._id;
  console.log(m1);
  m1.save();
});

var mission2 = missions_info[2];
Area.findOne({name: mission2.name},function(err , area){
  var m2 = new Mission({name: mission2.name});
  m2.description = mission2.description;
  m2.bonus = mission2.bonus;
  m2.areaId = area._id;
  console.log(m2);
  m2.save();
});
/*
User.findOne({name: 'sqrh'},function(err, u){
  var area = new Area({ownerId:u._id});
  console.log(area);
  area.save();
});
*/
