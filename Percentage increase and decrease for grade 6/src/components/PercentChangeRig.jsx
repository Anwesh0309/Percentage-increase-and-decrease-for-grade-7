import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Plus, Minus, Target } from 'lucide-react';
import soundEngine from '../utils/audio';
import { rigOriginals } from '../data/stationData';

const fmtNum = (n) => Number(Math.round(n * 100) / 100).toLocaleString('en-US');

// Station A — drag the knob or use step controls. The ORIGINAL bar is fixed at 100%.
export const PercentChangeRig = () => {
  const [origIdx, setOrigIdx] = useState(0);
  const [newPct, setNewPct] = useState(125); // new amount as % of original (0–200)
  const svgRef = useRef(null);
  const dragging = useRef(false);

  const selectedOrig = rigOriginals[origIdx];
  const original = selectedOrig.value;
  const isMoney = selectedOrig.money !== false;

  const fmtVal = (val) => `${isMoney ? '$' : ''}${fmtNum(val)}${!isMoney ? ` ${selectedOrig.unit}` : ''}`;

  const X0 = 40;
  const UNIT = 1.6; // px per 1% in a 400-wide viewBox
  const pctChange = newPct - 100;
  const newVal = (original * newPct) / 100;
  const change = newVal - original;
  const mult = newPct / 100;
  const up = pctChange >= 0;

  const setFromPointer = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const vx = ((e.clientX - rect.left) / rect.width) * 400;
    let p = (vx - X0) / UNIT;
    p = Math.max(0, Math.min(200, Math.round(p / 5) * 5));
    if (p !== newPct) soundEngine.playDragClick();
    setNewPct(p);
  };

  const onDown = (e) => {
    dragging.current = true;
    svgRef.current?.setPointerCapture(e.pointerId);
    setFromPointer(e);
  };
  const onMove = (e) => dragging.current && setFromPointer(e);
  const onUp = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    if (svgRef.current?.hasPointerCapture(e.pointerId)) svgRef.current.releasePointerCapture(e.pointerId);
    if (newPct === 200 || newPct === 50) confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const nudge = (delta) => {
    soundEngine.playDragClick();
    const target = Math.max(0, Math.min(200, newPct + delta));
    setNewPct(target);
    if (target === 200 || target === 50) confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const quick = (p) => {
    soundEngine.playDragClick();
    setNewPct(100 + p);
    if (p === 100 || p === -50) confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const milestone = newPct === 200 ? '🎉 +100% = DOUBLED!' : newPct === 50 ? '🎉 −50% = HALVED!' : newPct === 100 ? 'No change: 0%' : null;
  const barEnd = X0 + newPct * UNIT;
  const origEnd = X0 + 100 * UNIT;

  // Visual item count indicator badges (up to 10 icons max for neatness)
  const itemIconsCount = Math.min(10, Math.max(1, Math.round((newVal / original) * 5)));
  const itemIconsArray = Array.from({ length: itemIconsCount }, (_, i) => i);

  return (
    <div className="w-full flex flex-col items-center space-y-1.5 h-full justify-between">
      {/* Real-World Story Item Header */}
      <div className="w-full bg-[#161129] border border-purple-700/60 rounded-xl px-3 py-1 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">{selectedOrig.icon}</span>
          <span className="text-xs sm:text-sm font-black text-amber-300 font-display">
            {selectedOrig.item}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] sm:text-xs font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-700/50 flex items-center gap-1">
            <span>Visual Batch:</span>
            <span>{itemIconsArray.map(() => selectedOrig.icon).join('')}</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="w-full flex flex-col md:flex-row items-stretch gap-2 flex-1 min-h-0">
        {/* Left: SVG Bar Visualization with Clickable Ticks */}
        <div className="w-full md:w-[56%] bg-[#130E26]/90 border border-purple-900/60 rounded-2xl p-2 flex flex-col justify-center">
          <svg
            ref={svgRef}
            viewBox="0 0 400 205"
            className="w-full h-auto max-h-[195px] touch-none select-none overflow-visible cursor-crosshair"
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <text x={X0} y="18" fill="#A78BFA" fontSize="11" fontWeight="900" letterSpacing="1.2">ORIGINAL = 100%</text>
            <rect x={X0} y="25" width={100 * UNIT} height="36" rx="8" fill="#06B6D4" fillOpacity="0.35" stroke="#06B6D4" strokeWidth="3" />
            <text x={X0 + 50 * UNIT} y="49" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="900" fontFamily="Outfit, Inter, sans-serif">{fmtVal(original)}</text>

            <text x={X0} y="96" fill="#A78BFA" fontSize="11" fontWeight="900" letterSpacing="1.2">NEW = {newPct}% OF ORIGINAL</text>
            <rect x={X0} y="103" width={Math.min(newPct, 100) * UNIT} height="36" rx="8" fill="#F59E0B" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="3" />
            {newPct > 100 && (
              <rect x={origEnd} y="103" width={(newPct - 100) * UNIT} height="36" rx="8" fill="#10B981" fillOpacity="0.55" stroke="#10B981" strokeWidth="3" />
            )}
            {newPct < 100 && (
              <rect x={barEnd} y="103" width={(100 - newPct) * UNIT} height="36" rx="8" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="3" strokeDasharray="6 5" />
            )}
            <text x={X0 + Math.max(newPct, 30) * UNIT / 2} y="127" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="900" fontFamily="Outfit, Inter, sans-serif">{fmtVal(newVal)}</text>

            {/* 100% guide line */}
            <line x1={origEnd} y1="21" x2={origEnd} y2="152" stroke="rgba(255,184,0,0.7)" strokeWidth="2" strokeDasharray="5 5" />

            {/* Interactive Clickable Ruler */}
            <line x1={X0} y1="162" x2={X0 + 200 * UNIT} y2="162" stroke="#3B2D6B" strokeWidth="3" />
            {[0, 25, 50, 75, 100, 125, 150, 175, 200].map((t) => (
              <g key={t} className="cursor-pointer hover:opacity-80" onClick={(e) => { e.stopPropagation(); soundEngine.playDragClick(); setNewPct(t); }}>
                <line x1={X0 + t * UNIT} y1="157" x2={X0 + t * UNIT} y2="167" stroke={newPct === t ? '#F59E0B' : '#8B5CF6'} strokeWidth={newPct === t ? '4' : '2.5'} />
                <text x={X0 + t * UNIT} y="183" textAnchor="middle" fill={newPct === t ? '#F59E0B' : '#A78BFA'} fontSize={newPct === t ? '11' : '9.5'} fontWeight="900">{t}%</text>
              </g>
            ))}

            {/* Draggable knob */}
            <circle
              cx={barEnd}
              cy="121"
              r="16"
              fill="#FFB800"
              stroke="#161129"
              strokeWidth="3.5"
              className="cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
              onPointerDown={onDown}
            />
            <text x={barEnd} y="126" textAnchor="middle" fill="#161129" fontSize="13" fontWeight="900" pointerEvents="none">↔</text>
          </svg>
        </div>

        {/* Right: Readouts, Story Item Switcher, Fine-Tune Nudge & Presets */}
        <div className="w-full md:w-[44%] flex flex-col justify-between gap-1.5 bg-[#130E26]/60 border border-purple-900/40 rounded-2xl p-2.5">
          {/* Select Story Item */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] font-black text-purple-300">Scenario Item:</span>
            {rigOriginals.map((o, idx) => (
              <button
                key={o.value}
                onClick={() => { soundEngine.playDragClick(); setOrigIdx(idx); }}
                className={`px-2 py-0.5 rounded-lg text-xs font-black cursor-pointer transition-all ${origIdx === idx ? 'bg-amber-400 text-slate-950 scale-105 shadow-glow-gold' : 'bg-[#1A1333] text-purple-200 border border-purple-700/60 hover:text-white'}`}
              >
                {o.icon} {o.label}
              </button>
            ))}
          </div>

          {/* Metric Cards (Change, % Change, Multiplier) */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className={`rounded-xl border px-1.5 py-1 text-center ${up ? 'border-emerald-500/70 bg-emerald-950/40' : 'border-pink-500/70 bg-pink-950/40'}`}>
              <div className="text-[9px] font-black text-purple-300 uppercase tracking-wider">Amount Change</div>
              <div className={`text-xs sm:text-sm font-black ${up ? 'text-emerald-400' : 'text-pink-400'}`}>
                {change >= 0 ? '+' : '−'}{fmtVal(Math.abs(change))}
              </div>
            </div>
            <div className={`rounded-xl border px-1.5 py-1 text-center ${up ? 'border-emerald-500/70 bg-emerald-950/40' : 'border-pink-500/70 bg-pink-950/40'}`}>
              <div className="text-[9px] font-black text-purple-300 uppercase tracking-wider">% Change</div>
              <div className={`text-xs sm:text-sm font-black ${up ? 'text-emerald-400' : 'text-pink-400'}`}>
                {pctChange >= 0 ? '+' : '−'}{Math.abs(pctChange)}%
              </div>
            </div>
            <div className="rounded-xl border border-amber-500/70 bg-amber-950/30 px-1.5 py-1 text-center">
              <div className="text-[9px] font-black text-purple-300 uppercase tracking-wider">Multiplier</div>
              <div className="text-xs sm:text-sm font-black text-amber-300">×{fmtNum(mult)}</div>
            </div>
          </div>

          {/* Workable Fine-Tune Step Buttons (-10%, -5%, +5%, +10%) */}
          <div className="flex items-center justify-between gap-1 bg-[#161129] p-1 rounded-xl border border-purple-800/40">
            <span className="text-[10px] font-black text-purple-300 ml-1">Step Dial:</span>
            <div className="flex items-center gap-1">
              <button onClick={() => nudge(-10)} className="px-2 py-0.5 rounded bg-pink-950/80 hover:bg-pink-900 border border-pink-700/60 text-pink-300 text-xs font-black cursor-pointer">-10%</button>
              <button onClick={() => nudge(-5)} className="px-2 py-0.5 rounded bg-pink-950/50 hover:bg-pink-900/60 border border-pink-700/40 text-pink-300 text-xs font-black cursor-pointer">-5%</button>
              <button onClick={() => nudge(5)} className="px-2 py-0.5 rounded bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-black cursor-pointer">+5%</button>
              <button onClick={() => nudge(10)} className="px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-black cursor-pointer">+10%</button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-1">
            {[25, -20, 100, -50].map((p) => (
              <button
                key={p}
                onClick={() => quick(p)}
                className={`py-1 rounded-lg text-xs font-black cursor-pointer border transition-transform hover:scale-105 ${p > 0 ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300' : 'bg-pink-950/50 border-pink-500/60 text-pink-300'}`}
              >
                {p > 0 ? '+' : '−'}{Math.abs(p)}%
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => { soundEngine.playDragClick(); setNewPct(125); }}
              className="px-2 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-[#3B2D6B] text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <span className="text-[11px] font-bold text-cyan-300">
              {milestone ? milestone : `${newPct}% of original`}
            </span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Grade 6-7 Mathematical Formula Breakdown */}
      <div className="w-full bg-[#161129] border-2 border-amber-400/80 px-3 py-1.5 rounded-2xl text-amber-300 font-black text-xs sm:text-sm shadow-glow-gold text-center shrink-0">
        <span className="text-cyan-300 mr-2">Grade 7 Formula:</span>
        {change === 0 ? (
          'No Change: Change = 0 → 0 ÷ Original × 100 = 0%'
        ) : (
          <>
            <span>Change = {fmtVal(newVal)} − {fmtVal(original)} = {change > 0 ? '+' : '−'}{fmtVal(Math.abs(change))}</span>
            <span className="mx-2 text-purple-400">•</span>
            <span>% Change = ({fmtVal(Math.abs(change))} ÷ {fmtVal(original)}) × 100 = <span className="text-amber-400 font-bold underline">{Math.abs(pctChange)}% {up ? 'Increase' : 'Decrease'}</span></span>
          </>
        )}
      </div>
    </div>
  );
};

export default PercentChangeRig;


