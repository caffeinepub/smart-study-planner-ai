import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useProgressData } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import SubjectProgressCard from '@/components/SubjectProgressCard';
import { Link } from '@tanstack/react-router';

export default function ProgressTracker() {
  const { sessionsQuery, completionRateQuery } = useProgressData();

  const isLoading = sessionsQuery.isLoading || completionRateQuery.isLoading;
  const sessions = sessionsQuery.data || [];
  const completionRate = completionRateQuery.data ? Number(completionRateQuery.data) : 0;

  // Group sessions by subject
  const sessionsBySubject = sessions.reduce((acc, session) => {
    if (!acc[session.subject]) {
      acc[session.subject] = [];
    }
    acc[session.subject].push(session);
    return acc;
  }, {} as Record<string, typeof sessions>);

  const subjects = Object.keys(sessionsBySubject);
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.completed).length;

  // Calculate upcoming sessions (next 3 days)
  const now = Date.now();
  const threeDaysFromNow = now + (3 * 24 * 60 * 60 * 1000);
  const upcomingSessions = sessions
    .filter(s => !s.completed && Number(s.startTime) / 1000000 > now && Number(s.startTime) / 1000000 < threeDaysFromNow)
    .sort((a, b) => Number(a.startTime) - Number(b.startTime))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (totalSessions === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">No Study Plan Yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Create your first study plan to start tracking your progress and achieving your academic goals.
                </p>
              </div>
              <Link to="/create-plan">
                <Button size="lg" className="mt-4">
                  Create Study Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/assets/generated/progress-icon.dim_128x128.png" 
              alt="Progress" 
              className="h-16 w-16"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Your Progress</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your study sessions and monitor your completion rate across all subjects.
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription>Overall Completion</CardDescription>
              <CardTitle className="text-3xl sm:text-4xl font-bold text-chart-1">
                {completionRate}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionRate} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription>Sessions Completed</CardDescription>
              <CardTitle className="text-3xl sm:text-4xl font-bold">
                {completedSessions}/{totalSessions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-chart-2" />
                {totalSessions - completedSessions} remaining
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription>Total Subjects</CardDescription>
              <CardTitle className="text-3xl sm:text-4xl font-bold">
                {subjects.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-chart-3" />
                Active study plan
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Sessions */}
        {upcomingSessions.length > 0 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-chart-1" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Your next study sessions in the next 3 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingSessions.map((session, index) => {
                  const startDate = new Date(Number(session.startTime) / 1000000);
                  const endDate = new Date(Number(session.endTime) / 1000000);
                  const duration = Math.round((Number(session.endTime) - Number(session.startTime)) / 1000000 / 1000 / 60 / 60 * 10) / 10;
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                          <Clock className="h-5 w-5 text-chart-1" />
                        </div>
                        <div>
                          <p className="font-semibold">{session.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{duration}h</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subject Progress */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Progress by Subject</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((subject) => (
              <SubjectProgressCard
                key={subject}
                subject={subject}
                sessions={sessionsBySubject[subject]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
