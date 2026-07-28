/* =====================================
   AUTH
===================================== */

function cekLogin(){

    const nama =
    localStorage.getItem("nama");

    const nrp =
    localStorage.getItem("nrp");

    if(!nama || !nrp){

        location.href="login.html";

        return;

    }

    document.getElementById("nama").innerHTML=nama;

    document.getElementById("nrp").innerHTML=nrp;

}

function logout(){

    localStorage.clear();

    location.href="login.html";

}

function getNama(){

    return localStorage.getItem("nama");

}

function getNRP(){

    return localStorage.getItem("nrp");

}
