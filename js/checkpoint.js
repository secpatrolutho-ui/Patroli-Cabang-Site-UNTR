/* ===================================================
   PATROLI DIGITAL CABANG & SITE
   CHECKPOINT MODULE
=================================================== */

let checkpointData = null;

/* ==========================================
   LOAD CHECKPOINT
========================================== */

async function loadCheckpoint(){

    showLoading();

    const params = new URLSearchParams(window.location.search);

    const checkpointId = params.get("id");

    if(!checkpointId){

        hideLoading();

        alertError("QR Code tidak valid.");

        return false;

    }

    try{

        const response = await fetch(

            API +

            "?action=getCheckpoint&id=" +

            encodeURIComponent(checkpointId)

        );

        const result = await response.json();

        debug("CHECKPOINT RESPONSE", result);

        if(result.status != STATUS.SUCCESS){

            hideLoading();

            alertError(result.pesan);

            return false;

        }

        checkpointData = result;

        tampilCheckpoint();

        hideLoading();

        return true;

    }

    catch(error){

        console.error(error);

        hideLoading();

        alertError("Tidak dapat mengambil data checkpoint.");

        return false;

    }

}

/* ==========================================
   TAMPILKAN DATA CHECKPOINT
========================================== */

function tampilCheckpoint(){

    if(!checkpointData){

        return;

    }

    setText("lokasi", checkpointData.lokasi);

    setText("wilayah", checkpointData.wilayah);

    setText("checkpointId", checkpointData.checkpointId);

    setText("checkpoint", checkpointData.checkpoint);

}

/* ==========================================
   GETTER
========================================== */

function getCheckpoint(){

    return checkpointData;

}
