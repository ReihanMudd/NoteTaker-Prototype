import { contextBridge, ipcRenderer } from 'electron'
import type { EnhanceMeetingInput, MeetingMindApi, StartMeetingInput } from '../shared/types'

const api: MeetingMindApi = {
  meetings: {
    list: () => ipcRenderer.invoke('meetings:list'),
    start: (input?: StartMeetingInput) => ipcRenderer.invoke('meetings:start', input),
    stop: (meetingId: string, notes: string) => ipcRenderer.invoke('meetings:stop', meetingId, notes),
    enhance: (input: EnhanceMeetingInput) => ipcRenderer.invoke('meetings:enhance', input),
  },
  audio: {
    getStatus: () => ipcRenderer.invoke('audio:status'),
  },
}

contextBridge.exposeInMainWorld('meetingMind', api)
