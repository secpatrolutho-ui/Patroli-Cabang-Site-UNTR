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
