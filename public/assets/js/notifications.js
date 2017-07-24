(()=>{
    if(Notification.permission === "denied"){
        $('#localNotifications').empty();
        $('#localNotifications').append('<b style="color:red">Permission Denied</b>');
    }
    
    //Non-Perisistant Notification
    $('#localNotifications').click(() => {
        notificationPermission();
    });

})();

function notificationPermission() {
    if(Notification.permission === "granted") {
        showNotification();
    } else if(Notification.permission !== "denied") {
        Notification.requestPermission().then(permissions => {
            if(permissions === "granted") {
                showNotification();
            }
        });
    } else {
        $('#localNotifications').empty();
        $('#localNotifications').append('<b style="color:red">Permission Denied</b>');
//        Notification.requestPermission(function (permission) {
//          // If the user accepts, let's create a notification
//          if (permission === "granted") {
//
//          }
//        });
    }
}

function showNotification(){
    
    var pushNotification = new Notification ('Push Notification Sample', {
        body : 'This is the sample text which describes about message',
        badge : '../img/PWA-logo.jpg',
        icon : '../img/PWA-logo.jpg',
        image : '../img/ipad-hand.png',
        silent : false,
        vibrate : [200, 100, 300],
//        tag : 'a'
//        requireInteraction : true,
//        actions : [{
//            action : 'clickBtnId',
//            title : 'Test Action',
//            icon : '../img/PWA-logo.png'
//        }]
    });
    
}