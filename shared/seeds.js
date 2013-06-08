var model = require('./model');
var areas_info = require('./areas');
var missions_info = require('./missions');
var Point = model.model('Point');
var Area = model.model('Area');
var points = [];

var w = 320, h = 226;

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


for (var x = 0; x <= w; x++) {
  for (var y = 0; y <= h; y++) {
    var p = new Point({x: x, y: y});
    points.push(p);
    console.log(x+','+y);
  }
}


for (ai in areas_info) {
  var a = areas_info[ai];
  var area = new Area({name:a.name});
  for (pi in a.points) {
    var p = a.points[pi];
    var pti = findOneBy(points, p);
    area.pointsId.push(points[pti]._id);
  }
  area.save(function (err) {
    for (pi in a.points) {
      var p = a.points[pi];
      var pti = findOneBy(points, p);
      points[pti].areaId = area._id;
    }
  });
}

function complete() {

  if (!points.length) return;
  var p = points.shift();
  console.log('s'+points.length);
  p.save(complete);
}

complete();
