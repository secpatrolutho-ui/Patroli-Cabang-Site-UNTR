/* ===================================================
   PATROLI DIGITAL CABANG & SITE
=================================================== */

/* ========= URL APPS SCRIPT ========= */

const API =
"https://script.google.com/macros/s/AKfycbwvMYlVBsxjef7-OVHqmiaUX0gecof7VEG2-JlMyp0sAeeJj_ANslssKDpXQJX-pbgY/exec";

/* ========= LOGIN ========= */

const nama = localStorage.getItem("nama");
const nrp  = localStorage.getItem("nrp");

if(!nama || !nrp){

    location.href="login.html";

}

document.getElementById("nama").innerText = nama;
document.getElementById("nrp").innerText = nrp;

/* ========= AMBIL ID DARI QR ========= */

const params = new URLSearchParams(window.location.search);

const checkpointID = params.get("id");

if(!checkpointID){

    alert("ID Checkpoint tidak ditemukan.");

    throw new Error("Checkpoint kosong");

}

/* ========= VARIABEL GLOBAL ========= */

let checkpointData = null;
let currentLat = null;
let currentLng = null;
let currentDistance = 0;

/* ===================================================
   LOAD CHECKPOINT
=================================================== */

window.onload = function(){

    loadCheckpoint();

}

/* ===================================================
   LOAD DATA DARI APPS SCRIPT
=================================================== */

async function loadCheckpoint(){

    try{

        const response = await fetch(

            API+

            "?action=getCheckpoint&id="+

            encodeURIComponent(checkpointID)

        );

        const result = await response.json();

        console.log(result);

        if(result.status!="success"){

            alert(result.pesan);

            return;

        }

        checkpointData = result;

        console.log("Checkpoint berhasil dimuat");

        console.log(checkpointData);

        tampilCheckpoint(result);

    }

    catch(err){

        console.error(err);

        alert("Gagal mengambil data checkpoint.");

    }

}

/* ===================================================
   TAMPILKAN DATA
=================================================== */

function tampilCheckpoint(data){

    document.getElementById("lokasi").innerText =
    data.lokasi;

    document.getElementById("wilayah").innerText =
    data.wilayah;

    document.getElementById("checkpointId").innerText =
    data.checkpointId;

    document.getElementById("checkpoint").innerText =
    data.checkpoint;

}
