/* ==========================================
   SMART PATROL SESSION
   SPMS v1.0
========================================== */

let patrolTimer = null;

/* ==========================================
   GENERATE PATROL ID
========================================== */

function generatePatrolId() {

    const now = new Date();

    const yyyy = now.getFullYear();

    const MM = String(now.getMonth() + 1).padStart(2, "0");

    const dd = String(now.getDate()).padStart(2, "0");

    const hh = String(now.getHours()).padStart(2, "0");

    const mm = String(now.getMinutes()).padStart(2, "0");

    const ss = String(now.getSeconds()).padStart(2, "0");

    return `PTL${yyyy}${MM}${dd}${hh}${mm}${ss}`;

}

/* ==========================================
   START PATROL
========================================== */

function startPatrol() {

    const patrolId = generatePatrolId();

    localStorage.setItem("patrolId", patrolId);

    localStorage.setItem("patrolStatus", "ACTIVE");

    localStorage.setItem("patrolStart", Date.now());

    loadSession();

}

/* ==========================================
   FINISH PATROL
========================================== */

function finishPatrol() {

    localStorage.removeItem("patrolId");

    localStorage.removeItem("patrolStatus");

    localStorage.removeItem("patrolStart");

    clearInterval(patrolTimer);

    loadSession();

}

/* ==========================================
   LOAD SESSION
========================================== */

function loadSession() {

    const status =
    localStorage.getItem("patrolStatus");

    const patrolId =
    localStorage.getItem("patrolId");

    const patrolStart =
    localStorage.getItem("patrolStart");

    const statusEl =
    document.getElementById("patrolStatus");

    const patrolIdEl =
    document.getElementById("patrolId");

    const startEl =
    document.getElementById("patrolStart");

    const durationEl =
    document.getElementById("patrolDuration");

    const btn =
    document.getElementById("btnSession");

    if (!status) {

        statusEl.textContent = "BELUM START";

        patrolIdEl.textContent = "-";

        startEl.textContent = "-";

        durationEl.textContent = "00:00:00";

        btn.innerHTML =
        "▶ START PATROL";

        btn.onclick =
        startPatrol;

        return;

    }

    statusEl.textContent =
    "🟢 ACTIVE";

    patrolIdEl.textContent =
    patrolId;

    const startDate =
    new Date(Number(patrolStart));

    startEl.textContent =
    startDate.toLocaleTimeString("id-ID");

    btn.innerHTML =
    "■ FINISH PATROL";

    btn.onclick =
    finishPatrol;

    updateTimer();

}

/* ==========================================
   TIMER
========================================== */

function updateTimer() {

    clearInterval(patrolTimer);

    patrolTimer = setInterval(function () {

        const start =
        Number(localStorage.getItem("patrolStart"));

        const diff =
        Math.floor((Date.now() - start) / 1000);

        const hh =
        String(Math.floor(diff / 3600)).padStart(2, "0");

        const mm =
        String(Math.floor(diff % 3600 / 60)).padStart(2, "0");

        const ss =
        String(diff % 60).padStart(2, "0");

        document.getElementById("patrolDuration").textContent =
        `${hh}:${mm}:${ss}`;

    }, 1000);

}

/* ==========================================
   STATUS
========================================== */

function isPatrolActive() {

    return localStorage.getItem("patrolStatus") === "ACTIVE";

}
