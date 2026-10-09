export type MeetingStatus = 'idle' | 'recording' | 'processing' | 'completed' | 'error'

export interface TranscriptSegment {
  id: string
  speaker?: string
  text: string
  startedAt: string
  endedAt?: string
  isFinal: boolean
}

export interface ActionItem {
  id: string
  task: string
  owner?: string
  deadline?: string
  completed: boolean
}

export interface MeetingSummary {
  summary: string
  keyPoints: string[]
  decisions: string[]
  actionItems: ActionItem[]
  openQuestions: string[]
}

export interface Meeting {
  id: string
  title: string
  status: MeetingStatus
  startedAt: string
  endedAt?: string
  durationSeconds: number
  notes: string
  transcript: TranscriptSegment[]
  summary?: MeetingSummary
}

export interface StartMeetingInput {
  title?: string
}

export interface EnhanceMeetingInput {
  meetingId: string
  notes: string
  transcript: TranscriptSegment[]
}

export interface MeetingMindApi {
  meetings: {
    list: () => Promise<Meeting[]>
    start: (input?: StartMeetingInput) => Promise<Meeting>
    stop: (meetingId: string, notes: string) => Promise<Meeting>
    enhance: (input: EnhanceMeetingInput) => Promise<MeetingSummary>
  }
  audio: {
    getStatus: () => Promise<{ microphone: 'unknown' | 'granted' | 'denied'; systemAudio: 'unknown' | 'available' | 'unavailable' }>
  }
}
