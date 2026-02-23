import type { SubjectInput, StudyPlan, StudySession } from '@/types/studyPlan';

const DIFFICULTY_MULTIPLIERS = {
  easy: 1.0,
  medium: 1.3,
  hard: 1.6,
};

const REVISION_DAYS_BEFORE_EXAM = 2;

export function generateStudyPlan(subjects: SubjectInput[], dailyHours: number): StudyPlan {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate priority scores for each subject
  const subjectsWithPriority = subjects.map(subject => {
    const examDate = new Date(subject.examDate);
    examDate.setHours(0, 0, 0, 0);
    const daysUntilExam = Math.max(1, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[subject.difficulty];
    
    // Priority score: higher difficulty and closer exams get higher priority
    const priorityScore = (difficultyMultiplier * 100) / daysUntilExam;
    
    return {
      ...subject,
      examDate: examDate,
      daysUntilExam,
      priorityScore,
      hoursNeeded: dailyHours * daysUntilExam * 0.6 * difficultyMultiplier, // 60% of available time, adjusted by difficulty
    };
  });

  // Sort by priority (highest first)
  subjectsWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);

  // Calculate total days needed
  const maxDaysUntilExam = Math.max(...subjectsWithPriority.map(s => s.daysUntilExam));
  const totalDays = Math.min(maxDaysUntilExam, 90); // Cap at 90 days

  // Generate study sessions
  const sessions: StudySession[] = [];
  let currentDay = 0;

  // Distribute study time across days
  while (currentDay < totalDays) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + currentDay);
    
    let remainingHoursToday = dailyHours;
    
    // For each subject, check if we should study it today
    for (const subject of subjectsWithPriority) {
      if (remainingHoursToday <= 0) break;
      
      const daysUntilThisExam = Math.ceil((subject.examDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Skip if exam has passed
      if (daysUntilThisExam < 0) continue;
      
      // Check if this is a revision day (within REVISION_DAYS_BEFORE_EXAM days of exam)
      const isRevisionDay = daysUntilThisExam <= REVISION_DAYS_BEFORE_EXAM && daysUntilThisExam > 0;
      
      // Determine if we should study this subject today
      const shouldStudyToday = isRevisionDay || 
        (daysUntilThisExam > REVISION_DAYS_BEFORE_EXAM && currentDay % Math.max(1, Math.floor(3 / subject.priorityScore)) === 0);
      
      if (shouldStudyToday) {
        // Allocate time based on priority and difficulty
        const hoursForThisSubject = Math.min(
          remainingHoursToday,
          isRevisionDay ? dailyHours * 0.8 : dailyHours * 0.4 * subject.priorityScore / 100
        );
        
        if (hoursForThisSubject >= 0.5) { // Minimum 30 minutes per session
          const startTime = currentDate.getTime() + (9 * 60 * 60 * 1000); // Start at 9 AM
          const endTime = startTime + (hoursForThisSubject * 60 * 60 * 1000);
          
          sessions.push({
            subject: subject.name,
            startTime: startTime * 1000, // Convert to nanoseconds for backend
            endTime: endTime * 1000,
            isRevision: isRevisionDay,
            dayNumber: currentDay + 1,
          });
          
          remainingHoursToday -= hoursForThisSubject;
        }
      }
    }
    
    currentDay++;
  }

  return {
    sessions,
    totalDays,
    dailyHours,
  };
}
