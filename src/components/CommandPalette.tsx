import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { buildCommands, type Command } from '../lib/commands'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onToggleTheme: () => void
}

/** Mounted only while open, so every opening starts with an empty search. */
export function CommandPalette(props: CommandPaletteProps) {
  return props.open ? <PaletteDialog {...props} /> : null
}

function PaletteDialog({ onClose, onToggleTheme }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const commands = useMemo(() => buildCommands(onToggleTheme), [onToggleTheme])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands
  }, [commands, query])

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    return () => previous?.focus()
  }, [])

  function run(command: Command | undefined) {
    if (!command) return
    onClose()
    command.run()
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[active])
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[15vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onKeyDown={onKeyDown}
        className="w-full max-w-lg overflow-hidden rounded-2xl border-[3px] border-line bg-card shadow-[8px_8px_0_var(--shadow)]"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          placeholder="Type a command or search…"
          aria-label="Search commands"
          aria-controls="command-list"
          aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
          role="combobox"
          aria-expanded="true"
          className="w-full border-b-2 border-line bg-transparent px-5 py-4 font-mono text-base outline-none placeholder:text-muted"
        />
        <ul id="command-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-3 text-muted">No matches.</li>}
          {results.map((c, i) => (
            <li
              key={c.id}
              id={`cmd-${c.id}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(c)}
              className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 ${
                i === active ? 'bg-accent text-white' : ''
              }`}
            >
              <span>{c.label}</span>
              <span
                className={`font-mono text-xs ${i === active ? 'text-white/80' : 'text-muted'}`}
              >
                {c.hint}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
