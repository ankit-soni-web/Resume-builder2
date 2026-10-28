export type TemplateId = 
  | 'classic'
  | 'modern'
  | 'executive'
  | 'fresher'
  | 'technical'
  | 'datascience'
  | 'creative'
  | 'twocolumn';

export type FontFamily = 
  | 'Inter'
  | 'Plus Jakarta Sans'
  | 'Merriweather'
  | 'JetBrains Mono'
  | 'Playfair Display'
  | 'Georgia';

export type FontSize = 'compact' | 'normal' | 'large';
export type LineHeight = 'tight' | 'normal' | 'relaxed';
export type Margins = 'compact' | 'normal' | 'spacious';
export type SectionSpacing = 'compact' | 'normal' | 'spacious';
export type HeadingStyle = 'underline' | 'left-bar' | 'pill' | 'filled' | 'minimal';
export type PaperSize = 'a4' | 'letter';

export interface DesignSettings {
  templateId: TemplateId;
  fontFamily: FontFamily;
  fontSize: FontSize;
  lineHeight: LineHeight;
  margins: Margins;
  sectionSpacing: SectionSpacing;
  primaryColor: string;
  headingStyle: HeadingStyle;
  paperSize: PaperSize;
  showPhoto: boolean;
  showPageNumbers: boolean;
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  photoUrl?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  achievements?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  coursework: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'tools' | 'languages';
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  role?: string;
  outcome?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface InternshipItem {
  id: string;
  position: string;
  organization: string;
  duration: string;
  location?: string;
  bullets: string[];
  achievements?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface VolunteerItem {
  id: string;
  role: string;
  organization: string;
  duration: string;
  description: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  company: string;
  role: string;
  contact: string;
  type: 'Professional' | 'Academic' | 'Personal';
}

export type ResumeSectionKey = 
  | 'personalInfo'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'internships'
  | 'awards'
  | 'publications'
  | 'volunteer'
  | 'references';

export interface Resume {
  id: string;
  title: string;
  targetRole?: string;
  createdAt: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  internships: InternshipItem[];
  awards: AwardItem[];
  publications: PublicationItem[];
  volunteer: VolunteerItem[];
  references: ReferenceItem[];
  sectionVisibility: Record<ResumeSectionKey, boolean>;
  sectionOrder: ResumeSectionKey[];
  design: DesignSettings;
}

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  category: 'ATS' | 'Modern' | 'Executive' | 'Entry Level' | 'Technical' | 'Creative';
  isAtsFriendly: boolean;
  accentColor: string;
  layout: 'single-column' | 'two-column';
  bestFor: string;
}

export interface ATSCheckItem {
  id: string;
  category: 'Critical' | 'Recommended' | 'Formatting' | 'Content';
  title: string;
  passed: boolean;
  score: number;
  maxScore: number;
  message: string;
  recommendation: string;
}

export interface ATSAnalysisResult {
  overallScore: number;
  rating: 'Needs Work' | 'Good' | 'Strong' | 'Outstanding';
  passedCount: number;
  totalChecks: number;
  items: ATSCheckItem[];
  wordCount: number;
  actionVerbsFound: string[];
  weakWordsFound: string[];
  metricsCount: number;
}

export interface JobApplication {
  id: string;
  resumeId: string;
  resumeTitle: string;
  company: string;
  role: string;
  status: 'Draft' | 'Applied' | 'Interviewing' | 'Offered' | 'Archived';
  dateApplied: string;
  salaryExpectation?: string;
  notes?: string;
  jobUrl?: string;
}
