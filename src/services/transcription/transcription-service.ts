import type { TranscriptSegment } from '../../shared/types'

export interface TranscriptionService {
  start(): Promise<void>
  stop(): Promise<void>
  onSegment(callback: (segment: TranscriptSegment) => void): () => void
}

/** Provider-neutral seam for cloud or local speech-to-text. */
export class UnimplementedTranscriptionService implements TranscriptionService {
  async start(): Promise<void> {}
  async stop(): Promise<void> {}
  onSegment(_callback: (segment: TranscriptSegment) => void): () => void {
    return () => {}
  }
}
