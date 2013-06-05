var config = require('./config');
var nohm = require('nohm').Nohm;
var utils = require('./utils');
var redisClient = require('redis').createClient();


nohm.setPrefix(config.REDIS_PREFIX);

nohm.model('User', {
  properties: {
    name: {
      type: 'string',
      unique: true,
      validations: [
        ['notEmpty']
      ]
    },
    email: {
      type: 'string',
      unique: true,
      validations: [
        ['notEmpty'],
        ['email']
      ]
    },
    password: {
      defaultValue: '',
      type: utils.hashedPassword,
      validations: [
        ['length', {
          min: 6
        }]
      ]
    },
    studentId: {
      defaultValue: 888,
      unique: true,
      type: 'integer',
      validations: [
        ['notEmpty']
      ]
    },
    energy: {
      defaultValue: 0,
      type: 'integer',
      validations: [
        ['notEmpty']
      ]
    },
    isOnline: {
      defaultValue: false,
      type: 'boolean'
    }
  },
  idGenerator: 'increment'
});

nohm.model('Area', {
  properties: {
    name: {
      type: 'string',
      unique: true,
      validations: [
        ['notEmpty']
      ]
    }
  },
  idGenerator: 'increment'
});

nohm.model('Point', {
  properties: {
    x: {
      type: 'integer',
      validations: [
        ['notEmpty']
      ]
    },
    y: {
      type: 'integer',
      validations: [
        ['notEmpty']
      ]
    },   
  },
  idGenerator: 'increment'
});



nohm.setClient(redisClient);

module.exports = nohm;
