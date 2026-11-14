import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the headline and every project', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Backend you can watch work.',
    )
    for (const name of ['RelayCRM', 'airlock', 'Beyond Blue']) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
  })

  it('switches theme, updates <html> and remembers the choice', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(document.documentElement.dataset.theme).toBe('light')
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('theme')).toBe('dark')
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })

  it('starts from a stored theme', () => {
    window.localStorage.setItem('theme', 'dark')
    render(<App />)

    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('opens the command menu with Ctrl+K, filters it, and closes on Escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard('{Control>}k{/Control}')
    const dialog = screen.getByRole('dialog', { name: 'Command menu' })
    const input = within(dialog).getByRole('combobox')
    expect(input).toHaveFocus()

    await user.type(input, 'linked')
    const options = within(dialog).getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('Open LinkedIn')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('runs the theme command from the menu', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Open command menu' }))
    await user.type(screen.getByRole('combobox'), 'theme{Enter}')

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('RequestDemo', () => {
  it('reveals each check and ends in 404 for another tenant', async () => {
    vi.useFakeTimers()
    try {
      render(<App />)
      const demo = screen.getByRole('heading', { name: /Ask for Acme/ }).closest('section')!

      act(() => {
        within(demo).getByRole('button', { name: 'Send request' }).click()
      })
      expect(within(demo).queryByText(/404 Not Found/)).not.toBeInTheDocument()

      act(() => {
        vi.runAllTimers()
      })
      expect(within(demo).getByText(/404 Not Found/)).toBeInTheDocument()
      expect(within(demo).getByText(/matched no row/)).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows the database refusing the row when the app forgets its filter', async () => {
    vi.useFakeTimers()
    try {
      render(<App />)
      const demo = screen.getByRole('heading', { name: /Ask for Acme/ }).closest('section')!

      act(() => {
        within(demo).getByRole('checkbox').click()
        within(demo).getByRole('button', { name: 'Send request' }).click()
      })
      act(() => {
        vi.runAllTimers()
      })

      expect(within(demo).getByText(/policy hides org 1 rows/)).toBeInTheDocument()
      expect(within(demo).getByText(/404 Not Found/)).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('returns the contact to a user in the same organization', async () => {
    vi.useFakeTimers()
    try {
      render(<App />)
      const demo = screen.getByRole('heading', { name: /Ask for Acme/ }).closest('section')!

      act(() => {
        within(demo).getByRole('button', { name: /Alice/ }).click()
      })
      act(() => {
        within(demo).getByRole('button', { name: 'Send request' }).click()
      })
      act(() => {
        vi.runAllTimers()
      })

      expect(within(demo).getByText(/200 OK/)).toBeInTheDocument()
      expect(within(demo).getByText(/Wile E. Coyote/)).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
