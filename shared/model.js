var config = require('./config');
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/wmserver');
var utils = require('./utils');
var autoinc = require('mongoose-id-autoinc');



var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

autoinc.init(db);

var UserSchema = new Schema({
  name: { type: String },
  email: { type: String },
  passwordHashed: { type: String },
  studentId: { type: Number},
  energy: { type: Number },
  isOnline: { type: Boolean },
  pointId: { type: ObjectId }
});

var AreaSchema = new Schema({
  name: { type: String },
  pointsId: [ObjectId]
});

AreaSchema.plugin(autoinc.plugin, {
  model: 'Area'
});

var PointSchema = new Schema({
  x: Number,
  y: Number,
  areaId: ObjectId
});

db.model('User', UserSchema);
db.model('Area', AreaSchema);
db.model('Point', PointSchema);

module.exports = db;
