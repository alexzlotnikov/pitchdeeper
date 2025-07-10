import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
            <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
              <p className="text-muted-foreground mb-3">
                When you use PitchDeeper AI, we collect and process the following information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Pitch deck files you upload for analysis</li>
                <li>Technical information such as IP address, browser type, and device information</li>
                <li>Usage data including how you interact with our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-3">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Provide AI-powered pitch deck analysis</li>
                <li>Improve our service and user experience</li>
                <li>Communicate with you about our service</li>
                <li>Ensure the security and proper functioning of our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Data Processing and Third Parties</h2>
              <p className="text-muted-foreground mb-3">
                Your pitch deck data is processed through AI and third-party services to provide analysis. 
                We work with the following types of service providers:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>AI analysis providers (Google Gemini API)</li>
                <li>Cloud hosting services</li>
                <li>Analytics and monitoring services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Data Retention</h2>
              <p className="text-muted-foreground">
                We do not permanently store your pitch deck files. Files are processed for analysis and then deleted. 
                Usage data and analytics may be retained for service improvement purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights</h2>
              <p className="text-muted-foreground mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Request information about how your data is processed</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Contact us with any privacy concerns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us through our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
