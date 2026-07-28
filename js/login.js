const API =
"https://SCRIPT-WEBAPP-ANDA/exec";

function login(){

const nama =
document
.getElementById("nama")
.value
.trim();

const nrp =
document
.getElementById("nrp")
.value
.trim();

if(nama=="" || nrp==""){

alert("Lengkapi data.");

return;

}

document.getElementById("info").innerHTML="Memverifikasi...";

fetch(

API+

"?action=login"+

"&nama="+encodeURIComponent(nama)+

"&nrp="+encodeURIComponent(nrp)

)

.then(r=>r.json())

.then(res=>{

document.getElementById("info").innerHTML=res.pesan||"";

if(res.status=="success"){

localStorage.setItem("userId",res.userId);

localStorage.setItem("nama",res.nama);

localStorage.setItem("nrp",res.nrp);

localStorage.setItem("role",res.role);

window.location.href="index.html";

}

})

.catch(err=>{

console.error(err);

alert("Tidak dapat terhubung ke server.");

});

}
