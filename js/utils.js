/* =====================================
   UTILS
===================================== */

function showLoading(){

    document
    .getElementById("loading")
    ?.classList.add("show");

}

function hideLoading(){

    document
    .getElementById("loading")
    ?.classList.remove("show");

}

function alertError(msg){

    alert(msg);

}

function alertSuccess(msg){

    alert(msg);

}

function formatMeter(jarak){

    return Number(jarak).toFixed(1)+" Meter";

}
