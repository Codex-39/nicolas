export const HR_QUESTIONS = [
  {
    id: 'intro-1',
    category: 'Introduction',
    question: 'Tell me about yourself.',
    sampleAnswer: 'I am a passionate software engineer with a strong foundation in full-stack development. Recently, I built a scalable e-commerce platform using React and Node.js that handled 1,000+ concurrent users seamlessly. I thrive in collaborative environments and am always eager to learn new technologies. I am excited about this role because it aligns with my passion for building user-centric, performant applications.',
    tips: [
      'Use the Present-Past-Future formula.',
      'Highlight relevant technical achievements.',
      'Keep it concise (1-2 minutes max).',
      'Connect it back to why you are here today.'
    ]
  },
  {
    id: 'strength-1',
    category: 'Strengths & Weaknesses',
    question: 'What is your greatest weakness?',
    sampleAnswer: 'In the past, I sometimes struggled with delegating tasks because I wanted to ensure everything was done perfectly. However, I realized this was causing bottlenecks. I started actively practicing delegation by documenting processes clearly and holding regular check-ins, which improved both team efficiency and trust.',
    tips: [
      'Choose a real weakness but not a deal-breaker.',
      'Focus heavily on the steps you are taking to overcome it.',
      'Show self-awareness and a growth mindset.'
    ]
  },
  {
    id: 'conflict-1',
    category: 'Conflict Handling',
    question: 'Describe a time you disagreed with a team member. How did you handle it?',
    sampleAnswer: 'During my last project, a teammate and I disagreed on whether to use a NoSQL or SQL database for our new microservice. I suggested we each take an hour to outline the pros, cons, and performance implications for our specific use case. We then reviewed them together objectively. We realized NoSQL was faster for our read-heavy requirements, and my teammate agreed. We documented the decision and moved forward smoothly.',
    tips: [
      'Use the STAR method (Situation, Task, Action, Result).',
      'Focus on the resolution and mutual respect.',
      'Show that you rely on facts/data, not emotion.',
      'Never badmouth former colleagues.'
    ]
  },
  {
    id: 'failure-1',
    category: 'Failure Stories',
    question: 'Tell me about a time you failed.',
    sampleAnswer: 'Once, I deployed an update without running the full test suite because we were rushing to meet a deadline. It caused a minor production outage for an hour. I immediately rolled back the change, communicated the issue to the team, and fixed the bug. More importantly, I took ownership and implemented a mandatory CI/CD pipeline check so code could not be merged without passing all tests. It hasn’t happened since.',
    tips: [
      'Own the failure—don’t blame others.',
      'Explain the immediate action you took to fix it.',
      'Highlight what you learned and the system you put in place to prevent it from happening again.'
    ]
  },
  {
    id: 'leadership-1',
    category: 'Leadership',
    question: 'Describe a time you stepped up as a leader.',
    sampleAnswer: 'When our team lead went on sudden leave right before a major release, the team was disorganized and anxious. I stepped up by organizing a daily 10-minute standup to align our priorities, reassigning tasks based on strengths, and acting as the main point of contact for stakeholders. We successfully delivered the release on time, and the team felt much more confident.',
    tips: [
      'Leadership isn’t just a title; it’s an action.',
      'Show how you motivated or organized others.',
      'Highlight the positive outcome for the team, not just yourself.'
    ]
  }
];

export const RESUME_ANALYZER_PROMPTS = [
    "Explain the architecture of the project you mentioned.",
    "What was the most challenging technical hurdle in this project?",
    "If you had to redo this project today, what technologies would you change and why?",
    "How did you ensure the scalability and performance of this application?",
    "Can you describe your specific contribution to this team project?"
];
