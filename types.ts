export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  topics: string[];
}

export interface Topic {
  id: string;
  examId: string;
  name: string;
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: Difficulty;
  topic: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: string;
  masteryLevel: number; // 0-5
}

export interface ExamResult {
  id: string;
  examName: string;
  score: number;
  totalQuestions: number;
  date: string;
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
}
