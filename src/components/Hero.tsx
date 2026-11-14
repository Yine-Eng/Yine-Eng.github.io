import { links } from '../data/content'

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto grid max-w-7xl items-end gap-10 px-5 pt-8 pb-14 md:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:pt-12"
    >
      <div className="flex flex-col gap-6 lg:pb-10">
        <span className="sticker -rotate-2 self-start bg-sun">
          <span className="text-[#137a3f]">●</span> live · backend engineer · class of 2027
        </span>
        <h1 className="font-display text-6xl leading-[0.95] font-bold tracking-tighter sm:text-7xl xl:text-[6.5rem]">
          Backend you can <span className="text-accent-text">watch</span> work.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
          I build the parts of software you never see, then make them visible: tenant walls, AI
          guardrails, audit trails. Prev. Morgan Stanley and Intuit Credit Karma.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="#demo" className="btn-primary">
            See it run
          </a>
          <a href={links.github} className="btn-secondary" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>

      <div className="relative mx-auto h-[420px] w-full max-w-[520px] sm:h-[520px]">
        <div
          aria-hidden="true"
          className="absolute inset-x-6 bottom-0 h-[82%] overflow-hidden rounded-[2rem] border-[3px] border-line bg-accent"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:36px_36px]" />
        </div>
        <img
          src="/caricature.svg"
          alt="Illustrated caricature of Sampson, laughing, in a black polo with a silver chain"
          width={1000}
          height={1000}
          className="absolute bottom-[3px] left-1/2 w-[92%] -translate-x-1/2"
          fetchPriority="high"
        />
        <span
          aria-hidden="true"
          className="sticker animate-bob absolute top-14 left-0 -rotate-3 bg-card !text-ink"
        >
          GET /api/me <span className="text-ok">200</span>
        </span>
        <span
          aria-hidden="true"
          className="sticker animate-bob absolute top-32 right-0 rotate-3 bg-peach [animation-delay:-2s]"
        >
          404 · org_id=2 · not yours
        </span>
        <span
          aria-hidden="true"
          className="sticker animate-bob absolute top-2 right-8 -rotate-2 bg-tangerine [animation-delay:-3.5s]"
        >
          now: building airlock
        </span>
      </div>
    </section>
  )
}
