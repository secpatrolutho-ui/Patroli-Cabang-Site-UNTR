/* =====================================
   CHECKPOINT
===================================== */

let checkpointData=null;

async function loadCheckpoint(){

    showLoading();

    const params=
    new URLSearchParams(window.location.search);

    const id=
    params.get("id");

    if(!id){

        hideLoading();

        alertError("Checkpoint tidak ditemukan.");

        return;

    }

    try{

        const res=
        await fetch(

            API+

            "?action=getCheckpoint&id="+

            encodeURIComponent(id)

        );

        const data=
        await res.json();

        if(data.status!="success"){

            hideLoading();

            alertError(data.pesan);

            return;

        }

        checkpointData=data;

        tampilCheckpoint();

        hideLoading();

        mulaiGPS();

    }

    catch(err){

        hideLoading();

        console.log(err);

        alertError("Gagal mengambil checkpoint.");

    }

}

function tampilCheckpoint(){

    document.getElementById("lokasi").innerHTML=
    checkpointData.lokasi;

    document.getElementById("wilayah").innerHTML=
    checkpointData.wilayah;

    document.getElementById("checkpointId").innerHTML=
    checkpointData.checkpointId;

    document.getElementById("checkpoint").innerHTML=
    checkpointData.checkpoint;

}
