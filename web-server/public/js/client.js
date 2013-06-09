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
  var route = "connector.authHandler.signup";
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
        goToView('login');
      }
      pomelo.disconnect();
    });
  });
}

var loginAction = function() {
  var route = "connector.authHandler.login";
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

var logoutAction = function() {
  var route = "connector.authHandler.logout";
  pomelo.request(route, {}, function(data) {
    recvdata = data;
    alert(data.msg);
    goToView('login');
  });
}

var moveToAction = function () {

}

//qiao 
var battle = function() {
  var route = "battle.battleHandler.battle";
  pomelo.request(route, {fights: buildObj('battle')}, function(data) {
      if (data.error) {
        console.log("errors:", data.errors);
      } else {
        alert(data.msg);
      }
    });
}

var getMission = function() {
  var route = "area.areaHandler.getMission";
  pomelo.request(route, {}, function(data) {
      if (data.error) {
        console.log("errors:", data.errors);
      } else {
        alert(data.msg);
      }
    });
}

var completeMission = function() {
  var route = "area.areaHandler.completeMission";
  pomelo.request(route, {mission: buildObj('mission')}, function(data) {
      if (data.error) {
        console.log("errors:", data.errors);
      } else {
        alert(data.msg);
      }
    });
}

$(document).ready(function(){
  goToView("login");
 // goToView("battle");
})
