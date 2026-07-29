/* ===========================================
   SUBMIT MODULE
=========================================== */

function initSubmit() {

    const btn = document.getElementById("btnSubmit");

    if (!btn) return;

    btn.addEventListener("click", submitPatroli);

}

/* ===========================================
   SUBMIT PATROLI
=========================================== */

async function submitPatroli() {

    const btn = document.getElementById("btnSubmit");

    btn.disabled = true;

    try {

        /* ================= VALIDASI ================= */

        if (!checkpointData) {

            alertError("Checkpoint belum dimuat.");
            return;

        }

        if (currentLat == null || currentLng == null) {

            alertError("GPS belum siap.");
            return;

        }

        if (currentDistance > Number(checkpointData.radius)) {

            alertError("Anda berada di luar radius checkpoint.");
            return;

        }

        const situasi =
        document.getElementById("situasi").value;

        const deskripsi =
        document.getElementById("deskripsi").value.trim();

        if (situasi !== "K10" && deskripsi === "") {

            alertError("Deskripsi wajib diisi.");
            return;

        }

        /* ================= PAYLOAD ================= */

        const payload = {

            action: "submitPatroli",

            nama: getNama(),

            nrp: getNRP(),

            checkpointId: checkpointData.checkpointId,

            lokasi: checkpointData.lokasi,

            wilayah: checkpointData.wilayah,

            checkpoint: checkpointData.checkpoint,

            situasi: situasi,

            deskripsi: deskripsi,

            latitude: currentLat,

            longitude: currentLng,

            jarak: currentDistance

        };

        console.log("================================");
        console.log("SUBMIT PATROLI");
        console.log("================================");
        console.log("API :", API);
        console.table(payload);

        showLoading();

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });

        console.log("HTTP STATUS :", response.status);

        const raw = await response.text();

        console.log("RAW RESPONSE :");
        console.log(raw);

        let result;

        try{

            result = JSON.parse(raw);

        }

        catch(e){

            throw new Error("Response bukan JSON.\n\n" + raw);

        }

        console.log("HASIL JSON");
        console.log(result);

        hideLoading();

        if(result.status=="success"){

            alertSuccess(

                "✅ " + result.pesan

            );

            setTimeout(function(){

                location.reload();

            },1000);

        }

        else{

            alertError(

                "❌ " + result.pesan

            );

        }

    }

    catch(err){

        console.error("ERROR SUBMIT");

        console.error(err);

        hideLoading();

        alertError(

            "Submit gagal.\n\n" +

            err.message

        );

    }

    finally{

        btn.disabled = false;

    }

}
