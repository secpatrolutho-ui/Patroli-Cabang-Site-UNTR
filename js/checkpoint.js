let checkpointData=null;

async function loadCheckpoint(){

    const params=new URLSearchParams(window.location.search);

    const id=params.get("id");

    if(!id){

        alert("Checkpoint tidak ditemukan.");

        return false;

    }

    const res=await fetch(

        API+

        "?action=getCheckpoint&id="+

        encodeURIComponent(id)

    );

    const data=await res.json();

    if(data.status!="success"){

        alert(data.pesan);

        return false;

    }

    checkpointData=data;

    document.getElementById("lokasi").textContent=data.lokasi;
    document.getElementById("wilayah").textContent=data.wilayah;
    document.getElementById("checkpointId").textContent=data.checkpointId;
    document.getElementById("checkpoint").textContent=data.checkpoint;

    return true;

}
