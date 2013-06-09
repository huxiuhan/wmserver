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
  pointId: { type: ObjectId },
  finishedMissionsId: [ObjectId]
});

UserSchema.virtual('password').set(function(password){
  this.passwordHashed = utils.passwordHashed(password);
});

var AreaSchema = new Schema({
  name: { type: String },
  pointsId: [ObjectId],
  ownerId: ObjectId
});

var PointSchema = new Schema({
  x: Number,
  y: Number,
  areaId: ObjectId
});

var MissionSchema = new Schema({
  name: { type: String },
  description: { type: String },
  bonus: { type: Number },
  areaId: ObjectId
});

var FeedSchema = new Schema({
  time: { type: Date },
  type: { type: Number },// number stand for type
  content: { type: String },
  destId: ObjectId,
  fromId: ObjectId
});

db.model('User', UserSchema);
db.model('Area', AreaSchema);
db.model('Point', PointSchema);
db.model('Mission', MissionSchema);
db.model('Feed', FeedSchema);

module.exports = db;
