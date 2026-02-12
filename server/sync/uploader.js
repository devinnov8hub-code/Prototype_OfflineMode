// uploader for sync.
const db = require("../database/db");

function syncToCloud() {

  db.all("SELECT * FROM answers", [], (err, rows) => {

    console.log("Syncing answers to cloud…");
    console.log(rows);

    // Here you POST to SaaS API

  });

}

module.exports = syncToCloud;
