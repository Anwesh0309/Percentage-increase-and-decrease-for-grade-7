import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowUp, ArrowDown, Minus, Plus, Target, Shuffle, AlertTriangle, Lightbulb, Receipt } from 'lucide-react';
import soundEngine from '../utils/audio';
import { chainScenarios, chainChallenges } from '../data/stationData';

const fmtNum = (n) => Number(Math.round(n * 100) / 100).toLocaleString('en-US');

const Stepper = ({ label, step, onChange, locked, maxUp = 100 }) => {
  const max = step.dir === 'up' ? maxUp : 95;
  const bump = (d) => {
    soundEngine.playDragClick();
    onChange({ ...step, pct: Math.max(5, Math.min(max, step.pct + d)) });
  };
  return (
    <div className={`flex-1 rounded-2xl border px-2 py-1.5 flex flex-col items-center gap-1 ${step.dir === 'up' ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-pink-500/60 bg-pink-950/20'}`}>
      <span className="text-[10px] font-black text-purple-300 tracking-widest uppercase">{label}{locked ? ' (fixed)' : ''}</span>
      <div className="flex items-center gap-1">
        <button
          disabled={locked}
          onClick={() => { soundEngine.playDragClick(); onChange({ dir: 'up', pct: Math.min(step.pct, 100) }); }}
          className={`p-1 rounded-lg cursor-pointer disabled:opacity-60 transition-all ${step.dir === 'up' ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-[#1A1333] text-purple-300 border border-purple-700/60'}`}
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          disabled={locked}
          onClick={() => { soundEngine.playDragClick(); onChange({ dir: 'down', pct: Math.min(step.pct, 95) }); }}
          className={`p-1 rounded-lg cursor-pointer disabled:opacity-60 transition-all ${step.dir === 'down' ? 'bg-pink-500 text-slate-950 scale-105' : 'bg-[#1A1333] text-purple-300 border border-purple-700/60'}`}
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <button disabled={locked} onClick={() => bump(-5)} className="p-0.5 rounded-md bg-purple-950 border border-purple-700 text-amber-400 disabled:opacity-40 cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
        <span className={`w-16 text-center text-base sm:text-lg font-black font-mono ${step.dir === 'up' ? 'text-emerald-400' : 'text-pink-400'}`}>{step.dir === 'up' ? '+' : '−'}{step.pct}%</span>
        <button disabled={locked} onClick={() => bump(5)} className="p-0.5 rounded-md bg-purple-950 border border-purple-700 text-amber-400 disabled:opacity-40 cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
};

// Station D — chain two percent changes; then try to get exactly back to the start.
export const ChainLab = () => {
  const [scenarioId, setScenarioId] = useState('game');
  const [mode, setMode] = useState('free'); // free | challenge
  const [s1, setS1] = useState({ dir: 'up', pct: 20 });
  const [s2, setS2] = useState({ dir: 'down', pct: 20 });
  const [chIdx, setChIdx] = useState(0);
  const [activeBarIdx, setActiveBarIdx] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const celebrated = useRef(false);

  const sc = chainScenarios.find((s) => s.id === scenarioId) || chainScenarios[0];
  const ch = chainChallenges[chIdx];
  const fmt = (v) => `${sc.unit}${fmtNum(v)}${sc.suffix}`;

  const eff1 = mode === 'challenge' ? { dir: 'up', pct: ch.step1 } : s1;
  const m1 = eff1.dir === 'up' ? 1 + eff1.pct / 100 : 1 - eff1.pct / 100;
  const m2 = s2.dir === 'up' ? 1 + s2.pct / 100 : 1 - s2.pct / 100;
  const netMult = m1 * m2;
  const v1 = Math.round(sc.start * m1 * 100) / 100;
  const v2 = Math.round(v1 * m2 * 100) / 100;
  const net = ((v2 - sc.start) / sc.start) * 100;
  const back = Math.abs(v2 - sc.start) < 0.005;

  useEffect(() => {
    if (back && !celebrated.current) {
      celebrated.current = true;
      soundEngine.playChime();
      soundEngine.playText('back_to_start');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
    if (!back) celebrated.current = false;
  }, [back]);

  const switchMode = (m) => {
    setMode(m);
    celebrated.current = false;
    setShowHint(false);
    if (m === 'challenge') setS2({ dir: 'down', pct: 10 });
    else { setS1({ dir: 'up', pct: 20 }); setS2({ dir: 'down', pct: 20 }); }
  };
  const nextChallenge = () => { setChIdx((chIdx + 1) % chainChallenges.length); setS2({ dir: 'down', pct: 10 }); setShowHint(false); };

  const applyPresetTrap = (dir1, pct1, dir2, pct2) => {
    soundEngine.playDragClick();
    setMode('free');
    setS1({ dir: dir1, pct: pct1 });
    setS2({ dir: dir2, pct: pct2 });
  };

  // SVG Bar Chart Data
  const vals = [sc.start, v1, v2];
  const maxV = Math.max(...vals) || 1;
  const base = 100;
  const maxH = 68;
  const xs = [80, 200, 320];
  const colors = ['#06B6D4', eff1.dir === 'up' ? '#10B981' : '#EC4899', s2.dir === 'up' ? '#10B981' : '#EC4899'];
  const labels = ['1. START', '2. STEP 1 RESULT', '3. FINAL RESULT'];

  return (
    <div className="w-full flex flex-col items-center space-y-1.5 h-full justify-between">
      {/* Scenario Skins & Mode Selector */}
      <div className="w-full flex flex-wrap items-center justify-between gap-1.5 shrink-0">
        <div className="flex flex-wrap items-center gap-1.5">
          {chainScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => { soundEngine.playDragClick(); setScenarioId(s.id); }}
              className={`px-2.5 py-0.5 rounded-xl text-xs font-black cursor-pointer transition-all ${scenarioId === s.id ? 'bg-amber-400 text-slate-950 shadow-glow-gold scale-105' : 'bg-[#130E26]/90 text-purple-200 border border-purple-800/60 hover:text-white'}`}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => switchMode('free')} className={`px-2.5 py-0.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${mode === 'free' ? 'bg-cyan-400 text-slate-950' : 'bg-[#1A1333] text-purple-200 border border-purple-700/60'}`}>
            <Shuffle className="w-3.5 h-3.5" /> Free Lab
          </button>
          <button onClick={() => switchMode('challenge')} className={`px-2.5 py-0.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${mode === 'challenge' ? 'bg-cyan-400 text-slate-950 shadow-glow-cyan' : 'bg-[#1A1333] text-purple-200 border border-purple-700/60'}`}>
            <Target className="w-3.5 h-3.5" /> Reset Challenge
          </button>
        </div>
      </div>

      {/* Quick Real-World Trap Presets */}
      <div className="w-full bg-[#161129] border border-purple-700/60 rounded-xl px-3 py-1 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-[10px] font-black text-amber-300 uppercase shrink-0">Quick Traps:</span>
          <button onClick={() => applyPresetTrap('up', 20, 'down', 20)} className="px-2 py-0.5 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-[11px] font-black shrink-0 cursor-pointer">+20% then −20% (Story Trap!)</button>
          <button onClick={() => applyPresetTrap('up', 25, 'down', 20)} className="px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-[11px] font-black shrink-0 cursor-pointer">+25% then −20% (Balance)</button>
          <button onClick={() => applyPresetTrap('up', 50, 'down', 50)} className="px-2 py-0.5 rounded bg-pink-950/80 hover:bg-pink-900 border border-pink-500/50 text-pink-300 text-[11px] font-black shrink-0 cursor-pointer">+50% then −50% (−25% Drop)</button>
          <button onClick={() => applyPresetTrap('up', 10, 'up', 15)} className="px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-[11px] font-black shrink-0 cursor-pointer">+10% Tax +15% Tip</button>
        </div>
        <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-700/50 shrink-0">
          ×{fmtNum(netMult)} Total
        </span>
      </div>

      {/* SVG Bar Visualization with Clickable Inspection */}
      <div className="w-full bg-[#130E26]/80 border border-purple-900/60 rounded-2xl p-1 flex-1 min-h-0 flex items-center justify-center relative">
        <svg viewBox="0 0 400 130" className="w-full h-28 md:h-32 select-none overflow-visible">
          <line x1="10" y1={base - (sc.start / maxV) * maxH} x2="390" y2={base - (sc.start / maxV) * maxH} stroke="rgba(255,184,0,0.6)" strokeWidth="2" strokeDasharray="6 5" />
          <line x1="10" y1={base} x2="390" y2={base} stroke="#3B2D6B" strokeWidth="3" />
          {vals.map((v, i) => {
            const h = Math.max((v / maxV) * maxH, 6);
            return (
              <g key={i} className="cursor-pointer hover:opacity-90" onClick={() => { soundEngine.playDragClick(); setActiveBarIdx(activeBarIdx === i ? null : i); }}>
                <rect x={xs[i] - 36} y={base - h} width="72" height={h} rx="8" fill={colors[i]} fillOpacity="0.4" stroke={colors[i]} strokeWidth={activeBarIdx === i ? '4' : '3'} />
                <g transform={`translate(${xs[i]}, ${base - h - 13})`}>
                  <rect x="-40" y="-11" width="80" height="22" rx="7" fill="#161129" stroke={colors[i]} strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="900" fontFamily="Outfit, Inter, sans-serif">{fmt(v)}</text>
                </g>
                <text x={xs[i]} y={base + 15} textAnchor="middle" fill="#A78BFA" fontSize="10" fontWeight="900" letterSpacing="0.8">{labels[i]}</text>
              </g>
            );
          })}
        </svg>

        {/* Clickable Bar Detailed Invoice Inspector Tooltip */}
        {activeBarIdx !== null && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-[#161129] text-white px-3 py-1 rounded-xl text-xs font-bold border-2 border-amber-400 shadow-glow-gold animate-pop-in flex items-center gap-2 z-10">
            <Receipt className="w-4 h-4 text-amber-400" />
            <span>{labels[activeBarIdx]}: <strong className="text-amber-300">{fmt(vals[activeBarIdx])}</strong></span>
            {activeBarIdx === 1 && <span>(Step 1: ×{fmtNum(m1)})</span>}
            {activeBarIdx === 2 && <span>(Step 2: ×{fmtNum(m2)})</span>}
          </div>
        )}
      </div>

      {/* Two-Step Stepper Controls */}
      <div className="w-full flex items-stretch gap-2 shrink-0">
        <Stepper label="Step 1 Multiplier" step={eff1} onChange={setS1} locked={mode === 'challenge'} />
        <Stepper label="Step 2 Multiplier" step={s2} onChange={setS2} />
      </div>

      {/* Grade 6-7 Chained Percentage Math Banner */}
      <div className="w-full flex flex-col items-center gap-1 shrink-0">
        {mode === 'challenge' && (
          <div className="flex items-center gap-2 text-xs font-black text-amber-300 text-center">
            <span>🎯 Challenge #{chIdx + 1}: Step 1 is +{ch.step1}% (×{fmtNum(1 + ch.step1/100)}). Find Step 2 decrease!</span>
            <button onClick={() => setShowHint(!showHint)} className="bg-purple-900/80 hover:bg-purple-800 text-amber-300 px-2 py-0.5 rounded-lg text-[11px] font-bold border border-purple-600/40 cursor-pointer flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span>{showHint ? 'Hide Clue' : 'Clue'}</span>
            </button>
          </div>
        )}
        {showHint && mode === 'challenge' && (
          <div className="bg-purple-950/90 border border-purple-500 text-purple-200 text-xs font-bold px-3 py-1 rounded-xl animate-pop-in text-center">
            💡 Reciprocal Hint: {ch.note} Target multiplier m₂ = 1 / m₁ = 1 / {fmtNum(m1)} = {fmtNum(1/m1)}.
          </div>
        )}
        {back ? (
          <div className="bg-emerald-950 border-2 border-emerald-500 text-emerald-300 px-3.5 py-1 rounded-2xl text-xs md:text-sm font-black shadow-glow-green animate-pop-in flex items-center justify-between gap-2 text-center w-full">
            <div className="flex items-center gap-1.5">
              <span>✅ Back to Start! ×{fmtNum(m1)} × ×{fmtNum(m2)} = ×1.00 (Net 0% Change)</span>
            </div>
            {mode === 'challenge' && (
              <button onClick={nextChallenge} className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-lg text-xs font-black cursor-pointer hover:bg-amber-300 shrink-0">Next Challenge ➜</button>
            )}
          </div>
        ) : (
          <div className={`w-full px-3 py-1 rounded-xl border-2 text-xs md:text-sm font-black flex items-center justify-between ${net > 0 ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' : 'bg-rose-950/70 border-rose-500 text-rose-300'}`}>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Chained Formula: {fmt(sc.start)} × {fmtNum(m1)} × {fmtNum(m2)} = {fmt(v2)}</span>
            </div>
            <div className="font-mono">
              Net Change: {net > 0 ? '+' : '−'}{fmtNum(Math.abs(net))}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChainLab;


