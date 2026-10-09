import type { Meeting, MeetingSummary, TranscriptSegment } from '../../shared/types'
import { randomUUID } from 'node:crypto'

/** Temporary in-memory store. Replace with SQLite behind this same interface. */
export class MeetingStore {
  private meetings: Meeting[] = [
    {
      id: 'demo-project-planning',
      title: 'Project Planning Meeting',
      status: 'completed',
      startedAt: '2026-10-03T15:00:00.000Z',
      endedAt: '2026-10-03T15:42:00.000Z',
      durationSeconds: 2520,
      notes: 'Review API deadline\nConfirm authentication approach',
      transcript: [
        {
          id: 'demo-segment-1',
          speaker: 'Sarah',
          text: 'Let’s move the API deadline to Friday and use OAuth for authentication.',
          startedAt: '2026-10-03T15:10:00.000Z',
          endedAt: '2026-10-03T15:10:08.000Z',
          isFinal: true,
        },
      ],
      summary: {
        summary: 'The team aligned on the API deadline and authentication direction.',
        keyPoints: ['API work is targeted for Friday.', 'OAuth is the preferred authentication approach.'],
        decisions: ['Use OAuth instead of a custom authentication flow.'],
        actionItems: [
          {
            id: 'demo-action-1',
            task: 'Implement the OAuth flow',
            owner: 'Reihan',
            deadline: 'Friday',
            completed: false,
          },
        ],
        openQuestions: ['Which OAuth provider should be used?'],
      },
    },
  ]

  list(): Meeting[] {
    return structuredClone(this.meetings).sort((a, b) => b.startedAt.localeCompare(a.startedAt))
  }

  get(id: string): Meeting | undefined {
    const meeting = this.meetings.find((item) => item.id === id)
    return meeting ? structuredClone(meeting) : undefined
  }

  create(title = 'Untitled meeting'): Meeting {
    const meeting: Meeting = {
      id: randomUUID(),
      title,
      status: 'recording',
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      notes: '',
      transcript: [],
    }
    this.meetings.unshift(meeting)
    return structuredClone(meeting)
  }

  complete(id: string, notes: string, transcript: TranscriptSegment[]): Meeting {
    const meeting = this.meetings.find((item) => item.id === id)
    if (!meeting) throw new Error(`Meeting ${id} was not found`)

    meeting.status = 'completed'
    meeting.endedAt = new Date().toISOString()
    meeting.durationSeconds = Math.max(0, Math.round((Date.parse(meeting.endedAt) - Date.parse(meeting.startedAt)) / 1000))
    meeting.notes = notes
    meeting.transcript = transcript
    return structuredClone(meeting)
  }

  saveSummary(id: string, summary: MeetingSummary): MeetingSummary {
    const meeting = this.meetings.find((item) => item.id === id)
    if (!meeting) throw new Error(`Meeting ${id} was not found`)
    meeting.summary = summary
    return structuredClone(summary)
  }
}
