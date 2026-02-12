import { defineStore } from "pinia";
import api from "../services/api";
import { saveAnswer } from "../offline/db";
import type { Question } from "../types";

export const useExamStore = defineStore("exam", {
  state: () => ({
    questions: [] as Question[],
    currentIndex: 0
  }),

  actions: {

    async loadQuestions() {
      const res = await api.get<Question[]>("/exam/questions");
      this.questions = res.data;
    },

    async submitAnswer(i: number) {

      const q = this.questions[this.currentIndex];

      const payload = {
        student_id: "student1",
        question_id: q.id,
        answer: i,
        source: "obj"
      };

      await saveAnswer(payload);

      try {
        await api.post("/answers/submit", payload);
      } catch {
        console.log("Offline — saved locally");
      }

      this.currentIndex++;
    }
  }
});
