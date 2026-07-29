/* ===================================================
   PATROLI DIGITAL CABANG & SITE
   UTILITY MODULE
=================================================== */

/* ===============================
   LOADING
================================ */

function showLoading(){

    const loading = document.getElementById("loading");

    if(loading){

        loading.classList.add("show");

    }

}

function hideLoading(){

    const loading = document.getElementById("loading");

    if(loading){

        loading.classList.remove("show");

    }

}

/* ===============================
   ALERT
================================ */

function alertSuccess(message){

    alert(message);

}

function alertError(message){

    alert(message);

}

/* ===============================
   FORMAT
================================ */

function formatMeter(value){

    if(value == null || isNaN(value)){

        return "-";

    }

    return Number(value).toFixed(1) + " Meter";

}

/* ===============================
   DOM HELPER
================================ */

function setText(id, value){

    const el = document.getElementById(id);

    if(el){

        el.textContent = value;

    }

}

function getValue(id){

    const el = document.getElementById(id);

    if(!el){

        return "";

    }

    return el.value.trim();

}

/* ===============================
   DEBUG
================================ */

function debug(title, data){

    console.log("========== " + title + " ==========");

    console.log(data);

}
