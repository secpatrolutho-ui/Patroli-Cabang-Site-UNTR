let currentLat=null;
let currentLng=null;
let currentDistance=0;

function mulaiGPS(){

    navigator.geolocation.watchPosition(

        gpsSuccess,

        gpsError,

        GPS_OPTION

    );

}
