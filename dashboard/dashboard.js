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


const result =
await response.json();

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

let chartPatrol;
let chartLokasi;
let chartSituasi;

let map;
let markerLayer;


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





    if(bounds.length > 0){

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

window.onload=function(){

loadDashboard();

};

setInterval(function(){


    loadDashboard();


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
