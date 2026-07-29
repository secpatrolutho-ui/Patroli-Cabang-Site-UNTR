function checkLogin(){

    const nama = localStorage.getItem("nama");
    const nrp = localStorage.getItem("nrp");

    if(!nama || !nrp){

        location.href="login.html";
        return false;

    }

    document.getElementById("nama").textContent=nama;
    document.getElementById("nrp").textContent=nrp;

    return true;

}

function getNama(){

    return localStorage.getItem("nama");

}

function getNRP(){

    return localStorage.getItem("nrp");

}

function logout(){

    localStorage.clear();

    location.href="login.html";

}
