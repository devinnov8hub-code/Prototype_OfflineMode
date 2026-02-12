const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { randomUUID } = require("crypto");


router.post("/submit", (req, res) => {

  const { student_id, question_id, answer, source } = req.body;

  const id = randomUUID();

  db.run(`
    INSERT INTO answers
    (id, student_id, question_id, answer, source)
    VALUES (?, ?, ?, ?, ?)
  `,
  [id, student_id, question_id, answer, source],
  (err) => {

    if (err) return res.status(500).json(err);

    res.json({ status: "saved offline" });

  });

});

module.exports = router;
