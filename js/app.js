/* =====================================
   APP
===================================== */

console.log("APP BERHASIL DIMUAT");

window.onload = async function () {

    console.log("window.onload");

    if (!checkLogin()) {

        console.log("Belum login");

        return;

    }

    console.log("Login OK");

    const ok = await loadCheckpoint();

    console.log("loadCheckpoint =", ok);

    if (!ok) return;

    console.log("Checkpoint OK");

    mulaiGPS();

    console.log("GPS dimulai");

    initSubmit();

    console.log("Submit siap");

};
