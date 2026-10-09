import type { TranscriptSegment } from '../../shared/types'

/**
 * Boundary for microphone + system-audio capture.
 *
 * This is intentionally a no-op in the first scaffold. The real implementation
 * will own OS permissions, MediaStream setup, chunking, and cleanup so the
 * renderer never handles raw audio directly.
 */
export class AudioCaptureService {
  private active = false

  async start(): Promise<void> {
    this.active = true
  }

  async stop(): Promise<void> {
    this.active = false
  }

  isActive(): boolean {
    return this.active
  }

  getTranscriptPlaceholder(): TranscriptSegment[] {
    return [
      {
        id: 'placeholder-segment',
        speaker: 'Transcript service',
        text: 'Live transcription will appear here once the audio adapter is connected.',
        startedAt: new Date().toISOString(),
        isFinal: true,
      },
    ]
  }
}
