console.log("APP BERHASIL DIMUAT");

window.onload = function () {

    console.log("window.onload");

    checkLogin();

    console.log("login OK");

    loadCheckpoint();

    console.log("checkpoint dipanggil");

    initSubmit();

    console.log("submit init");

};

window.onload=async function(){

    if(!checkLogin()) return;

    const ok=await loadCheckpoint();

    if(!ok) return;

    initForm();

    mulaiGPS();

    initSubmit();

}
