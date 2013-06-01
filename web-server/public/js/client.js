var pomelo = window.pomelo;
var host = "127.0.0.1";
var port = "3010";




function queryEntry(username, callback) {
  var route = 'gate.gateHandler.queryEntry';
  pomelo.init({
    host: window.location.hostname,
    port: 3014,
    log: true
  }, function() {
    pomelo.request(route, {
      username: username
    }, function(data) {
      pomelo.disconnect();
      if(data.code === 500) {
        console.log('LOGIN_ERROR 500');
        return;
      }
      callback(data.host, data.port);
    });
  });
};


function doNothing(host, port) {
  console.log(host, port);
}

var auser = {
    name: 'sqrh',
    email: 'sqrh@sqrh.net',
    password: '123456',
    studentId: '1000010438',
    energy: 100
  };

function registrate(host, port) {
  console.log(host, port);
  var route = "auth.authHandler.registration";
  pomelo.init({
    host: host,
    port: port,
    log: true
  }, function() {
  pomelo.request(route, {user: auser}, function(data) {
      if (data.error) {
        console.log("errors:", data.errors);
      } else {
        alert(data.msg);
      }
    });
  });
}


function test(){
  queryEntry('sqrh', registrate);
  //registrate('127.0.0.1',3014);
}
