import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini API client if API key is provided
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with provided key:', err);
  }
}

// AI Status check endpoint
app.get('/api/ai/status', (req: Request, res: Response) => {
  res.json({
    configured: Boolean(ai),
    model: 'gemini-3.8-flash',
    message: ai 
      ? 'Gemini 3.8 Flash is ready for AI resume generation and enhancement.'
      : 'Gemini API key is not configured in environment. Smart deterministic fallback is enabled.',
  });
});

// AI Summary Generator endpoint
app.post('/api/ai/summary', async (req: Request, res: Response) => {
  const { fullName, jobTitle, experience, skills, targetRole } = req.body;

  if (ai) {
    try {
      const prompt = `You are a professional resume writer and career coach.
Create 3 distinct professional summary options for this person's resume:
1. Impact-Driven (focuses on measurable achievements and high business value)
2. Skills & Technical Expertise (focuses on core competencies and technical depth)
3. Concise & Direct (2-3 punchy sentences perfect for ATS systems)

Candidate Details:
Name: ${fullName || 'Candidate'}
Current/Recent Title: ${jobTitle || 'Professional'}
Target Role: ${targetRole || jobTitle || 'Target Role'}
Top Skills: ${skills || 'Not specified'}
Experience Highlights: ${experience || 'Not specified'}

Safety and Truthfulness:
- Never invent imaginary employers or fake metrics.
- Output ONLY valid JSON in this exact structure:
{
  "options": [
    { "title": "Impact-Driven", "summary": "..." },
    { "title": "Skills & Expertise", "summary": "..." },
    { "title": "Concise ATS", "summary": "..." }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, ...parsed, provider: 'gemini' });
      } catch {
        return res.json({
          success: true,
          options: [{ title: 'Professional Summary', summary: responseText }],
          provider: 'gemini',
        });
      }
    } catch (error: any) {
      console.error('Gemini summary error:', error);
      // Fallback below
    }
  }

  // Deterministic fallback if API is not active or fails
  const role = targetRole || jobTitle || 'experienced professional';
  const skillList = skills ? skills.split(',').slice(0, 3).join(', ') : 'strategic problem-solving and cross-functional leadership';
  
  res.json({
    success: true,
    provider: 'local-engine',
    options: [
      {
        title: 'Impact-Driven',
        summary: `Results-focused ${role} with a proven track record of driving operational efficiency, delivering scalable solutions, and collaborating across multidisciplinary teams. Adept at leveraging ${skillList} to exceed organizational goals and consistently deliver high-quality outcomes.`,
      },
      {
        title: 'Skills & Expertise',
        summary: `Dynamic ${role} specialized in ${skillList}. Known for analytical rigor, attention to detail, and rapid adaptation to evolving industry methodologies. Committed to continuous improvement and delivering measurable value in fast-paced environments.`,
      },
      {
        title: 'Concise ATS',
        summary: `Accomplished ${role} with extensive experience in ${skillList}. Dedicated to engineering robust solutions, optimizing team workflows, and achieving mission-critical milestones.`,
      },
    ],
  });
});

// AI Bullet Improver endpoint
app.post('/api/ai/improve-bullet', async (req: Request, res: Response) => {
  const { rawText, role, company } = req.body;

  if (!rawText || !rawText.trim()) {
    return res.status(400).json({ error: 'Text to improve is required' });
  }

  if (ai) {
    try {
      const prompt = `You are an expert resume writer specializing in ATS-friendly, high-impact bullet points.
Rewrite the following raw job responsibility into 3 improved bullet points using the STAR method (Action Verb + Context/Task + Measurable Impact/Result).

Raw Text: "${rawText}"
Role: ${role || 'Team Member'}
Company: ${company || 'Organization'}

Guidelines:
- Start with strong action verbs (e.g., Architected, Spearheaded, Optimized, Streamlined, Championed).
- Keep each bullet between 15 and 30 words.
- Do NOT fabricate fake percentages or numbers if none were given; use realistic qualitative scale or bracketed placeholders like "[X%]" if relevant.
- Return ONLY valid JSON:
{
  "improvedBullets": [
    { "style": "Metric & Impact Focused", "text": "..." },
    { "style": "Leadership & Initiative", "text": "..." },
    { "style": "Streamlined & Concise", "text": "..." }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, ...parsed, provider: 'gemini' });
      } catch {
        return res.json({
          success: true,
          improvedBullets: [{ style: 'Polished', text: responseText }],
          provider: 'gemini',
        });
      }
    } catch (err: any) {
      console.error('Gemini bullet error:', err);
    }
  }

  // Deterministic local smart improvement
  const trimmed = rawText.trim().replace(/^[•\-\*]\s*/, '');
  const cleaned = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  
  res.json({
    success: true,
    provider: 'local-engine',
    improvedBullets: [
      {
        style: 'Action-Oriented',
        text: `Spearheaded initiatives to ${cleaned.toLowerCase()}, streamlining processes and enhancing overall operational productivity.`,
      },
      {
        style: 'Outcome-Focused',
        text: `Successfully executed key responsibilities in ${cleaned.toLowerCase()}, resulting in improved deliverable turnaround times and higher cross-functional team alignment.`,
      },
      {
        style: 'Concise Professional',
        text: `Orchestrated ${cleaned.toLowerCase()} while ensuring strict compliance with industry quality benchmarks and deadlines.`,
      },
    ],
  });
});

// AI Resume Tailoring endpoint
app.post('/api/ai/tailor', async (req: Request, res: Response) => {
  const { resumeText, jobDescription } = req.body;

  if (!jobDescription || !jobDescription.trim()) {
    return res.status(400).json({ error: 'Job description is required' });
  }

  if (ai) {
    try {
      const prompt = `Analyze this resume against the target job description. Provide practical, transparent ATS optimization advice:
1. Match Score (0 to 100) based purely on keyword & qualification overlap.
2. Missing Keywords: List the top 5-8 crucial skills or terms mentioned in the job description that are missing from the resume.
3. Tailoring Recommendations: 3-4 specific, actionable tips to align this resume with the role.
4. Positive Matches: 3-5 existing strengths already well aligned.

Resume Data:
${resumeText || 'None provided'}

Target Job Description:
${jobDescription}

Return ONLY valid JSON:
{
  "matchScore": 78,
  "missingKeywords": ["Docker", "Kubernetes", "GraphQL", "CI/CD pipelines"],
  "recommendations": [
    "Highlight experience with cloud-native architectures in your work history",
    "Add measurable performance metrics to your current role bullet points"
  ],
  "positiveMatches": [
    "Strong TypeScript and React background aligns directly with frontend requirements",
    "Demonstrated cross-functional collaboration matches team expectations"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, ...parsed, provider: 'gemini' });
    } catch (err) {
      console.error('Gemini tailor error:', err);
    }
  }

  // Local rule-based keyword extraction and comparison
  const commonTech = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'PostgreSQL', 'GraphQL', 'Tailwind CSS', 'Next.js', 'CI/CD', 'Git', 'Agile', 'REST API', 'Figma', 'System Design'];
  const jdLower = jobDescription.toLowerCase();
  const resumeLower = (resumeText || '').toLowerCase();
  
  const foundInJd = commonTech.filter(t => jdLower.includes(t.toLowerCase()));
  const missing = foundInJd.filter(t => !resumeLower.includes(t.toLowerCase()));
  const matched = foundInJd.filter(t => resumeLower.includes(t.toLowerCase()));
  
  const calculatedScore = Math.min(95, Math.max(50, Math.round(55 + (matched.length / Math.max(1, foundInJd.length)) * 35)));

  res.json({
    success: true,
    provider: 'local-engine',
    matchScore: calculatedScore,
    missingKeywords: missing.length ? missing : ['Cloud Architecture', 'Agile Methodologies', 'Performance Profiling'],
    recommendations: [
      'Mirror the exact terminology from the job description in your summary and experience bullets.',
      'Ensure your most relevant project highlights the technologies prominently featured in the job posting.',
      'Quantify results where possible (e.g., latency reduction, cost savings, user scale).',
    ],
    positiveMatches: matched.length ? matched.map(m => `Matched core competency: ${m}`) : ['General professional profile structure matches standard industry expectations'],
  });
});

// AI Skills Suggestion endpoint
app.post('/api/ai/suggest-skills', async (req: Request, res: Response) => {
  const { targetRole, existingSkills } = req.body;

  if (ai) {
    try {
      const prompt = `Suggest high-value skills for a ${targetRole || 'Software Professional'} resume.
Existing skills: ${existingSkills || 'None'}

Return ONLY valid JSON:
{
  "technical": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "soft": ["Skill 1", "Skill 2", "Skill 3"],
  "tools": ["Tool 1", "Tool 2", "Tool 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, ...parsed, provider: 'gemini' });
    } catch (err) {
      console.error('Gemini skills error:', err);
    }
  }

  // Local fallback
  res.json({
    success: true,
    provider: 'local-engine',
    technical: ['TypeScript', 'Next.js', 'PostgreSQL', 'GraphQL', 'Microservices', 'RESTful APIs'],
    soft: ['Cross-functional Collaboration', 'Technical Mentorship', 'Critical Thinking', 'Stakeholder Communication'],
    tools: ['Docker', 'Git / GitHub', 'Jest / Vitest', 'Postman', 'Figma', 'AWS'],
  });
});

// AI Grammar and Clarity checker endpoint
app.post('/api/ai/check-grammar', async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  if (ai) {
    try {
      const prompt = `Review this resume section for grammar, spelling, passive voice, weak action verbs, and clarity issues:
"${text}"

Return ONLY valid JSON:
{
  "issuesCount": 2,
  "suggestions": [
    {
      "original": "was responsible for managing",
      "replacement": "Managed and directed",
      "reason": "Avoid passive phrases like 'was responsible for'. Use direct action verbs."
    }
  ],
  "improvedVersion": "..."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, ...parsed, provider: 'gemini' });
    } catch (err) {
      console.error('Gemini grammar check error:', err);
    }
  }

  // Local rule-based check
  const weakPhrases = [
    { match: /responsible for/i, replacement: 'Spearheaded / Managed', reason: 'Replace passive "responsible for" with direct, active verbs.' },
    { match: /helped with/i, replacement: 'Facilitated / Accelerated', reason: 'Use authoritative verbs instead of "helped with".' },
    { match: /worked on/i, replacement: 'Developed / Engineered', reason: 'Specify the exact technical contribution.' },
    { match: /handled/i, replacement: 'Orchestrated / Administered', reason: 'Use more descriptive professional terminology.' }
  ];

  const suggestions: any[] = [];
  weakPhrases.forEach(item => {
    if (item.match.test(text)) {
      suggestions.push({
        original: text.match(item.match)?.[0] || '',
        replacement: item.replacement,
        reason: item.reason,
      });
    }
  });

  res.json({
    success: true,
    provider: 'local-engine',
    issuesCount: suggestions.length,
    suggestions,
    improvedVersion: text.replace(/responsible for/gi, 'led the development of').replace(/worked on/gi, 'architected'),
  });
});

// Setup Vite or static serving
async function setupServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`ResumeCraft server running on http://localhost:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
