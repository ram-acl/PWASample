var batteryInfo = {};

(()=>{
    window.addEventListener('online', ()=> {
        $('#changeState').empty();
        $('#changeState').append('<b style="color: greeen">Online</b>');
    });
    
    window.addEventListener('offline', ()=> {
        $('#changeState').empty();
        $('#changeState').append('<b style="color: red">Offline</b>');
    });
    
    getStream('video');
    
    batteryInfo = navigator.getBattery();
    
    batteryInfo.then((battery)=>{
        var chargingMode = battery.charging ? 'Charging' : 'Discharging';
        $('#chargingState').append('<b>' + chargingMode + '</b>');
        $('#chargetime').append('<b>' + battery.level + '</b>');
    });
})();

function updateChargingInfo(battery){

}

function updateChargingTime(){
    
}

function getGeo(){
    navigator.geolocation.getCurrentPosition((location) => {
        var lati = location.coords.latitude;
        var longi = location.coords.longitude;
        initMap(lati, longi);
    }, (error)=>{
        if(error.code == 1) {
            $('#map').css("height","");
            $('#mapError').empty();
            $('#mapError').append('<b style="color: red">Location Permission Denied</b>');
        } else {
            $('#map').css("height","");
            $('#mapError').empty();
            $('#mapError').append('<b style="color: red">Location is Not Accessible</b>');
        }   
    });
}

function initMap(latitude, longitude) {
    var uluru = {lat: latitude, lng: longitude};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
}


function getUserMedia(options, successCallback, failureCallback) {
  var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (api) {
    return api.bind(navigator)(options, successCallback, failureCallback);
  }
    $('#camera').empty();
    $('#camError').empty();
    $('#camError').append('<b style="color: red">User Media API not supported.</b>');
}

function getStream(type) {
  var constraints = {};
  constraints[type] = true;
  getUserMedia(constraints, function(stream) {
    var mediaControl = document.querySelector(type);
    if (navigator.mozGetUserMedia) {
      mediaControl.mozSrcObject = stream;
    } else {
      mediaControl.srcObject = stream;
      mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
    }
  }, function(err) {
    $('#camera').empty();
    $('#camError').empty();
    $('#camError').append('<b style="color: red">'+err.name+'</b>');
  });
}