/* ===================================================
   PATROLI DIGITAL CABANG & SITE
   AUTH MODULE
=================================================== */

/* ===============================
   CEK LOGIN
================================ */

function checkLogin(){

    const nama = localStorage.getItem("nama");
    const nrp = localStorage.getItem("nrp");

    if(!nama || !nrp){

        location.href = "login.html";
        return false;

    }

    setText("nama", nama);
    setText("nrp", nrp);

    return true;

}

/* ===============================
   USER DATA
================================ */

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

/* ===============================
   LOGIN SESSION
================================ */

function saveLogin(user){

    localStorage.setItem("userId", user.userId);
    localStorage.setItem("nama", user.nama);
    localStorage.setItem("nrp", user.nrp);
    localStorage.setItem("role", user.role);

}

/* ===============================
   LOGOUT
================================ */

function logout(){

    localStorage.clear();

    location.href = "login.html";

}
