/* ==========================================
   PATROLI DIGITAL
   APP CONTROLLER
========================================== */

window.addEventListener("load", initApp);

async function initApp(){

    console.log("APP START");

    // 1. Cek Login
    if(!checkLogin()) return;

    // 2. Ambil Data Checkpoint
    const ok = await loadCheckpoint();

    if(!ok) return;

    // 3. Aktifkan GPS
    mulaiGPS();

    // 4. Aktifkan Tombol Submit
    initSubmit();

    console.log("APP READY");

}
