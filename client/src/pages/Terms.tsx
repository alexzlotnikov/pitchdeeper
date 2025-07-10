import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
            <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using PitchDeeper AI, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Service Description</h2>
              <p className="text-muted-foreground mb-3">
                PitchDeeper AI provides AI-powered analysis of pitch deck presentations. Our service includes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Automated analysis of uploaded pitch deck files</li>
                <li>Feedback on content, structure, and presentation</li>
                <li>Simulated investor questions and suggested responses</li>
                <li>Design and formatting recommendations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">User Responsibilities</h2>
              <p className="text-muted-foreground mb-3">
                When using our service, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Only upload content you own or have permission to analyze</li>
                <li>Not upload malicious, illegal, or inappropriate content</li>
                <li>Use the service for legitimate business purposes only</li>
                <li>Not attempt to reverse engineer or exploit our AI systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Data Processing</h2>
              <p className="text-muted-foreground">
                By using our service, you acknowledge and consent that your uploaded pitch deck data will be processed 
                through AI and third-party services to provide analysis. We do not permanently store your pitch deck files, 
                but they may be temporarily processed by our AI partners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Disclaimer</h2>
              <p className="text-muted-foreground">
                The analysis provided by PitchDeeper AI is for informational purposes only and should not be considered 
                as professional investment advice. The AI analysis is based on general patterns and may not reflect 
                the actual opinions of real investors. Always consult with qualified professionals for investment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                PitchDeeper AI shall not be liable for any direct, indirect, incidental, special, or consequential damages 
                resulting from the use or inability to use our service, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Continued use of the service after changes 
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us through our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
