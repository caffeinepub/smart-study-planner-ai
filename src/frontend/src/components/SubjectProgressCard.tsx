import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { useStudyPlanMutations } from '@/hooks/useQueries';
import type { StudySession } from '@/backend';

interface SubjectProgressCardProps {
  subject: string;
  sessions: StudySession[];
}

export default function SubjectProgressCard({ subject, sessions }: SubjectProgressCardProps) {
  const { completeSessionMutation } = useStudyPlanMutations();
  
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.completed).length;
  const completionPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  const handleCompleteSession = async (sessionSubject: string) => {
    try {
      await completeSessionMutation.mutateAsync(sessionSubject);
      toast.success('Session marked as complete!');
    } catch (error) {
      toast.error('Failed to update session');
    }
  };

  // Get next incomplete session
  const nextSession = sessions.find(s => !s.completed);

  return (
    <Card className="border-2 hover:border-chart-1/30 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl">{subject}</span>
          <span className="text-2xl font-bold text-chart-1">{completionPercentage}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={completionPercentage} className="h-3" />
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{completedSessions} of {totalSessions} sessions completed</span>
          <span>{totalSessions - completedSessions} remaining</span>
        </div>

        {nextSession && !nextSession.completed && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Next Session</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(Number(nextSession.startTime) / 1000000).toLocaleDateString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCompleteSession(nextSession.subject)}
                disabled={completeSessionMutation.isPending}
              >
                {completeSessionMutation.isPending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {completionPercentage === 100 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-chart-2/10 text-chart-2">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">All sessions completed!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
