import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowUp, ArrowDown, Play, RefreshCw, CheckCircle, Receipt, Plus, Minus, Sparkles } from 'lucide-react';
import soundEngine from '../utils/audio';
import { machinePuzzles } from '../data/stationData';

const fmtNum = (n) => Number(Math.round(n * 100) / 100).toLocaleString('en-US');

// Station B — the student finds the percent change by dialling it in and running the machine.
export const MultiplierMachine = () => {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState('up');
  const [pct, setPct] = useState(10);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);

  const pz = machinePuzzles[idx];
  const money = pz.money !== false;
  const fmt = (v) => `${money ? '$' : ''}${fmtNum(v)}${pz.suffix || ''}`;
  const multiplier = direction === 'up' ? 1 + pct / 100 : 1 - pct / 100;
  const result = Math.round(pz.input * multiplier * 100) / 100;

  const reset = (nextIdx) => {
    setIdx(nextIdx);
    setDirection('up');
    setPct(10);
    setOutput(null);
    setAttempts(0);
    setSolved(false);
    setRunning(false);
  };

  const nudge = (delta) => {
    soundEngine.playDragClick();
    const maxVal = direction === 'down' ? 95 : 100;
    setPct((p) => Math.max(5, Math.min(maxVal, p + delta)));
  };

  const selectPreset = (dir, val) => {
    soundEngine.playDragClick();
    setDirection(dir);
    setPct(val);
  };

  const run = () => {
    if (running || solved) return;
    setRunning(true);
    setOutput(null);
    soundEngine.playWhirr();
    setTimeout(() => {
      setOutput(result);
      setRunning(false);
      setAttempts((a) => a + 1);
      if (result === pz.target) {
        setSolved(true);
        soundEngine.playChime();
        soundEngine.playText('machine_match');
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } else {
        soundEngine.playBuzz();
        if (attempts === 0) soundEngine.playText('machine_miss');
      }
    }, 600);
  };

  const feedback = () => {
    if (output === null) return null;
    if (solved) return null;
    const diff = output < pz.target ? 'too small' : 'too big';
    const hint = output < pz.target
      ? (direction === 'up' ? 'Try a bigger increase.' : 'Try a smaller decrease.')
      : (direction === 'up' ? 'Try a smaller increase.' : 'Try a bigger decrease.');
    return `${fmt(output)} is ${diff} for target ${fmt(pz.target)}. ${hint}`;
  };

  const change = pz.target - pz.input;

  return (
    <div className="w-full flex flex-col items-center space-y-1.5 h-full justify-between">
      {/* Top Bar with Story Scenario Context & Item Progress */}
      <div className="w-full bg-[#161129] border border-purple-700/60 rounded-xl px-3 py-1 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="text-xl">{pz.icon}</span>
          <span className="text-xs md:text-sm font-black text-cyan-300 font-display truncate">{pz.item}</span>
          <span className="text-[11px] text-purple-300 hidden sm:inline">• {pz.story}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-amber-400 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-700/50">
            {idx + 1} of {machinePuzzles.length}
          </span>
          <button
            onClick={() => reset((idx + 1) % machinePuzzles.length)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-0.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-glow-gold transition-transform hover:scale-105"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Next Item ➜</span>
          </button>
        </div>
      </div>

      {/* Real-World Machine Conveyor: INPUT -> MULTIPLIER -> OUTPUT */}
      <div className="w-full flex items-stretch justify-center gap-1.5 md:gap-2 flex-1 min-h-0">
        {/* INPUT TICKET */}
        <div className="flex-1 rounded-2xl border-2 border-cyan-400/70 bg-cyan-950/40 px-2 py-2 text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1 text-[10px] font-black text-cyan-300 tracking-widest uppercase">
            <Receipt className="w-3 h-3 text-cyan-400" />
            <span>ORIGINAL PRICE</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-display my-auto">{fmt(pz.input)}</div>
          <div className="text-[10px] font-bold text-cyan-200/80">Base = 100%</div>
        </div>

        {/* MULTIPLIER DIAL RIG */}
        <div className={`flex-[1.4] rounded-2xl border-2 px-2 py-2 text-center flex flex-col justify-between relative overflow-hidden ${running ? 'border-amber-400 bg-amber-950/40' : 'border-purple-500/70 bg-purple-950/40'}`}>
          <div className="text-[10px] font-black text-purple-300 tracking-widest uppercase">MULTIPLIER ENGINE</div>
          <div className={`text-xl md:text-2xl font-black font-display my-auto ${direction === 'up' ? 'text-emerald-400' : 'text-pink-400'}`}>
            {direction === 'up' ? '+' : '−'}{pct}% <span className="text-amber-300 text-base md:text-lg font-mono">(×{fmtNum(multiplier)})</span>
          </div>
          <div className="text-[10px] font-bold text-slate-300 bg-purple-900/60 rounded-full px-2 py-0.5 mx-auto border border-purple-600/40">
            Preview: {fmt(pz.input)} × {fmtNum(multiplier)} = <span className="text-amber-300 font-black">{fmt(result)}</span>
          </div>
          <div className={`h-2 rounded-full mt-1 ${running ? 'animate-conveyor' : ''}`} style={{ backgroundImage: 'repeating-linear-gradient(90deg,#FFB800 0 10px,#3B2D6B 10px 20px)', backgroundSize: '28px 100%' }} />
        </div>

        {/* OUTPUT TARGET */}
        <div className={`flex-1 rounded-2xl border-2 px-2 py-2 text-center flex flex-col justify-between ${solved ? 'border-emerald-400 bg-emerald-950/40 shadow-glow-green' : 'border-amber-400/70 bg-amber-950/20'}`}>
          <div className="text-[10px] font-black text-amber-300 tracking-widest uppercase">TARGET RESULT</div>
          <div className="text-xl md:text-2xl font-black text-white font-display my-auto">{running ? '…' : output === null ? '?' : fmt(output)}</div>
          <div className="text-[10px] font-black text-amber-400 bg-amber-950/80 rounded-full px-2 py-0.5 border border-amber-500/40">
            TARGET: {fmt(pz.target)}
          </div>
        </div>
      </div>

      {/* Multiplier Quick Dial Presets & Slider Controls */}
      <div className="w-full bg-[#130E26]/90 border border-purple-900/60 rounded-2xl px-3 py-2 flex flex-col gap-1.5 shrink-0">
        {/* Quick Presets Chips */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-0.5">
          <span className="text-[10px] font-black text-purple-300 uppercase shrink-0">Quick Dial:</span>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => selectPreset('up', 20)} className={`px-2 py-0.5 rounded text-xs font-black border cursor-pointer ${direction === 'up' && pct === 20 ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50'}`}>+20%</button>
            <button onClick={() => selectPreset('up', 25)} className={`px-2 py-0.5 rounded text-xs font-black border cursor-pointer ${direction === 'up' && pct === 25 ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50'}`}>+25%</button>
            <button onClick={() => selectPreset('up', 50)} className={`px-2 py-0.5 rounded text-xs font-black border cursor-pointer ${direction === 'up' && pct === 50 ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50'}`}>+50%</button>
            <button onClick={() => selectPreset('down', 20)} className={`px-2 py-0.5 rounded text-xs font-black border cursor-pointer ${direction === 'down' && pct === 20 ? 'bg-pink-500 text-slate-950 border-pink-400' : 'bg-pink-950/50 text-pink-300 border-pink-700/50'}`}>−20%</button>
            <button onClick={() => selectPreset('down', 25)} className={`px-2 py-0.5 rounded text-xs font-black border cursor-pointer ${direction === 'down' && pct === 25 ? 'bg-pink-500 text-slate-950 border-pink-400' : 'bg-pink-950/50 text-pink-300 border-pink-700/50'}`}>−25%</button>
            <button onClick={() => selectPreset('down', 30)} className={`px-2 py-0.5 rounded text-xs font-black border cursor-pointer ${direction === 'down' && pct === 30 ? 'bg-pink-500 text-slate-950 border-pink-400' : 'bg-pink-950/50 text-pink-300 border-pink-700/50'}`}>−30%</button>
          </div>
        </div>

        {/* Direction Toggle & Range Slider with Step Nudge Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => { setDirection('up'); soundEngine.playDragClick(); }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-transform ${direction === 'up' ? 'bg-emerald-500 text-slate-950 shadow-glow-green scale-105' : 'bg-[#1A1333] text-purple-200 border border-purple-700/60'}`}
            >
              <ArrowUp className="w-3.5 h-3.5" /> Hike (+)
            </button>
            <button
              onClick={() => { setDirection('down'); setPct((p) => Math.min(p, 95)); soundEngine.playDragClick(); }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-transform ${direction === 'down' ? 'bg-pink-500 text-slate-950 shadow-glow-pink scale-105' : 'bg-[#1A1333] text-purple-200 border border-purple-700/60'}`}
            >
              <ArrowDown className="w-3.5 h-3.5" /> Cut (−)
            </button>
          </div>

          <button onClick={() => nudge(-5)} className="p-1 rounded bg-purple-950 border border-purple-700 text-amber-400 cursor-pointer shrink-0"><Minus className="w-3.5 h-3.5" /></button>
          
          <input
            type="range"
            min="5"
            max={direction === 'down' ? 95 : 100}
            step="5"
            value={pct}
            onChange={(e) => { setPct(parseInt(e.target.value, 10)); soundEngine.playDragClick(); }}
            className="flex-1 accent-amber-400 h-2 cursor-pointer"
            aria-label="Percent dial"
          />

          <button onClick={() => nudge(5)} className="p-1 rounded bg-purple-950 border border-purple-700 text-amber-400 cursor-pointer shrink-0"><Plus className="w-3.5 h-3.5" /></button>

          <button
            onClick={run}
            disabled={running || solved}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs md:text-sm flex items-center gap-1 shadow-glow-green cursor-pointer disabled:opacity-50 transition-transform active:scale-95 shrink-0"
          >
            <Play className="w-4 h-4 fill-slate-950" /> Run Machine
          </button>
        </div>
      </div>

      {/* Grade 6-7 Math Feedback & Step-by-Step Multiplier Display */}
      <div className="w-full min-h-[36px] flex items-center justify-center shrink-0">
        {solved ? (
          <div className="bg-emerald-950 border-2 border-emerald-500 text-emerald-300 px-4 py-1 rounded-2xl text-xs md:text-sm font-black shadow-glow-green flex items-center justify-between gap-2 animate-pop-in w-full text-center">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Match! {fmt(pz.input)} × {fmtNum(multiplier)} = {fmt(pz.target)} ({pz.pct}% {direction === 'up' ? 'increase' : 'discount'})
              </span>
            </div>
            <button
              onClick={() => reset((idx + 1) % machinePuzzles.length)}
              className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer shrink-0 hover:bg-amber-300"
            >
              <span>Next Machine</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : output !== null ? (
          <div className="bg-rose-950/80 border border-rose-500 text-rose-200 px-3 py-1 rounded-2xl text-xs md:text-sm font-bold animate-shake-x text-center">
            {feedback()}
            {attempts >= 3 && ` 💡 Multiplier hint: Change = ${fmt(Math.abs(change))}. Target multiplier = ${fmt(pz.target)} ÷ ${fmt(pz.input)} = ×${fmtNum(pz.target / pz.input)}.`}
          </div>
        ) : (
          <div className="bg-[#161129] border border-purple-700/50 px-3 py-1 rounded-full text-xs md:text-sm font-bold text-purple-200 text-center">
            <span className="text-amber-300 mr-1">Multiplier Formula:</span>
            <span>New Value = Original × Multiplier. Dial in the percent to reach {fmt(pz.target)}!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiplierMachine;


