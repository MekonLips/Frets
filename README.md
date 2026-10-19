# Frets

Frets is a browser-based guitar and bass fretboard practice app.

## Features

- Explore note positions on the fretboard and filter natural notes or accidentals.
- Practise with six guided exercises and synchronized fretboard/tab highlighting.
- Configure instrument tuning and fret range.
- Use a five-minute practice timer, adjustable metronome (40–200 BPM), and pause/resume controls.

## Development

```sh
npm install
npm run dev
npm test
npm run build
```

The production build is written to `dist/`. The app is deployed at [frets.joltrouter.net](https://frets.joltrouter.net/). The static host must serve `index.html` for direct visits to exercise routes. For S3 website hosting, configure `index.html` as the error document and verify the response behavior for your domain/CDN.

## State and privacy

There are no user accounts or application backend. Preferences are stored locally in the browser; exercise progress is session state.

The Zustand store keeps progress under `exercises`, keyed by exercise number, so each exercise has its own sequence, notes, pattern, stage, and playback beat. Only preferences are persisted; exercise progress and timer state remain transient.

## Future ideas

- Improve the fretboard wood appearance, with optional dark rosewood and light maple styles.
- Add triad exercises 7–9: major, minor, and mixed triads. Define voicings and traversal order before implementation.
