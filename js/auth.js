/* =====================================
   AUTH MODULE
===================================== */

function checkLogin(){

    const userId = localStorage.getItem("userId");

    if(!userId){

        location.href="login.html";
        return;

    }

    document.getElementById("nama").innerHTML=getNama();

    document.getElementById("nrp").innerHTML=getNRP();

}

function logout(){

    localStorage.clear();

    location.href="login.html";

}

/* ========================= */

function getUserId(){

    return localStorage.getItem("userId");

}

function getNama(){

    return localStorage.getItem("nama");

}

function getNRP(){

    return localStorage.getItem("nrp");

}

function getRole(){

    return localStorage.getItem("role");

}
