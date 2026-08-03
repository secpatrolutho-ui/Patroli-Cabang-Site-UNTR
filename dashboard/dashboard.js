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

loadDashboard();

},30000);

