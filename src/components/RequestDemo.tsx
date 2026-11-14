import { useEffect, useId, useRef, useState } from 'react'
import { links } from '../data/content'
import {
  DEMO_CONTACT,
  DEMO_USERS,
  runPipeline,
  type Method,
  type PipelineResult,
  type StepOutcome,
} from '../lib/requestPipeline'
import { useReducedMotion } from '../lib/useReducedMotion'

const STEP_DELAY_MS = 420

const outcomeStyle: Record<StepOutcome, { mark: string; className: string; srText: string }> = {
  pass: { mark: '✓', className: 'text-[#5fd38d]', srText: 'passed' },
  fail: { mark: '✕', className: 'text-[#f28b82]', srText: 'refused' },
  skipped: { mark: '·', className: 'text-[#7c859a]', srText: 'not reached' },
  bypassed: { mark: '!', className: 'text-[#f2b84b]', srText: 'bypassed' },
}

function statusClass(status: number) {
  return status < 300 ? 'text-[#5fd38d]' : 'text-[#f28b82]'
}

export function RequestDemo() {
  const reducedMotion = useReducedMotion()
  const bugId = useId()
  const [userKey, setUserKey] = useState('gina')
  const [method, setMethod] = useState<Method>('GET')
  const [bug, setBug] = useState(false)
  const [result, setResult] = useState<PipelineResult | null>(null)
  const [shown, setShown] = useState(0)
  const timers = useRef<number[]>([])

  const user = DEMO_USERS.find((u) => u.key === userKey) ?? DEMO_USERS[0]!
  const running = result !== null && shown < result.steps.length + 1

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  function send() {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    const next = runPipeline({ user, method, appForgetsOrgFilter: bug })
    setResult(next)
    const total = next.steps.length + 1 // every step, then the response
    if (reducedMotion) {
      setShown(total)
      return
    }
    setShown(0)
    for (let i = 1; i <= total; i++) {
      timers.current.push(window.setTimeout(() => setShown(i), i * STEP_DELAY_MS))
    }
  }

  return (
    <section id="demo" className="mx-auto max-w-7xl px-5 pt-20 md:px-10">
      <div className="grid gap-8 rounded-3xl border-[3px] border-line bg-console p-6 text-[#e8eaf0] shadow-[8px_8px_0_var(--shadow)] md:p-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col gap-5">
          <span className="font-mono text-sm text-[#c6f432]">// watch it run</span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#f2f2ee] md:text-4xl">
            Pick who you are. Ask for Acme&apos;s contact.
          </h2>
          <p className="text-[#a9adbc]">
            This replays, step by step, how RelayCRM decides a request. Turn on the bug to see what
            happens when application code forgets its tenant filter.
          </p>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-mono text-xs tracking-wider text-[#a9adbc] uppercase">
              View as
            </legend>
            <div className="flex flex-wrap gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.key}
                  type="button"
                  aria-pressed={u.key === userKey}
                  onClick={() => setUserKey(u.key)}
                  className={`rounded-xl border-2 px-3 py-2 font-mono text-sm ${
                    u.key === userKey
                      ? 'border-[#f2f2ee] bg-accent text-white'
                      : 'border-[#606a84] text-[#e8eaf0] hover:border-[#f2f2ee]'
                  }`}
                >
                  {u.name} · {u.org.name.split(' ')[0]} · {u.role}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-mono text-xs tracking-wider text-[#a9adbc] uppercase">
              Request
            </legend>
            <div className="flex flex-wrap gap-2">
              {(['GET', 'DELETE'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={m === method}
                  onClick={() => setMethod(m)}
                  className={`rounded-xl border-2 px-3 py-2 font-mono text-sm ${
                    m === method
                      ? 'border-[#f2f2ee] bg-[#f2f2ee] text-[#111114]'
                      : 'border-[#606a84] text-[#e8eaf0] hover:border-[#f2f2ee]'
                  }`}
                >
                  {m} /api/contacts/{DEMO_CONTACT.id}
                </button>
              ))}
            </div>
          </fieldset>

          <label htmlFor={bugId} className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              id={bugId}
              type="checkbox"
              checked={bug}
              onChange={(e) => setBug(e.target.checked)}
              className="h-5 w-5 accent-[#f2b84b]"
            />
            Simulate a bug: the app forgets <code className="font-mono">WHERE org_id = ?</code>
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={send} className="btn-primary" disabled={running}>
              {running ? 'Running…' : 'Send request'}
            </button>
            <a
              href={links.relaycrmDemo}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[#a9adbc] underline underline-offset-4 hover:text-white"
            >
              Try the real API demo
            </a>
          </div>
        </div>

        <div
          className="min-h-[300px] rounded-2xl border border-[#232836] bg-[#0b0d12] p-5 font-mono text-sm leading-7 md:text-[15px]"
          aria-live="polite"
        >
          {result === null ? (
            <p className="text-[#7c859a]">
              $ waiting for a request…
              <br />
              Contact {DEMO_CONTACT.id} belongs to Acme Corp (org 1).
            </p>
          ) : (
            <>
              <p className="text-[#a9adbc]">
                $ {method} /api/contacts/{DEMO_CONTACT.id}{' '}
                <span className="text-[#7c859a]">as {user.name}</span>
              </p>
              <ol>
                {result.steps.slice(0, shown).map((s) => {
                  const o = outcomeStyle[s.outcome]
                  return (
                    <li key={s.id} className="animate-step-in">
                      <span className={o.className} aria-hidden="true">
                        {o.mark}
                      </span>{' '}
                      <span className="text-[#e8eaf0]">{s.label}</span>
                      <span className="sr-only"> {o.srText}:</span>{' '}
                      <span className="text-[#a9adbc]">· {s.detail}</span>
                    </li>
                  )
                })}
              </ol>
              {shown > result.steps.length && (
                <div className="animate-step-in mt-3 border-t border-[#232836] pt-3">
                  <p className={statusClass(result.status)}>
                    ← {result.status} {result.statusText}
                  </p>
                  {result.body && <p className="break-all text-[#a9adbc]">{result.body}</p>}
                  {result.status === 404 && (
                    <p className="mt-2 text-[#7c859a]">
                      Same answer as a contact that doesn&apos;t exist, so nobody can probe another
                      company&apos;s ids.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
