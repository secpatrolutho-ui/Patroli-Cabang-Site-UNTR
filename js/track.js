/* ==========================================
   SMART PATROL TRACK
   Track Buffer Engine
========================================== */

let trackBuffer = [];

/* ==========================================
   SMART FILTER CONFIG
========================================== */

const TRACK_INTERVAL = 5000;     // 5 detik
const MIN_DISTANCE = 3;          // meter
const MAX_ACCURACY = 20;         // meter

let lastTrackPoint = null;

/* ==========================================
   RESET BUFFER
========================================== */

function resetTrackBuffer(){

    trackBuffer=[];

    lastTrackPoint=null;

    console.log("TRACK BUFFER RESET");

}

/* ==========================================
   ADD TRACK POINT
========================================== */

function addTrackPoint(point){

    /* ==========================
       Accuracy Filter
    ========================== */

    if(point.accuracy > MAX_ACCURACY){

        console.log("TRACK SKIP : Accuracy buruk");

        return;

    }

    /* ==========================
       First Point
    ========================== */

    if(lastTrackPoint==null){

        trackBuffer.push(point);

        lastTrackPoint=point;

        console.log("TRACK START");

        return;

    }

    /* ==========================
       Time Filter
    ========================== */

    const diffTime =

        point.timestamp -

        lastTrackPoint.timestamp;

    if(diffTime < TRACK_INTERVAL){

        return;

    }

    /* ==========================
       Distance Filter
    ========================== */

    const distance =

        calculateDistance(

            lastTrackPoint.lat,

            lastTrackPoint.lng,

            point.lat,

            point.lng

        );

    if(distance < MIN_DISTANCE){

        return;

    }

    trackBuffer.push(point);

    lastTrackPoint = point;

    console.log(

        "TRACK",

        trackBuffer.length,

        "Distance",

        distance.toFixed(1),

        "m"

    );

}

/* ==========================================
   GET BUFFER
========================================== */

function getTrackBuffer(){

    return trackBuffer;

}

/* ==========================================
   TOTAL TRACK
========================================== */

function totalTrackPoint(){

    return trackBuffer.length;

}

/* ==========================================
   CLEAR BUFFER
========================================== */

function clearTrackBuffer(){

    trackBuffer=[];

    lastTrackPoint=null;

}

/* ==========================================
   HITUNG JARAK (Haversine)
========================================== */

function calculateDistance(lat1,lng1,lat2,lng2){

    const R = 6371000;

    const dLat = (lat2-lat1)*Math.PI/180;

    const dLng = (lng2-lng1)*Math.PI/180;

    const a =

        Math.sin(dLat/2)**2 +

        Math.cos(lat1*Math.PI/180) *

        Math.cos(lat2*Math.PI/180) *

        Math.sin(dLng/2)**2;

    const c =

        2*Math.atan2(

            Math.sqrt(a),

            Math.sqrt(1-a)

        );

    return R*c;

}

/* ==========================================
   DEBUG
========================================== */

function showTrackBuffer(){

    console.table(trackBuffer);

}
