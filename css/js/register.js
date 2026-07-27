const API =
"https://script.google.com/macros/s/AKfycbwvMYlVBsxjef7-OVHqmiaUX0gecof7VEG2-JlMyp0sAeeJj_ANslssKDpXQJX-pbgY/exec";

function register(){

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

document
.getElementById("info")
.innerHTML="Mengirim data...";

fetch(API,{

method:"POST",

body:JSON.stringify({

action:"register",

nama:nama,

nrp:nrp

})

})

.then(r=>r.json())

.then(res=>{

document
.getElementById("info")
.innerHTML=
res.pesan;

if(res.status=="success"){

setTimeout(()=>{

window.location=
"login.html";

},2000);

}

});

}
