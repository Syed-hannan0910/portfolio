require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('./db');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

const profileData = {
  name: 'Syed Hannan Sarmadi',
  title: 'Full-Stack Developer & AI Specialist',
  subtitle: 'B.Tech Computer Science',
  bio: 'Dedicated Computer Science undergraduate with a strong foundation in Full-Stack Development, Cloud Computing, and DevOps. Proven track record in architecting complex, AI-driven applications and scalable APIs. Expert in modern development workflows including Prompt Engineering and Machine Learning.',
  email: 'syedhanshab9802@gmail.com',
  phone: '+91 8550011942',
  location: 'Bengaluru, India',
  github: 'https://github.com/Syed-hannan0910',
  linkedin: 'https://linkedin.com/in/syed-hannan-sarmadi',
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institution: 'Dayananda Sagar University',
      location: 'Bengaluru',
      grade: '8 CGPA',
      year: '2022–2026'
    },
    {
      degree: 'Higher Secondary (2nd PU)',
      institution: 'Christ Junior College',
      location: 'Bengaluru',
      grade: '87.33%',
      year: '2020–2022'
    },
    {
      degree: 'SSLC',
      institution: 'The Crystal School',
      location: 'Bengaluru',
      grade: '95.56%',
      year: '2020'
    }
  ],
  interests: ['Poetry', 'Backpacking'],
  available: true
};

const skillsData = [
  {
    category: 'Web Tech',
    icon: 'code',
    items: [
      { name: 'Next.js', level: 90 },
      { name: 'React', level: 90 },
      { name: 'Tailwind CSS', level: 88 },
      { name: 'JavaScript (ES6+)', level: 92 },
      { name: 'HTML5 / CSS3', level: 95 }
    ]
  },
  {
    category: 'Backend',
    icon: 'server',
    items: [
      { name: 'Node.js', level: 88 },
      { name: 'Express.js', level: 87 },
      { name: 'RESTful APIs', level: 90 },
      { name: 'JWT Auth', level: 85 }
    ]
  },
  {
    category: 'Databases',
    icon: 'database',
    items: [
      { name: 'PostgreSQL', level: 82 },
      { name: 'MongoDB', level: 88 },
      { name: 'MySQL', level: 82 },
      { name: 'SQL Server', level: 78 }
    ]
  },
  {
    category: 'DevOps & Tools',
    icon: 'cloud',
    items: [
      { name: 'Git / GitHub', level: 92 },
      { name: 'Vercel', level: 85 },
      { name: 'Render', level: 82 },
      { name: 'Postman', level: 88 },
      { name: 'LaTeX', level: 75 }
    ]
  }
];

const projectsData = [
  {
    title: 'Ryze AI',
    subtitle: 'Generative AI Accelerator Platform',
    description: 'Architected a comprehensive SaaS platform focusing on enterprise AI integration. Implemented Intelligent Document Processing (Neuro Reader) and Automated Agents for data synthesis.',
    longDescription: 'A full-featured SaaS platform that enables enterprise teams to integrate cutting-edge Generative AI capabilities into their workflows. Features include the Neuro Reader for intelligent document parsing, multi-agent orchestration for complex data synthesis tasks, and a scalable API layer for third-party integrations.',
    tags: ['Next.js', 'GenAI', 'Tailwind CSS', 'Node.js'],
    github: 'https://github.com/Syed-hannan0910',
    featured: true,
    order: 1,
    color: '#3B82F6'
  },
  {
    title: 'TaskFlow API',
    subtitle: 'Scalable Task Management API',
    description: 'Developed a robust RESTful API handling complex task synchronization and user data persistence with JWT security and encrypted storage.',
    longDescription: 'A production-grade backend API built with Node.js and Express, featuring advanced task synchronization, real-time collaboration support, JWT-based authentication, and AES-encrypted data storage. Deployed on Render with 99.9% uptime SLAs.',
    tags: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    github: 'https://github.com/Syed-hannan0910',
    featured: true,
    order: 2,
    color: '#10B981'
  },
  {
    title: 'Poetry Community',
    subtitle: 'Social Creative Platform',
    description: 'Built a vibrant community platform for poets to share contemporary works, fostering creative expression through a polished React-based UI.',
    longDescription: 'A community-first platform where poets discover, share, and discuss contemporary verse. Features real-time feed, user profiles, reactions, nested comments, and Firebase-backed authentication with zero-config deployments.',
    tags: ['React', 'Firebase', 'CSS3'],
    github: 'https://github.com/Syed-hannan0910',
    featured: true,
    order: 3,
    color: '#8B5CF6'
  },
  {
    title: 'Zoo Management',
    subtitle: 'Full-Stack Application',
    description: 'Developed a dynamic management portal managing animal records and staff schedules with CRUD operations and SQL integration.',
    longDescription: 'An enterprise-grade zoo management system with a Java backend, MySQL persistence layer, and a clean HTML/CSS/JS frontend. Supports full CRUD operations for animal records, staff scheduling, feeding logs, and health monitoring dashboards.',
    tags: ['Java', 'MySQL', 'HTML5', 'CSS3'],
    github: 'https://github.com/Syed-hannan0910',
    featured: false,
    order: 4,
    color: '#F59E0B'
  }
];

async function seed() {
  try {
    await connectDB();

    await Profile.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});

    await Profile.create(profileData);
    await Skill.insertMany(skillsData);
    await Project.insertMany(projectsData);

    console.log('🌱 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
