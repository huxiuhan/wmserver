var pomelo = window.pomelo;
var username;
var host = "0.0.0.0";
var port = "10000";
var userToken = "";
var recvdata;

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
      recvdata = data;
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
