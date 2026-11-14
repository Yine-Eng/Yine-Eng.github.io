export const links = {
  github: 'https://github.com/Yine-Eng',
  linkedin: 'https://www.linkedin.com/in/sampson-anaba/',
  email: 'mailto:sampson.anaba.y@gmail.com',
  relaycrmDemo: 'https://relaycrm-demo.netlify.app',
  relaycrmRepo: 'https://github.com/Yine-Eng/relaycrm',
  beyondBlueDemo: 'https://beyond-blue-vert.vercel.app',
  beyondBlueRepo: 'https://github.com/Yine-Eng/beyond-blue',
} as const

export type Tag = 'live' | 'progress'

export interface Project {
  name: string
  tag: Tag
  summary: string
  stack: string
  links: { label: string; href: string }[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    name: 'RelayCRM',
    tag: 'live',
    featured: true,
    summary:
      "A multi-tenant CRM API. Switch between two companies and try to peek at the other's data: the request is checked at every layer, and refused before it ever sees a row.",
    stack: 'Java 21 · Spring Boot · Postgres RLS · React · 170 integration tests',
    links: [
      { label: 'Live demo', href: links.relaycrmDemo },
      { label: 'Code', href: links.relaycrmRepo },
    ],
  },
  {
    name: 'airlock',
    tag: 'progress',
    summary:
      'A guardrail proxy between AI agents and their tools. The model proposes an action; a policy allows it, denies it, or holds it for a human.',
    stack: 'Java 21 · MCP · hash-chained audit log',
    links: [],
  },
  {
    name: 'Beyond Blue',
    tag: 'live',
    summary:
      'A 100-day launch plan for graduating seniors, built as the sole engineer for the Disney on the Yard Innovation Challenge 2026.',
    stack: 'Next.js · Supabase · Playwright',
    links: [
      { label: 'Live', href: links.beyondBlueDemo },
      { label: 'Code', href: links.beyondBlueRepo },
    ],
  },
]

export const experience = [
  {
    when: '2026 · Morgan Stanley',
    what: 'An LLM reads natural-language trade-change requests. Deterministic code decides what applies. 600+ automated tests.',
  },
  {
    when: '2025 · Intuit Credit Karma',
    what: 'Scala/Finagle tooling that simulates offer-ranking data in Google Spanner, plus an AI Slackbot for on-call.',
  },
]

export const hobbies = [
  { text: 'Fishing on weekends', color: 'bg-sun' },
  { text: 'Soccer, playing and watching', color: 'bg-mint' },
  { text: 'Dancing, more confidence than rhythm', color: 'bg-peach' },
  { text: 'Anime & action movies', color: 'bg-lilac' },
] as const

export const skills = [
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'TypeScript',
  'React',
  'AI guardrails',
  'Afrobeats on loop',
]
