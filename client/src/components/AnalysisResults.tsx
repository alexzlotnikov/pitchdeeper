import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, MessageSquare, Eye, Brain, Building2, Presentation, ArrowRight, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AnalysisSection {
  title: string;
  score: number;
  issues: string[];
  strengths: string[];
  recommendations: string[];
}

interface InvestorQuestionWithAnswer {
  question: string;
  suggestedAnswer: string;
}

interface SlideAnalysis {
  slideNumber: number;
  title: string;
  score: number;
  strengths: string[];
  issues: string[];
  recommendations: string[];
}

interface AnalysisResultsProps {
  analysis: {
    companyInfo: {
      name: string;
      industry: string;
      stage: string;
      location: string;
      description: string;
    };
    overallScore: number;
    sections: AnalysisSection[];
    investorQuestionsWithAnswers: InvestorQuestionWithAnswer[];
    slideAnalysis: {
      totalSlides: number;
      recommendedSlides: number;
      slideBySlide: SlideAnalysis[];
      slideOptimization: {
        currentOrder: string[];
        recommendedOrder: string[];
        rationale: string;
        slideContentSuggestions?: Array<{
          slideNumber: number;
          title: string;
          contentDescription: string;
          keyElements: string[];
        }>;
      };
    };
    designFeedback: {
      strengths: string[];
      issues: string[];
      recommendations: string[];
    };
  };
}

export const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleManualSubscription = () => {
    setIsSubscribed(true);
    localStorage.setItem('substack_subscription', 'subscribed');
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return XCircle;
  };

  // Check subscription status from Substack iframe
  useEffect(() => {
    const checkSubstackSubscription = () => {
      // Listen for messages from the Substack iframe
      const handleMessage = (event: MessageEvent) => {
        // Only process messages from trusted origins
        if (!event.origin || (!event.origin.includes('substack.com') && !event.origin.includes('foundterra.substack.com'))) {
          return;
        }
        
        try {
          if (event.data && (event.data.type === 'subscription_success' || event.data.subscribed === true)) {
            setIsSubscribed(true);
            localStorage.setItem('substack_subscription', 'subscribed');
          }
        } catch (error) {
          console.log('Error processing subscription message:', error);
        }
      };

      window.addEventListener('message', handleMessage);
      
      // Also check for Substack cookies or localStorage
      const checkSubstackData = () => {
        try {
          // Check if user has subscribed indicator in localStorage
          const substackData = localStorage.getItem('substack_subscription');
          if (substackData === 'subscribed') {
            setIsSubscribed(true);
          }
        } catch (error) {
          console.log('Unable to check subscription status');
        }
      };

      checkSubstackData();
      
      return () => window.removeEventListener('message', handleMessage);
    };

    checkSubstackSubscription();
  }, []);

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground">Overall Score</CardTitle>
            <div className="flex items-center gap-2">
              <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}/100
              </div>
              {(() => {
                const Icon = getScoreIcon(analysis.overallScore);
                return <Icon className={`h-6 w-6 ${getScoreColor(analysis.overallScore)}`} />;
              })()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className="bg-gradient-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${analysis.overallScore}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        {analysis.sections.map((section, index) => (
          <Card key={index} className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">{section.title}</CardTitle>
                <Badge variant={section.score >= 70 ? 'default' : 'destructive'}>
                  {section.score}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.strengths.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Strengths
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {section.strengths.map((strength, i) => (
                      <li key={i}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {section.issues.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-400 mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Issues
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {section.issues.map((issue, i) => (
                      <li key={i}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {section.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Recommendations
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {section.recommendations.map((rec, i) => (
                      <li key={i}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Design Feedback */}
      {analysis.designFeedback && (
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Design & Visual Appeal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.designFeedback.strengths && analysis.designFeedback.strengths.length > 0 && (
              <div>
                <h4 className="font-medium text-green-400 mb-2">Visual Strengths</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {analysis.designFeedback.strengths.map((strength, i) => (
                    <li key={i}>• {strength}</li>
                  ))}
                </ul>
              </div>
            )}

            <Separator className="bg-border" />

            {analysis.designFeedback.issues && analysis.designFeedback.issues.length > 0 && (
              <div>
                <h4 className="font-medium text-red-400 mb-2">Design Issues</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {analysis.designFeedback.issues.map((issue, i) => (
                    <li key={i}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}

            <Separator className="bg-border" />

            {analysis.designFeedback.recommendations && analysis.designFeedback.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-yellow-400 mb-2">Design Improvements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {analysis.designFeedback.recommendations.map((rec, i) => (
                    <li key={i}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Company Information */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">What They Do</h4>
              <p className="text-muted-foreground">{analysis.companyInfo.description}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-foreground mb-1">Company Name</h4>
                <p className="text-muted-foreground">{analysis.companyInfo.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Industry</h4>
                <p className="text-muted-foreground">{analysis.companyInfo.industry}</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Stage</h4>
                <p className="text-muted-foreground">{analysis.companyInfo.stage}</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Location</h4>
                <p className="text-muted-foreground">{analysis.companyInfo.location}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Gate */}
      {!isSubscribed ? (
        <Card className="bg-gradient-primary border-primary shadow-elegant overflow-hidden">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-4 bg-primary-foreground/10 rounded-full w-fit">
              <Star className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary-foreground mb-2">
              🚀 Unlock Your Complete Analysis
            </CardTitle>
            <div className="inline-flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-full">
              <Zap className="h-4 w-4 text-primary-foreground" />
              <span className="text-primary-foreground font-semibold">100% FREE • No Credit Card Required</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center">
              <p className="text-primary-foreground/90 text-lg mb-6">
                Get the complete investor-grade analysis worth <span className="font-bold text-primary-foreground">$500+</span> absolutely free. 
                Join thousands of founders who use our insights to close deals faster.
              </p>
              
              {/* Premium Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-primary-foreground/10 rounded-xl p-6 text-left">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-foreground/20 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-foreground mb-2">Investor Q&A Preparation</h4>
                      <p className="text-primary-foreground/80 text-sm">Get specific questions VCs will ask + winning answers that close deals</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary-foreground/10 rounded-xl p-6 text-left">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-foreground/20 rounded-lg">
                      <Presentation className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-foreground mb-2">Slide-by-Slide Breakdown</h4>
                      <p className="text-primary-foreground/80 text-sm">Detailed feedback on every slide with specific improvement actions</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary-foreground/10 rounded-xl p-6 text-left">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-foreground/20 rounded-lg">
                      <ArrowRight className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-foreground mb-2">Optimized Slide Flow</h4>
                      <p className="text-primary-foreground/80 text-sm">Reorder your slides for maximum investor impact and engagement</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary-foreground/10 rounded-xl p-6 text-left">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-foreground/20 rounded-lg">
                      <Brain className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-foreground mb-2">AI Content Suggestions</h4>
                      <p className="text-primary-foreground/80 text-sm">Specific content recommendations to strengthen weak areas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subscription Instructions */}
            <div className="text-center mb-4">
              <h3 className="font-semibold text-primary-foreground mb-2">Subscribe below to unlock your complete analysis</h3>
              <p className="text-primary-foreground/80 text-sm">Once you subscribe, the content will automatically unlock. No manual verification needed!</p>
            </div>
            
            {/* Substack Embed */}
            <div className="flex justify-center pt-4">
              <iframe 
                src="https://foundterra.substack.com/embed" 
                width="480" 
                height="240" 
                style={{border: '1px solid rgba(255,255,255,0.2)', background: 'white'}} 
                frameBorder="0" 
                scrolling="no"
                className="rounded-lg shadow-card opacity-80"
              />
            </div>
            
            {/* Manual Subscription Button */}
            <div className="text-center pt-4">
              <button
                onClick={handleManualSubscription}
                className="px-6 py-3 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border border-primary-foreground/40 rounded-lg transition-colors text-sm font-medium"
              >
                I promise, I've subscribed, give me access! 🚀
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Investor Questions with Answers */}
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Expected Investor Questions & Suggested Answers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Based on your pitch, here are the tough questions investors will likely ask and how you should answer them:
              </p>
              <div className="space-y-4">
                {analysis.investorQuestionsWithAnswers.map((qa, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="mb-3 p-3 bg-secondary rounded-lg border-l-4 border-primary">
                      <p className="text-foreground font-medium">Q{index + 1}: {qa.question}</p>
                    </div>
                    <div className="p-3 bg-gradient-card rounded-lg border-l-4 border-green-400">
                      <h5 className="text-green-400 font-medium mb-2">Suggested Answer:</h5>
                      <p className="text-muted-foreground">{qa.suggestedAnswer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Slide Analysis */}
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Presentation className="h-5 w-5" />
                Slide-by-Slide Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Slide Statistics */}
              <div className="grid md:grid-cols-3 gap-4 p-4 bg-secondary rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{analysis.slideAnalysis.totalSlides}</div>
                  <div className="text-sm text-muted-foreground">Current Slides</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{analysis.slideAnalysis.recommendedSlides}</div>
                  <div className="text-sm text-muted-foreground">Recommended Slides</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {analysis.slideAnalysis.totalSlides - analysis.slideAnalysis.recommendedSlides > 0 ? '-' : '+'}
                    {Math.abs(analysis.slideAnalysis.totalSlides - analysis.slideAnalysis.recommendedSlides)}
                  </div>
                  <div className="text-sm text-muted-foreground">Difference</div>
                </div>
              </div>

              {/* Individual Slides */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Individual Slide Feedback</h4>
                {analysis.slideAnalysis.slideBySlide.map((slide, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-foreground">
                        Slide {slide.slideNumber}: {slide.title}
                      </h5>
                      <Badge variant={slide.score >= 90 ? 'default' : slide.score >= 70 ? 'secondary' : 'destructive'}>
                        {slide.score}/100
                      </Badge>
                    </div>
                    
                    {slide.score >= 90 ? (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h6 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Excellent Slide - Keep as is!
                        </h6>
                        <ul className="text-sm text-green-600 space-y-1">
                          {slide.strengths.map((strength, i) => (
                            <li key={i}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {slide.strengths.length > 0 && (
                          <div>
                            <h6 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              What's Working
                            </h6>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {slide.strengths.map((strength, i) => (
                                <li key={i}>• {strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {slide.issues.length > 0 && (
                          <div>
                            <h6 className="font-medium text-red-400 mb-2 flex items-center gap-2">
                              <XCircle className="h-4 w-4" />
                              Issues to Fix
                            </h6>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {slide.issues.map((issue, i) => (
                                <li key={i}>• {issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {slide.recommendations.length > 0 && (
                          <div>
                            <h6 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                              <Brain className="h-4 w-4" />
                              Specific Improvements
                            </h6>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {slide.recommendations.map((rec, i) => (
                                <li key={i}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Slide Optimization */}
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Slide Order Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-3">Recommended Slide Order</h4>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-muted-foreground mb-2">Current Order</h5>
                    <div className="space-y-2">
                      {analysis.slideAnalysis.slideOptimization.currentOrder.map((slide, index) => (
                        <div key={index} className="p-2 bg-secondary rounded text-sm">
                          {index + 1}. {slide}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-primary mb-2">Optimized Order</h5>
                    <div className="space-y-2">
                      {analysis.slideAnalysis.slideOptimization.recommendedOrder.map((slide, index) => (
                        <div key={index} className="p-2 bg-gradient-card border border-primary rounded text-sm">
                          {index + 1}. {slide}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <h5 className="font-medium text-foreground mb-2">Why This Order Works Better</h5>
                <p className="text-muted-foreground text-sm">{analysis.slideAnalysis.slideOptimization.rationale}</p>
              </div>

              {/* Slide Content Suggestions */}
              {analysis.slideAnalysis.slideOptimization.slideContentSuggestions && (
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground mb-3">Detailed Content Suggestions</h4>
                  <div className="space-y-4">
                    {analysis.slideAnalysis.slideOptimization.slideContentSuggestions.map((suggestion, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline">{suggestion.slideNumber}</Badge>
                          <h5 className="font-medium text-foreground">{suggestion.title}</h5>
                        </div>
                        <p className="text-muted-foreground mb-3 text-sm">{suggestion.contentDescription}</p>
                        <div>
                          <h6 className="font-medium text-primary mb-2 text-sm">Key Elements to Include:</h6>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {suggestion.keyElements.map((element, i) => (
                              <li key={i}>• {element}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
