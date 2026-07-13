/**
 * Seed sample jobs for local development and job-matching demos.
 *
 * Usage: node scripts/seed-jobs.js
 * Requires MONGODB_URI (or local MongoDB fallback via database.js).
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');
const Job = require('../src/models/job.model');

// Prevent accidental running in production
if (process.env.NODE_ENV === 'production') {
  console.error('ERROR: Cannot run seed script in production environment.');
  process.exit(1);
}

const SAMPLE_JOBS = [
  {
    title: 'Frontend Developer',
    category: 'engineering',
    description:
      'Build responsive React applications. Work with TypeScript, REST APIs, and modern CSS. Collaborate with design and backend teams.',
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
    preferredSkills: ['TypeScript', 'Tailwind', 'Node.js'],
    experienceLevel: 'mid',
    location: 'Remote',
    employmentType: 'full-time',
    isActive: true,
  },
  {
    title: 'Full Stack Engineer',
    category: 'engineering',
    description:
      'Develop end-to-end features using Node.js, Express, MongoDB, and React. Own API design, database modeling, and deployment.',
    requiredSkills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'Express'],
    preferredSkills: ['Docker', 'AWS', 'TypeScript'],
    experienceLevel: 'senior',
    location: 'Bangalore, India',
    employmentType: 'full-time',
    isActive: true,
  },
  {
    title: 'Data Analyst',
    category: 'operations',
    description:
      'Analyze datasets, build dashboards, and deliver insights. Use SQL, Python, and visualization tools to support business decisions.',
    requiredSkills: ['SQL', 'Python', 'Excel', 'Data Analysis'],
    preferredSkills: ['Pandas', 'Tableau', 'Machine Learning'],
    experienceLevel: 'entry',
    location: 'Hyderabad, India',
    employmentType: 'full-time',
    isActive: true,
  },
  {
    title: 'DevOps Engineer',
    category: 'engineering',
    description:
      'Maintain CI/CD pipelines, cloud infrastructure, and monitoring. Experience with Docker, Kubernetes, and cloud platforms required.',
    requiredSkills: ['Docker', 'Linux', 'Git', 'CI/CD', 'AWS'],
    preferredSkills: ['Kubernetes', 'Jenkins', 'Terraform'],
    experienceLevel: 'mid',
    location: 'Remote',
    employmentType: 'full-time',
    isActive: true,
  },
  {
    title: 'Product Designer',
    category: 'design',
    description:
      'Design user-centered product experiences. Create wireframes, prototypes, and design systems in Figma.',
    requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    preferredSkills: ['Design Systems', 'HTML', 'CSS'],
    experienceLevel: 'mid',
    location: 'Mumbai, India',
    employmentType: 'full-time',
    isActive: true,
  },
];

async function seed() {
  await connectDB();

  const existing = await Job.countDocuments();
  if (existing > 0) {
    console.log(`Database already has ${existing} job(s). Skipping seed (delete jobs first to re-seed).`);
    await mongoose.connection.close();
    process.exit(0);
  }

  const created = await Job.insertMany(SAMPLE_JOBS);
  console.log(`Seeded ${created.length} sample jobs.`);
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
