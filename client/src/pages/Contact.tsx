import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link to="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
            <p className="text-muted-foreground mt-2">Get in touch with the PitchDeeper AI team</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  General Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For general questions, support, or feedback about PitchDeeper AI, please reach out to us.
                </p>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24-48 hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Feedback & Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We value your feedback! Let us know how we can improve PitchDeeper AI to better serve entrepreneurs and founders.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Feature requests</li>
                  <li>Bug reports</li>
                  <li>User experience improvements</li>
                  <li>Analysis quality feedback</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Help us continue improving PitchDeeper AI and supporting entrepreneurs worldwide.
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://paypal.me/yourusername" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      💳 Support via PayPal
                    </Button>
                  </a>
                  <a 
                    href="https://buymeacoffee.com/yourusername" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      ☕ Buy Me a Coffee
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
