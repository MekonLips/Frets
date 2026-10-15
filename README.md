# Frets

Frets is a client-only guitar and bass fretboard practice app. The migration branch uses Vite and Tailwind tooling, while the original routed component tree is still active during the staged migration.

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

## Migration status

The legacy `src/App.js` entry and original component hierarchy remain active so existing appearance and exercise behavior can be preserved while the migration proceeds. Tailwind semantic classes have replaced styling for the navigation panel, overlay, navigation links/buttons, exercise instructions, and timer wrapper. Most fretboard, tab, range, grid, and remaining control styles still use styled-components; `src/App.scss` also remains.

The active legacy component tree still uses Recoil. Zustand exists in the branch but has not yet replaced Recoil as the source of truth for the active app. Do not treat the migration as complete or deploy it yet.

### Remaining migration checklist

1. Port the remaining styled-components rules to Tailwind utilities and semantic `@apply` classes, preserving the original responsive layout and fretboard geometry.
2. Remove `src/App.scss` once its global rules have been safely moved to the Tailwind entry styles.
3. Migrate active app state from Recoil to Zustand, including exercise sequence/stage, instrument and fret-range preferences, navigation visibility, and timer/metronome state. Persist only the intended preferences in localStorage.
4. Remove Recoil and styled-components only after no active source imports them; remove obsolete dependencies only after checking all imports.
5. Validate `npm run build`, tests, and manual behavior for the home page and `/exercises/1` through `/exercises/6`, including direct URL loads and refreshes, all supported instruments/tunings, shuffle, fret window, timer, and metronome.
6. Confirm the S3/CDN fallback for direct exercise routes and compare the migrated appearance against the original before merging or deploying.

No new feature work should begin until the style port and migration checks are complete.

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
