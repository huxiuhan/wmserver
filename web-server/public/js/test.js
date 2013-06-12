/*
 * Connection params
 */

var pomelo = window.pomelo;
var host = "121.199.19.146";
var port = "10000";

var routes = {
  signup: "connector.authHandler.signup",
  login: "connector.authHandler.login",
  getMissions: "area.areaHandler.getMissions", 
  completeMission: "area.areaHandler.completeMission" 
};


/*
 * WM testing framework
 */

var specs = {};

var logString;
var statuses;
var totalCount;
var passedCount;
var finishedCount;


var logHtml = function(msg) {
  logString += msg + '\n';
  $("#testlog").html(logString);
};

var log = function(msg) {
  logHtml('<p>' + msg + '</p>');
};

var logSuccess = function(msg) {
  logHtml('<p class="success">' + msg + '</p>');
};

var logFail = function(msg) {
  logHtml('<p class="fail">' + msg + '</p>');
};

var runTests = function() {
  prepare();
  log("[*]Tests begin");

  var timer = 500;

  for (var specKey in specs) {
    if (specs.hasOwnProperty(specKey)) {
      var spec = specs[specKey];
      statuses[specKey] = "passed";
      totalCount++;
      setTimeout('specs.' + specKey + '()', timer);
      timer += 500;
    }
  }
};

var prepare = function() {
  passedCount = 0;
  finishedCount = 0;
  totalCount = 0;
  statuses = [];
  logString = "";

  log("[*]Initializing pomelo...");

  pomelo.init({
    host: host,
    port: port,
    log: true
  }, function() {
    log("[*]Connection established.");
  });
};

var pass = function(name) {
  if (statuses[name] == "failed") {
    return;
  }

  logSuccess("[+]Test " + name + " has passed.");
  statuses[name] = "passed";
  passedCount++;
  finishedCount++;

  if (finishedCount == totalCount) {
    log("[*]Test finish, " + passedCount + " of " + totalCount + " tests passed.");
    pomelo.disconnect();
  }
};

var fail = function(name) {
  logFail("[-]Test " + name + " has failed.");
  statuses[name] = "failed";
  finishedCount++;

  if (finishedCount == totalCount) {
    log("[*]Test finish, " + passedCount + " of " + totalCount + " tests passed.");
    pomelo.disconnect();
  }
};

var assertEqual = function(expr, correct, name) {
  if (expr != correct)
    fail(name);
};


/*
 * Specs
 *
 * db.users.remove({name:'test'}) is needed before running the test
 *
 */

specs.signupWithBadFields = function() {
  var msg = {
    user: {
      email: "example@test.com",
      name: "test",
      password: "foobar",
      studentId: ""
    }
  };

  pomelo.request(routes.signup, msg, function(res) {
    assertEqual(res.code, 501, 'signupWithBadFields');
    assertEqual(res.error.errors.studentId.name, 'ValidatorError', 'signupWithBadFields');
    pass('signupWithBadFields');
  });
};

specs.signupWithCorrectFields = function() {
  var msg = {
    user: {
      email: "example@test.com",
      name: "test",
      password: "foobar",
      studentId: "15432"
    }
  };

  pomelo.request(routes.signup, msg, function(res) {
    assertEqual(res.code, 200, 'signupWithCorrectFields');
    pass('signupWithCorrectFields');
  });
};

specs.signupWithDuplicatedName = function() {
  var msg = {
    user: {
      email: "example@test.com",
      name: "test",
      password: "foobar",
      studentId: "15432"
    }
  };

  pomelo.request(routes.signup, msg, function(res) {
    assertEqual(res.code, 501, 'signupWithDuplicatedName');
    assertEqual(res.error.code, 11000, 'signupWithDuplicatedName');
    pass('signupWithDuplicatedName');
  });
};

specs.loginWithIncorrectInformation = function() {
  var msg = {
    user: {
      email: "example@test.com",
      password: "wrong_password"
    }
  };

  pomelo.request(routes.login, msg, function(res) {
    assertEqual(res.code, 503, 'loginWithIncorrectInformation');
    pass('loginWithIncorrectInformation');
  });
};

specs.loginWithCorrectInformation = function() {
  var msg = {
    user: {
      email: "example@test.com",
      password: "foobar"
    }
  };

  pomelo.request(routes.login, msg, function(res) {
    assertEqual(res.code, 200, 'loginWithCorrectInformation');
    assertEqual(res.user.name, 'test', 'loginWithCorrectInformation');
    pass('loginWithCorrectInformation');
  });
};

var missionId;

specs.getMissions = function() {
  pomelo.request(routes.getMissions, {}, function(res) {
    assertEqual(res.code, 200, 'getMissions');
    assertEqual(res.errors, null, 'getMissions');
    missionId = res.missions[0]._id;
    if (res.missions.length > 0) {
      pass('getMissions');
    } else {
      fail('getMissions');
    }
  });
};

specs.completeMission = function() {
  var msg = {
    mission: {
      missionId: missionId
    }
  };
  pomelo.request(routes.completeMission, msg, function(res) {
    assertEqual(res.code, 200, 'completeMission');
    assertEqual(res.missionId, missionId, 'completeMission');
    pass('completeMission');
  });
};

