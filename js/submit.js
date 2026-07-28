/* ===================================================
   SUBMIT MODULE
   PATROLI DIGITAL CABANG & SITE
=================================================== */

function initSubmit(){

    const btn = document.getElementById("btnSubmit");

    if(btn){

        btn.addEventListener("click", submitPatroli);

    }

}

/* ===================================================
   SUBMIT PATROLI
=================================================== */

async function submitPatroli(){

    const btn = document.getElementById("btnSubmit");

    btn.disabled = true;

    /* ================= VALIDASI ================= */

    if(!checkpointData){

        alertError("Data checkpoint belum dimuat.");

        btn.disabled = false;

        return;

    }

    if(currentLat == null || currentLng == null){

        alertError("GPS belum siap.");

        btn.disabled = false;

        return;

    }

    if(currentDistance > Number(checkpointData.radius)){

        alertError("Anda berada di luar radius checkpoint.");

        btn.disabled = false;

        return;

    }

    /* ================= AMBIL FORM ================= */

    const situasi =
    document.getElementById("situasi").value;

    const deskripsi =
    document.getElementById("deskripsi").value.trim();

    /* ================= VALIDASI DESKRIPSI ================= */

    if(situasi != "K10" && deskripsi == ""){

        alertError("Deskripsi temuan wajib diisi.");

        btn.disabled = false;

        return;

    }

    /* ================= PAYLOAD ================= */

    const payload = {

        action : "submitPatroli",

        nama : getNama(),

        nrp : getNRP(),

        checkpointId : checkpointData.checkpointId,

        lokasi : checkpointData.lokasi,

        wilayah : checkpointData.wilayah,

        checkpoint : checkpointData.checkpoint,

        situasi : situasi,

        deskripsi : deskripsi,

        latitude : currentLat,

        longitude : currentLng,

        jarak : currentDistance

    };

    console.log("========== PAYLOAD ==========");
    console.log(payload);

    showLoading();

    try{

        const response = await fetch(API,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(payload)

        });

        const result = await response.json();

        console.log("========== RESPONSE ==========");
        console.log(result);

        hideLoading();

        if(result.status=="success"){

            alertSuccess(result.pesan);

            setTimeout(()=>{

                location.reload();

            },1000);

        }

        else{

            alertError(result.pesan);

        }

    }

    catch(error){

        console.error(error);

        hideLoading();

        alertError("Gagal terhubung ke server.");

    }

    finally{

        btn.disabled = false;

    }

}
