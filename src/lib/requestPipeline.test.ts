import { DEMO_USERS, runPipeline, type DemoUser } from './requestPipeline'

function user(key: string): DemoUser {
  const found = DEMO_USERS.find((u) => u.key === key)
  if (!found) throw new Error(`no demo user ${key}`)
  return found
}

describe('runPipeline', () => {
  it('lets a user read a contact in their own organization', () => {
    const result = runPipeline({ user: user('alice'), method: 'GET' })

    expect(result.status).toBe(200)
    expect(result.steps.map((s) => s.outcome)).toEqual(['pass', 'pass', 'pass', 'pass'])
    expect(JSON.parse(result.body)).toMatchObject({ id: 1 })
  })

  it('answers 404 to another tenant at the org scope and never reaches the database policy', () => {
    const result = runPipeline({ user: user('gina'), method: 'GET' })

    expect(result.status).toBe(404)
    expect(result.steps.find((s) => s.id === 'scope')?.outcome).toBe('fail')
    expect(result.steps.find((s) => s.id === 'rls')?.outcome).toBe('skipped')
  })

  it('still answers 404 when the app forgets its filter, because row-level security refuses the row', () => {
    const result = runPipeline({ user: user('gina'), method: 'GET', appForgetsOrgFilter: true })

    expect(result.status).toBe(404)
    expect(result.steps.find((s) => s.id === 'scope')?.outcome).toBe('bypassed')
    expect(result.steps.find((s) => s.id === 'rls')?.outcome).toBe('fail')
  })

  it('gives the same body for another tenant as for a missing record', () => {
    const result = runPipeline({ user: user('gina'), method: 'GET' })

    expect(JSON.parse(result.body)).toEqual({ status: 404, title: 'Not Found' })
  })

  it('refuses a delete by a rep in the same organization with 403', () => {
    const result = runPipeline({ user: user('rita'), method: 'DELETE' })

    expect(result.status).toBe(403)
    expect(result.steps.find((s) => s.id === 'role')?.outcome).toBe('fail')
  })

  it('lets an admin delete in their own organization', () => {
    const result = runPipeline({ user: user('alice'), method: 'DELETE' })

    expect(result.status).toBe(204)
    expect(result.body).toBe('')
  })

  it('checks access before role, so another tenant gets 404 rather than 403 on delete', () => {
    const result = runPipeline({ user: user('gina'), method: 'DELETE' })

    expect(result.status).toBe(404)
  })
})
