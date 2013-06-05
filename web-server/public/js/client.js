var pomelo = window.pomelo;
var host = "127.0.0.1";
var port = "3010";
var userToken = "";
var $ = window.jQuery;


/*
 * Currently we do not use this function
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
*/

function goToView(viewname) {
  $(".view").hide();
  $("#"+viewname+"-view").show();
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
function setVar(varName, val) {
  $("#var-"+varName).html(val);
}

var  signupAction = function() {
  var route = "auth.authHandler.signup";
  pomelo.init({
    host: host,
    port: port,
    log: true
  }, function() {
    pomelo.request(route, {user: buildObj('signup')}, function(data) {
      if (data.code==501) {
        console.log("fields errors:", data.errors);
      } else {
        alert(data.msg);
      }
      pomelo.disconnect();
    });
  });
};

var loginAction = function() {
  var route = "auth.authHandler.login";
  pomelo.init({
    host: host,
    port: port,
    log: true
  }, function() {
    pomelo.request(route, {user: buildObj('login')}, function(data) {
      if (data.code==200) {
        goToView('home');
        setVar('username', data.user.name);
        userToken = data.token;
      } else {
        console.log('Error:', data);
        pomelo.disconnect();
      }
    })
  });
}

var moveAction = function () {

}

$(document).ready(function(){
  goToView("login");
})
