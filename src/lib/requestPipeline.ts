/**
 * A faithful, in-browser model of how RelayCRM decides a request.
 *
 * The real API checks a request in layers: the caller's identity comes from the server,
 * every query is scoped to the caller's organization, role rules come next, and PostgreSQL
 * row-level security refuses another tenant's rows even when application code forgets its
 * filter. This module reproduces that order so the demo can show each decision as it happens.
 */

export type Role = 'ADMIN' | 'MANAGER' | 'REP'

export interface Org {
  id: number
  name: string
}

export interface DemoUser {
  key: string
  name: string
  role: Role
  org: Org
}

export interface Contact {
  id: number
  orgId: number
  ownerId: string
  name: string
  company: string
}

export type Method = 'GET' | 'DELETE'

export type StepId = 'auth' | 'scope' | 'role' | 'rls'

export type StepOutcome = 'pass' | 'fail' | 'skipped' | 'bypassed'

export interface Step {
  id: StepId
  label: string
  outcome: StepOutcome
  detail: string
}

export interface PipelineResult {
  steps: Step[]
  status: number
  statusText: string
  body: string
}

export const ACME: Org = { id: 1, name: 'Acme Corp' }
export const GLOBEX: Org = { id: 2, name: 'Globex Inc' }

export const DEMO_USERS: readonly DemoUser[] = [
  { key: 'gina', name: 'Gina', role: 'ADMIN', org: GLOBEX },
  { key: 'alice', name: 'Alice', role: 'ADMIN', org: ACME },
  { key: 'rita', name: 'Rita', role: 'REP', org: ACME },
]

export const DEMO_CONTACT: Contact = {
  id: 1,
  orgId: ACME.id,
  ownerId: 'alice',
  name: 'Wile E. Coyote',
  company: 'Road Runner Group',
}

const NOT_FOUND_BODY = JSON.stringify({ status: 404, title: 'Not Found' })

export interface PipelineInput {
  user: DemoUser
  method: Method
  contact?: Contact
  /** Simulates a bug where application code forgets its `WHERE org_id = ?` filter. */
  appForgetsOrgFilter?: boolean
}

function step(id: StepId, outcome: StepOutcome, detail: string): Step {
  const labels: Record<StepId, string> = {
    auth: 'auth',
    scope: 'org scope',
    role: 'role check',
    rls: 'postgres rls',
  }
  return { id, label: labels[id], outcome, detail }
}

/**
 * Runs one request through the layers in the same order as the real API:
 * access (404, 403) is decided before anything is read or changed.
 */
export function runPipeline({
  user,
  method,
  contact = DEMO_CONTACT,
  appForgetsOrgFilter = false,
}: PipelineInput): PipelineResult {
  const steps: Step[] = [
    step(
      'auth',
      'pass',
      `${user.name} · ${user.role} · org ${user.org.id}, resolved on the server`,
    ),
  ]

  const sameOrg = contact.orgId === user.org.id

  if (appForgetsOrgFilter) {
    steps.push(step('scope', 'bypassed', 'bug: query ran without WHERE org_id = ?'))
  } else if (!sameOrg) {
    steps.push(step('scope', 'fail', `WHERE org_id = ${user.org.id} matched no row`))
    steps.push(step('role', 'skipped', 'not reached'))
    steps.push(step('rls', 'skipped', 'not reached'))
    return notFound(steps)
  } else {
    steps.push(step('scope', 'pass', `WHERE org_id = ${user.org.id} found contact ${contact.id}`))
  }

  if (!sameOrg) {
    // Only reachable when the application filter was skipped: the database is the last wall.
    steps.push(step('role', 'skipped', 'no row to check'))
    steps.push(
      step('rls', 'fail', `policy hides org ${contact.orgId} rows from org ${user.org.id}`),
    )
    return notFound(steps)
  }

  if (method === 'DELETE' && user.role !== 'ADMIN') {
    steps.push(step('role', 'fail', `${user.role} may not delete; only ADMIN can`))
    steps.push(step('rls', 'skipped', 'not reached'))
    return {
      steps,
      status: 403,
      statusText: 'Forbidden',
      body: JSON.stringify({ status: 403, title: 'Forbidden' }),
    }
  }

  steps.push(
    step('role', 'pass', method === 'GET' ? 'everyone in the org may read' : 'ADMIN may delete'),
  )
  steps.push(step('rls', 'pass', `app.current_org = ${user.org.id} matches the row`))

  if (method === 'DELETE') {
    return { steps, status: 204, statusText: 'No Content', body: '' }
  }

  return {
    steps,
    status: 200,
    statusText: 'OK',
    body: JSON.stringify({ id: contact.id, name: contact.name, company: contact.company }),
  }
}

function notFound(steps: Step[]): PipelineResult {
  return { steps, status: 404, statusText: 'Not Found', body: NOT_FOUND_BODY }
}
