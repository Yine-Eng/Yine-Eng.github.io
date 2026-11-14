import { links } from '../data/content'

export interface Command {
  id: string
  label: string
  hint: string
  run: () => void
}

function goTo(hash: string) {
  document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', hash)
}

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function buildCommands(onToggleTheme: () => void): Command[] {
  return [
    { id: 'work', label: 'Go to work', hint: 'section', run: () => goTo('#work') },
    { id: 'demo', label: 'Watch a request run', hint: 'section', run: () => goTo('#demo') },
    { id: 'about', label: 'About me', hint: 'section', run: () => goTo('#about') },
    { id: 'contact', label: 'Contact', hint: 'section', run: () => goTo('#contact') },
    { id: 'theme', label: 'Toggle light / dark theme', hint: 'action', run: onToggleTheme },
    { id: 'github', label: 'Open GitHub', hint: 'link', run: () => openExternal(links.github) },
    {
      id: 'linkedin',
      label: 'Open LinkedIn',
      hint: 'link',
      run: () => openExternal(links.linkedin),
    },
    {
      id: 'relaycrm',
      label: 'Open the RelayCRM live demo',
      hint: 'link',
      run: () => openExternal(links.relaycrmDemo),
    },
    {
      id: 'email',
      label: 'Send me an email',
      hint: 'link',
      run: () => (location.href = links.email),
    },
  ]
}
