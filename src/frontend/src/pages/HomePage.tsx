import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Calendar, TrendingUp, Sparkles, Target, Clock } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Planning',
      description: 'Intelligent algorithms prioritize your subjects based on exam dates and difficulty levels.',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Automatically generates daily study tasks optimized for your available time.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your completion rate and stay motivated with visual progress indicators.',
    },
    {
      icon: Target,
      title: 'Strategic Revision',
      description: 'Get revision day suggestions strategically placed before your exams.',
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden bg-gradient-to-br from-chart-1/10 via-chart-2/10 to-chart-3/10"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chart-1/10 border border-chart-1/20 text-sm font-medium text-chart-1 mb-4">
              <Sparkles className="h-4 w-4" />
              AI-Powered Study Planning
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
                Smart Study Planner AI
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your study routine with intelligent scheduling. Let AI help you prioritize subjects, 
              manage your time effectively, and achieve your academic goals with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/create-plan">
                <Button size="lg" className="text-base px-8 shadow-lg hover:shadow-xl transition-all">
                  <Calendar className="mr-2 h-5 w-5" />
                  Create Study Plan
                </Button>
              </Link>
              <Link to="/progress">
                <Button size="lg" variant="outline" className="text-base px-8">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  View Progress
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Study Smarter, Not Harder
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform helps you create personalized study schedules that adapt to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-chart-1/50 transition-all hover:shadow-lg group">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-1 to-chart-2 shadow-md group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 bg-gradient-to-br from-chart-1/5 via-chart-2/5 to-chart-3/5">
            <CardContent className="p-8 sm:p-12 lg:p-16">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <Clock className="h-16 w-16 mx-auto text-chart-1" />
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Ready to Transform Your Study Routine?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Start planning your study schedule today and experience the power of AI-driven learning optimization.
                </p>
                <Link to="/create-plan">
                  <Button size="lg" className="text-base px-8 shadow-lg hover:shadow-xl transition-all">
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
