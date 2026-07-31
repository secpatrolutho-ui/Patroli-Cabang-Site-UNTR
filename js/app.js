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

    // 3. Load Checkpoint
    const ok = await loadCheckpoint();

    if(!ok) return;

    // 4. GPS
    mulaiGPS();

    // 5. Submit
    initSubmit();

    console.log("SPMS READY");

}
