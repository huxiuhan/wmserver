var model = require('./model');
var areas_info = require('./areas');
var missions_info = require('./missions');
var Point = model.model('Point');
var Area = model.model('Area');
var points = [];

var n = 100;

for (var x = 1; x <= 100; x++) {
  for (var y = 1; y <= 100; y++) {
    var p = new Point({x: x, y: y});
    points.push(p);
    console.log((x-1)*100+y);
  }
}


for (ai in areas_info) {
  var a = areas_info[ai];
  var area = new Area({name:a.name});
  area.save();
  for (pi in a.points) {
    var p = a.points[pi];
    var pt = points[(p.x-1)*1000+p.y];
    pt.areaId = area._id;
    area.pointsId.push(pt._id);
  }
  area.save();
}

function complete() {

  if (!points.length) return;
  var p = points.shift();
  console.log('s'+points.length);
  p.save(complete);
}

complete();
