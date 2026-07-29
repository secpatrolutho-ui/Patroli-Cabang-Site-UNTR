/* ===========================================
   SUBMIT MODULE
=========================================== */

function initSubmit() {

    const btn = document.getElementById("btnSubmit");

    if (!btn) {
        console.error("Tombol Submit tidak ditemukan.");
        return;
    }

    btn.addEventListener("click", submitPatroli);

    console.log("Submit Module Ready");

}

/* ===========================================
   SUBMIT PATROLI
=========================================== */

async function submitPatroli() {

    const btn = document.getElementById("btnSubmit");

    btn.disabled = true;

    showLoading();

    try {

        console.log("======================================");
        console.log("PATROLI DIGITAL - SUBMIT");
        console.log("======================================");

        /* ================= VALIDASI ================= */

        if (!checkpointData) {
            throw new Error("Checkpoint belum dimuat.");
        }

        if (currentLat == null || currentLng == null) {
            throw new Error("GPS belum siap.");
        }

        if (currentDistance > Number(checkpointData.radius)) {
            throw new Error("Anda berada di luar radius checkpoint.");
        }

        const situasi =
            document.getElementById("situasi").value;

        const deskripsi =
            document.getElementById("deskripsi").value.trim();

        if (situasi !== "K10" && deskripsi === "") {
            throw new Error("Deskripsi wajib diisi.");
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

        console.log("========== API ==========");
        console.log(API);

        console.log("========== PAYLOAD ==========");
        console.table(payload);

        /* ================= FETCH ================= */

        const response = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=UTF-8"
            },

            body: JSON.stringify(payload)

        });

        console.log("========== RESPONSE ==========");
        console.log(response);

        console.log("HTTP STATUS :", response.status);
        console.log("STATUS TEXT :", response.statusText);
        console.log("OK :", response.ok);
        console.log("TYPE :", response.type);

        const raw = await response.text();

        console.log("========== RAW RESPONSE ==========");
        console.log(raw);

        let result;

        try {

            result = JSON.parse(raw);

        } catch (e) {

            throw new Error(
                "Response bukan JSON.\n\n" + raw
            );

        }

        console.log("========== JSON ==========");
        console.table(result);

        hideLoading();

        if (result.status === "success") {

            alertSuccess(result.pesan);

            setTimeout(() => {

                location.reload();

            }, 1000);

        } else {

            alertError(result.pesan);

        }

    }

    catch (err) {

        hideLoading();

        console.log("========== ERROR ==========");
        console.error(err);

        alertError(

            "Submit gagal.\n\n" +

            err.message

        );

    }

    finally {

        btn.disabled = false;

    }

}
