import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Pitch analysis API route
  app.post('/api/analyze-pitch', upload.single('file'), async (req, res) => {
    try {
      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        console.error('Groq API key not configured');
        return res.status(500).json({
          error: 'AI service not configured. Please contact support.',
          code: 'API_KEY_MISSING'
        });
      }

      const file = req.file;
      if (!file) {
        console.error('No file uploaded');
        return res.status(400).json({
          error: 'No file was uploaded. Please select a file and try again.',
          code: 'NO_FILE'
        });
      }

      console.log('Processing file:', file.originalname, 'Type:', file.mimetype, 'Size:', file.size);

      // Validate file type and size
      const fileExtension = file.originalname.toLowerCase().split('.').pop();
      const isValidPitchDeck = ['pdf', 'ppt', 'pptx'].includes(fileExtension || '');
      const maxSizeBytes = 50 * 1024 * 1024; // 50MB
      
      if (!isValidPitchDeck) {
        return res.status(400).json({
          error: 'Please upload a PDF or PowerPoint file (.pdf, .ppt, .pptx)',
          code: 'INVALID_FILE_TYPE'
        });
      }

      if (file.size > maxSizeBytes) {
        return res.status(400).json({
          error: 'File size too large. Please upload a file smaller than 50MB.',
          code: 'FILE_TOO_LARGE'
        });
      }

      const analysisPrompt = `
You are a seasoned venture capitalist with 20+ years of experience reviewing pitch decks. You are starting fresh with this deck analysis - no memory of previous decks.

CRITICAL ANALYSIS RULES:
1. FRESH ANALYSIS: This is a completely new deck analysis with no memory of previous files
2. REALISTIC SLIDE COUNT: Estimate slide count based on file size - small files (under 5MB) typically have 8-12 slides, medium files (5-15MB) have 12-18 slides, large files (15MB+) have 18-25 slides
3. INFER CONTENT: Based on file name and size, make educated guesses about the company and content
4. VARY SCORES: Use realistic score distribution (25-90 range), avoid repetitive numbers
5. PERSONALIZED RESPONSES: All investor question answers should be written as the FOUNDER responding directly to investors (use "I/we" not "they should say")
6. COMPANY-SPECIFIC SUGGESTIONS: Tailor all content suggestions to the inferred company, not generic advice

SLIDE NAMING REQUIREMENTS:
- ALWAYS provide descriptive slide names like "Title Slide", "Problem Statement", "Solution Overview", "Market Size", "Business Model", "Traction", "Team", "Competition", "Financial Projections", "Funding Ask", etc.
- NEVER use just numbers or generic titles
- Match slide count to realistic expectations based on file size

File Analysis:
- Name: ${file.originalname}
- Type: ${file.mimetype} 
- Size: ${Math.round(file.size / 1024 / 1024 * 100) / 100} MB

SLIDE COUNT ESTIMATION LOGIC:
- Under 2MB: 6-10 slides (basic pitch)
- 2-5MB: 10-15 slides (standard pitch)  
- 5-15MB: 15-20 slides (detailed pitch)
- 15MB+: 20-25 slides (comprehensive pitch)

ANALYSIS APPROACH:
1. Start completely fresh - no memory of previous analyses
2. Infer company type/industry from filename and estimate appropriate slide count
3. Generate company info that makes sense for the filename/context  
4. Create specific, personalized feedback as if you actually reviewed this exact deck
5. Write investor answers in first person as the founder would respond
6. Ensure slide count matches file size expectations

Provide your analysis in the following JSON format:

{
  "companyInfo": {
    "name": "Company name extracted from deck",
    "industry": "Industry/sector", 
    "stage": "Startup stage (seed, series A, etc)",
    "location": "Company location if mentioned",
    "description": "One-liner describing what the company does"
  },
  "overallScore": number (0-100),
  "sections": [
    {
      "title": "Problem & Solution",
      "score": number (0-100),
      "strengths": ["strength1", "strength2"],
      "issues": ["issue1", "issue2"],
      "recommendations": ["rec1", "rec2", "rec3"]
    },
    {
      "title": "Market Opportunity",
      "score": number (0-100),
      "strengths": ["strength1"],
      "issues": ["issue1", "issue2"],
      "recommendations": ["rec1", "rec2", "rec3"]
    },
    {
      "title": "Business Model",
      "score": number (0-100),
      "strengths": ["strength1"],
      "issues": ["issue1", "issue2"],
      "recommendations": ["rec1", "rec2", "rec3"]
    },
    {
      "title": "Traction & Metrics",
      "score": number (0-100),
      "strengths": ["strength1", "strength2"],
      "issues": ["issue1"],
      "recommendations": ["rec1", "rec2", "rec3"]
    }
  ],
  "investorQuestionsWithAnswers": [
    {
      "question": "How will you acquire customers and scale your user base?",
      "suggestedAnswer": "I plan to leverage [specific channels based on the company]. Our initial traction shows that [specific metric], and we're targeting to reach [goal] by [timeframe]. We'll focus on [specific strategy relevant to company]..."
    },
    {
      "question": "What makes you different from competitors in this space?",
      "suggestedAnswer": "Our key differentiator is [specific advantage]. Unlike competitors who [common approach], we [unique approach]. This gives us [specific benefit] which is crucial because [reason specific to industry]..."
    },
    {
      "question": "Can you walk me through your unit economics?",
      "suggestedAnswer": "Our customer acquisition cost is [amount] and lifetime value is [amount], giving us a [ratio] LTV:CAC ratio. We achieve profitability at the unit level within [timeframe]. Our margins improve over time because [specific reason]..."
    },
    {
      "question": "How do you know customers actually want this?",
      "suggestedAnswer": "We've validated demand through [specific evidence]. Our retention rate is [percentage], and customers tell us [specific feedback]. We've seen [specific behavioral metric] which indicates strong product-market fit..."
    },
    {
      "question": "How will you use the funding and what's your runway?",
      "suggestedAnswer": "We're raising [amount] to achieve [specific milestones]. The funding will be allocated to [breakdown by area]. This gives us [timeframe] runway to reach [specific goal], at which point we'll be [revenue/growth milestone]..."
    },
    {
      "question": "Why is your team uniquely positioned to solve this?",
      "suggestedAnswer": "I have [specific experience] in this industry, and my co-founder brings [complementary skills]. Together we've [relevant achievement]. Our domain expertise means we understand [specific insight] that others miss..."
    },
    {
      "question": "What are the biggest risks and how do you mitigate them?",
      "suggestedAnswer": "The main risks are [specific risks]. We mitigate [risk 1] by [strategy], and [risk 2] through [approach]. We've already seen [early indicator] that validates our risk management approach..."
    },
    {
      "question": "What's your go-to-market strategy?",
      "suggestedAnswer": "We're launching with [specific channel] because [reason specific to company]. Our sales process involves [specific approach]. We've tested this with [pilot customers/early adopters] and seen [specific results]..."
    },
    {
      "question": "Do you have any intellectual property or defensibility?",
      "suggestedAnswer": "Our defensibility comes from [specific moats]. We have [IP status] on [specific technology/process]. Additionally, our [network effects/data advantages/etc.] create barriers for competitors because [specific reason]..."
    },
    {
      "question": "What's your long-term vision and potential exit scenarios?",
      "suggestedAnswer": "We're building toward [specific vision]. In 5-7 years, I see us [specific position in market]. Potential acquirers would include [relevant companies] because we'd provide them [specific strategic value]. The market opportunity supports [exit size] outcomes..."
    }
  ],
  "slideAnalysis": {
    "totalSlides": number,
    "recommendedSlides": number,
    "slideBySlide": [
      {
        "slideNumber": 1,
        "title": "Slide title if identifiable",
        "score": number (0-100),
        "strengths": ["what works well"],
        "issues": ["what needs improvement"],
        "recommendations": ["specific suggestions"]
      }
    ],
      "slideOptimization": {
        "currentOrder": ["Current slide names like 'Title Slide', 'Problem Statement', 'Solution Overview', etc."],
        "recommendedOrder": ["Optimized slide names like 'Hook & Vision', 'Problem Statement', 'Solution Demo', 'Market Opportunity', etc."],
        "rationale": "Why this order works better for investor storytelling",
        "slideContentSuggestions": [
          {
            "slideNumber": 1,
            "title": "Opening/Hook",
            "contentDescription": "What specific content should be on this slide based on the deck analysis",
            "keyElements": ["element1", "element2", "element3"]
          },
          {
            "slideNumber": 2,
            "title": "Problem Statement",
            "contentDescription": "What specific content should be on this slide based on the deck analysis",
            "keyElements": ["element1", "element2", "element3"]
          }
        ]
      }
  },
  "designFeedback": {
    "strengths": ["design strength1", "design strength2"],
    "issues": ["design issue1", "design issue2", "design issue3"],
    "recommendations": ["design rec1", "design rec2", "design rec3", "design rec4"]
  }
}

Be specific, actionable, and brutally honest. Focus on real issues that would concern investors. Each section should have 1-3 strengths, 1-3 issues, and 2-4 specific recommendations.

CRITICAL REQUIREMENTS:
- Generate EXACTLY 10 investor questions
- Generate slideContentSuggestions for EVERY slide in the recommendedOrder array
- Ensure all scores are varied and realistic (avoid repetitive numbers)
- Include compelling company description that explains what they do in one line
`;

      console.log('Sending request to Groq API...');

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-70b-versatile',
          messages: [
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 8192,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq API error:', response.status, errorText);
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Groq API response received');

      const analysisText = data.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Groq response');
      }

      const analysis = JSON.parse(jsonMatch[0]);
      console.log('Analysis completed successfully');

      res.json(analysis);

    } catch (error) {
      console.error('Error in analyze-pitch function:', error);
      res.status(500).json({
        error: error.message || 'Analysis failed',
        details: error.toString()
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
