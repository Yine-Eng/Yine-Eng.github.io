import { Fragment } from 'react'
import { skills } from '../data/content'

export function Marquee() {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {skills.map((skill) => (
        <Fragment key={skill}>
          <span>{skill}</span>
          <span className="text-[var(--marquee-star)]">✦</span>
        </Fragment>
      ))}
    </div>
  )

  return (
    <div className="overflow-hidden border-y-[3px] border-line bg-[var(--marquee-bg)] py-4 font-display text-2xl font-bold whitespace-nowrap text-[var(--marquee-ink)]">
      <p className="sr-only">Skills: {skills.join(', ')}</p>
      <div className="animate-marquee flex w-max" aria-hidden="true">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
