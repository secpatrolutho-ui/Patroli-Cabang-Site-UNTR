/* ==========================================
   PATROLI DIGITAL
   APP CONTROLLER
========================================== */

window.addEventListener("load", initApp);

async function initApp(){

    console.log("================================");
    console.log("SPMS START");
    console.log("================================");

    // 1. Login
    if(!checkLogin()) return;

    // 2. Load Patrol Session
    loadSession();

    // 3. Auto Sync Engine
    startAutoSync();

    // 4. Load Checkpoint
    const ok = await loadCheckpoint();

    if(!ok) return;

    // 5. GPS
    mulaiGPS();

    // 6. Submit
    initSubmit();

    console.log("SPMS READY");

}
