/* ==========================================
   UPLOAD TRACK
========================================== */

async function uploadTrack() {

    const payload = {

        action: "uploadTrack",

        patrolId: localStorage.getItem("patrolId"),

        nama: getNama(),

        nrp: getNRP(),

        points: getTrackBuffer()

    };

    console.log("================================");

    console.log("UPLOAD TRACK");

    console.log(payload);

    console.log("================================");

    try{

        const response = await fetch(API,{

            method:"POST",

            headers:{
                "Content-Type":"text/plain;charset=utf-8"
            },

            body:JSON.stringify(payload)

        });

        const result = await response.json();

        console.log(result);

        return result;

    }

    catch(err){

        console.error(err);

        return{

            status:"error",

            pesan:err.message

        };

    }

}
