import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
let genAI;
let model;

export const initGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set - AI features will not work');
    return false;
  }

  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  console.log('✅ Gemini API initialized with gemini-2.0-flash-exp');
  return true;
};

/**
 * Parse resume text into structured JSON
 * Extracts: name, email, education, experience, skills
 */
export const parseResumeText = async (resumeText) => {
  try {
    if (!model) {
      throw new Error('Gemini API not initialized');
    }

    const prompt = `You are a resume parser. Analyze this resume and extract structured information.

Resume Text:
${resumeText}

Return ONLY a JSON object (no markdown, no explanation) with this structure:
{
  "name": "candidate's full name",
  "email": "email address",
  "phone": "phone number",
  "education": [
    {
      "degree": "degree name",
      "institution": "university name",
      "year": "graduation year",
      "gpa": "GPA if mentioned"
    }
  ],
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "time period",
      "description": "what they did"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {
      "name": "project name",
      "description": "brief description",
      "technologies": ["tech1", "tech2"]
    }
  ]
}

If any field is missing, use empty string or empty array.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean response (remove markdown code blocks if present)
    const jsonText = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error('Failed to parse resume with AI');
  }
};

/**
 * Analyze resume against job description
 * Returns match score, matched skills, missing skills, and suggestions
 */
export const analyzeResumeForJob = async (resumeText, jobDescription) => {
  try {
    if (!model) {
      throw new Error('Gemini API not initialized');
    }

    const prompt = `You are an expert career counselor and ATS (Applicant Tracking System) analyzer.

CANDIDATE'S RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze how well this resume matches the job description and return ONLY a JSON object (no markdown, no explanation) with this structure:

{
  "matchScore": 85,
  "matchedSkills": [
    {"skill": "React", "occurrences": 3, "importance": "high"},
    {"skill": "Node.js", "occurrences": 2, "importance": "high"}
  ],
  "missingSkills": [
    {"skill": "Docker", "importance": "high", "category": "technical"},
    {"skill": "AWS", "importance": "medium", "category": "technical"}
  ],
  "suggestions": [
    {
      "priority": "high",
      "category": "skills",
      "suggestion": "Add Docker containerization experience from your existing projects"
    },
    {
      "priority": "medium",
      "category": "wording",
      "suggestion": "Change 'team collaboration' to 'Agile development' to match job requirements"
    }
  ],
  "tweakedContent": {
    "improvedSummary": "Improved professional summary that matches job keywords",
    "improvedExperience": [
      {
        "title": "Software Engineer",
        "company": "Company Name",
        "duration": "Jan 2023 - Present",
        "bullets": [
          "Developed full-stack web applications using React and Node.js",
          "Built RESTful APIs serving 10,000+ users"
        ]
      }
    ],
    "improvedSkills": "React, Node.js, Python, Docker, AWS, SQL",
    "additionalSections": {
      "education": [
        {
          "degree": "Bachelor of Science in Computer Science",
          "institution": "University Name",
          "year": "2024",
          "gpa": "3.8/4.0"
        }
      ],
      "projects": [
        {
          "name": "Project Name",
          "description": "Built an AI-powered application...",
          "technologies": "React, Python, TensorFlow"
        }
      ]
    }
  },
  "strengths": ["What the candidate does well", "Strong project portfolio"],
  "keywordAnalysis": {
    "jobKeywords": ["React", "Node.js", "Docker", "AWS"],
    "resumeKeywords": ["React", "Node.js"],
    "coveragePercentage": 50
  }
}

Guidelines:
- matchScore should be 0-100 (realistic assessment)
- Focus on actionable, specific suggestions
- improvedExperience should be complete experience entries, not just changes
- improvedSkills should be a comma-separated string of all relevant skills
- Include education and projects if mentioned in the resume
- Consider ATS keyword matching
- Provide concrete improvements, not generic advice

IMPORTANT: Generate COMPLETE resume sections, not just the changes. The improvedExperience should contain full job entries that can be directly used in a resume.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean response
    const jsonText = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const analysis = JSON.parse(jsonText);
    return analysis;
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw new Error('Failed to analyze resume with AI');
  }
};

/**
 * Generate improved resume content for specific job
 * Returns rewritten sections optimized for the job
 */
export const generateTweakedResume = async (resumeText, jobDescription, analysisData) => {
  try {
    if (!model) {
      throw new Error('Gemini API not initialized');
    }

    const prompt = `You are a professional resume writer. Rewrite this resume to better match the job description.

ORIGINAL RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

ANALYSIS INSIGHTS:
- Match Score: ${analysisData.matchScore}%
- Missing Skills: ${analysisData.missingSkills.map(s => s.skill).join(', ')}
- Key Suggestions: ${analysisData.suggestions.slice(0, 3).map(s => s.suggestion).join('; ')}

Generate an improved version that:
1. Incorporates missing keywords naturally
2. Rewrites bullet points to emphasize relevant experience
3. Optimizes for ATS scanning
4. Maintains truthfulness (don't fabricate experience)

Return ONLY a JSON object with:
{
  "improvedSummary": "Professional summary optimized for this job",
  "improvedExperience": [
    {
      "title": "Job Title",
      "company": "Company",
      "bulletPoints": ["Improved bullet 1", "Improved bullet 2"]
    }
  ],
  "improvedSkills": "Prioritized skills list matching job requirements",
  "additionalSections": {
    "relevantProjects": "Projects that align with job",
    "certifications": "Suggested certs if applicable"
  }
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const jsonText = response
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const tweaked = JSON.parse(jsonText);
    return tweaked;
  } catch (error) {
    console.error('Resume generation error:', error);
    throw new Error('Failed to generate tweaked resume');
  }
};

/**
 * Get quick match score without full analysis (faster)
 */
export const getQuickMatchScore = async (resumeText, jobDescription) => {
  try {
    if (!model) {
      throw new Error('Gemini API not initialized');
    }

    const prompt = `Analyze this resume against the job description and return ONLY a number between 0-100 representing the match score.

Resume: ${resumeText.substring(0, 1000)}...
Job: ${jobDescription.substring(0, 500)}...

Return only the number, nothing else.`;

    const result = await model.generateContent(prompt);
    const score = parseInt(result.response.text().trim());
    
    return isNaN(score) ? 50 : Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error('Quick score error:', error);
    return 50; // Default score if API fails
  }
};

// Initialize will be called after dotenv.config() in server.js

