import { links } from '../data/content'

export function Footer() {
  return (
    <footer id="contact" className="mx-auto max-w-7xl px-5 pt-24 pb-14 md:px-10">
      <div className="flex flex-col gap-8 border-t-[3px] border-line pt-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Let&apos;s build something.
          </p>
          <p className="text-muted">Open to New Grad 2027 roles anywhere in the US.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={links.email} className="btn-primary">
            Get in touch
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" className="btn-secondary">
            LinkedIn
          </a>
          <a href={links.github} target="_blank" rel="noreferrer" className="btn-secondary">
            GitHub
          </a>
        </div>
      </div>
      <p className="mt-10 font-mono text-xs text-muted">
        © {new Date().getFullYear()} Sampson Anaba · Built with React, TypeScript and Tailwind.
      </p>
    </footer>
  )
}
