import { Resume, JobApplication } from '../types/resume';
import { SAMPLE_RESUMES, createEmptyResume } from '../data/sampleResumes';

const STORAGE_KEY = 'resumecraft_resumes_v1';
const APPLICATIONS_KEY = 'resumecraft_applications_v1';
const ACTIVE_RESUME_KEY = 'resumecraft_active_id_v1';

export function getStoredResumes(): Resume[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with sample resumes on first visit
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_RESUMES));
      return SAMPLE_RESUMES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SAMPLE_RESUMES;
  } catch (err) {
    console.error('Failed to load resumes from localStorage:', err);
    return SAMPLE_RESUMES;
  }
}

export function getResumeById(id: string): Resume | null {
  const resumes = getStoredResumes();
  return resumes.find(r => r.id === id) || null;
}

export function saveResume(resume: Resume): void {
  try {
    const resumes = getStoredResumes();
    const updated: Resume = {
      ...resume,
      updatedAt: new Date().toISOString(),
    };
    const index = resumes.findIndex(r => r.id === resume.id);
    if (index >= 0) {
      resumes[index] = updated;
    } else {
      resumes.unshift(updated);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
    localStorage.setItem(ACTIVE_RESUME_KEY, resume.id);
  } catch (err) {
    console.error('Failed to save resume:', err);
  }
}

export function duplicateResume(id: string): Resume | null {
  const original = getResumeById(id);
  if (!original) return null;

  const now = new Date().toISOString();
  const duplicate: Resume = {
    ...JSON.parse(JSON.stringify(original)),
    id: 'resume-' + Math.random().toString(36).substring(2, 9),
    title: `${original.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };

  saveResume(duplicate);
  return duplicate;
}

export function deleteResume(id: string): boolean {
  try {
    const resumes = getStoredResumes();
    const filtered = resumes.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete resume:', err);
    return false;
  }
}

export function resetResumeDesign(resume: Resume): Resume {
  const blank = createEmptyResume(resume.design.templateId);
  return {
    ...resume,
    design: blank.design,
    updatedAt: new Date().toISOString(),
  };
}

export function exportResumeAsJson(resume: Resume): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const safeTitle = (resume.title || 'resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadAnchor.setAttribute('download', `${safeTitle}_resumecraft.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importResumeFromJson(jsonStr: string): Resume {
  const parsed = JSON.parse(jsonStr);
  if (!parsed || !parsed.personalInfo) {
    throw new Error('Invalid resume JSON format');
  }
  const id = 'resume-' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();
  const imported: Resume = {
    ...parsed,
    id,
    title: parsed.title ? `${parsed.title} (Imported)` : 'Imported Resume',
    createdAt: now,
    updatedAt: now,
  };
  saveResume(imported);
  return imported;
}

export function getActiveResumeId(): string | null {
  return localStorage.getItem(ACTIVE_RESUME_KEY);
}

export function setActiveResumeId(id: string): void {
  localStorage.setItem(ACTIVE_RESUME_KEY, id);
}

// Applications tracker
export function getJobApplications(): JobApplication[] {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) {
      const sampleApps: JobApplication[] = [
        {
          id: 'app-1',
          resumeId: 'sample-software-engineer',
          resumeTitle: 'Senior Software Engineer — Alex Morgan',
          company: 'Stripe',
          role: 'Staff Infrastructure Engineer',
          status: 'Interviewing',
          dateApplied: '2026-10-18',
          salaryExpectation: '$190k - $220k',
          notes: 'Round 2 System Architecture completed on Monday.',
        },
        {
          id: 'app-2',
          resumeId: 'sample-software-engineer',
          resumeTitle: 'Senior Software Engineer — Alex Morgan',
          company: 'Figma',
          role: 'Senior Full Stack Engineer',
          status: 'Applied',
          dateApplied: '2026-10-24',
          salaryExpectation: '$180k - $210k',
          notes: 'Applied through employee referral.',
        },
      ];
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(sampleApps));
      return sampleApps;
    }
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveJobApplication(application: JobApplication): void {
  try {
    const apps = getJobApplications();
    const index = apps.findIndex(a => a.id === application.id);
    if (index >= 0) {
      apps[index] = application;
    } else {
      apps.unshift(application);
    }
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save application:', err);
  }
}

export function deleteJobApplication(id: string): void {
  try {
    const apps = getJobApplications();
    const filtered = apps.filter(a => a.id !== id);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete application:', err);
  }
}
