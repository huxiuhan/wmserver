var model = require('./model');
var areas_info = require('./areas');
var missions_info = require('./missions');
var Point = model.model('Point');
var Area = model.model('Area');
var points = [];

var w = 320, h = 226;

var check = function (obj, conditions) {
  for (k in conditions) {
    if (k=='_id') {
      if (!obj[k].equals(conditions[k])) {
        return false;
      }
    } else {
      if (obj[k]!=conditions[k]) {
        return false;
      }
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


var aok_cnt = 0;
for (ai in areas_info) {
  var a = areas_info[ai];
  var area = new Area({name:a.name});
  for (pi in a.points) {
    var p = a.points[pi];
    var pti = findOneBy(points, p);
    area.pointsId.push(points[pti]._id);
  }
  area.save(function (err) {
    aok_cnt++;
    console.log('aok:', aok_cnt);
  });
}
function complete() {
  if (aok_cnt < areas_info.length) {
    setTimeout(complete,500);
    return;
  }
  if (!points.length ) 
  {
    var pa = {};
    Area.find({}, function(err, areas) {
      for (var ai=0; ai < areas.length; ai++) {
        var a = areas[ai];
        console.log(a);
        for (var pi=0; pi < a.pointsId.length; pi++) {
          var pid = a.pointsId[pi];
          pa[pid.toString()] = a._id;
          console.log(pid);
          Point.findById(pid, function(err, point){
            point.areaId = pa[point._id.toString()];
            point.save();
          });
        }
      }
    });

    return;
  }
  var p = points.shift();
  console.log('s'+points.length);
  p.save(complete);
}
complete();
