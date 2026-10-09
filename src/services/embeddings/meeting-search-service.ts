export interface SearchResult {
  meetingId: string
  meetingTitle: string
  excerpt: string
  score: number
}

export interface MeetingSearchService {
  indexMeeting(meetingId: string, transcript: string): Promise<void>
  search(query: string): Promise<SearchResult[]>
}

/** Future RAG boundary: chunking, embeddings, vector storage, retrieval, and citations. */
export class UnimplementedMeetingSearchService implements MeetingSearchService {
  async indexMeeting(_meetingId: string, _transcript: string): Promise<void> {}
  async search(_query: string): Promise<SearchResult[]> {
    return []
  }
}
