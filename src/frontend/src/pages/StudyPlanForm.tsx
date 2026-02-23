import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useStudyPlanMutations } from '@/hooks/useQueries';
import type { SubjectInput, StudyPlan } from '@/types/studyPlan';
import { generateStudyPlan } from '@/lib/studyPlanGenerator';

export default function StudyPlanForm() {
  const navigate = useNavigate();
  const { addSessionMutation } = useStudyPlanMutations();
  const [dailyHours, setDailyHours] = useState<string>('3');
  const [subjects, setSubjects] = useState<SubjectInput[]>([
    { id: '1', name: '', examDate: '', difficulty: 'medium' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addSubject = () => {
    const newId = (Math.max(...subjects.map(s => parseInt(s.id)), 0) + 1).toString();
    setSubjects([...subjects, { id: newId, name: '', examDate: '', difficulty: 'medium' }]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof SubjectInput, value: string) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const validateForm = (): boolean => {
    if (!dailyHours || parseFloat(dailyHours) <= 0) {
      toast.error('Please enter valid daily study hours');
      return false;
    }

    for (const subject of subjects) {
      if (!subject.name.trim()) {
        toast.error('Please fill in all subject names');
        return false;
      }
      if (!subject.examDate) {
        toast.error('Please set exam dates for all subjects');
        return false;
      }
      const examDate = new Date(subject.examDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (examDate < today) {
        toast.error(`Exam date for ${subject.name} must be in the future`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsGenerating(true);

    try {
      // Generate study plan using AI algorithm
      const studyPlan: StudyPlan = generateStudyPlan(subjects, parseFloat(dailyHours));

      // Save sessions to backend
      for (const session of studyPlan.sessions) {
        await addSessionMutation.mutateAsync({
          subject: session.subject,
          startTime: BigInt(session.startTime),
          endTime: BigInt(session.endTime),
        });
      }

      toast.success('Study plan generated successfully!', {
        description: `Created ${studyPlan.sessions.length} study sessions across ${studyPlan.totalDays} days`,
      });

      // Navigate to progress page
      setTimeout(() => {
        navigate({ to: '/progress' });
      }, 1000);
    } catch (error) {
      console.error('Error generating study plan:', error);
      toast.error('Failed to generate study plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chart-1/10 border border-chart-1/20 text-sm font-medium text-chart-1 mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Schedule Generation
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Create Your Study Plan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your subjects, exam dates, and available study time. Our AI will create an optimized schedule for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Daily Study Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Study Time</CardTitle>
              <CardDescription>How many hours can you study each day?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="dailyHours">Hours per day</Label>
                <Input
                  id="dailyHours"
                  type="number"
                  min="0.5"
                  max="16"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                  placeholder="e.g., 3"
                  className="max-w-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Subjects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Subjects</CardTitle>
                  <CardDescription>Add all subjects you need to study for</CardDescription>
                </div>
                <Button type="button" onClick={addSubject} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {subjects.map((subject, index) => (
                <div key={subject.id} className="p-4 sm:p-6 border-2 border-border rounded-xl space-y-4 bg-card hover:border-chart-1/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Subject {index + 1}</h3>
                    {subjects.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubject(subject.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor={`subject-name-${subject.id}`}>Subject Name</Label>
                      <Input
                        id={`subject-name-${subject.id}`}
                        value={subject.name}
                        onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                        placeholder="e.g., Mathematics"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`exam-date-${subject.id}`} className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Exam Date
                      </Label>
                      <Input
                        id={`exam-date-${subject.id}`}
                        type="date"
                        value={subject.examDate}
                        onChange={(e) => updateSubject(subject.id, 'examDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`difficulty-${subject.id}`}>Difficulty Level</Label>
                      <Select
                        value={subject.difficulty}
                        onValueChange={(value) => updateSubject(subject.id, 'difficulty', value)}
                      >
                        <SelectTrigger id={`difficulty-${subject.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isGenerating}
              className="px-12 shadow-lg hover:shadow-xl transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Study Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
