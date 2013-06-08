var config = require('./config');
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/wmserver');
var utils = require('./utils');




var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


var UserSchema = new Schema({
  name: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  passwordHashed: { type: String, required: true},
  studentId: { type: Number, required:true, unique: true },
  energy: { type: Number },
  isOnline: { type: Boolean },
  pointId: { type: ObjectId }
});

UserSchema.virtual('password').set(function(password){
  this.passwordHashed = utils.passwordHashed(password);
});

var AreaSchema = new Schema({
  name: { type: String },
  pointsId: [ObjectId]
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
