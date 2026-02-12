const WebSocket = require("ws");
const db = require("./database/db");
const { randomUUID } = require("crypto");


const wss = new WebSocket.Server({ port: 9001 });

console.log("Slate WS running on ws://localhost:9001");

wss.on("connection", ws => {

  ws.on("message", message => {

    const data = JSON.parse(message);

    console.log("Stroke received:", data);

  
    const detectedAnswer = Math.floor(Math.random() * 4);

    const id = randomUUID();

    db.run(`
      INSERT INTO answers
      (id, student_id, question_id, answer, source)
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      id,
      data.student_id,
      data.question_id,
      detectedAnswer,
      "slate"
    ]);

    ws.send(JSON.stringify({
      status: "answer recorded",
      answer: detectedAnswer
    }));

  });

});
