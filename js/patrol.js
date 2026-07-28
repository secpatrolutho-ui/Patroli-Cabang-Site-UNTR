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
        
        mulaiGPS();

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

function mulaiGPS(){

    if(!navigator.geolocation){

        alert("Browser tidak mendukung GPS.");

        return;

    }

    navigator.geolocation.watchPosition(

        updateGPS,

        gagalGPS,

        {

            enableHighAccuracy:true,

            timeout:10000,

            maximumAge:0

        }

    );

}

function updateGPS(position){

    currentLat =
    position.coords.latitude;

    currentLng =
    position.coords.longitude;

    currentDistance =
    hitungJarak(

        currentLat,

        currentLng,

        Number(checkpointData.latitude),

        Number(checkpointData.longitude)

    );

    updateStatusGPS();

}

function gagalGPS(error){

    console.log(error);

    document
    .getElementById("gpsStatus")
    .innerHTML="GPS Gagal";

}

function updateStatusGPS(){

    document
    .getElementById("distance")
    .innerHTML =
    currentDistance.toFixed(1)+" Meter";

    const radius =
    Number(checkpointData.radius);

    const progress = currentDistance <= radius
     ? 100
     : Math.max(0, 100 - ((currentDistance - radius) / radius) * 100);
   

    );

    document
    .getElementById("progressBar")
    .style.width =
    progress+"%";

    const status =
    document
    .getElementById("gpsStatus");

    if(currentDistance<=radius){

        status.innerHTML =
        "✅ Dalam Radius";

        status.className =
        "status-success";

        document
        .getElementById("btnSubmit")
        .disabled=false;

    }

    else{

        status.innerHTML =
        "❌ Di luar Radius";

        status.className =
        "status-danger";

        document
        .getElementById("btnSubmit")
        .disabled=true;

    }

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

function hitungJarak(lat1,lng1,lat2,lng2){

    const R = 6371000;

    const dLat =
    (lat2-lat1)*Math.PI/180;

    const dLng =
    (lng2-lng1)*Math.PI/180;

    const a =

    Math.sin(dLat/2)*
    Math.sin(dLat/2)+

    Math.cos(lat1*Math.PI/180)*
    Math.cos(lat2*Math.PI/180)*

    Math.sin(dLng/2)*
    Math.sin(dLng/2);

    const c =
    2*Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1-a));

    return R*c;

}
