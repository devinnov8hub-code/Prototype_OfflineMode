import { openDB } from "idb";
import type { Answer } from "../types";

export const dbPromise = openDB("exam-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("answers")) {
      db.createObjectStore("answers", { keyPath: "question_id" });
    }
  }
});

export async function saveAnswer(answer: Answer) {
  const db = await dbPromise;
  await db.put("answers", answer);
}

export async function getAllAnswers() {
  const db = await dbPromise;
  return db.getAll("answers");
}
