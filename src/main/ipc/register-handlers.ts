import { ipcMain } from 'electron'
import { AudioCaptureService } from '../audio/audio-capture-service'
import { MeetingStore } from '../database/meeting-store'
import type { EnhanceMeetingInput } from '../../shared/types'

const store = new MeetingStore()
const audio = new AudioCaptureService()

export function registerIpcHandlers(): void {
  ipcMain.handle('meetings:list', () => store.list())

  ipcMain.handle('meetings:start', async (_event, input?: { title?: string }) => {
    await audio.start()
    return store.create(input?.title)
  })

  ipcMain.handle('meetings:stop', async (_event, meetingId: string, notes: string) => {
    await audio.stop()
    const transcript = audio.getTranscriptPlaceholder()
    return store.complete(meetingId, notes, transcript)
  })

  ipcMain.handle('meetings:enhance', async (_event, input: EnhanceMeetingInput) => {
    // Replace this deterministic placeholder with the structured-output AI adapter.
    const summary = {
      summary: input.notes.trim()
        ? 'The assistant will expand the topics you flagged using the meeting transcript.'
        : 'Add a few rough notes to guide the assistant toward what matters most in this meeting.',
      keyPoints: ['Structured AI notes are ready to be generated from transcript + user notes.'],
      decisions: [],
      actionItems: [],
      openQuestions: ['Which AI provider and structured schema should the first implementation use?'],
    }
    return store.saveSummary(input.meetingId, summary)
  })

  ipcMain.handle('audio:status', () => ({
    microphone: 'unknown' as const,
    systemAudio: 'unknown' as const,
  }))
}
