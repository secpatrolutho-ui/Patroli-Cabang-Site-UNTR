/* =====================================
   GPS MODULE
===================================== */

let currentLat = null;
let currentLng = null;
let currentDistance = 0;
let watchId = null;

/* ============================= */

function mulaiGPS(){

    if(!navigator.geolocation){

        alertError("Browser tidak mendukung GPS.");

        return;

    }

    watchId = navigator.geolocation.watchPosition(

        updateGPS,

        gagalGPS,

        GPS_OPTION

    );

}

/* ============================= */

function stopGPS(){

    if(watchId){

        navigator.geolocation.clearWatch(watchId);

    }

}

/* ============================= */

function updateGPS(position){

    currentLat = position.coords.latitude;

    currentLng = position.coords.longitude;

    currentDistance = hitungJarak(

        currentLat,

        currentLng,

        Number(checkpointData.latitude),

        Number(checkpointData.longitude)

    );

    updateStatusGPS();

}

/* ============================= */

function gagalGPS(error){

    console.error(error);

    document.getElementById("gpsStatus").innerHTML =
    "❌ GPS Tidak Aktif";

    document.getElementById("gpsStatus").className =
    "status-danger";

    document.getElementById("btnSubmit").disabled = true;

}

/* ============================= */

function updateStatusGPS(){

    document.getElementById("distance").innerHTML =
    formatMeter(currentDistance);

    const radius =
    Number(checkpointData.radius);

    const progress = currentDistance <= radius
    ? 100
    : Math.max(

        0,

        100 - ((currentDistance-radius)/radius)*100

    );

    document.getElementById("progressBar")
    .style.width = progress + "%";

    const status =
    document.getElementById("gpsStatus");

    if(currentDistance <= radius){

        status.innerHTML =
        "✅ Dalam Radius";

        status.className =
        "status-success";

        document.getElementById("btnSubmit")
        .disabled = false;

    }

    else{

        status.innerHTML =
        "❌ Di luar Radius";

        status.className =
        "status-danger";

        document.getElementById("btnSubmit")
        .disabled = true;

    }

}

/* ============================= */

function hitungJarak(

    lat1,

    lng1,

    lat2,

    lng2

){

    const R = 6371000;

    const dLat =
    (lat2-lat1) * Math.PI/180;

    const dLng =
    (lng2-lng1) * Math.PI/180;

    const a =

    Math.sin(dLat/2) *
    Math.sin(dLat/2)

    +

    Math.cos(lat1*Math.PI/180)

    *

    Math.cos(lat2*Math.PI/180)

    *

    Math.sin(dLng/2)

    *

    Math.sin(dLng/2);

    const c =

    2 *

    Math.atan2(

        Math.sqrt(a),

        Math.sqrt(1-a)

    );

    return R*c;

}
