const API =
"https://script.google.com/macros/s/AKfycbwvMYlVBsxjef7-OVHqmiaUX0gecof7VEG2-JlMyp0sAeeJj_ANslssKDpXQJX-pbgY/exec";


let map;
let markerLayer;



async function loadDashboard(){


try{


const response =
await fetch(
API+
"?action=getDashboard"
);



const result =
await response.json();



console.log(
"DASHBOARD DATA",
result
);



updateKPI(result);



updateTable(
result.data
);



renderMap(
result.checkpointMap
);



renderChart(
result
);



}

catch(error){


console.error(error);


}



}

function updateKPI(data){


document.querySelector(
".card:nth-child(1) span"
).innerHTML =
data.total || 0;



document.querySelector(
".card:nth-child(2) span"
).innerHTML =
data.petugas || 0;



document.querySelector(
".card:nth-child(3) span"
).innerHTML =
data.checkpoint || 0;



document.querySelector(
".card:nth-child(4) span"
).innerHTML =
data.temuan || 0;


}

function updateTable(data){


let tbody =
document.querySelector(
"tbody"
);


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

window.onload=function(){

loadDashboard();

}



setInterval(()=>{

function renderMap(points){


if(!points || points.length===0){
console.log("Tidak ada data checkpoint");
return;
}



if(!map){


map = L.map('map')
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
)
return;



let marker =
L.marker(
[lat,lng]
);



marker.bindPopup(`

<b>
${cp.checkpoint}
</b>

<br>

Lokasi :
${cp.lokasi}

<br>

Wilayah :
${cp.wilayah}

<br>

Radius :
${cp.radius} meter

`);



marker.addTo(markerLayer);



bounds.push(
[
lat,
lng
]
);



});



if(bounds.length){

map.fitBounds(bounds);

}



}  
loadDashboard();

},30000);

let chartPatrol;
let chartLokasi;
let chartSituasi;



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




chartPatrol =
new Chart(
document.getElementById("chartPatrol"),
{

type:"bar",

data:{

labels:

result.chartTanggal.map(
x=>x.tanggal
),


datasets:[{

label:"Jumlah Patrol",

data:

result.chartTanggal.map(
x=>x.jumlah
)

}]

}

});






chartLokasi =
new Chart(
document.getElementById("chartLokasi"),
{

type:"doughnut",

data:{

labels:

result.chartWilayah.map(
x=>x.wilayah
),


datasets:[{

data:

result.chartWilayah.map(
x=>x.jumlah
)

}]

}

});






chartSituasi =
new Chart(
document.getElementById("chartSituasi"),
{

type:"pie",

data:{

labels:

result.chartSituasi.map(
x=>x.situasi
),


datasets:[{

data:

result.chartSituasi.map(
x=>x.jumlah
)

}]

}

});



}

