// Stable section identifiers shared by the welcome overlay and future guided tours.
export const APP_SECTIONS = Object.freeze({
    EXERCISE_INSTRUCTIONS: 1,
    SESSION_TIMER: 2,
    BPM_SLIDER: 3,
    SHUFFLE_NOTE_SEQUENCE: 4,
    USE_ACCIDENTALS: 5,
    LOOP_EXERCISE: 6,
    INSTRUMENT_BUILDER: 7,
    FRETBOARD: 8,
    GUITAR_TAB: 9,
    FRET_RANGE_SELECTOR: 10,
    NOTE_SEQUENCE: 11,
});

export const APP_SECTION_TITLES = Object.freeze({
    [APP_SECTIONS.EXERCISE_INSTRUCTIONS]: 'Exercise Instructions',
    [APP_SECTIONS.SESSION_TIMER]: 'Session Timer',
    [APP_SECTIONS.BPM_SLIDER]: 'BPM Slider',
    [APP_SECTIONS.SHUFFLE_NOTE_SEQUENCE]: 'Shuffle Note Sequence',
    [APP_SECTIONS.USE_ACCIDENTALS]: 'Use Accidentals?',
    [APP_SECTIONS.LOOP_EXERCISE]: 'Loop exercise?',
    [APP_SECTIONS.INSTRUMENT_BUILDER]: 'Instrument Builder',
    [APP_SECTIONS.FRETBOARD]: 'Fretboard',
    [APP_SECTIONS.GUITAR_TAB]: 'Guitar Tab',
    [APP_SECTIONS.FRET_RANGE_SELECTOR]: 'Fret Range Selector',
    [APP_SECTIONS.NOTE_SEQUENCE]: 'Note Sequence',
});

export const APP_SECTION_DESCRIPTIONS = Object.freeze({
    [APP_SECTIONS.EXERCISE_INSTRUCTIONS]: 'The numbers are links to each of the exercises. You should begin with Exercise 1.',
    [APP_SECTIONS.SESSION_TIMER]: 'Helps keep track of your 5 minute daily session. Start when you’re ready and pause at any time if you have to let the cat out.',
    [APP_SECTIONS.BPM_SLIDER]: 'For exercises with a metronome. Adjust the slider to a realistic BPM for your ability level, recommended to start at 40 BPM.',
    [APP_SECTIONS.SHUFFLE_NOTE_SEQUENCE]: 'Lets you mix things up a bit to break you out of patterns and reduce the monotony.',
    [APP_SECTIONS.USE_ACCIDENTALS]: 'Toggles display of accidentals if you want to target the sharps and flats.',
    [APP_SECTIONS.LOOP_EXERCISE]: 'Useful if you’re getting through an exercise with lots of time left on the session timer but you don’t feel ready to process to the next exercise.',
    [APP_SECTIONS.INSTRUMENT_BUILDER]: 'Click on the cog to configure your instrument. You can choose from a range of preset instruments or configure your own tunings and number of strings.',
    [APP_SECTIONS.FRETBOARD]: 'Displays the locations of the notes on the keyboard. Click on a note to hear it play. For exercises involving a metronome the notes you should be playing will be highlighted as you play along.',
    [APP_SECTIONS.GUITAR_TAB]: 'Displays the fret numbers for each note in the sequence as guitar tab for quick reference. This will highlight the correct fret number as you play along.',
    [APP_SECTIONS.FRET_RANGE_SELECTOR]: 'Set which area of the fretboard you want to focus. Start with 1 - 12 is recommended unless you’re specifically targeting the higher frets.',
    [APP_SECTIONS.NOTE_SEQUENCE]: 'These are your target notes. Click on a note to display all instances of it on the fretboard within a 12 fret range.',
});
