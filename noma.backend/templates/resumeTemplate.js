/**
 * Generate HTML resume template
 * Clean, ATS-friendly, single-column layout
 */
export const generateResumeHTML = (data) => {
  const {
    name = 'Candidate Name',
    email = '',
    phone = '',
    summary = '',
    experience = [],
    skills = '',
    education = [],
    projects = []
  } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #333;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.5in;
      background: white;
    }

    h1 {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 8px;
      color: #1a1a1a;
    }

    h2 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 18px;
      margin-bottom: 10px;
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 4px;
    }

    h3 {
      font-size: 12pt;
      font-weight: bold;
      margin-top: 10px;
      margin-bottom: 4px;
      color: #34495e;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .contact-info {
      text-align: center;
      font-size: 10pt;
      color: #555;
      margin-bottom: 15px;
    }

    .contact-info span {
      margin: 0 10px;
    }

    .section {
      margin-bottom: 18px;
    }

    .experience-item,
    .education-item,
    .project-item {
      margin-bottom: 12px;
    }

    .title-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }

    .job-title,
    .degree {
      font-weight: bold;
      font-size: 11pt;
      color: #2c3e50;
    }

    .company,
    .institution {
      font-style: italic;
      color: #555;
    }

    .duration {
      font-size: 10pt;
      color: #777;
      font-style: italic;
    }

    ul {
      margin-left: 20px;
      margin-top: 6px;
    }

    li {
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .skills-list {
      line-height: 1.6;
    }

    .summary {
      margin-bottom: 15px;
      line-height: 1.6;
      text-align: justify;
    }

    /* Print optimization */
    @media print {
      body {
        padding: 0;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>${name}</h1>
    <div class="contact-info">
      ${email ? `<span>${email}</span>` : ''}
      ${phone ? `<span>${phone}</span>` : ''}
    </div>
  </div>

  <!-- Summary -->
  ${summary ? `
  <div class="section">
    <h2>Professional Summary</h2>
    <p class="summary">${summary}</p>
  </div>
  ` : ''}

  <!-- Experience -->
  ${experience && experience.length > 0 ? `
  <div class="section">
    <h2>Experience</h2>
    ${experience.map(exp => `
      <div class="experience-item">
        <div class="title-line">
          <div>
            <span class="job-title">${exp.title || 'Position'}</span>
            ${exp.company ? ` <span class="company">at ${exp.company}</span>` : ''}
          </div>
          ${exp.duration ? `<span class="duration">${exp.duration}</span>` : ''}
        </div>
        ${exp.bulletPoints && exp.bulletPoints.length > 0 ? `
        <ul>
          ${exp.bulletPoints.map(bullet => `<li>${bullet}</li>`).join('')}
        </ul>
        ` : exp.description ? `<p>${exp.description}</p>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Education -->
  ${education && education.length > 0 ? `
  <div class="section">
    <h2>Education</h2>
    ${education.map(edu => `
      <div class="education-item">
        <div class="title-line">
          <div>
            <span class="degree">${edu.degree || 'Degree'}</span>
            ${edu.institution ? ` <span class="institution">from ${edu.institution}</span>` : ''}
          </div>
          ${edu.year ? `<span class="duration">${edu.year}</span>` : ''}
        </div>
        ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Skills -->
  ${skills ? `
  <div class="section">
    <h2>Skills</h2>
    <p class="skills-list">${skills}</p>
  </div>
  ` : ''}

  <!-- Projects -->
  ${projects && projects.length > 0 ? `
  <div class="section">
    <h2>Projects</h2>
    ${projects.map(proj => `
      <div class="project-item">
        <h3>${proj.name || 'Project'}</h3>
        ${proj.description ? `<p>${proj.description}</p>` : ''}
        ${proj.technologies ? `
          <p><em>Technologies: ${typeof proj.technologies === 'string' ? proj.technologies : proj.technologies.join(', ')}</em></p>
        ` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Footer -->
  <div style="margin-top: 30px; text-align: center; font-size: 9pt; color: #999;">
    <p>Generated with NOMA - AI Resume Optimizer</p>
  </div>
</body>
</html>
  `.trim();
};


