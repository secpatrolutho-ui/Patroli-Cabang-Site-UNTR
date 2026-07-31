/* ==========================================
   OFFLINE RECOVERY ENGINE
========================================== */

const OFFLINE_KEY =

"offlineTrackQueue";

/* ==========================================
   GET QUEUE
========================================== */

function getOfflineQueue(){

    const data =

    localStorage.getItem(

        OFFLINE_KEY

    );

    if(!data){

        return [];

    }

    return JSON.parse(data);

}

/* ==========================================
   SAVE QUEUE
========================================== */

function saveOfflineQueue(queue){

    localStorage.setItem(

        OFFLINE_KEY,

        JSON.stringify(queue)

    );

}

/* ==========================================
   PUSH
========================================== */

function pushOffline(payload){

    const queue =

    getOfflineQueue();

    queue.push(payload);

    saveOfflineQueue(queue);

    updateSyncStatus();   

    console.log(

        "OFFLINE SAVE",

        queue.length

    );

}

/* ==========================================
   CLEAR
========================================== */

function clearOfflineQueue(){

    saveOfflineQueue([]);
    updateSyncStatus();  
}

/* ==========================================
   TOTAL
========================================== */

function totalOfflineQueue(){

    return getOfflineQueue().length;

}

/* ==========================================
   DEBUG
========================================== */

function previewOfflineQueue(){

    console.table(

        getOfflineQueue()

    );

}
