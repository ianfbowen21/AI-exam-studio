export interface Source {
  id: string;
  title: string;
  type: "notes" | "exam" | "problems";
  content: string;
  wordCount?: number;
}

export interface Question {
  id: string;
  type: "multiple-choice" | "short-answer" | "essay";
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface GeneratedExam {
  id: string;
  title: string;
  instructions: string;
  questions: Question[];
  latexCode: string;
  documentContent?: string;
  documentAnswerKey?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  format: "multiple-choice" | "short-answer" | "mixed" | "authentic";
  questionsCount: number;
  createdDate: string;
}

export interface QuestionGrade {
  questionId: string;
  correct: boolean;
  gradePercent: number;
  detailedFeedback: string;
}

export interface GradedResult {
  feedbackInp?: string;
  feedbackNarrative: string;
  questionGrades: QuestionGrade[];
  scorePercent: number;
  gradedDate: string;
}

export interface ClassWorkspace {
  id: string;
  name: string;
  description: string;
  sources: Source[];
  exams: GeneratedExam[];
  activeExamId?: string;
  gradedResults?: Record<string, GradedResult>; // examId -> score results
  activeAnswers?: Record<string, string>; // examId -> answers for active practice
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}
