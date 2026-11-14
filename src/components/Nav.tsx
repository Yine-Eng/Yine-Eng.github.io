import type { Theme } from '../lib/theme'
import { MoonIcon, SearchIcon, SunIcon } from './Icons'

interface NavProps {
  theme: Theme
  onToggleTheme: () => void
  onOpenPalette: () => void
}

const sections = [
  { href: '#work', label: 'Work' },
  { href: '#demo', label: 'Watch it run' },
  { href: '#about', label: 'About' },
]

export function Nav({ theme, onToggleTheme, onOpenPalette }: NavProps) {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  return (
    <header className="sticky top-0 z-30 border-b-2 border-transparent bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-10 md:py-5"
      >
        <a href="#top" className="font-display text-xl font-bold tracking-tight">
          Sampson Anaba<span className="text-accent-text">.</span>
        </a>
        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-2 md:flex">
            {sections.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="pill">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onOpenPalette}
            className="flex h-11 items-center gap-2 rounded-xl border-2 border-line px-3 font-mono text-sm text-muted"
            aria-label="Open command menu"
          >
            <SearchIcon />
            <span className="hidden sm:inline">{isMac ? '⌘K' : 'Ctrl K'}</span>
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-line bg-card"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>
    </header>
  )
}
