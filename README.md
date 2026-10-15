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
