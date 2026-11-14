import { hobbies } from '../data/content'

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 pt-20 md:px-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Off the keyboard
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-muted">
            CS at Bluefield State University, graduating May 2027. President of Students Today
            Alumni Tomorrow, VP of the International Student Organization, and a member of
            ColorStack and CodePath. Afrobeats and hip hop are always playing; I&apos;ll start every
            song and finish none of them.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-2">
          {hobbies.map((h) => (
            <li
              key={h.text}
              className={`${h.color} rounded-2xl border-2 border-line p-5 font-display text-lg font-bold text-[#111114] md:text-xl`}
            >
              {h.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
