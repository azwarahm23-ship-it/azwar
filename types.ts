
export enum ExamStatus {
  IDLE = 'IDLE',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  TEACHER = 'TEACHER'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface ExamSession {
  studentName: string;
  examTitle: string;
  questions: Question[];
  answers: Record<string, number>;
  startTime: number;
  endTime?: number;
  score?: number;
}

export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  aiFeedback: string;
}
