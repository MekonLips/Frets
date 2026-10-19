# Agent Instructions

## Project overview

Frets is a React application for fretboard note practice and exercises. It uses Vite, React Router, Zustand, and Vitest.

- The Vite entry point is `src/main.jsx`.
- `src/main.jsx` currently imports `src/App.js`.
- `src/index.js` is marked as a legacy entry point.
- `src/App.jsx` is a separate alternative implementation whose status is unresolved. Do not assume it is active or delete it without investigating its history and discussing the decision.
- The current test command is `npm test` (runs `vitest run`); the production build command is `npm run build`.

## Working agreement

- Inspect the existing code and relevant Git history before proposing changes.
- **Discuss planned code or repository changes first and wait for explicit agreement before implementing them.** This includes refactors, file removals, dependency changes, and changes to application behaviour.
- Work incrementally and keep each change focused on the agreed scope. Do not bundle unrelated cleanup into a task.
- Do not merge branches or pull requests unless explicitly asked.
- Never claim a change, test, build, or browser check succeeded unless it was actually performed.

## Development workflow

- Follow the repository's existing branch and pull-request workflow; avoid committing directly to `main`.
- Before finishing an implementation, run the relevant tests and, where practical, `npm test` and `npm run build`.
- Add or update regression tests when fixing a bug or changing behaviour.
- If tests or the build cannot be run, report that clearly and explain what remains unverified.
- Preserve existing user-visible behaviour unless a change has been agreed.

## Code and test practices

- Prefer small, maintainable changes that fit the existing architecture and conventions.
- Use Vitest for tests; do not introduce Jest-specific configuration or dependencies without first establishing a need.
- Test observable behaviour and important edge cases. Mock workers, timers, audio, or browser APIs at clear boundaries when needed.
- Avoid broad rewrites or extracting abstractions without a concrete benefit supported by the task or tests.

## Documentation and scope

- Keep project documentation accurate when agreed changes affect it.
- Remove obsolete code or documentation only after verifying it is genuinely unused and confirming the removal is in scope.
- When investigating ambiguous or legacy files, report the evidence and recommended next step before changing them.
