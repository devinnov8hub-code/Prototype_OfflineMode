import { createRouter, createWebHistory } from "vue-router";
import Exam from "../views/ExamView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Exam
    }
  ]
});

export default router;
