export interface SubjectInput {
  id: string;
  name: string;
  examDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StudySession {
  subject: string;
  startTime: number;
  endTime: number;
  isRevision: boolean;
  dayNumber: number;
}

export interface StudyPlan {
  sessions: StudySession[];
  totalDays: number;
  dailyHours: number;
}
