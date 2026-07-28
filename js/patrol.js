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
    location.href = "login.html";
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
   LOAD HALAMAN
=================================================== */

window.onload = function(){

    loadCheckpoint();

};

/* ===================================================
   LOAD CHECKPOINT
=================================================== */

async function loadCheckpoint(){

    try{

        const response = await fetch(

            API +
            "?action=getCheckpoint&id=" +
            encodeURIComponent(checkpointID)

        );

        const result = await response.json();

        console.log(result);

        if(result.status != "success"){

            alert(result.pesan);

            return;

        }

        checkpointData = result;

        tampilCheckpoint(result);

    }

    catch(err){

        console.error(err);

        alert("Gagal mengambil data checkpoint.");

    }

}

/* ===================================================
   TAMPILKAN CHECKPOINT
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

/* ===================================================
   SUBMIT PATROLI
=================================================== */

document
.getElementById("btnSubmit")
.addEventListener("click", submitPatroli);

async function submitPatroli(){

    const btn =
    document.getElementById("btnSubmit");

    btn.disabled = true;

    if(!checkpointData){

        alert("Checkpoint belum dimuat.");

        btn.disabled = false;

        return;

    }

    if(currentLat == null || currentLng == null){

        alert("GPS belum siap.");

        btn.disabled = false;

        return;

    }

    if(currentDistance > Number(checkpointData.radius)){

        alert("Anda berada di luar radius checkpoint.");

        btn.disabled = false;

        return;

    }

    const situasi =
    document.getElementById("situasi").value;

    const deskripsi =
    document.getElementById("deskripsi").value;

    document
    .getElementById("loading")
    .classList.add("show");

    try{

        const response = await fetch(API,{

            method:"POST",

            body:JSON.stringify({

                action:"submitPatroli",

                nama:nama,

                nrp:nrp,

                checkpointId:
                checkpointData.checkpointId,

                situasi:situasi,

                deskripsi:deskripsi,

                latitude:currentLat,

                longitude:currentLng,

                jarak:currentDistance

            })

        });

        const result =
        await response.json();

        if(result.status=="success"){

            alert(result.pesan);

            location.reload();

        }else{

            alert(result.pesan);

        }

    }

    catch(err){

        console.error(err);

        alert("Gagal mengirim data ke server.");

    }

    finally{

        document
        .getElementById("loading")
        .classList.remove("show");

        btn.disabled = false;

    }

}
