export interface Question {
  id: number;
  text: string;
  options: string[];
}

export interface Answer {
  student_id: string;
  question_id: number;
  answer: number;
  source: string;
}
