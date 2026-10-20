# Frets

Frets is a browser-based guitar and bass fretboard practice app.

**Repository:** [github.com/MekonLips/Frets](https://github.com/MekonLips/Frets)  
**Live app:** [frets.joltrouter.net](https://frets.joltrouter.net/)

## Features

- Explore note positions on the fretboard and filter natural notes or accidentals.
- Practise with six guided exercises and synchronized fretboard/tab highlighting.
- Configure instrument tuning and fret range.
- Use a five-minute practice timer, adjustable metronome (40–200 BPM), and pause/resume controls.

## Development

The Vite entry point is `src/main.jsx`, which loads the active app component from `src/App.jsx`.

```sh
npm install
npm run dev
npm test
npm run build
```

Vitest covers configuration (including shared fret markers and configured store defaults), store transitions, pitch utilities, and exercise/timer Worker message handling.

The production build is written to `dist/`. The static host must serve `index.html` for direct visits to exercise routes. For S3 website hosting, configure `index.html` as the error document and verify the response behavior for your domain/CDN.

## Current project status

The app is deployed and the existing fretboard, six guided exercises, and practice timer are implemented. Recent maintenance has consolidated exercise Worker message handling, added timer Worker regression tests, and aligned store defaults with shared configuration. The configuration cleanup and tests are merged into `main`.

The broader refactor is **paused** while work moves to other aspects of the app. The roadmap below records the proposed follow-up work; it is not an active implementation plan.

## State and privacy

There are no user accounts or application backend. Preferences are stored locally in the browser; exercise progress is session state.

The Zustand store keeps progress under `exercises`, keyed by exercise number, so each exercise has its own sequence, notes, pattern, stage, and playback beat. The shared exercise Worker has one message handler, which routes responses to the originating exercise; sequence, notes, and pattern results are committed together in one store update. Only preferences are persisted; exercise progress and timer state remain transient.

## Refactor roadmap (paused)

**Status: On pause for now.** Resume this work when refactoring is a priority again.

1. **Audit exercise-generation tests.** Review exercise hooks, Workers, and supporting utilities; identify important untested behavior and add focused regression tests before larger changes.
2. **Review duplicated exercise logic.** Check generation, result formatting, and note/pattern processing for genuine duplication; consolidate only where shared responsibilities are clear.
3. **Review Zustand store responsibilities.** Assess coupling between UI state, exercise results, and application logic. Consider separation only where it provides a concrete testing or maintenance benefit.
4. **Finish the configuration and architecture audit.** Verify remaining constants and dependencies are genuinely used, and record evidence before proposing further cleanup.

When resumed, tackle one focused change per branch, update documentation, run `npm test` and `npm run build`, and merge only with explicit approval.

## Future ideas

- Improve the fretboard wood appearance, with optional dark rosewood and light maple styles.
- Add triad exercises 7–9: major, minor, and mixed triads. Define voicings and traversal order before implementation.
