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

            const payload = {

            action:"submitPatroli",

            nama:getNama(),

            nrp:getNRP(),

            checkpointId:checkpointData.checkpointId,

            lokasi:checkpointData.lokasi,

            wilayah:checkpointData.wilayah,

            checkpoint:checkpointData.checkpoint,

            situasi:situasi,

            deskripsi:deskripsi,

            latitude:currentLat,

            longitude:currentLng,

            jarak:currentDistance

        };

        console.log("PAYLOAD");

        console.log(payload);

        showLoading();

        const response = await fetch(API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(payload)

        });

        const result = await response.json();

        console.log(result);

        hideLoading();

        if (result.status == "success") {

            alertSuccess(result.pesan);

            setTimeout(function () {

                location.reload();

            }, 1000);

        }

        else {

            alertError(result.pesan);

        }

    }

    catch (err) {

        console.error(err);

        hideLoading();

        alertError("Gagal menghubungi server.");

    }

    finally {

        btn.disabled = false;

    }

}
