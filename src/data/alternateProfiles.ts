import { DeveloperProfile } from '../types';

/**
 * Neha Sharma: Lead C/C++ Systems & Messaging Infrastructure Engineer
 * (Featured in prompt: ex-ValueFirst Digital Media strictly masked)
 */
export const nehaSharmaProfile: DeveloperProfile = {
  id: 'neha-sharma',
  name: 'NEHA SHARMA',
  title: 'Lead Systems & C/C++ Software Engineer',
  subtitle: 'High-Throughput Systems • C/C++ (Modern C++17/20) • Telecom Messaging Infrastructure',
  specializationTag: 'C/C++ ENGINEER',
  location: 'Noida / Delhi NCR, India • Available for Global Client Engagements',
  email: 'talent@prashainfotech.com',
  phone: '+91 98765 43210',
  linkedin: 'https://www.linkedin.com/in/prasha-infotech-3b8536325/',
  github: 'github.com/prasha-infotech',
  summary:
    'Distinguished Lead Systems Software Engineer with 7+ years of rigorous core engineering experience in high-performance C/C++, Linux systems programming, and high-concurrency telecom messaging platforms. Deep technical mastery in multithreaded daemon design, POSIX socket programming, IPC pipelines, and low-latency network protocols (SMPP, HTTP/2, TCP/IP). Demonstrated expertise engineering mission-critical infrastructure processing 40M+ daily events with sub-5ms transaction SLAs.',
  snapshotStats: [
    {
      value: '7+ YEARS',
      label: 'SYSTEMS EXPERIENCE',
      subtext: 'Core C/C++ & low-latency daemon engineering',
    },
    {
      value: '40M+',
      label: 'DAILY EVENTS',
      subtext: 'High-throughput messaging & routing pipelines',
    },
    {
      value: '< 5 MS',
      label: 'TRANSACTION SLA',
      subtext: 'Zero-copy buffers & thread-safe ring queues',
    },
    {
      value: 'C++17 / C++20',
      label: 'SYSTEMS MASTERY',
      subtext: 'Memory-safe POSIX & Linux kernel socket APIs',
    },
  ],
  coreExpertise: [
    {
      category: 'Systems & Core Languages',
      skills: ['Modern C++ (C++14/17/20)', 'C', 'POSIX Systems Programming', 'Linux Shell Scripting', 'Python', 'SQL'],
    },
    {
      category: 'Concurrency & Network Protocols',
      skills: ['SMPP v3.4', 'TCP/IP Sockets', 'HTTP/REST', 'IPC (Shared Memory, Semaphores)', 'Multithreading (pthreads, std::thread)'],
    },
    {
      category: 'Databases & In-Memory Stores',
      skills: ['MySQL High-Concurrency', 'Redis (In-Memory Lookup)', 'PostgreSQL', 'SQLite'],
    },
    {
      category: 'Profiling & Performance',
      skills: ['Valgrind (Memcheck, Massif)', 'GDB Debugger', 'Perf', 'Strace', 'Wireshark', 'AddressSanitizer'],
    },
    {
      category: 'Platforms & Infrastructure',
      skills: ['Linux (RHEL, Ubuntu, CentOS)', 'Docker', 'Git / GitLab', 'Jenkins CI/CD', 'CMake', 'Make'],
    },
  ],
  experiences: [
    {
      id: 'exp-ns-1',
      role: 'LEAD SYSTEMS ENGINEER',
      duration: 'June 2018 – Present',
      domainSpecialization: 'SYSTEMS ENGINEERING • C/C++ • MESSAGING INFRASTRUCTURE',
      location: 'Noida, India (Enterprise Client Delivery)',
      rawEmployerName: 'ValueFirst Digital Media',
      hideEmployer: true,
      highlights: [
        'Architected and deployed high-throughput telecom messaging engines in modern C++ processing 40,000,000+ daily SMS/RCS notifications for Tier-1 enterprise clients.',
        'Engineered non-blocking, asynchronous I/O architectures utilizing epoll and zero-copy socket buffers, maintaining sub-5ms roundtrip packet latency under peak traffic.',
        'Designed lockless ring buffers and thread-safe worker pools, reducing CPU core contention and dropping packet loss to 0.001%.',
        'Implemented distributed throttling and rate-limiting daemons communicating via shared memory and Redis, ensuring compliance with telecom operator guidelines.',
        'Spearheaded performance tuning with Valgrind and GDB, eliminating memory leaks and reducing process resident memory footprints by 35%.',
      ],
    },
    {
      id: 'exp-ns-2',
      role: 'SOFTWARE ENGINEER (SYSTEMS)',
      duration: 'July 2016 – May 2018',
      domainSpecialization: 'NETWORK PROTOCOLS • LINUX DAEMONS • PROTOCOL PARSING',
      location: 'Noida, India',
      rawEmployerName: 'Telecom Software Technologies',
      hideEmployer: true,
      highlights: [
        'Engineered SMPP v3.4 protocol parser modules and delivery receipt (DLR) handlers in C++ with custom memory pool allocators.',
        'Integrated automated health-check daemons and alerting scripts in Bash and Python, achieving 99.99% service uptime.',
        'Built automated regression test harnesses simulating thousands of concurrent SMPP binds and packet corruptions.',
      ],
    },
  ],
  techStack: [
    {
      category: 'CORE LANGUAGES',
      items: ['C++', 'C', 'Modern C++17/20', 'Bash', 'Python', 'SQL'],
    },
    {
      category: 'NETWORKING & PROTOCOLS',
      items: ['SMPP v3.4', 'TCP/IP', 'Linux Sockets (epoll)', 'HTTP/REST', 'IPC', 'Zero-Copy I/O'],
    },
    {
      category: 'CONCURRENCY & STORAGE',
      items: ['Multithreading', 'Lock-Free Queues', 'Redis', 'MySQL High-Throughput', 'Shared Memory'],
    },
    {
      category: 'DEBUGGING & PROFILING',
      items: ['GDB', 'Valgrind', 'AddressSanitizer', 'Perf', 'Strace', 'Wireshark'],
    },
    {
      category: 'BUILD & PLATFORMS',
      items: ['Linux (RHEL / Ubuntu)', 'CMake', 'Make', 'Docker', 'Git', 'Jenkins CI/CD'],
    },
  ],
  selectedProjects: [
    {
      id: 'proj-ns-1',
      title: 'High-Concurrency SMPP Gateway & Router',
      domain: 'Telecommunications & Enterprise Messaging',
      description: 'Carrier-grade SMS routing daemon capable of sustaining 15,000 transactions per second across 200+ parallel telecom operator connections.',
      impact: 'Eliminated message queue congestion during national campaign surges, sustaining 99.99% availability.',
      technologies: ['C++17', 'Linux epoll', 'Redis', 'MySQL', 'CMake'],
      hideClientIdentity: true,
      rawClientName: 'Tier 1 Digital Media Enterprise',
    },
    {
      id: 'proj-ns-2',
      title: 'Distributed Rate-Limiting & Quota Engine',
      domain: 'Fintech & Transactional Alerts',
      description: 'Shared-memory micro-daemon validating client credit limits and sending burst rate quotas in under 120 microseconds.',
      impact: 'Prevented network overages and delivered real-time billing accuracy for corporate banking alert feeds.',
      technologies: ['C++', 'IPC Shared Memory', 'POSIX Semaphores', 'Redis'],
      hideClientIdentity: true,
      rawClientName: 'Corporate Banking Client',
    },
  ],
  education: [
    {
      id: 'edu-ns-1',
      degree: 'Bachelor of Technology (B.Tech) in Information Technology',
      institution: 'APJ Abdul Kalam Technical University',
      year: '2016',
      details: 'Specialized in Operating Systems Architecture, Networking & Compiler Design',
    },
  ],
  certifications: [
    {
      id: 'cert-ns-1',
      name: 'Advanced Systems Programming & Linux Internals',
      issuer: 'Prasha Infotech Technical Governance',
      year: '2023',
    },
    {
      id: 'cert-ns-2',
      name: 'Certified C++ Architecture Specialist',
      issuer: 'Technical Standards Council',
      year: '2022',
    },
  ],
  sourceFileName: 'Neha_Sharma_CV_C++.pdf',
  dateProcessed: new Date().toLocaleDateString(),
  hideAllEmployers: true,
  hideAllClientNames: true,
};

/**
 * Ankush Ojha: Principal Software & Enterprise Integration Engineer
 * (Featured in prompt: ex-UKG strictly masked: "LEAD SOFTWARE ENGINEER", "Nov 2019 – Present", Domain: "ENTERPRISE INTEGRATION • DELL BOOMI • WORKFORCE SYSTEMS")
 */
export const ankushOjhaProfile: DeveloperProfile = {
  id: 'ankush-ojha',
  name: 'ANKUSH OJHA',
  title: 'Principal Software & Enterprise Integration Engineer',
  subtitle: 'Enterprise Integration • Dell Boomi • Cloud Workflows • Microservices Architecture',
  specializationTag: 'INTEGRATION ENGINEER',
  location: 'Bengaluru, India • Available for Global Client Engagements',
  email: 'talent@prashainfotech.com',
  phone: '+91 98765 43210',
  linkedin: 'https://www.linkedin.com/in/prasha-infotech-3b8536325/',
  github: 'github.com/prasha-infotech',
  summary:
    'Principal Software & Enterprise Integration Leader with 8+ years of dedicated expertise in architecting large-scale enterprise integrations, Dell Boomi middleware solutions, and cloud-native API fabrics. Proven track record deploying complex data pipelines across SAP ERP, Salesforce, and HCM platforms synchronizing hundreds of thousands of daily records. Adept at establishing automated error recovery architectures, designing RESTful microservices, and leading enterprise client delivery with 99.99% data pipeline reliability.',
  snapshotStats: [
    {
      value: '8+ YEARS',
      label: 'INTEGRATION EXPERIENCE',
      subtext: 'Dell Boomi, middleware & distributed systems',
    },
    {
      value: '250K+',
      label: 'DAILY SYNCED RECORDS',
      subtext: 'Automated SAP, Salesforce & HCM workflows',
    },
    {
      value: '99.99%',
      label: 'PIPELINE RELIABILITY',
      subtext: 'Automated rollback & dead-letter queue recovery',
    },
    {
      value: 'DELL BOOMI',
      label: 'CERTIFIED ARCHITECT',
      subtext: 'Enterprise iPaaS governance & API management',
    },
  ],
  coreExpertise: [
    {
      category: 'Integration & iPaaS',
      skills: ['Dell Boomi (Atmosphere, Atom, Molecule)', 'Enterprise Integration Patterns (EIP)', 'API Management', 'MuleSoft Concepts', 'Kafka Messaging'],
    },
    {
      category: 'Languages & Scripting',
      skills: ['Java', 'Groovy Scripting', 'JavaScript', 'SQL', 'Bash Scripting', 'Python'],
    },
    {
      category: 'Enterprise Connectors',
      skills: ['SAP ERP (RFC, BAPI)', 'Salesforce REST/SOAP APIs', 'Workday HCM', 'ServiceNow', 'Jira APIs'],
    },
    {
      category: 'APIs & Data Protocols',
      skills: ['RESTful Web Services', 'SOAP / WSDL', 'JSON / XML / EDIFACT', 'Webhooks', 'OAuth 2.0 / SAML'],
    },
    {
      category: 'Cloud & DevOps',
      skills: ['AWS (Lambda, SQS, S3)', 'Docker', 'Git', 'CI/CD Pipelines', 'Postman Automated Testing'],
    },
  ],
  experiences: [
    {
      id: 'exp-ao-1',
      role: 'LEAD SOFTWARE ENGINEER',
      duration: 'Nov 2019 – Present',
      domainSpecialization: 'ENTERPRISE INTEGRATION • DELL BOOMI • WORKFORCE SYSTEMS',
      location: 'Bengaluru, India (Global Enterprise Delivery)',
      rawEmployerName: 'UKG',
      hideEmployer: true,
      highlights: [
        'Architected and maintained mission-critical integration processes in Dell Boomi synchronizing over 250,000 daily employee records across multinational enterprise systems.',
        'Engineered custom Groovy script transformations and REST API connectors handling multi-tenant payload normalization, trimming processing latency by 45%.',
        'Implemented resilient dead-letter queues (DLQ), automated alerting, and self-healing error reprocessing workflows, cutting sync failure tickets by 92%.',
        'Led client integration workshops with Fortune 500 corporate stakeholders to define interface specifications, data mapping, and cutover strategies.',
        'Spearheaded security hardening across all integration endpoints enforcing OAuth 2.0 token caching and mutual TLS (mTLS) authentication.',
      ],
    },
    {
      id: 'exp-ao-2',
      role: 'SENIOR INTEGRATION DEVELOPER',
      duration: 'June 2017 – October 2019',
      domainSpecialization: 'MIDDLEWARE PIPELINES • SAP & SALESFORCE DATA FLOWS',
      location: 'Bengaluru, India',
      rawEmployerName: 'Enterprise Cloud Integrations Corp',
      hideEmployer: true,
      highlights: [
        'Developed bidirectional data synchronization pipelines connecting SAP ERP and Salesforce CRM for global manufacturing clients.',
        'Constructed custom Java middleware plugins accelerating bulk XML/JSON parsing for large-scale nightly reconciliations.',
        'Standardized unit and regression test scripts in Postman reducing enterprise client deployment verification time by 60%.',
      ],
    },
  ],
  techStack: [
    {
      category: 'IPAAS & MIDDLEWARE',
      items: ['Dell Boomi', 'Boomi Atom / Molecule', 'API Gateway', 'Kafka', 'RabbitMQ'],
    },
    {
      category: 'LANGUAGES & SCRIPTS',
      items: ['Java', 'Groovy', 'JavaScript', 'SQL', 'XML / JSON', 'EDI'],
    },
    {
      category: 'ENTERPRISE CONNECTORS',
      items: ['SAP ERP', 'Salesforce', 'Workday HCM', 'ServiceNow', 'SuccessFactors'],
    },
    {
      category: 'APIS & SECURITY',
      items: ['REST APIs', 'SOAP Web Services', 'OAuth 2.0', 'mTLS', 'Webhooks'],
    },
    {
      category: 'CLOUD & TOOLS',
      items: ['AWS', 'Docker', 'Git', 'Postman', 'Jira', 'Agile Delivery'],
    },
  ],
  selectedProjects: [
    {
      id: 'proj-ao-1',
      title: 'Global Workforce Master Data Sync Mesh',
      domain: 'Enterprise Cloud HCM & ERP Integration',
      description: 'Real-time Dell Boomi integration mesh syncing global payroll, time tracking, and organizational hierarchies across 14 countries.',
      impact: 'Cut data latency from 24-hour batch jobs to 30-second near real-time sync with 99.99% guaranteed delivery.',
      technologies: ['Dell Boomi', 'Groovy', 'REST APIs', 'OAuth 2.0', 'SAP Connector'],
      hideClientIdentity: true,
      rawClientName: 'Global Workforce Solutions Client',
    },
    {
      id: 'proj-ao-2',
      title: 'Enterprise Billing & CRM Automated Pipeline',
      domain: 'Commercial Systems Orchestration',
      description: 'Event-driven middleware pipeline orchestrating customer license entitlements between Salesforce CRM and backend financial ledgers.',
      impact: 'Processed $12M+ in monthly subscription orders with zero manual reconciliation overhead.',
      technologies: ['Dell Boomi', 'Salesforce API', 'SQL Server', 'AWS SQS'],
      hideClientIdentity: true,
      rawClientName: 'Multinational Software Enterprise',
    },
  ],
  education: [
    {
      id: 'edu-ao-1',
      degree: 'Bachelor of Engineering (B.E.) in Computer Science',
      institution: 'Visvesvaraya Technological University',
      year: '2016',
      details: 'Specialization in Enterprise Systems, Database Management & Software Engineering',
    },
  ],
  certifications: [
    {
      id: 'cert-ao-1',
      name: 'Certified Dell Boomi Professional Developer',
      issuer: 'Dell Boomi Official Certification',
      year: '2023',
    },
    {
      id: 'cert-ao-2',
      name: 'Enterprise Cloud Architecture Certification',
      issuer: 'Prasha Infotech Technical Governance',
      year: '2022',
    },
  ],
  sourceFileName: 'AnkushOjha.docx',
  dateProcessed: new Date().toLocaleDateString(),
  hideAllEmployers: true,
  hideAllClientNames: true,
};

export const sampleProfilesList: DeveloperProfile[] = [
  nehaSharmaProfile,
  ankushOjhaProfile,
];
