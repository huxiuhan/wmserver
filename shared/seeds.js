var model = require('./model');
var areas = require('./areas');
var missions = require('./missions');

var user = model.factory('User');

for (var x = 1; x <= 5; x++) {
  for (var y = 1; y <= 5; y++) {
    var point = model.factory('Point');
    point.p('x', x);
    point.p('y', y);
    point.save(function(err) { console.log(err);});
  }
}

for (i in areas) {
  var area = model.factory('Area');
  area.p('name',areas[i].name);
  for (j in areas[i].points) {
    var  point = model.factory('Point');
    var p = areas[i].points[j];
    point.find({x: p.x, y: p.y}, function(err,ids) {
      point.load(ids[0], function(err, props){
        area.link(this);
      });
    });
  }
  area.save(function(err,is_link_err,l){
    if (!err) {
      console.log(areas[i].name);
    }
  });
}
