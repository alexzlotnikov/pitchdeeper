import { useState } from 'react';
import { Link } from 'wouter';
import { FileUpload } from '@/components/FileUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    toast({
      title: "File uploaded successfully",
      description: `${file.name} is ready for analysis.`,
    });
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setAnalysisComplete(false);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      console.log('Starting analysis for file:', uploadedFile.name);

      const response = await fetch('/api/analyze-pitch', {
        method: 'POST',
        body: formData,
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        
        // Handle specific error types without page refresh
        let errorMessage = 'Analysis failed. Please try again.';
        
        if (errorData.error) {
          const message = errorData.error;
          if (message.includes('API_KEY_MISSING')) {
            errorMessage = 'AI service is not configured. Please contact support.';
          } else if (message.includes('FILE_TOO_LARGE')) {
            errorMessage = 'File is too large. Please upload a file smaller than 50MB.';
          } else if (message.includes('INVALID_FILE_TYPE')) {
            errorMessage = 'Please upload a PDF or PowerPoint file (.pdf, .ppt, .pptx).';
          } else if (message.includes('quota') || message.includes('limit')) {
            errorMessage = 'AI service is temporarily busy. Please try again in a few minutes.';
          } else {
            errorMessage = message;
          }
        }
        
        // Don't throw error, just show toast and reset state
        toast({
          title: "Analysis failed", 
          description: errorMessage,
          variant: "destructive",
        });
        
        setIsAnalyzing(false);
        return; // Early return to prevent further execution
      }

      const analysisData = await response.json();
      console.log('Analysis data received:', analysisData);
      
      setAnalysisResults(analysisData);
      setAnalysisComplete(true);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Your pitch deck has been thoroughly reviewed by AI.",
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Prevent any navigation or page refresh
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      
      toast({
        title: "Analysis failed", 
        description: errorMessage,
        variant: "destructive",
      });
      
      // Always reset analyzing state
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setUploadedFile(null);
    setAnalysisComplete(false);
    setAnalysisResults(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-elegant">
              <Target className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">PitchDeeper AI</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get brutally honest feedback from an AI that thinks like a seasoned VC. 
            Upload your pitch deck and prepare for the tough questions real investors will ask.
          </p>
          
          {/* Support Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <a 
              href="https://paypal.me/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              💳 Support Us (PayPal)
            </a>
            <a 
              href="https://buymeacoffee.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              ☕ Buy Me a Coffee
            </a>
          </div>
        </div>

        {!analysisComplete ? (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Features */}
            {!uploadedFile && (
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="text-center p-6 bg-gradient-card rounded-xl border border-border shadow-card">
                  <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Content Analysis</h3>
                  <p className="text-sm text-muted-foreground">Deep dive into your story, market opportunity, and business model</p>
                </div>
                <div className="text-center p-6 bg-gradient-card rounded-xl border border-border shadow-card">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Design Critique</h3>
                  <p className="text-sm text-muted-foreground">Professional feedback on visual appeal and slide design</p>
                </div>
                <div className="text-center p-6 bg-gradient-card rounded-xl border border-border shadow-card">
                  <Brain className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Investor Questions</h3>
                  <p className="text-sm text-muted-foreground">Predict the tough questions VCs will ask you</p>
                </div>
              </div>
            )}

            {/* File Upload */}
            <FileUpload 
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
              onRemoveFile={handleRemoveFile}
            />

            {/* Analyze Button */}
            {uploadedFile && (
              <div className="text-center">
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-8 py-3 text-lg shadow-elegant"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="h-5 w-5 mr-2 animate-pulse" />
                      Analyzing Your Pitch...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Get Brutal Feedback
                    </>
                  )}
                </Button>
                {isAnalyzing && (
                  <p className="text-muted-foreground mt-3 text-sm">
                    This usually takes 30-60 seconds. We're analyzing every slide for content, design, and investor appeal.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Results</h2>
                <p className="text-muted-foreground">Here's your brutally honest feedback</p>
              </div>
              <Button 
                onClick={handleNewAnalysis}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Analyze New Deck
              </Button>
            </div>

            {/* Analysis Results */}
            {analysisResults && <AnalysisResults analysis={analysisResults} />}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2024 PitchDeeper AI. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your pitch deck data is processed through AI and third-party services to provide analysis. Decks are not saved.
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
