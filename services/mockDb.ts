import { Subject, Exam, User, UserRole, Topic, ExamResult } from '../types';

// Initial Mock Data
const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics', description: 'Algebra, Calculus, and Geometry', createdAt: new Date().toISOString() },
  { id: '2', name: 'Science', description: 'Physics, Chemistry, and Biology', createdAt: new Date().toISOString() },
  { id: '3', name: 'Computer Science', description: 'Algorithms, Data Structures, and Systems', createdAt: new Date().toISOString() },
];

const INITIAL_EXAMS: Exam[] = [
  { id: '101', subjectId: '1', name: 'SAT Math', description: 'Standardized test prep for College', topics: ['Algebra', 'Geometry'] },
  { id: '102', subjectId: '3', name: 'AWS Certified Practitioner', description: 'Cloud computing basics', topics: ['Cloud Concepts', 'Security', 'Billing'] },
];

const INITIAL_TOPICS: Topic[] = [
  { id: 't1', examId: '101', name: 'Linear Equations' },
  { id: 't2', examId: '101', name: 'Quadratics' },
  { id: 't3', examId: '102', name: 'EC2 Instances' },
];

const MOCK_RESULTS: ExamResult[] = [
  { 
    id: 'r1', 
    examName: 'SAT Math', 
    score: 8, 
    totalQuestions: 10, 
    date: new Date(Date.now() - 86400000).toISOString(),
    difficultyBreakdown: { easy: 3, medium: 4, hard: 1 }
  },
  { 
    id: 'r2', 
    examName: 'AWS Certified Practitioner', 
    score: 6, 
    totalQuestions: 10, 
    date: new Date(Date.now() - 172800000).toISOString(),
    difficultyBreakdown: { easy: 4, medium: 2, hard: 0 }
  }
];

class MockDB {
  private subjects: Subject[] = INITIAL_SUBJECTS;
  private exams: Exam[] = INITIAL_EXAMS;
  private topics: Topic[] = INITIAL_TOPICS;
  private results: ExamResult[] = MOCK_RESULTS;

  // Subjects
  getSubjects() { return this.subjects; }
  addSubject(subject: Omit<Subject, 'id' | 'createdAt'>) {
    const newSubject = { ...subject, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    this.subjects = [...this.subjects, newSubject];
    return newSubject;
  }
  deleteSubject(id: string) {
    this.subjects = this.subjects.filter(s => s.id !== id);
    // Cascade delete
    this.exams = this.exams.filter(e => e.subjectId !== id);
  }

  // Exams
  getExams(subjectId?: string) {
    if (subjectId) return this.exams.filter(e => e.subjectId === subjectId);
    return this.exams;
  }
  addExam(exam: Omit<Exam, 'id'>) {
    const newExam = { ...exam, id: Math.random().toString(36).substr(2, 9) };
    this.exams = [...this.exams, newExam];
    return newExam;
  }
  deleteExam(id: string) {
    this.exams = this.exams.filter(e => e.id !== id);
  }

  // Topics
  getTopics(examId?: string) {
    if (examId) return this.topics.filter(t => t.examId === examId);
    return this.topics;
  }
  addTopic(topic: Omit<Topic, 'id'>) {
    const newTopic = { ...topic, id: Math.random().toString(36).substr(2, 9) };
    this.topics = [...this.topics, newTopic];
    return newTopic;
  }
  deleteTopic(id: string) {
    this.topics = this.topics.filter(t => t.id !== id);
  }

  // Results
  getResults() { return this.results; }
  addResult(result: ExamResult) {
    this.results = [result, ...this.results];
  }
}

export const db = new MockDB();
