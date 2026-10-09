import type { MeetingSummary, TranscriptSegment } from '../../shared/types'

export interface MeetingNotesInput {
  transcript: TranscriptSegment[]
  userNotes: string
  meetingType?: string
}

export interface MeetingNotesService {
  generate(input: MeetingNotesInput): Promise<MeetingSummary>
}

/** Provider-neutral seam for structured-output LLM calls. */
export class UnimplementedMeetingNotesService implements MeetingNotesService {
  async generate(_input: MeetingNotesInput): Promise<MeetingSummary> {
    throw new Error('MeetingNotesService is not connected yet')
  }
}
