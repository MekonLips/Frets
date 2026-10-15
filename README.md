# Frets

Frets is a client-side guitar and bass fretboard practice app with guided exercises, note highlighting, and a configurable metronome.

## Development

```sh
npm install
npm run dev
```

## Production build and deployment

```sh
npm run build
npm run preview
```

The production build is written to `dist/`. The app is deployed at the domain root, so Vite emits root-relative asset URLs. For direct refreshes on paths such as `/exercises/1`, configure the static host to serve `index.html` for unknown paths. For S3 website hosting, configure `index.html` as the error document and verify that the response behavior is suitable for your domain/CDN.

## State and privacy

The app has no user accounts or application backend. Preferences are stored locally in the browser; exercise progress is session state.

## Feature backlog

These are ideas for future additions.

### Fretboard appearance

- **Neck wood:** let users switch between dark rosewood and light maple. Explore layered CSS gradients for a subtle wood-grain effect, with restrained contrast so fret markers and notes remain easy to read.

### Triad exercises

- **Exercise 7 — Major triads:** play major triads across three-string sets, progressing from the lowest available triad to the highest, then back down, following the existing exercises' ascending/descending flow.
- **Exercise 8 — Minor triads:** use the same traversal and string-set approach as Exercise 7, but with minor triads.
- **Exercise 9 — Mixed triads:** combine major and minor triads in one exercise.

For triad exercises, preserve the app's existing instrument/tuning support and fret-window behavior. Define the string-set order, available inversions/voicings, and exact ascending/descending sequence before implementation.
