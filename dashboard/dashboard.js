const API =
"https://script.google.com/macros/s/AKfycbwvMYlVBsxjef7-OVHqmiaUX0gecof7VEG2-JlMyp0sAeeJj_ANslssKDpXQJX-pbgY/exec";

let activeFilter = {
    lokasi:"",
    nama:"",
    tanggal:""
};

async function loadDashboard(){

let btn=document.getElementById("loadButton");


if(btn){

btn.innerHTML="⏳ Loading...";
btn.disabled=true;

}


try{


let url =
API+
"?action=getDashboard"+
"&lokasi="+activeFilter.lokasi+
"&nama="+activeFilter.nama+
"&tanggal="+activeFilter.tanggal;


const response =
await fetch(url);


const text =
await response.text();


console.log(
"RAW API RESPONSE",
text
);


const result =
JSON.parse(text);

if(
!activeFilter.lokasi &&
!activeFilter.nama &&
!activeFilter.tanggal &&
document.getElementById("filterLokasi").options.length <=1
){

generateFilter(result.data);

}


console.log(
"DASHBOARD DATA",
result
);



updateKPI(result);


updateTable(result.data);


renderMap(result.checkpointMap);


renderChart(result);



}

catch(error){

console.error(error);

}



if(btn){

btn.innerHTML="🔄 Refresh Dashboard";
btn.disabled=false;

}


}

function updateKPI(data){


document.getElementById("total").innerHTML =
data.total || 0;



document.getElementById("petugas").innerHTML =
data.petugas || 0;



document.getElementById("checkpoint").innerHTML =
data.checkpoint || 0;



document.getElementById("temuan").innerHTML =
data.temuan || 0;


}

function updateTable(data){


let tbody =
document.getElementById(
"historyBody"
);


if(!tbody) return;


tbody.innerHTML="";



for(let i=1;i<data.length;i++){


let row =
`
<tr>

<td>
${data[i][0]}
</td>

<td>
${data[i][1]}
</td>

<td>
${data[i][3]}
</td>

<td>
${data[i][6]}
</td>

<td>
${data[i][7]}
</td>

</tr>

`;


tbody.innerHTML+=row;


}


}

let chartPatrol;
let chartLokasi;
let chartSituasi;

let map;
let markerLayer;
let routeLayer;
let routeMarkerLayer;

let activeRoute = null;

// REPLAY

let replayIndex = 0;

let replayTimer = null;

let replayMarker = null;

let startMarker = null;

let finishMarker = null;

let replaySpeed = 2000;

let replayDistance = 0;

let replayStartTime = null;

// ===============================
// RENDER CHART
// ===============================

function renderChart(result){


    if(chartPatrol){
        chartPatrol.destroy();
    }


    if(chartLokasi){
        chartLokasi.destroy();
    }


    if(chartSituasi){
        chartSituasi.destroy();
    }



    // =====================
    // TREND PATROL
    // =====================

    let patrolData = result.chartTanggal || [];


    chartPatrol =
    new Chart(
        document.getElementById("chartPatrol"),
        {

            type:"bar",

            data:{

                labels:
                patrolData.map(
                    x=>x.tanggal
                ),


                datasets:[{

                    label:"Jumlah Patrol",

                    data:
                    patrolData.map(
                        x=>x.jumlah
                    )

                }]

            }

        }
    );




    // =====================
    // PATROL PER LOKASI
    // =====================


    let lokasiData =
    result.chartWilayah || [];



    chartLokasi =
    new Chart(
        document.getElementById("chartLokasi"),
        {

            type:"doughnut",

            data:{

                labels:
                lokasiData.map(
                    x=>x.wilayah
                ),


                datasets:[{

                    label:"Lokasi",

                    data:
                    lokasiData.map(
                        x=>x.jumlah
                    )

                }]

            }

        }
    );




    // =====================
    // SITUASI PATROL
    // =====================


    let situasiData =
    result.chartSituasi || [];



    chartSituasi =
    new Chart(
        document.getElementById("chartSituasi"),
        {

            type:"pie",

            data:{

                labels:
                situasiData.map(
                    x=>x.situasi
                ),


                datasets:[{

                    label:"Situasi",

                    data:
                    situasiData.map(
                        x=>x.jumlah
                    )

                }]

            }

        }
    );



}



// ===============================
// MAP CHECKPOINT MONITORING
// ===============================


function renderMap(points){


    console.log("MAP DATA :", points);



    if(!points || points.length === 0){

        console.log(
        "Tidak ada data checkpoint"
        );

        return;

    }



    if(!map){



        map =
        L.map('map')
        .setView(
            [-6.18,106.93],
            15
        );



        L.tileLayer(

            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',

            {
                maxZoom:19
            }

        ).addTo(map);



        markerLayer =
        L.layerGroup()
        .addTo(map);



    }




    markerLayer.clearLayers();



    let bounds=[];




    points.forEach(cp=>{



        let lat =
        Number(cp.latitude);



        let lng =
        Number(cp.longitude);




        if(
            isNaN(lat) ||
            isNaN(lng)
        ){

            return;

        }





        let marker =
        L.marker(
            [
                lat,
                lng
            ]
        );





        marker.bindPopup(`


        <div style="min-width:200px">


        <b>
        ${cp.checkpoint}
        </b>


        <br><br>


        📍 Lokasi :
        ${cp.lokasi}


        <br>


        🏢 Wilayah :
        ${cp.wilayah}


        <br>


        📏 Radius :
        ${cp.radius} meter


        </div>


        `);




        marker.addTo(
            markerLayer
        );



        bounds.push(
            [
                lat,
                lng
            ]
        );



    });





    if(bounds.length > 0 && !activeRoute){

        map.fitBounds(
            bounds
        );

    }

    setTimeout(function(){

    map.invalidateSize();

    },500);

}





// ===============================
// AUTO REFRESH DASHBOARD
// ===============================

window.onload=async function(){


await loadDashboard();


await loadMonitoring();


await loadPatrolList();


};

setInterval(function(){


loadDashboard();

loadMonitoring();  

},30000);

document
.getElementById("loadButton")
.addEventListener(
"click",
loadDashboard
);

function filterDashboard(){


activeFilter.lokasi =
document.getElementById(
"filterLokasi"
).value;



activeFilter.nama =
document.getElementById(
"filterPetugas"
).value;



activeFilter.tanggal =
document.querySelector(
"input[type=date]"
).value;



console.log(
"FILTER AKTIF",
activeFilter
);



loadDashboard();

}

function generateFilter(data){


let lokasiSet=new Set();

let petugasSet=new Set();



for(let i=1;i<data.length;i++){


lokasiSet.add(
data[i][3]
);


petugasSet.add(
data[i][1]
);


}



let lokasi =
document.getElementById(
"filterLokasi"
);



lokasi.innerHTML=
`
<option value="">
Semua Lokasi
</option>
`;



lokasiSet.forEach(x=>{


lokasi.innerHTML+=
`
<option value="${x}">
${x}
</option>
`;


});




let petugas =
document.getElementById(
"filterPetugas"
);



petugas.innerHTML=
`
<option value="">
Semua Petugas
</option>
`;



petugasSet.forEach(x=>{


petugas.innerHTML+=
`
<option value="${x}">
${x}
</option>
`;

});



// restore filter aktif

lokasi.value = activeFilter.lokasi;

petugas.value = activeFilter.nama;


}

async function loadMonitoring(){


try{


let response =
await fetch(
API+"?action=getMonitoring"
);


let result =
await response.json();



console.log(
"MONITORING",
result
);



let tbody =
document.getElementById(
"monitoringBody"
);



if(!tbody){

console.error(
"Elemen monitoringBody tidak ditemukan"
);

return;

}



tbody.innerHTML="";



result.monitoring.forEach(item=>{


let warna="";


if(item.status=="AKTIF"){

warna="🟢";

}

else if(item.status=="WASPADA"){

warna="🟡";

}

else{

warna="🔴";

}



tbody.innerHTML+=`

<tr>

<td>
${item.lokasi}
</td>


<td>
${item.nama}
</td>


<td>
${new Date(item.waktu)
.toLocaleString()
}
</td>


<td>
${warna} ${item.status}
</td>


</tr>

`;



});


}

catch(err){

console.error(
"Monitoring Error",
err
);

}


}

async function loadPatrolList(){


try{


let response =
await fetch(
API+"?action=getPatrolSummary"
);


let result =
await response.json();



let select =
document.getElementById(
"routePatrolId"
);



if(!select) return;



select.innerHTML=
`
<option value="">
Pilih Patrol Session
</option>
`;



result.data.forEach(item=>{


select.innerHTML +=

`
<option value="${item.patrolId}">
${item.patrolId} - ${item.nama}
</option>
`;



});


}
catch(err){

console.error(
"Load Patrol List Error",
err
);

}


}

async function loadPatrolRoute(){


let patrolId =
document.getElementById(
"routePatrolId"
).value;



if(!patrolId){

alert(
"Pilih Patrol Session dahulu"
);

return;

}



try{


let response =
await fetch(

API+
"?action=getPatrolRoute&patrolId="
+
patrolId

);



let result =
await response.json();



console.log(
"PATROL ROUTE",
result
);



drawPatrolRoute(
result.route
);


document.getElementById(
"replayControl"
).style.display="block";
    


}
catch(err){

console.error(
"Route Error",
err
);


}


}

function drawPatrolRoute(route){

activeRoute = route;

if(!route || route.length==0){

alert(
"Data route tidak ditemukan"
);

return;

}



// hapus route lama

if(routeLayer){

map.removeLayer(routeLayer);

}


if(routeMarkerLayer){

map.removeLayer(routeMarkerLayer);

}



let points=[];



route.forEach(p=>{


points.push([

Number(p.lat),

Number(p.lng)

]);


});




// buat garis

routeLayer =
L.polyline(

points,

{

weight:6,

color:"red"

}

)
.addTo(map);



// marker layer

routeMarkerLayer =
L.layerGroup()
.addTo(map);




// START

L.marker(

points[0]

)

.bindPopup(
"🟢 START PATROL"
)

.addTo(
routeMarkerLayer
);




// FINISH

L.marker(

points[
points.length-1
]

)

.bindPopup(
"🔴 FINISH PATROL"
)

.addTo(
routeMarkerLayer
);



map.fitBounds(
routeLayer.getBounds()
);

prepareReplay(route);

}

function clearRoute(){


if(routeLayer){

map.removeLayer(routeLayer);

}


if(routeMarkerLayer){

map.removeLayer(routeMarkerLayer);

}


activeRoute=null;


loadDashboard();


}

function prepareReplay(route){


replayIndex = 0;



// hapus marker lama

if(replayMarker){

map.removeLayer(
replayMarker
);

}


if(startMarker){

map.removeLayer(
startMarker
);

}


if(finishMarker){

map.removeLayer(
finishMarker
);

}



// =====================
// START MARKER
// =====================

startMarker =
L.marker(

[
route[0].lat,
route[0].lng
],

{

icon:
L.icon({

iconUrl:
"https://cdn-icons-png.flaticon.com/512/684/684908.png",

iconSize:[
35,
35
]

})

}

)
.addTo(map);



startMarker.bindPopup(
`
<b>🟢 START PATROL</b>
<br>
Point : 1
`
);




// =====================
// FINISH MARKER
// =====================


finishMarker =
L.marker(

[
route[
route.length-1
].lat,

route[
route.length-1
].lng

],

{

icon:
L.icon({

iconUrl:
"https://cdn-icons-png.flaticon.com/512/252/252025.png",

iconSize:[
35,
35
]

})

}

)

.addTo(map);



finishMarker.bindPopup(
`

<b>🔴 FINISH PATROL</b>

<br>

Point :
${route.length}

`
);



// =====================
// MOVING MARKER
// =====================


const patrolIcon = L.divIcon({

html:`

<div class="patrol-direction">
🚶
</div>

`,

className:"patrol-icon",

iconSize:[35,35],

iconAnchor:[17,17]

});


replayMarker =
L.marker(

[
route[0].lat,
route[0].lng
],

{
icon:patrolIcon
}

)
.addTo(map);



}
function startReplay(){


if(!activeRoute){

alert(
"Load patrol route terlebih dahulu"
);

return;

}
    
replayDistance = 0;

replayStartTime =
Date.now();


if(replayTimer){

return;

}



replaySpeed =
Number(
document.getElementById(
"replaySpeed"
).value
);



replayTimer =
setInterval(function(){


moveReplay();


},replaySpeed);



}

function moveReplay(){


if(
replayIndex >= activeRoute.length
){

clearInterval(
replayTimer
);


replayTimer=null;


return;

}



let point =
activeRoute[
replayIndex
];

let heading =
Number(point.heading || 0);    

if(replayIndex > 0){


let prev =
activeRoute[
replayIndex-1
];


replayDistance +=

calculateDistance(

prev.lat,
prev.lng,

point.lat,
point.lng

);


}

replayMarker.setLatLng(

[
point.lat,
point.lng
]

);

let markerElement =
replayMarker.getElement();


if(markerElement){


let icon =
markerElement.querySelector(
".patrol-direction"
);



if(icon){


icon.style.transform =
`
rotate(${point.heading}deg)
`;


}


}
    
let el =
replayMarker
.getElement();


if(el){

let arrow =
el.querySelector(
".patrol-arrow"
);


if(arrow){

arrow.style.transform =
`
rotate(${heading}deg)
`;

}

}

let duration =
Math.floor(
(Date.now()-replayStartTime)
/1000
);


document.getElementById(
"replayInfo"
).innerHTML =


`

<b>
🚶 PATROL REPLAY
</b>

<hr>


<b>Progress:</b>

${point.no}/${activeRoute.length}


<br>


<b>Distance:</b>

${Math.round(replayDistance)}
 meter


<br>


<b>Speed:</b>

${Number(point.speed).toFixed(2)}

<br>

<b>Heading:</b>

${point.heading.toFixed(0)}°

<br>


<b>Accuracy:</b>

${Number(point.accuracy).toFixed(1)}
 meter


<br>


<b>GPS Time:</b>

${new Date(
point.time
)
.toLocaleTimeString()
}


<br>


<b>Duration:</b>

${formatDuration(duration)}


`;

replayIndex++;

console.log(
"CURRENT POINT",
point
);    

}

function pauseReplay(){


clearInterval(
replayTimer
);


replayTimer=null;


}

function resetReplay(){


pauseReplay();


replayIndex=0;



if(activeRoute){


let p =
activeRoute[0];



replayMarker.setLatLng(

[
p.lat,
p.lng
]

);


}


document.getElementById(
"replayInfo"
).innerHTML="";



}

function calculateDistance(
lat1,
lon1,
lat2,
lon2
){


const R = 6371000;


const dLat =
(lat2-lat1)
*
Math.PI/180;


const dLon =
(lon2-lon1)
*
Math.PI/180;



const a =

Math.sin(dLat/2)
*
Math.sin(dLat/2)

+

Math.cos(lat1*Math.PI/180)
*
Math.cos(lat2*Math.PI/180)

*

Math.sin(dLon/2)
*
Math.sin(dLon/2);



const c =
2 *
Math.atan2(
Math.sqrt(a),
Math.sqrt(1-a)
);



return R*c;


}

function formatDuration(sec){


let h =
Math.floor(sec/3600);


let m =
Math.floor(
(sec%3600)/60
);


let s =
sec%60;



return (

String(h).padStart(2,"0")
+
":"
+
String(m).padStart(2,"0")
+
":"
+
String(s).padStart(2,"0")

);


}

function updateMonitoring(data){


let tbody =
document.getElementById(
"monitoringBody"
);


if(!tbody){

console.error(
"Tabel monitoring tidak ditemukan"
);

return;

}


tbody.innerHTML="";



data.forEach(item=>{


tbody.innerHTML +=

`

<tr>

<td>${item.lokasi}</td>

<td>${item.nama}</td>

<td>
${new Date(item.waktu).toLocaleString()}
</td>

<td>
${item.status}
</td>

</tr>

`;

});


}

function downloadPDF(){


let rows =
document.querySelectorAll(
"#historyBody tr"
);


if(rows.length==0){

alert(
"Tidak ada data untuk dibuat laporan."
);

return;

}



const {
jsPDF
}
=
window.jspdf;



let doc =
new jsPDF();



doc.setFontSize(16);

doc.text(
"SMART PATROL MANAGEMENT SYSTEM",
10,
20
);


doc.setFontSize(12);


doc.text(
"Patrol Report",
10,
30
);



let y=45;



doc.text(
"Tanggal : "
+
(
activeFilter.tanggal ||
"Semua"
),

10,
y
);


y+=10;


doc.text(
"Lokasi : "
+
(
activeFilter.lokasi ||
"Semua"
),

10,
y
);


y+=10;


doc.text(
"Petugas : "
+
(
activeFilter.nama ||
"Semua"
),

10,
y
);


y+=20;


doc.text(
"Detail Patrol",

10,
y
);


y+=10;



rows.forEach((row,index)=>{


let text =
row.innerText
.replace(/\n/g," | ");



doc.text(

(index+1)
+". "
+
text,

10,

y

);



y+=8;



if(y>280){

doc.addPage();

y=20;

}


});



doc.save(
"Patrol_Report.pdf"
);


}
