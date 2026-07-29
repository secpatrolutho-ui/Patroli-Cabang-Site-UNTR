/* ===================================================
   PATROLI DIGITAL CABANG & SITE
   CONFIGURATION
=================================================== */

/* ========= APPS SCRIPT ========= */

const API =
"https://script.google.com/macros/s/AKfycbwvMYlVBsxjef7-OVHqmiaUX0gecof7VEG2-JlMyp0sAeeJj_ANslssKDpXQJX-pbgY/exec";

/* ========= GPS ========= */

const GPS_OPTION = {

    enableHighAccuracy: true,

    timeout: 10000,

    maximumAge: 0

};

/* ========= DEFAULT ========= */

const DEFAULT_RADIUS = 50;

/* ========= STATUS ========= */

const STATUS = {

    SUCCESS: "success",

    ERROR: "error",

    PENDING: "pending",

    ACTIVE: "Active"

};
