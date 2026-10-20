// music theory
export const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

export const NATURALS = [0,2,3,5,7,8,10];

export const ACCIDENTALS = [1,4,6,9,11];

export const MARKERS = [3,5,7,9,12,15,17,19,21,24];

export const NOTES_NUM = NOTES.length;

export const FRETS_NUM = NOTES_NUM * 2;

// instrument
export const INSTRUMENT_TYPES = {
    GUITAR: 1,
    BASS: 2,
    MANDOLIN: 3,
    UKULELE: 4,
    BANJO: 5,
};

export const INSTRUMENT_TYPE_NAMES = {
    [INSTRUMENT_TYPES.GUITAR]: "Guitar",
    [INSTRUMENT_TYPES.BASS]: "Bass",
    [INSTRUMENT_TYPES.MANDOLIN]: "Mandolin",
    [INSTRUMENT_TYPES.UKULELE]: "Ukulele",
    [INSTRUMENT_TYPES.BANJO]: "Banjo",
};

// Open-string MIDI pitches follow the fretboard's displayed row order (top to bottom).
// Guitar rows are high-to-low E4 B3 G3 D3 A2 E2; bass rows are G2 D2 A1 E1.
export const INSTRUMENTS = [
    { id: 1, name: "6 String Guitar Standard", type: INSTRUMENT_TYPES.GUITAR, strings: [7,2,10,5,0,7], openStringMidi: [64,59,55,50,45,40] },
    { id: 2, name: "6 String Guitar Eb",       type: INSTRUMENT_TYPES.GUITAR, strings: [6,1,9,4,11,6], openStringMidi: [63,58,54,49,44,39] },
    { id: 3, name: "6 String Guitar Open D",   type: INSTRUMENT_TYPES.GUITAR, strings: [5,0,9,5,0,5], openStringMidi: [62,57,54,50,45,38] },
    { id: 4, name: "4 String Bass Standard",   type: INSTRUMENT_TYPES.BASS, strings: [10,5,0,7], openStringMidi: [43,38,33,28] },
    { id: 5, name: "4 String Bass Eb",         type: INSTRUMENT_TYPES.BASS, strings: [9,4,11,6], openStringMidi: [42,37,32,27] },
];

export const GRID_BASE_WIDTH = 1.6;

export const GRID_MARGIN = 10;

export const GRID_ROW_HEIGHT = 4;

export const GRID_ROW_HEIGHT_MIN = 30;

// exercises
export const EXERCISE_INSTRUCTIONS = [
    [
        'Play each note up and down 3 times.',
        'When you have done this for all notes, repeat.',
        'Play slowly, no mistakes.',
    ],
    [
        'introduce metronome',
        'no accidentals',
        'play note up and down, repeat for all notes',
        'continue until pattern completed or until timer runs out',
    ],
    [
        'accidentals only',
        'play note up and down, repeat for all notes',
        'continue until pattern completed or until timer runs out',
    ],
    [
        'play note 1 up then note 2 down then loop',
        'continue until feels easy or until timer runs out',
    ],
    [
        'alternate playing randomised notes up and down',
        'continue until pattern completed or until timer runs out',
    ],
    [
        'increase / decrease speed buttons',
        'repeat exercises 2 - 5',
        'repeat until able to complete at 80bpm or until timer runs out',
    ],
];

export const EXERCISES_NUM = EXERCISE_INSTRUCTIONS.length;

// worker actions
export const ACTIONS = {
    NOTES: {
        NOTE:        1,
        NATURALS:    3,
        ACCIDENTALS: 4,
    },
    PATTERNS: {
        SEQUENCE:    1,
        NOTES:       2,
        PATTERN:     3,
    },
    TIMER: {
        START:       1,
        STOP:        2,
        UPDATE:      3,
        TICK:        4,
    },
};

// gui state
export const START_FRET = 1;

export const SELECTED_INSTRUMENT = 1;

export const SELECTED_NOTES = ACTIONS.NOTES.NOTE;

export const SELECTED_NOTE = null;

export const SHOW_RANGE = false;

export const SHOW_NAV = false;

// timer / metronome
export const MINUTE = 60 * 1000;

export const TIME_LIMIT = 5 * MINUTE;

export const TICKS_PER_BEAT_BINARY = 16;

export const TICKS_PER_BEAT_TERNARY = 12;

export const SECONDS_IN_MINUTE = 60;

export const SCHEDULE_AHEAD_TIME = 0.1;

// layout
export const Z_INDEX = {
    Overlay:      998,
    Panel:        999,
    Grid:         997,
    Controls:     997,
    Instructions: 997,
    Tab:          997,
    Range:        996,
    Focus:        799,
    Blur:         996,
    Guitar:       894,
    Neck:         894,
    Nut:          896,
    Fretboard:    895,
    Number:       899,
    Fret:         897,
    Dot:          897,
    String:       898,
    Note:         899,
};

export const PORTALS = {
    NAV:       'nav',
    FRET_GRID: 'fret-grid',
};

export const COLORS = {
    Range: {
        backgroundColor: `rgba(255,255,255,0.05)`,
    },
    Neck: {
        backgroundColor: `rgba(0,0,0,1)`,
    },
    Nut: {
        backgroundColor: `rgba(0,0,0,1)`,
    },
    Fretboard: {
        backgroundColor: `rgba(33,9,4,1)`,
        backgroundColorDark: `rgba(43,29,14,1)`,
    },
    Fret: {
        gradientColor1: `rgb(160,160,160)`,
        gradientColor2: `rgb(64,64,64)`,
    },
    Dot: {
        backgroundColor: `rgb(255,255,255)`,
    },
    Note: {
        color: `rgba(255,255,255,1)`,
        borderColor: `rgba(255,255,255,0.5)`,
        backgroundColor: `rgba(255,128,0,1)`,
        colorAlt: `rgba(255,255,255,1)`,
        borderColorAlt: `rgba(255,255,255,0.5)`,
        backgroundColorAlt: `rgba(32,128,32,1)`,
    },
};
