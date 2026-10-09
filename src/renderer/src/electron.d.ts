import type { MeetingMindApi } from '@shared/types'

declare global {
  interface Window {
    meetingMind: MeetingMindApi
  }
}

export {}
