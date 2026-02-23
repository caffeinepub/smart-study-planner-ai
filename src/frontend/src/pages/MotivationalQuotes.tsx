import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Quote } from 'lucide-react';
import { quotes } from '@/data/quotes';

export default function MotivationalQuotes() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center shadow-lg">
              <Quote className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Stay Motivated</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get inspired with motivational quotes to keep you focused on your academic journey.
          </p>
        </div>

        {/* Quote Card */}
        <Card className="border-2 bg-gradient-to-br from-chart-1/5 via-chart-2/5 to-chart-3/5">
          <CardContent className="p-8 sm:p-12 lg:p-16">
            <div className="space-y-8">
              <Quote className="h-12 w-12 text-chart-1 opacity-50" />
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-serif leading-relaxed">
                "{currentQuote.text}"
              </blockquote>
              <p className="text-lg sm:text-xl text-muted-foreground font-medium">
                — {currentQuote.author}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={getRandomQuote}
            className="px-8 shadow-lg hover:shadow-xl transition-all"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Get New Quote
          </Button>
        </div>

        {/* Quote Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
          {quotes.slice(0, 6).map((quote, index) => (
            <Card key={index} className="border hover:border-chart-1/50 transition-colors cursor-pointer" onClick={() => setCurrentQuote(quote)}>
              <CardContent className="p-6 space-y-3">
                <p className="text-sm sm:text-base font-medium leading-relaxed">
                  "{quote.text}"
                </p>
                <p className="text-sm text-muted-foreground">— {quote.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
