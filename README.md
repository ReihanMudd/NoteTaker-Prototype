# MeetingMind

MeetingMind is a skeleton Electron + React + TypeScript desktop app for an AI-assisted meeting notetaker.

It is intentionally small and provider-neutral. The current shell demonstrates the intended product flow without pretending that audio capture, transcription, SQLite, or an LLM are already wired up.

## Product direction

The project is designed around this MVP:

1. Start a meeting.
2. Capture microphone and system audio.
3. Show a live transcript.
4. Let the user write rough notes.
5. Stop the meeting.
6. Generate a summary, key points, decisions, action items, and open questions.
7. Save and browse previous meetings.

The most important product distinction is that user-authored notes remain visibly separate from AI-generated content. Recording is also explicit and visible so the app can be built with privacy in mind.

## Stack

- Electron for the desktop shell and OS/audio boundary
- React + TypeScript for the renderer
- SQLite schema prepared in `database/schema.sql`
- Provider-neutral service seams for transcription, structured AI notes, and future embeddings/RAG search
- Vitest for lightweight unit tests

## Repository map

```text
src/
├── main/
│   ├── audio/              # microphone/system-audio ownership
│   ├── database/           # temporary store; SQLite adapter goes here
│   ├── ipc/                # renderer/main process contract
│   └── index.ts
├── preload/                # safe contextBridge API
├── renderer/src/
│   ├── App.tsx             # skeleton Home + Meeting flows
│   └── styles.css
├── services/
│   ├── transcription/      # cloud or local STT adapter
│   ├── ai/                 # structured meeting-note generation
│   └── embeddings/          # future semantic search/RAG
├── prompts/                # model prompts kept separate from UI code
└── shared/types/           # shared domain and IPC types
database/schema.sql         # persistence design
tests/                      # unit tests
```

## Getting started

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm test
npm run build
```

## Implementation order

1. Replace `AudioCaptureService` with microphone capture and OS-specific system-audio capture.
2. Connect the transcription service and stream final/interim `TranscriptSegment` values through IPC.
3. Replace the in-memory `MeetingStore` with SQLite while keeping its interface stable.
4. Implement the structured AI adapter using `src/prompts/enhance-notes.ts`.
5. Add retrieval/search only after saved meetings and summaries are reliable.
6. Add privacy settings, export, and packaging polish after the core loop works.

No API key is required for the current scaffold. Copy `.env.example` when wiring a provider.
