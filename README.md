# Frets

Frets is a client-only guitar and bass fretboard practice app built with Vite, React, Zustand, React Router, and Tailwind CSS.

## Development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

The production output is written to `dist/`. The app is deployed at the domain root, so Vite emits root-relative asset URLs. For direct refreshes on paths such as `/exercises/1`, configure the static host to serve `index.html` for unknown paths. For S3 website hosting, configure `index.html` as the error document and verify that the response behavior is suitable for your domain/CDN.

## State and privacy

There is no account, API, or backend. Zustand persists only local preferences (instrument, start fret, and range highlight) to browser localStorage. The metronome remains at the existing 120 BPM; adjustable tempo is intentionally outside this migration. Session state and exercise progress are transient.

## Migration validation

Run `npm install`, `npm run build`, then manually verify the home page and `/exercises/1` through `/exercises/6`, including direct navigation and refresh. Browser audio, visual parity, and the original exercise-worker timing should be validated before deploying this migration. This branch establishes the Vite/Zustand/Tailwind foundation and a responsive fretboard/exercise interface; it is not yet a verified pixel- or behavior-identical replacement for the legacy app.

## Feature backlog

These are planned additions, separate from the faithful migration and its stability work.

### Fretboard appearance

- **Neck wood:** let users switch between dark rosewood and light maple. Explore layered CSS gradients for a subtle wood-grain effect, with restrained contrast so fret markers and notes remain easy to read.
- **Wound strings:** style the lower strings with a core-and-winding appearance using CSS gradients or repeating gradients. The effect should suggest metal windings without reducing note visibility or fretboard legibility.

### Triad exercises

- **Exercise 7 — Major triads:** play major triads across three-string sets, progressing from the lowest available triad to the highest, then back down, following the existing exercises' ascending/descending flow.
- **Exercise 8 — Minor triads:** use the same traversal and string-set approach as Exercise 7, but with minor triads.
- **Exercise 9 — Mixed triads:** combine major and minor triads in one exercise.

For triad exercises, preserve the app's existing instrument/tuning support and fret-window behavior. Define the string-set order, available inversions/voicings, and exact ascending/descending sequence before implementation.
