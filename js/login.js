const API =
"https://SCRIPT-ANDA/exec";

document
.getElementById("btnLogin")
.addEventListener(
"click",
login
);

function showLoading(){

document
.getElementById("loading")
.classList.add("show");

}

function hideLoading(){

document
.getElementById("loading")
.classList.remove("show");

}

function login(){

const nama =
document
.getElementById("nama")
.value.trim();

const nrp =
document
.getElementById("nrp")
.value.trim();

if(
nama=="" ||
nrp==""
){

alert(
"Lengkapi Nama dan NRP."
);

return;

}

showLoading();

fetch(

API+

"?action=login"+

"&nama="+

encodeURIComponent(nama)+

"&nrp="+

encodeURIComponent(nrp)

)

.then(r=>r.json())

.then(res=>{

hideLoading();

if(res.status=="success"){

localStorage.setItem(
"nama",
res.nama
);

localStorage.setItem(
"nrp",
res.nrp
);

alert(
"Login berhasil."
);

window.location=
"index.html";

return;

}

alert(res.pesan);

})

.catch(()=>{

hideLoading();

alert(
"Gagal terhubung ke server."
);

});

}
