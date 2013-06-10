var pomelo = window.pomelo;
var username;
var host = "121.199.19.146";
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
    pomelo.disconnect();
  });
}

var moveToAction = function () {

}

//qiao 
var battle = function() {
  var route = "area.areaHandler.battle";
  pomelo.request(route, {fights: buildObj('battle')}, function(data) {
      if (data.error) {
        console.log("errors:", data.errors);
      } else {
        alert(data.msg);
      }
    });
}

var battlearea = function() {
  var route = "area.areaHandler.battleArea";
  pomelo.request(route, {fights: buildObj('battlearea')}, function(data) {
      if (data.error) {
        console.log("errors:", data.errors);
      } else {
        alert(data.msg);
      }
    });
}

var getMissions = function() {
  var route = "area.areaHandler.getMissions";
  pomelo.request(route, {}, function(data) {
      if (data.error) {
        console.log("errors:", data.errors);
      } else {
        recvdata = data ;
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

var listfriends = function() {
  var route = "chat.chatHandler.getFriendsList";
  pomelo.request(route, {}, function(data) {
      if (data.error) {
        console.log("errors:", data.errors);
      } else {
        recvdata = data ;
        alert(data.msg);
      }
    });
}

var addfriend = function() {
  var route = "chat.chatHandler.newFriendRequest";
  pomelo.request(route, {friend: buildObj('addfriend')}, function(data) {
      if (data.error) {
        console.log("errors:", data.errors);
      } else {
        alert(data.msg);
      }
    });
}

var sendMessage = function(){
  var route="chat.chatHandler.sendMsg";
   pomelo.request(route, {rid: '1',
        msg: 'welcome to wmserver',
        from: 'username',
        to: 'anbo'
}, function(data) {
     
        alert(data.msg);
  
    });
}


$(document).ready(function(){
  goToView("login");
 // goToView("battle");

 
 pomelo.on('onMsg', function(data) {
    alert('from:'+data.from+'\nMsg:'+data.msg+'\ntarget:'+data.to);
  });

  //update user list
  pomelo.on('onAdd', function(data) {
     alert('onAdd');
  });

  //update user list
  pomelo.on('onLeave', function(data) {
    alert('onLeave');
  });


  //handle disconect message, occours when the client is disconnect with servers
  pomelo.on('disconnect', function(reason) {
    alert('disconnect');
  });



})

