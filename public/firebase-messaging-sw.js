 importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js');

 firebase.initializeApp({
   'messagingSenderId': '1057350115837'
 });

 const messaging = firebase.messaging();
    messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        image:payload.notification.icon
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
