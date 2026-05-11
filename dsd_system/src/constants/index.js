// Indicator names — single source of truth
export const INDICATORS = [
  'Family members in Family Preservation Services',
  'Family Preservation Mediation',
  'Children with valid foster care orders',
  'Number of Reported Cases of Child Abuse',
  'Parenting programme participants',
  'HIV/AIDS Care & Services',
];

// Service options
export const SERVICE_OPTIONS = [
  'Mediation service',
  'Marriage counselling',
  'Marriage enrichment',
  'Marriage preparation',
];

// Status config
export const STATUS_CONFIG = {
  captured: {
    label: 'Captured',
    className: 'bg-emerald-100 text-emerald-700',
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-700',
  },
  inprogress: {
    label: 'In progress',
    className: 'bg-indigo-100 text-indigo-700',
  },
};

// Screen titles
export const SCREEN_TITLES = {
  dashboard: ['Dashboard', 'Overview'],
  capture: ['Form Capture', 'Prieska Siya-Themba · April 2026'],
  form: ['New Entry', 'Form Capture'],
  inbox: ['Form Inbox', 'Submitted forms'],
  reports: ['Reports', 'Analytics & exports'],
  comments: ['Comments', 'All entry comments'],
};