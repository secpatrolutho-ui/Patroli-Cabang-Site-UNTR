/* =====================================
   SUBMIT MODULE
===================================== */

function initSubmit(){

    document
    .getElementById("btnSubmit")
    .addEventListener(

        "click",

        submitPatroli

    );

}

/* ===================================== */

async function submitPatroli(){

    const btn =
    document.getElementById("btnSubmit");

    btn.disabled = true;

    /* ================= VALIDASI ================= */

    if(!checkpointData){

        alertError("Checkpoint belum dimuat.");

        btn.disabled=false;

        return;

    }

    if(currentLat==null){

        alertError("GPS belum siap.");

        btn.disabled=false;

        return;

    }

    if(

        currentDistance>

        Number(checkpointData.radius)

    ){

        alertError("Anda berada di luar radius checkpoint.");

        btn.disabled=false;

        return;

    }

    /* ================= AMBIL FORM ================= */

    const situasi =
    document
    .getElementById("situasi")
    .value;

    const deskripsi =
    document
    .getElementById("deskripsi")
    .value;

    showLoading();

    try{

        const payload = {

    action: "submitPatroli",

    nama: getNama(),

    nrp: getNRP(),

    checkpointId: checkpointData.checkpointId,

    situasi: situasi,

    deskripsi: deskripsi,

    latitude: currentLat,

    longitude: currentLng,

    jarak: currentDistance

};

console.log(payload);

const response = await fetch(API, {

    method: "POST",

    body: JSON.stringify(payload)

});
       
       const response =
        await fetch(API,{

            method:"POST",

            body:JSON.stringify({

                action:"submitPatroli",

                nama:getNama(),

                nrp:getNRP(),

                checkpointId:
                checkpointData.checkpointId,

                situasi:situasi,

                deskripsi:deskripsi,

                latitude:currentLat,

                longitude:currentLng,

                jarak:currentDistance

            })

        });

        const result =
        await response.json();

        hideLoading();

        if(result.status=="success"){

            alertSuccess(result.pesan);

            location.reload();

        }

        else{

            alertError(result.pesan);

        }

    }

    catch(err){

        console.log(err);

        hideLoading();

        alertError("Server tidak merespon.");

    }

    finally{

        btn.disabled=false;

    }

}
