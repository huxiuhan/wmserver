var model = require('./model');
var areas_info = require('./areas');
var missions_info = require('./missions');
var Point = model.model('Point');
var Area = model.model('Area');
var points = [];

var w = 320, h = 226;

for (var x = 0; x <= w; x++) {
  for (var y = 0; y <= h; y++) {
    var p = new Point({x: x, y: y});
    points.push(p);
    console.log(x*w+y);
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
