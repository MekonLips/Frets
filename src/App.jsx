import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Guitar, Menu, X, Home, Play, Pause, RotateCcw, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';
import { EXERCISES, NOTES, getNoteFrequency, getPattern, getSequence, noteIndexAtFret, noteName } from './config/frets.js';
import { getSelectedInstrument, useFretsStore } from './store/useFretsStore.js';

const formatTime = (ms) => {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

function useExerciseRoute() {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/exercises\/(\d+)\/?$/);
  if (!match) return null;
  const exercise = Number(match[1]);
  return Number.isInteger(exercise) && exercise >= 1 && exercise <= 6 ? exercise : null;
}

function Header({ exercise, onMenu, showNav }) {
  return <header className="app-header">
    <div className="flex items-center gap-3"><Guitar className="text-amber-400" size={25} /><Link to="/" className="brand">Frets</Link></div>
    <div className="flex items-center gap-2">
      {exercise && <span className="hidden text-sm text-neutral-400 sm:inline">Exercise {exercise} of 6</span>}
      <button className="button" onClick={onMenu} aria-label="Toggle navigation">{showNav ? <X size={18} /> : <Menu size={18} />}</button>
    </div>
  </header>;
}

function Navigation({ open, onClose }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose}>
    <nav className="h-full w-80 max-w-[85vw] space-y-3 border-r border-white/10 bg-neutral-900 p-5" onClick={(event) => event.stopPropagation()} aria-label="Main navigation">
      <div className="mb-6 flex items-center justify-between"><span className="brand">Practice</span><button className="button" onClick={onClose} aria-label="Close navigation"><X size={18} /></button></div>
      <Link className="button w-full justify-start gap-2" to="/" onClick={onClose}><Home size={16} /> Fretboard</Link>
      <p className="eyebrow pt-4">Exercises</p>
      {EXERCISES.map((item) => <Link key={item.id} className="button w-full justify-start" to={`/exercises/${item.id}`} onClick={onClose}>{item.id}. {item.title}</Link>)}
    </nav>
  </div>;
}

function Fretboard({ exercise }) {
  const instrumentId = useFretsStore((state) => state.selectedInstrumentId);
  const startFret = useFretsStore((state) => state.startFret);
  const selectedNoteIdx = useFretsStore((state) => state.selectedNoteIdx);
  const mode = useFretsStore((state) => state.selectedNotesMode);
  const sequence = useFretsStore((state) => state.sequence);
  const stage = useFretsStore((state) => state.stage);
  const beat = useFretsStore((state) => state.beat);
  const showRange = useFretsStore((state) => state.showRange);
  const instrument = getSelectedInstrument(instrumentId);
  const strings = instrument.strings;
  const currentPattern = useMemo(() => getPattern(sequence, strings, startFret), [sequence, strings, startFret]);
  const active = useFretsStore((state) => state.timerRunning) && exercise && exercise !== 6 && currentPattern.length ? currentPattern[(Math.max(0, beat - 1)) % currentPattern.length] : null;
  const visibleFrets = Array.from({ length: 12 }, (_, index) => startFret + index);
  const notePositions = useMemo(() => {
    const positions = [];
    for (let string = 1; string <= strings.length; string += 1) {
      for (const fret of visibleFrets) {
        const noteIdx = noteIndexAtFret(strings[string - 1], fret);
        const isExerciseNote = !exercise || noteIdx === sequence[Math.max(0, stage - 1)];
        const isSelected = exercise || selectedNoteIdx === null || selectedNoteIdx === noteIdx || mode === 'all' || (mode === 'naturals' && [0,2,3,5,7,8,10].includes(noteIdx)) || (mode === 'accidentals' && [1,4,6,9,11].includes(noteIdx));
        if (!isExerciseNote || !isSelected) continue;
        positions.push({ string, fret, noteIdx });
      }
    }
    return positions;
  }, [strings, startFret, selectedNoteIdx, mode, exercise, sequence, stage]);
  return <div className="space-y-2">
    <div className="flex justify-between text-xs text-neutral-400"><span>Nut</span><span>Fret {startFret}–{startFret + 11}</span><span>Bridge →</span></div>
    <div className={`fretboard ${showRange ? "ring-1 ring-inset ring-amber-400/70" : ""}`}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(12, minmax(0, 1fr))` }}>
        {visibleFrets.map((fret) => <div key={fret} className="flex h-7 items-center justify-center border-r border-neutral-700 bg-black/20 text-[10px] text-neutral-400">{fret}</div>)}
      </div>
      <div className="relative grid" style={{ gridTemplateColumns: `repeat(12, minmax(0, 1fr))`, gridTemplateRows: `repeat(${strings.length}, 42px)` }}>
        {visibleFrets.map((fret) => <div key={fret} className="pointer-events-none absolute bottom-0 top-0 border-l border-neutral-500/70" style={{ left: `${(fret - startFret) / 12 * 100}%`, zIndex: 1 }} />)}
        {strings.map((_, row) => <div key={row} className="pointer-events-none relative col-span-12 border-b border-neutral-400/70" style={{ gridRow: row + 1 }}>
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-b from-neutral-300 to-neutral-500 shadow" />
        </div>)}
        {notePositions.map(({ string, fret, noteIdx }) => {
          const isActive = active?.string === string && active?.fret === fret;
          return <div key={`${string}-${fret}`} className="fret-cell" style={{ gridColumn: fret - startFret + 1, gridRow: strings.length - string + 1, zIndex: 2 }}>
            <button className={`note-dot ${isActive ? 'note-dot-active' : ''}`} title={`String ${string}, fret ${fret}, ${noteName(noteIdx)}`} onClick={() => useFretsStore.getState().setSelectedNote(noteIdx)}>{exercise ? fret : noteName(noteIdx)}</button>
          </div>;
        })}
      </div>
    </div>
    <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
      <span>Strings: {strings.length}</span><span>·</span><span>24 frets available</span><span>·</span><span>{exercise ? `Stage ${Math.min(stage, sequence.length || 1)}` : 'Select any note to highlight its positions'}</span>
    </div>
  </div>;
}

function Preferences() {
  const instrumentId = useFretsStore((state) => state.selectedInstrumentId);
  const startFret = useFretsStore((state) => state.startFret);
  const showRange = useFretsStore((state) => state.showRange);
  const mode = useFretsStore((state) => state.selectedNotesMode);
  const setInstrument = useFretsStore((state) => state.setInstrument);
  const setStartFret = useFretsStore((state) => state.setStartFret);
  const setShowRange = useFretsStore((state) => state.setShowRange);
  const setSelectedNotesMode = useFretsStore((state) => state.setSelectedNotesMode);
  return <section className="panel space-y-4">
    <h2 className="eyebrow">Fretboard settings</h2>
    <label className="block space-y-1"><span className="text-sm text-neutral-300">Instrument</span><select className="field" value={instrumentId} onChange={(e) => setInstrument(Number(e.target.value))}>{(awaitableInstruments()).map((instrument) => <option key={instrument.id} value={instrument.id}>{instrument.name}</option>)}</select></label>
    <label className="block space-y-1"><span className="text-sm text-neutral-300">Start fret</span><select className="field" value={startFret} onChange={(e) => setStartFret(Number(e.target.value))}>{Array.from({ length: 13 }, (_, i) => i + 1).map((fret) => <option key={fret} value={fret}>{fret}</option>)}</select></label>
    <label className="block space-y-1"><span className="text-sm text-neutral-300">Notes shown</span><select className="field" value={mode} onChange={(e) => setSelectedNotesMode(e.target.value)}><option value="single">All notes</option><option value="naturals">Natural notes</option><option value="accidentals">Accidentals</option></select></label>
    <label className="flex items-center gap-2 text-sm text-neutral-300"><input type="checkbox" checked={showRange} onChange={(e) => setShowRange(e.target.checked)} /> Highlight fret range</label>
  </section>;
}

function awaitableInstruments() {
  return [
    { id: 1, name: '6 String Guitar Standard' },
    { id: 2, name: '6 String Guitar Eb' },
    { id: 3, name: '6 String Guitar Open D' },
    { id: 4, name: '4 String Bass Standard' },
    { id: 5, name: '4 String Bass Eb' },
  ];
}

function ExercisePanel({ exercise }) {
  const item = EXERCISES[exercise - 1];
  const sequence = useFretsStore((state) => state.sequence);
  const stage = useFretsStore((state) => state.stage);
  const setSequence = useFretsStore((state) => state.setSequence);
  const setPattern = useFretsStore((state) => state.setPattern);
  const setStage = useFretsStore((state) => state.setStage);
  const instrumentId = useFretsStore((state) => state.selectedInstrumentId);
  const startFret = useFretsStore((state) => state.startFret);
  const instrument = getSelectedInstrument(instrumentId);
  const [useAccidentals, setUseAccidentals] = useState(false);
  const refresh = useCallback(() => {
    const next = getSequence(exercise, useAccidentals);
    setSequence(next);
    setPattern(getPattern(next, instrument.strings, startFret));
  }, [exercise, instrumentId, startFret, useAccidentals]);
  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { setPattern(getPattern(sequence, instrument.strings, startFret)); }, [sequence, instrumentId, startFret]);
  const current = sequence[Math.max(0, stage - 1)];
  return <section className="panel space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="eyebrow">Exercise {exercise}</p><h2 className="mt-1 text-xl font-semibold">{item.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-300">{item.description}</p></div>
      <button className="button button-primary gap-2" onClick={refresh}><Shuffle size={15} /> Shuffle</button>
    </div>
    {exercise !== 6 && <div className="flex flex-wrap gap-2">
      {sequence.map((idx, index) => <button key={`${idx}-${index}`} onClick={() => setStage(index + 1)} className={`button min-w-10 ${index + 1 === stage ? 'button-primary' : ''}`}>{NOTES[idx]}</button>)}
    </div>}
    {(exercise === 4 || exercise === 5) && <label className="flex items-center gap-2 text-sm text-neutral-300">
      <input type="checkbox" checked={useAccidentals} onChange={(event) => setUseAccidentals(event.target.checked)} />
      Use accidentals?
    </label>}
    {exercise !== 6 && <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
      <button className="button gap-1" disabled={stage <= 1} onClick={() => setStage(Math.max(1, stage - 1))}><ChevronLeft size={16} /> Previous</button>
      <p className="text-sm text-neutral-300">Current note: <strong className="text-amber-300">{current === undefined ? '—' : NOTES[current]}</strong></p>
      <button className="button gap-1" disabled={stage >= sequence.length} onClick={() => setStage(Math.min(sequence.length, stage + 1))}>Next <ChevronRight size={16} /></button>
    </div>}
  </section>;
}

function Tablature({ exercise }) {
  const pattern = useFretsStore((state) => state.pattern);
  const stage = useFretsStore((state) => state.stage);
  const instrument = getSelectedInstrument(useFretsStore((state) => state.selectedInstrumentId));
  if (!exercise || exercise === 6 || !pattern.length) return null;
  const sectionLength = instrument.strings.length * 2;
  const section = pattern.slice((stage - 1) * sectionLength, stage * sectionLength);
  return <section className="panel space-y-3">
    <div className="flex items-center justify-between"><h2 className="eyebrow">Tab · {NOTES[section[0]?.noteIdx] ?? '—'}</h2><span className="text-xs text-neutral-500">Current note pattern</span></div>
    <div className="overflow-x-auto">
      <div className="min-w-[620px] space-y-1">
        {instrument.strings.map((openNote, stringIndex) => {
          const string = stringIndex + 1;
          return <div key={string} className="grid items-center gap-1" style={{ gridTemplateColumns: `44px repeat(${section.length}, minmax(28px, 1fr))` }}>
            <span className="text-xs font-semibold text-neutral-400">{NOTES[openNote]}</span>
            {section.map((position, index) => <span key={`${string}-${index}`} className={`relative flex h-7 items-center justify-center border-b border-neutral-600 font-mono text-xs ${position.string === string ? 'font-bold text-amber-300' : 'text-neutral-700'}`}>{position.string === string ? position.fret : '—'}</span>)}
          </div>;
        })}
      </div>
    </div>
  </section>;
}

function PracticeTimer({ exercise }) {
  const remaining = useFretsStore((state) => state.sessionRemaining);
  const running = useFretsStore((state) => state.timerRunning);
  const setRemaining = useFretsStore((state) => state.setSessionRemaining);
  const setRunning = useFretsStore((state) => state.setTimerRunning);
  const resetSession = useFretsStore((state) => state.resetSession);
  const tempo = useFretsStore((state) => state.tempoBpm);
  const setTempo = useFretsStore((state) => state.setTempoBpm);
  const setBeat = useFretsStore((state) => state.setBeat);
  useEffect(() => {
    if (!running) return undefined;
    const startedAt = Date.now();
    const initialRemaining = useFretsStore.getState().sessionRemaining;
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, initialRemaining - (Date.now() - startedAt)));
    }, 200);
    return () => window.clearInterval(id);
  }, [running, setRemaining]);
  useEffect(() => {
    if (remaining <= 0 && running) resetSession();
  }, [remaining, running, resetSession]);
  const audioContext = useRef(null);
  useEffect(() => {
    if (!running || !exercise) return undefined;
    let cancelled = false;
    let nextBeatAt = performance.now();
    const playBeat = () => {
      if (cancelled) return;
      const now = performance.now();
      if (now >= nextBeatAt) {
        setBeat((beat) => beat + 1);
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            if (!audioContext.current) audioContext.current = new AudioContextClass();
            if (audioContext.current.state === 'suspended') audioContext.current.resume();
            const context = audioContext.current;
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.type = 'sine';
            const noteIdx = useFretsStore.getState().sequence[Math.max(0, useFretsStore.getState().stage - 1)] ?? 0;
            oscillator.frequency.value = getNoteFrequency(noteIdx);
            gain.gain.setValueAtTime(0.0001, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.06);
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + 0.065);
          }
        } catch (error) {
          // Audio is an enhancement; the visual beat and timer remain usable if audio is unavailable.
        }
        nextBeatAt += 60000 / tempo;
        const patternLength = useFretsStore.getState().pattern.length || 1;
        const count = useFretsStore.getState().sequence.length || 1;
        const beatsPerNote = Math.max(1, patternLength / count);
        const currentBeat = useFretsStore.getState().beat;
        if (currentBeat >= patternLength) {
          useFretsStore.getState().setBeat(0);
          useFretsStore.getState().setTimerRunning(false);
          return;
        }
        if (currentBeat > 0 && currentBeat % beatsPerNote === 0) {
          useFretsStore.getState().setStage(Math.min(count, Math.floor(currentBeat / beatsPerNote) + 1));
        }
      }
    };
    const id = window.setInterval(playBeat, 20);
    return () => { cancelled = true; window.clearInterval(id); };
  }, [running, exercise, tempo, setBeat]);
  useEffect(() => () => {
    if (audioContext.current && audioContext.current.state !== 'closed') audioContext.current.close();
  }, []);
  return <section className="panel space-y-4">
    <div className="flex items-center justify-between"><h2 className="eyebrow">Practice session</h2><span className="rounded-full bg-white/5 px-3 py-1 text-xs text-neutral-300">5 minutes</span></div>
    <div className="text-center"><p className="font-mono text-4xl font-semibold tabular-nums">{formatTime(remaining)}</p><p className="mt-1 text-xs text-neutral-400">{remaining === 0 ? 'Session complete' : running ? 'Session in progress' : 'Ready when you are'}</p></div>
    <div className="flex flex-wrap items-end gap-3">
      <label className="min-w-[200px] flex-1 space-y-2">
        <span className="flex items-center justify-between text-sm text-neutral-300"><span>Tempo</span><strong className="font-mono text-amber-300">{tempo} BPM</strong></span>
        <input aria-label="Tempo in beats per minute" className="w-full accent-amber-400" type="range" min="40" max="200" step="1" value={tempo} onChange={(event) => setTempo(Number(event.target.value))} />
        <span className="flex justify-between text-xs text-neutral-500"><span>40 BPM</span><span>200 BPM</span></span>
      </label>
      <button className="button button-primary flex-1 gap-2" onClick={() => setRunning(!running)}>{running ? <Pause size={16} /> : <Play size={16} />}{running ? 'Pause' : 'Start'}</button>
      <button className="button gap-2" onClick={() => { resetSession(); setBeat(0); }}><RotateCcw size={16} /> Reset</button>
    </div>
    {exercise && <p className="text-xs leading-5 text-neutral-500">Start the session to practise at the selected tempo.</p>}
  </section>;
}

function FretboardHome() {
  const selectedNoteIdx = useFretsStore((state) => state.selectedNoteIdx);
  const setSelectedNote = useFretsStore((state) => state.setSelectedNote);
  return <div className="space-y-5"><section className="panel"><p className="eyebrow">Fretboard</p><h1 className="mt-1 text-2xl font-semibold">Learn the notes. Build the habit.</h1><p className="mt-2 text-sm leading-6 text-neutral-300">Choose an instrument and fret range, then explore note positions or start one of the six guided exercises.</p></section><div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]"><section className="panel space-y-4"><h2 className="eyebrow">Note map</h2><Fretboard /><div className="flex flex-wrap gap-2">{NOTES.map((note, index) => <button key={note} className={`button min-w-10 ${selectedNoteIdx === index ? 'button-primary' : ''}`} onClick={() => setSelectedNote(selectedNoteIdx === index ? null : index)}>{note}</button>)}</div></section><div className="space-y-4"><PracticeTimer /><Preferences /></div></div></div>;
}

function ExercisePage({ exercise }) {
  return <div className="space-y-5"><ExercisePanel exercise={exercise} /><Tablature exercise={exercise} /><div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]"><section className="panel space-y-4"><h2 className="eyebrow">Fretboard practice</h2><Fretboard exercise={exercise} /></section><div className="space-y-4"><PracticeTimer exercise={exercise} /><Preferences /></div></div><div className="flex flex-wrap justify-between gap-3"><Link className="button" to={exercise > 1 ? `/exercises/${exercise - 1}` : '/'}>Previous exercise</Link><Link className="button button-primary" to={exercise < 6 ? `/exercises/${exercise + 1}` : '/'}>{exercise < 6 ? 'Next exercise' : 'Finish'}</Link></div></div>;
}

export default function App() {
  const exercise = useExerciseRoute();
  const location = useLocation();
  const history = useHistory();
  const showNav = useFretsStore((state) => state.showNav);
  const setShowNav = useFretsStore((state) => state.setShowNav);
  useEffect(() => {
    const match = location.pathname.match(/^\/exercises\/(\d+)\/?$/);
    if (location.pathname !== '/' && !match) history.replace('/');
    if (match && (Number(match[1]) < 1 || Number(match[1]) > 6)) navigate('/', { replace: true });
  }, [location.pathname, history]);
  return <main className="app-shell">
    <Header exercise={exercise} showNav={showNav} onMenu={() => setShowNav(!showNav)} />
    <Navigation open={showNav} onClose={() => setShowNav(false)} />
    <div className="mx-auto w-full max-w-[1440px] space-y-5 p-4 md:p-8">
      {exercise ? <ExercisePage key={exercise} exercise={exercise} /> : <FretboardHome />}
      {!exercise && <section className="space-y-3"><h2 className="eyebrow">Guided exercises</h2><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{EXERCISES.map((item) => <Link key={item.id} to={`/exercises/${item.id}`} className="panel block transition hover:border-amber-500/50"><p className="eyebrow">Exercise {item.id}</p><h3 className="mt-1 font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-5 text-neutral-400">{item.description}</p><span className="mt-4 inline-flex text-sm text-amber-300">Start practice →</span></Link>)}</div></section>}
    </div>
    <footer className="border-t border-white/10 px-4 py-5 text-center text-xs text-neutral-500">Frets · A focused five-minute fretboard practice</footer>
  </main>;
}