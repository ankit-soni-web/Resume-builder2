import { Resume, ATSAnalysisResult, ATSCheckItem } from '../types/resume';

const STRONG_ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'advised', 'advocated', 'aligned', 'analyzed', 'applied',
  'architected', 'authored', 'automated', 'balanced', 'boosted', 'budgeted', 'built', 'calculated',
  'centralized', 'championed', 'coached', 'collaborated', 'consolidated', 'constructed', 'contracted',
  'coordinated', 'created', 'customized', 'decreased', 'delegated', 'delivered', 'deployed', 'designed',
  'developed', 'directed', 'distributed', 'documented', 'doubled', 'drafted', 'drove', 'eliminated',
  'empowered', 'enabled', 'engineered', 'enhanced', 'established', 'evaluated', 'exceeded', 'executed',
  'expanded', 'expedited', 'facilitated', 'formulated', 'fostered', 'generated', 'governed', 'guided',
  'harmonized', 'headed', 'identified', 'implemented', 'improved', 'incorporated', 'increased', 'initiated',
  'innovated', 'inspected', 'inspired', 'installed', 'instituted', 'integrated', 'intensified', 'introduced',
  'invented', 'investigated', 'launched', 'led', 'leveraged', 'maximized', 'mentored', 'migrated',
  'minimized', 'modernized', 'monitored', 'negotiated', 'optimized', 'orchestrated', 'organized', 'originated',
  'overhauled', 'oversaw', 'partnered', 'pioneered', 'planned', 'prioritized', 'produced', 'programmed',
  'promoted', 'published', 'rebuilt', 'recruited', 'redesigned', 'reduced', 'refined', 'regulated',
  'reorganized', 'resolved', 'restructured', 'revamped', 'revitalized', 'saved', 'scaled', 'scheduled',
  'secured', 'simplified', 'slashed', 'solicited', 'solved', 'spearheaded', 'standardized', 'steered',
  'streamlined', 'strengthened', 'structured', 'surpassed', 'systematized', 'targeted', 'tracked', 'trained',
  'transformed', 'transitioned', 'translated', 'tripled', 'uncovered', 'unified', 'upgraded', 'validated',
  'verified', 'yielded'
];

const WEAK_WORDS = [
  'responsible for', 'duties included', 'worked on', 'helped with', 'assisted with', 'handled',
  'tried to', 'involved in', 'participated in', 'various tasks', 'etc', 'hardworking', 'go-getter',
  'team player', 'synergy', 'detail-oriented', 'punctual', 'motivated self-starter'
];

export function analyzeResumeForATS(resume: Resume, targetJobDescription?: string): ATSAnalysisResult {
  const items: ATSCheckItem[] = [];

  // 1. Contact Information Completeness (Critical)
  const pi = resume.personalInfo;
  const hasName = Boolean(pi.fullName && pi.fullName.trim());
  const hasEmail = Boolean(pi.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pi.email));
  const hasPhone = Boolean(pi.phone && pi.phone.trim().length >= 7);
  const hasLocation = Boolean(pi.location && pi.location.trim());
  const hasOnlineProfile = Boolean((pi.linkedin && pi.linkedin.trim()) || (pi.github && pi.github.trim()) || (pi.website && pi.website.trim()));

  const contactScore = (hasName ? 4 : 0) + (hasEmail ? 4 : 0) + (hasPhone ? 3 : 0) + (hasLocation ? 2 : 0) + (hasOnlineProfile ? 2 : 0);
  items.push({
    id: 'contact_info',
    category: 'Critical',
    title: 'Contact Information Completeness',
    passed: contactScore >= 13,
    score: contactScore,
    maxScore: 15,
    message: contactScore >= 13 ? 'All vital contact fields are populated.' : 'Missing one or more contact details.',
    recommendation: !hasEmail ? 'Add a valid professional email address.' : (!hasPhone ? 'Add a contact phone number.' : (!hasLocation ? 'Add your city and state/country for ATS location filtering.' : 'Include a LinkedIn or portfolio link.')),
  });

  // 2. Professional Summary (Recommended)
  const summaryWords = resume.summary ? resume.summary.trim().split(/\s+/).filter(Boolean).length : 0;
  const summaryPassed = summaryWords >= 25 && summaryWords <= 120;
  items.push({
    id: 'summary_presence',
    category: 'Recommended',
    title: 'Professional Summary Length & Impact',
    passed: summaryPassed,
    score: summaryPassed ? 10 : (summaryWords > 0 ? 5 : 0),
    maxScore: 10,
    message: summaryPassed 
      ? `Well-calibrated summary (${summaryWords} words).`
      : (summaryWords === 0 ? 'No professional summary found.' : `Summary length (${summaryWords} words) is outside the 25–120 word sweet spot.`),
    recommendation: summaryWords === 0 
      ? 'Add a 3-4 sentence professional summary outlining your domain expertise and key career strengths.'
      : (summaryWords < 25 ? 'Expand summary with specific skills and domain specialization.' : 'Trim summary so recruiters can scan it in 6 seconds.'),
  });

  // 3. Work Experience & Bullet Quality
  const hasExperience = resume.experience && resume.experience.length > 0;
  const totalBullets = (resume.experience || []).flatMap(e => e.bullets || []).filter(b => b.trim().length > 0);
  
  // Collect text for linguistic parsing
  const fullText = [
    resume.summary,
    ...totalBullets,
    ...(resume.projects || []).map(p => `${p.description} ${p.outcome || ''}`),
    ...(resume.internships || []).flatMap(i => i.bullets || []),
  ].join(' ').toLowerCase();

  // Metrics check (%, $, numbers, x-fold, etc.)
  const metricRegex = /(\b\d+([.,]\d+)?%|\$\d+([.,]\d+)?|\b\d+([.,]\d+)?\s*(x|fold|million|billion|k|hours|days|users|ms|seconds))/gi;
  const metricsFound = (fullText.match(metricRegex) || []);
  const metricsCount = metricsFound.length;
  const metricsPassed = metricsCount >= 3;

  items.push({
    id: 'measurable_metrics',
    category: 'Content',
    title: 'Measurable Outcomes & Quantified Results',
    passed: metricsPassed,
    score: metricsPassed ? 15 : Math.min(10, metricsCount * 3),
    maxScore: 15,
    message: metricsPassed 
      ? `Great job! Detected ${metricsCount} quantified metrics (percentages, revenues, or performance figures).`
      : `Found only ${metricsCount} quantified metrics in your bullet points.`,
    recommendation: 'Quantify your accomplishments using the formula: "Accomplished [X] as measured by [Y] by doing [Z]". Example: "Reduced build times by 35%".',
  });

  // 4. Action Verbs analysis
  const actionVerbsFound: string[] = [];
  const weakWordsFound: string[] = [];

  STRONG_ACTION_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(fullText) && !actionVerbsFound.includes(verb)) {
      actionVerbsFound.push(verb);
    }
  });

  WEAK_WORDS.forEach(weak => {
    const regex = new RegExp(`\\b${weak}\\b`, 'i');
    if (regex.test(fullText) && !weakWordsFound.includes(weak)) {
      weakWordsFound.push(weak);
    }
  });

  const verbScore = Math.min(15, Math.round((actionVerbsFound.length / 5) * 15));
  items.push({
    id: 'action_verbs',
    category: 'Content',
    title: 'Strong Action Verbs Usage',
    passed: actionVerbsFound.length >= 5,
    score: verbScore,
    maxScore: 15,
    message: actionVerbsFound.length >= 5
      ? `Found ${actionVerbsFound.length} strong leadership & execution verbs.`
      : `Found only ${actionVerbsFound.length} strong action verbs.`,
    recommendation: weakWordsFound.length > 0 
      ? `Replace passive phrases (${weakWordsFound.slice(0, 3).join(', ')}) with active verbs like "Spearheaded", "Architected", or "Optimized".`
      : 'Start each bullet point with an authoritative past-tense verb.',
  });

  // 5. Skills Section & Categorization
  const skillsCount = (resume.skills || []).length;
  const skillsPassed = skillsCount >= 6 && skillsCount <= 35;
  items.push({
    id: 'skills_breadth',
    category: 'Critical',
    title: 'Core Skills & Competencies Presence',
    passed: skillsPassed,
    score: skillsPassed ? 15 : (skillsCount > 0 ? 8 : 0),
    maxScore: 15,
    message: skillsPassed
      ? `Solid skillset defined (${skillsCount} competencies across categories).`
      : (skillsCount === 0 ? 'No skills listed.' : `Skills list (${skillsCount}) is either too sparse or overloaded.`),
    recommendation: skillsCount < 6
      ? 'List 8-15 core technical and industry skills relevant to your target job.'
      : 'Curate your skills list to focus on high-priority competencies.',
  });

  // 6. Education & Academic Background
  const hasEdu = (resume.education || []).length > 0;
  items.push({
    id: 'education_check',
    category: 'Critical',
    title: 'Education Section Completeness',
    passed: hasEdu,
    score: hasEdu ? 10 : 0,
    maxScore: 10,
    message: hasEdu ? 'Degree and institutional credentials are provided.' : 'No education entries found.',
    recommendation: 'Add your degree, university/college, and graduation date.',
  });

  // 7. Bullet Length & Readability
  let longBulletCount = 0;
  let shortBulletCount = 0;
  totalBullets.forEach(b => {
    const wc = b.split(/\s+/).filter(Boolean).length;
    if (wc > 38) longBulletCount++;
    if (wc < 6) shortBulletCount++;
  });

  const formattingPassed = longBulletCount === 0 && shortBulletCount <= 1 && totalBullets.length >= 3;
  items.push({
    id: 'bullet_formatting',
    category: 'Formatting',
    title: 'Bullet Point Density & Scannability',
    passed: formattingPassed,
    score: formattingPassed ? 10 : 6,
    maxScore: 10,
    message: formattingPassed
      ? 'Bullet points are concise, scannable, and cleanly formatted.'
      : `Detected ${longBulletCount} overly long bullets (>38 words) or very short fragments.`,
    recommendation: 'Keep bullet points between 15-30 words so they scan easily without looking like dense paragraphs.',
  });

  // 8. Layout & Typography ATS Compatibility
  const isAtsTemplate = ['classic', 'modern', 'executive', 'fresher', 'technical', 'datascience'].includes(resume.design.templateId);
  items.push({
    id: 'layout_compliance',
    category: 'Formatting',
    title: 'ATS Structural Layout Compliance',
    passed: isAtsTemplate,
    score: isAtsTemplate ? 10 : 7,
    maxScore: 10,
    message: isAtsTemplate
      ? 'Selected template uses ATS-standard single-pass linear hierarchy.'
      : 'Complex or multi-column layouts can sometimes challenge older legacy ATS parsers.',
    recommendation: isAtsTemplate
      ? 'Your current layout passes standard ATS document parsing.'
      : 'If applying through Taleo, Workday, or older corporate portals, switch to Classic or Technical template for 100% compliance.',
  });

  // Calculate overall score
  const totalEarned = items.reduce((acc, curr) => acc + curr.score, 0);
  const maxPossible = items.reduce((acc, curr) => acc + curr.maxScore, 0);
  const overallScore = Math.min(100, Math.round((totalEarned / maxPossible) * 100));

  let rating: ATSAnalysisResult['rating'] = 'Needs Work';
  if (overallScore >= 85) rating = 'Outstanding';
  else if (overallScore >= 72) rating = 'Strong';
  else if (overallScore >= 55) rating = 'Good';

  const totalWords = fullText.split(/\s+/).filter(Boolean).length;

  return {
    overallScore,
    rating,
    passedCount: items.filter(i => i.passed).length,
    totalChecks: items.length,
    items,
    wordCount: totalWords,
    actionVerbsFound,
    weakWordsFound,
    metricsCount,
  };
}
