/* ===================================================
   PATROLI DIGITAL CABANG & SITE
   GPS MODULE
=================================================== */

let currentLat = null;
let currentLng = null;
let currentDistance = 0;
let watchId = null;

/* ==========================================
   MULAI GPS
========================================== */

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

/* ==========================================
   STOP GPS
========================================== */

function stopGPS(){

    if(watchId != null){

        navigator.geolocation.clearWatch(watchId);

    }

}

/* ==========================================
   UPDATE GPS
========================================== */

function updateGPS(position){

    currentLat = position.coords.latitude;

    currentLng = position.coords.longitude;

/* ==========================================
   SMART TRACK RECORDER
========================================== */

if (isPatrolActive()) {

    const now = new Date();

    addTrackPoint({

        patrolId: localStorage.getItem("patrolId"),

        lat: currentLat,

        lng: currentLng,

        accuracy: position.coords.accuracy || 999,

        speed: position.coords.speed || 0,

        heading: position.coords.heading || 0,

        timestamp: Date.now(),

        deviceTime:
            now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0") + " " +
            String(now.getHours()).padStart(2, "0") + ":" +
            String(now.getMinutes()).padStart(2, "0") + ":" +
            String(now.getSeconds()).padStart(2, "0")

    });

}  

    const cp = getCheckpoint();

    if(!cp){

        return;

    }

    currentDistance = hitungJarak(

        currentLat,

        currentLng,

        Number(cp.latitude),

        Number(cp.longitude)

    );

    updateStatusGPS();

}

/* ==========================================
   GPS ERROR
========================================== */

function gagalGPS(error){

    console.error(error);

    setText("gpsStatus","❌ GPS Tidak Aktif");

    document
    .getElementById("gpsStatus")
    .className="status-danger";

    document
    .getElementById("btnSubmit")
    .disabled=true;

}

/* ==========================================
   UPDATE STATUS GPS
========================================== */

function updateStatusGPS(){

    const cp = getCheckpoint();

    if(!cp){

        return;

    }

    setText(

        "distance",

        formatMeter(currentDistance)

    );

    const radius = Number(cp.radius);

    const progress =

        currentDistance <= radius

        ? 100

        : Math.max(

            0,

            100 -

            ((currentDistance-radius)/radius)*100

        );

    document
    .getElementById("progressBar")
    .style.width = progress + "%";

    const gpsStatus =

    document.getElementById("gpsStatus");

    if(currentDistance <= radius){

        gpsStatus.innerHTML =
        "✅ Dalam Radius";

        gpsStatus.className =
        "status-success";

        document
        .getElementById("btnSubmit")
        .disabled = false;

    }

    else{

        gpsStatus.innerHTML =
        "❌ Di luar Radius";

        gpsStatus.className =
        "status-danger";

        document
        .getElementById("btnSubmit")
        .disabled = true;

    }

}

/* ==========================================
   HITUNG JARAK
========================================== */

function hitungJarak(

    lat1,

    lng1,

    lat2,

    lng2

){

    const R = 6371000;

    const dLat =
    (lat2-lat1)*Math.PI/180;

    const dLng =
    (lng2-lng1)*Math.PI/180;

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

/* ==========================================
   GETTER
========================================== */

function getCurrentLat(){

    return currentLat;

}

function getCurrentLng(){

    return currentLng;

}

function getCurrentDistance(){

    return currentDistance;

}
