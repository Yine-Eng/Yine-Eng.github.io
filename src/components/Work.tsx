import { experience, projects, type Project } from '../data/content'
import { ArrowIcon } from './Icons'

const tagStyles: Record<Project['tag'], { label: string; className: string }> = {
  live: { label: 'live', className: 'bg-mint' },
  progress: { label: 'in progress', className: 'bg-peach' },
}

const flow = [
  { label: 'request', className: 'text-ink' },
  { label: 'auth', className: 'bg-lilac text-[#111114]' },
  { label: 'org scope', className: 'bg-lilac text-[#111114]' },
  { label: 'postgres rls', className: 'bg-peach text-[#111114]' },
]

function ProjectCard({ project }: { project: Project }) {
  const tag = tagStyles[project.tag]
  return (
    <article
      className={`pop-card flex flex-col gap-4 p-7 ${project.featured ? 'md:col-span-2' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-display text-3xl font-bold tracking-tight">{project.name}</h3>
        <span className={`chip ${tag.className}`}>{tag.label}</span>
      </div>
      <p className="text-base leading-relaxed text-muted md:text-lg">{project.summary}</p>
      {project.featured && (
        <ol
          aria-label="How a RelayCRM request is checked"
          className="flex flex-wrap items-center gap-2 font-mono text-sm"
        >
          {flow.map((f, i) => (
            <li key={f.label} className="flex items-center gap-2">
              <span className={`rounded-xl border-2 border-line px-3 py-2 ${f.className}`}>
                {f.label}
              </span>
              {i < flow.length - 1 && (
                <span aria-hidden="true" className="text-muted">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
        <span className="font-mono text-sm text-muted">{project.stack}</span>
        {project.links.length > 0 && (
          <div className="flex gap-4">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-accent-text underline-offset-4 hover:underline"
              >
                {l.label}
                <ArrowIcon />
                <span className="sr-only">(opens {project.name} in a new tab)</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-7xl px-5 pt-20 md:px-10">
      <h2 className="mb-8 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Things I built
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
        <div className="pop-card grid gap-6 p-7 md:col-span-2 md:grid-cols-2">
          {experience.map((e) => (
            <div key={e.when} className="flex flex-col gap-2">
              <span className="font-mono text-sm text-muted">{e.when}</span>
              <p className="text-lg leading-snug">{e.what}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
