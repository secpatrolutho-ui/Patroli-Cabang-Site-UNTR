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

    for(let i = 1; i < points.length; i++){

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
   DURATION
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

    if(duration <= 0){

        return 0;

    }

    return distance / duration;

}

/* ==========================================
   MAX SPEED
========================================== */

function calculateMaxSpeed(points){

    let max = 0;

    points.forEach(p=>{

        if(p.speed > max){

            max = p.speed;

        }

    });

    return max;

}

/* ==========================================
   SUMMARY
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
   DEBUG
========================================== */

function previewSummary(){

    console.table(

        getTrackSummary()

    );

}

/* ==========================================
   BUILD SUMMARY PAYLOAD
========================================== */

function buildSummaryPayload(){

    const summary = getTrackSummary();

    return{

        action:"uploadSummary",

        patrolId: summary.patrolId,

        nama: getNama(),

        nrp: getNRP(),

        startTime:

            localStorage.getItem("patrolStart"),

        finishTime:

            Date.now(),

        duration:

            summary.duration,

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

    try{

        const payload = buildSummaryPayload();

        console.log("UPLOAD SUMMARY");

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

        return result;

    }

    catch(err){

        console.error(err);

        return{

            status:"error",

            pesan:"Upload Summary gagal."

        };

    }

}
