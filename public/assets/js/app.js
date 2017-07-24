const messaging = firebase.messaging();
var token;

(()=>{
    var onlineState = navigator.onLine ? 'Online' : 'Offline';
    var buttonClass = navigator.onLine ? 'success' : 'danger';
    $('#headerButton').append('<button class="btn btn-lg btn-'+buttonClass+'">' + onlineState + '</button>');
    
    window.addEventListener('online', ()=> {
        $('#subBtn').attr('disabled', false);
        $('#regisfcm').attr('disabled', false);
        $('#headerButton').empty();
        $('#headerButton').append('<button class="btn btn-success btn-lg" type="submit" >Online</button>');
    });
    
    window.addEventListener('offline', ()=> {
        $('#subBtn').attr('disabled', true);
        $('#regisfcm').attr('disabled', true);
        $('#headerButton').empty();
        $('#headerButton').append('<button class="btn btn-danger btn-lg" type="submit" >Offline</button>');
    });
})();


$('#regisfcm').click(function(){
  if (!isTokenSentToServer()) {
    $('#exampleModal').modal('toggle');
  }else{
    alert("Don't worry you are already registered for FCM in the name of "+window.localStorage.getItem('recipient'));
  }
});

$('#FCMNotification').click(function(){
    var recipient = $('#recipient').val().trim();
    if(recipient.length < 1){
      recipient = "Anonymous "+ (Math.floor(Math.random() * 5000) + 1  );
    }
    window.localStorage.setItem('recipient', recipient);
    getFCMToken(recipient);

});

function getFCMToken(recipient){
  messaging.getToken()
      .then(function(currentToken) {
        console.log(currentToken);
        if (currentToken) {
          sendTokenToServer(currentToken,recipient);
          
          window.localStorage.setItem('token', currentToken);
        } else {
          console.log('No Instance ID token available. Request permission to generate one.');
          requestPermission();
          setTokenSentToServer(false);
        }
      })
      .catch(function(err) {
        console.log('An error occurred while retrieving token. ', err);
        setTokenSentToServer(false);
      });
}

  messaging.onTokenRefresh(function() {
    messaging.getToken()
    .then(function(refreshedToken) {
      console.log('Token refreshed.');
      setTokenSentToServer(false);
      sendTokenToServer(refreshedToken,window.localStorage.getItem('recipient'));
      window.localStorage.setItem('token', refreshedToken);
      console.log("refreshedToken::"+refreshedToken)
    })
    .catch(function(err) {
      console.log('Unable to retrieve refreshed token ', err);
      showToken('Unable to retrieve refreshed token ', err);
    });
  });

  messaging.onMessage(function(payload) {
    console.log("Message received. ", payload);

    new Notification (payload.notification.title, {
        body : 'This message is being loaded from app.js',
        icon : payload.notification.icon,
        //image : 'assets/img/ipad-hand.png',
    });
  });


  function sendTokenToServer(currentToken,recipient) {
    
    
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      firebase.database().ref('devices/'+recipient).set({
        token: currentToken,
        ostype: navigator.userAgent,
      });
      setTokenSentToServer(true);
    } else {
      alert('This device already registered to FCM in the name of '+recipient);
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }
  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') == 1;
  }
  function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? 1 : 0);
  }

  function requestPermission() {
    console.log('Requesting permission...');
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
       getFCMToken(window.localStorage.getItem('recipient'));
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
  }


function subscribe(){
  var token = window.localStorage.getItem('token');
  if(token==null || token.length < 1){
    alert('No FCM Registeration found, Please click Register to FCM button First');
    return;
  }
  else{
    $.ajax({
      type: "POST",
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", "key=AAAA9i76Yf0:APA91bFbbCxfBzXqGgMJGjMKWD_x5WlvIQNuKzQ2_xtNUGmoNP7bXenTNdsAwKupb9SIgedctDjarDIEaXZuIwzH4EzpTep0WQFEbiaE7F4odp-2IYnp2oNt_C2Lf2v30LE4gAStLteh");
        request.setRequestHeader("content-Type", "application/json");
      },
      url: "https://iid.googleapis.com/iid/v1/"+token+"/rel/topics/all",
      data: "",
      processData: false,
      success: function(msg) {
        alert('Subcribed');
      },
      error: function(err){
        alert('Error');
      }
    });
  }
    
}
