/* ==========================================
   SMART PATROL ANALYTICS
   SPMS v1.0
========================================== */

/* ==========================================
   TOTAL DISTANCE
========================================== */

function calculateTrackDistance(points){

    if(!points || points.length < 2){
        return 0;
    }

    let total = 0;

    for(let i=1;i<points.length;i++){

        total += calculateDistance(

            points[i-1].lat,
            points[i-1].lng,

            points[i].lat,
            points[i].lng

        );

    }

    return total;

}

/* ==========================================
   DURATION (SECOND)
========================================== */

function calculateTrackDuration(points){

    if(!points || points.length < 2){
        return 0;
    }

    return (

        points[points.length-1].timestamp -

        points[0].timestamp

    ) / 1000;

}

/* ==========================================
   AVG SPEED
========================================== */

function calculateAverageSpeed(points){

    const distance =

        calculateTrackDistance(points);

    const duration =

        calculateTrackDuration(points);

    if(duration<=0){

        return 0;

    }

    return distance/duration;

}

/* ==========================================
   MAX SPEED
========================================== */

function calculateMaxSpeed(points){

    let max = 0;

    points.forEach(function(p){

        if(Number(p.speed)>max){

            max = Number(p.speed);

        }

    });

    return max;

}

/* ==========================================
   SUMMARY OBJECT
========================================== */

function getTrackSummary(){

    const points = getTrackBuffer();

    return{

        patrolId:
            localStorage.getItem("patrolId"),

        totalPoint:
            points.length,

        totalDistance:
            calculateTrackDistance(points),

        duration:
            calculateTrackDuration(points),

        averageSpeed:
            calculateAverageSpeed(points),

        maxSpeed:
            calculateMaxSpeed(points)

    };

}

/* ==========================================
   BUILD SUMMARY PAYLOAD
========================================== */

function buildSummaryPayload(){

    const summary = getTrackSummary();

    return{

        action:"uploadSummary",

        patrolId:
            summary.patrolId,

        nama:
            getNama(),

        nrp:
            getNRP(),

        startTime:
            localStorage.getItem("patrolStart"),

        finishTime:
            Date.now(),

        duration:
            Number(summary.duration.toFixed(0)),

        totalDistance:
            Number(summary.totalDistance.toFixed(2)),

        averageSpeed:
            Number(summary.averageSpeed.toFixed(2)),

        maxSpeed:
            Number(summary.maxSpeed.toFixed(2)),

        totalPoint:
            summary.totalPoint

    };

}

/* ==========================================
   PREVIEW SUMMARY
========================================== */

function previewSummaryPayload(){

    console.log(

        JSON.stringify(

            buildSummaryPayload(),

            null,

            2

        )

    );

}

/* ==========================================
   UPLOAD SUMMARY
========================================== */

async function uploadSummary(){

    const payload = buildSummaryPayload();

    try{

        console.log("=================================");
        console.log("UPLOAD SUMMARY");
        console.log("=================================");

        console.table(payload);

        const response = await fetch(API,{

            method:"POST",

            headers:{
                "Content-Type":"text/plain;charset=utf-8"
            },

            body:JSON.stringify(payload)

        });

        const result =

            await response.json();

        console.log(result);

        if(result.status!="success"){

            pushOffline(payload);

            return{

                status:"offline",

                pesan:"Summary disimpan ke Offline Queue."

            };

        }

        return result;

    }

    catch(err){

        console.error(err);

        pushOffline(payload);

        return{

            status:"offline",

            pesan:"Summary disimpan ke Offline Queue."

        };

    }

}

/* ==========================================
   DEBUG SUMMARY
========================================== */

function previewSummary(){

    console.table(

        getTrackSummary()

    );

}
