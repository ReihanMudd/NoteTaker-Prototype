import { MeetingStore } from '../src/main/database/meeting-store'
import { describe, expect, it } from 'vitest'

describe('MeetingStore scaffold', () => {
  it('seeds a readable meeting library', () => {
    const store = new MeetingStore()
    expect(store.list()[0].title).toBe('Project Planning Meeting')
  })

  it('creates and completes a meeting while preserving notes', () => {
    const store = new MeetingStore()
    const created = store.create('Test meeting')
    const completed = store.complete(created.id, 'Ask about deployment', [])

    expect(completed.status).toBe('completed')
    expect(completed.notes).toBe('Ask about deployment')
    expect(completed.endedAt).toBeDefined()
  })
})
