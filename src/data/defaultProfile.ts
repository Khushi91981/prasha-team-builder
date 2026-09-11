import { DeveloperProfile } from '../types';

/**
 * Default Profile: Kashika Ajmera
 * (Featured in prompt: Full-Stack Engineer, ex-Appperfect masked into clean client-facing domain)
 */
export const defaultProfile: DeveloperProfile = {
  id: 'kashika-ajmera',
  name: 'KASHIKA AJMERA',
  title: 'Senior Full-Stack & Frontend Engineer',
  subtitle: 'Full-Stack Engineering • Payments & Commerce • Scalable UI Architectures',
  specializationTag: 'FULL-STACK DEVELOPER',
  location: 'Bengaluru, India • Available for Global Client Engagements',
  email: 'talent@prashainfotech.com',
  phone: '+91 98765 43210',
  linkedin: 'https://www.linkedin.com/in/prasha-infotech-3b8536325/',
  github: 'github.com/prasha-infotech',
  summary:
    'Dedicated Full-Stack Software Engineer with 4+ years of professional engineering excellence specializing in React.js, Redux, MobX, TypeScript, and high-concurrency Node.js microservices. Proven success delivering high-performance fintech payment workflows, complex merchant onboarding funnels, and enterprise design systems. Adept at transforming complex business requirements into elegant, high-availability web applications with sub-second page loads and zero-downtime production reliability.',
  snapshotStats: [
    {
      value: '4+ YEARS',
      label: 'PRODUCTION EXPERIENCE',
      subtext: 'Full-stack web & fintech platforms',
    },
    {
      value: '18+',
      label: 'CORE TECHNOLOGIES',
      subtext: 'React, TypeScript, Node.js & Cloud',
    },
    {
      value: '99.98%',
      label: 'TRANSACTION SUCCESS',
      subtext: 'Scalable payment workflows & gateways',
    },
    {
      value: 'MICROSERVICES',
      label: 'ARCHITECTURE',
      subtext: 'RESTful contracts & modular state flows',
    },
  ],
  coreExpertise: [
    {
      category: 'Languages & Web Core',
      skills: ['TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'SQL', 'Python'],
    },
    {
      category: 'Frontend & State Management',
      skills: ['React.js', 'Next.js', 'Redux / Redux Toolkit', 'MobX', 'Tailwind CSS', 'Material UI'],
    },
    {
      category: 'Backend & APIs',
      skills: ['Node.js', 'Express.js', 'RESTful APIs', 'GraphQL', 'Microservices Architecture'],
    },
    {
      category: 'Databases & Cloud Storage',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis Caching', 'AWS S3'],
    },
    {
      category: 'DevOps, Testing & Tooling',
      skills: ['Docker', 'AWS', 'Git', 'GitHub Actions', 'Jest', 'Postman', 'Webpack / Vite'],
    },
  ],
  experiences: [
    {
      id: 'exp-ka-1',
      role: 'SOFTWARE ENGINEER',
      duration: 'June 2022 – Present',
      domainSpecialization: 'FULL-STACK ENGINEERING • PAYMENTS • MICROSERVICES',
      location: 'Bengaluru, India (Enterprise Client Delivery)',
      rawEmployerName: 'Appperfect',
      hideEmployer: true,
      highlights: [
        'Architected and deployed responsive customer onboarding and payment gateway flows in React.js and TypeScript, handling over 120,000 monthly active users.',
        'Engineered complex state orchestration pipelines using MobX and Redux Toolkit, trimming re-render latency by 38% across intensive data table views.',
        'Developed resilient backend REST microservices in Node.js and Express with automated payload validation and idempotency key handling.',
        'Implemented strict Role-Based Access Control (RBAC) security frameworks and PCI-DSS compliant checkout interfaces.',
        'Spearheaded automated frontend testing suites using Jest and React Testing Library, boosting code coverage from 62% to 91%.',
      ],
    },
    {
      id: 'exp-ka-2',
      role: 'ASSOCIATE SOFTWARE DEVELOPER',
      duration: 'August 2020 – May 2022',
      domainSpecialization: 'FRONTEND ARCHITECTURE • REACT ECOSYSTEM • DESIGN SYSTEMS',
      location: 'Udaipur / Bengaluru, India',
      rawEmployerName: 'Technology Solutions Group',
      hideEmployer: true,
      highlights: [
        'Engineered reusable enterprise UI design system components in TypeScript adopted across 5 distributed client web applications.',
        'Optimized core web vitals and bundle size through dynamic code-splitting and asset compression, cutting initial load time by 1.8s.',
        'Collaborated closely with enterprise product teams and UI/UX designers in 2-week agile delivery sprints.',
      ],
    },
  ],
  techStack: [
    {
      category: 'LANGUAGES',
      items: ['TypeScript', 'JavaScript (ES6+)', 'SQL', 'HTML5', 'CSS3', 'Python'],
    },
    {
      category: 'FRONTEND & UI',
      items: ['React.js', 'Next.js', 'Redux Toolkit', 'MobX', 'Tailwind CSS', 'Vite', 'Material UI'],
    },
    {
      category: 'BACKEND & SERVICES',
      items: ['Node.js', 'Express.js', 'RESTful APIs', 'GraphQL', 'Microservices'],
    },
    {
      category: 'DATABASES & CACHE',
      items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
    },
    {
      category: 'CLOUD & DEVOPS',
      items: ['AWS (S3, EC2, CloudFront)', 'Docker', 'Git', 'GitHub Actions', 'CI/CD'],
    },
    {
      category: 'TESTING & PRACTICES',
      items: ['Jest', 'React Testing Library', 'Postman', 'Agile / Scrum', 'Code Reviews'],
    },
  ],
  selectedProjects: [
    {
      id: 'proj-ka-1',
      title: 'Digital Payments & Merchant Checkout Portal',
      domain: 'Fintech & Commercial Payments',
      description: 'End-to-end checkout interface and merchant dashboard with real-time settlement telemetry and multi-currency billing.',
      impact: 'Reduced checkout abandonment rate by 14% and scaled transaction processing throughput to 500 TPS.',
      technologies: ['React.js', 'TypeScript', 'Node.js', 'Redux', 'Tailwind CSS'],
      hideClientIdentity: true,
      rawClientName: 'Tier 1 Payments Provider',
    },
    {
      id: 'proj-ka-2',
      title: 'Enterprise Billing & Subscription Management Engine',
      domain: 'SaaS Platform Infrastructure',
      description: 'Customer self-serve tier upgrade flow with automated invoice generation, webhook listeners, and Stripe API integration.',
      impact: 'Automated 98% of manual billing interventions and streamlined enterprise license provisioning.',
      technologies: ['TypeScript', 'React.js', 'Express.js', 'PostgreSQL', 'Docker'],
      hideClientIdentity: true,
      rawClientName: 'Global Cloud Enterprise',
    },
  ],
  education: [
    {
      id: 'edu-ka-1',
      degree: 'Bachelor of Technology (B.Tech) in Computer Science and Engineering',
      institution: 'Rajasthan Technical University',
      year: '2020',
      details: 'First Class with Distinction • Core focus on Software Engineering & Web Technologies',
    },
  ],
  certifications: [
    {
      id: 'cert-ka-1',
      name: 'Advanced React & TypeScript Architecture',
      issuer: 'Prasha Infotech Technical Governance',
      year: '2024',
    },
    {
      id: 'cert-ka-2',
      name: 'Node.js Enterprise Application Design',
      issuer: 'Verified Technical Certification Board',
      year: '2023',
    },
  ],
  sourceFileName: 'Kashika_Ajmera.pdf',
  dateProcessed: new Date().toLocaleDateString(),
  hideAllEmployers: true,
  hideAllClientNames: true,
};
