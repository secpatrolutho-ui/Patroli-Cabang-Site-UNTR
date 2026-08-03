
let map;


window.onload=function(){


map=L.map('map')
.setView(
[-6.18,106.93],
15
);



L.tileLayer(

'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

).addTo(map);





new Chart(
document.getElementById("chartPatrol"),
{

type:"bar",

data:{

labels:[
"Sen",
"Sel",
"Rab",
"Kam",
"Jum"
],

datasets:[{

label:"Jumlah Patrol",

data:[
30,
45,
60,
40,
70
]

}]

}

});




new Chart(
document.getElementById("chartLokasi"),
{

type:"doughnut",

data:{

labels:[
"Head Office",
"Plant",
"Site"
],

datasets:[{

data:[
50,
30,
20
]

}]

}

});





new Chart(
document.getElementById("chartSituasi"),
{

type:"pie",

data:{

labels:[
"Normal",
"Temuan"
],

datasets:[{

data:[
90,
10
]

}]

}

});



}
