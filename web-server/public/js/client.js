var pomelo = window.pomelo;
var host = "127.0.0.1";
var port = "3010";
var $ = window.jQuery;



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


function buildObj(formName){
  var $form = $("#"+formName+"-form");
  var obj = {};
  $form.find('input[type!=submit]').each(function(){
    var t = {}; 
    t[this.name] = this.value; 
    $.extend(obj, t); 
  });
  return obj;
}


function signup() {
  //e.preventDefault();
  queryEntry('sqrh', function (host, port) {
  console.log(host, port);
  var route = "auth.authHandler.signup";
  pomelo.init({
    host: host,
    port: port,
    log: true
  }, function() {
    pomelo.request(route, {user: buildObj('signup')}, function(data) {
        if (data.error) {
          console.log("errors:", data.errors);
        } else {
          alert(data.msg);
        }
      });
    });
  });
  return false;
}

$(document).ready(function(){
  $(".view").hide();
  $("#signup-view").show();

})
