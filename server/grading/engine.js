const db = require("../database/db");

function gradeStudent(student_id) {

  return new Promise((resolve) => {

    db.all(`
      SELECT a.answer, q.correct_answer
      FROM answers a
      JOIN questions q
      ON a.question_id = q.id
      WHERE a.student_id = ?
    `,
    [student_id],
    (err, rows) => {

      let score = 0;

      rows.forEach(r => {
        if (r.answer === r.correct_answer) {
          score++;
        }
      });

      resolve(score);

    });

  });

}

module.exports = gradeStudent;
