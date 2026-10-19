import { monthsBetween, yearsLabel } from '@/lib/duration';

// Single source of truth for personal details, taken from the resume.
// Update the resume first, then this file, so the site and the PDF never disagree.

export const profile = {
  name: 'Vignesh Vaithiyanathan',
  firstName: 'Vignesh',
  title: 'AI Lead Product Designer',
  tagline: 'AI Lead Product Designer • Product Builder',
  location: 'UAE',
  availability: 'Available immediately',
  email: 'vignesh.creativeux@gmail.com',
  phone: '+971 54 142 8466',
  phoneHref: 'tel:+971541428466',
  whatsappHref: 'https://wa.me/971541428466',
  behance: 'https://www.behance.net/VigneshCreates',
  linkedin: 'https://www.linkedin.com/in/vigneshcreates',
  resumeHref: '/resume/Vignesh-V-Resume.pdf',
};

/** Years of experience, derived from the earliest experience start date ("YYYY-MM"). */
export const yearsOfExperience = (careerStart) => yearsLabel(monthsBetween(careerStart || DEFAULT_CAREER_START));

const DEFAULT_CAREER_START = '2022-05';

export const getStats = (careerStart) => [`${yearsOfExperience(careerStart)} years of experience`, '3 live Collabkit products', 'AI · SaaS · Enterprise'];

export const getAboutStatement = (careerStart) =>
  `I'm Vignesh, an AI Lead Product Designer who turns complex ideas into products people love to use. Over ${yearsOfExperience(careerStart)} years I've led research, design systems and developer handoff across AI, SaaS, healthcare and enterprise, and I build what I design.`;

/** Options for the contact form's "What's this about?" field (also validated on the server). */
export const contactTopics = ['Hiring / job opportunity', 'Freelance project', 'Collaboration', 'Something else'];
