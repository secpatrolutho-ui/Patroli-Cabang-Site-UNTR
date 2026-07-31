/* ==========================================
   AUTO SYNC ENGINE
========================================== */

let syncRunning = false;

/* ==========================================
   START AUTO SYNC
========================================== */

function startAutoSync(){

    updateSyncStatus();

    setInterval(syncOfflineQueue,15000);

}

/* ==========================================
   SYNC OFFLINE QUEUE
========================================== */

async function syncOfflineQueue(){

    if(syncRunning) return;

    if(!navigator.onLine) return;

    const queue = getOfflineQueue();

    if(queue.length==0){

        updateSyncStatus();

        return;

    }

    syncRunning = true;

    console.log("AUTO SYNC :", queue.length);

    while(queue.length>0){

        const payload = queue[0];

        try{

            const response = await fetch(API,{

                method:"POST",

                headers:{
                    "Content-Type":"text/plain;charset=utf-8"
                },

                body:JSON.stringify(payload)

            });

            const result = await response.json();

            if(result.status=="success"){

                queue.shift();

                saveOfflineQueue(queue);

                updateSyncStatus();

                console.log(
                    "SYNC SUCCESS",
                    queue.length
                );

            }else{

                break;

            }

        }catch(err){

            console.error(err);

            break;

        }

    }

    syncRunning = false;

}

/* ==========================================
   UPDATE SYNC STATUS
========================================== */

function updateSyncStatus(){

    const el = document.getElementById("syncStatus");

    if(!el){

        return;

    }

    const total = totalOfflineQueue();

    if(total==0){

        el.innerHTML =
        "🟢 Semua data tersinkron";

    }else{

        el.innerHTML =
        "🟠 Menunggu sinkronisasi (" +
        total +
        ")";

    }

}
