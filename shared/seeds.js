var model = require('./model');

var user = model.factory('User');

user.p({
  name: 'sqrh',
  email: 'sqrh@sqrh.net',
  password: '123456',
  studentId: '1000010438',
  energy: 100
});


user.save(function (err){
  if (err) {
    console.log(user.errors);
  }
});
