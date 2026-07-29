window.onload=async function(){

    if(!checkLogin()) return;

    const ok=await loadCheckpoint();

    if(!ok) return;

    initForm();

    mulaiGPS();

    initSubmit();

}
