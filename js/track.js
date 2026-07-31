/* ==========================================
   SMART PATROL TRACK
   Track Buffer Engine
========================================== */

let trackBuffer = [];

/* ==========================================
   RESET BUFFER
========================================== */

function resetTrackBuffer(){

    trackBuffer = [];

    console.log("TRACK BUFFER RESET");

}

/* ==========================================
   ADD TRACK POINT
========================================== */

function addTrackPoint(point){

    trackBuffer.push(point);

    console.log(
        "TRACK POINT :",
        trackBuffer.length,
        point
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

    trackBuffer = [];

}

/* ==========================================
   DEBUG
========================================== */

function showTrackBuffer(){

    console.table(trackBuffer);

}
