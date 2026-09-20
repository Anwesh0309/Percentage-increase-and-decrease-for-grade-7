import React, { useState } from 'react';
import { ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import soundEngine from '../utils/audio';

// Wonder-stage rig: press "Raise 20%" and "Cut 20%" in any order and watch the bars.
export const PriceTrapRig = () => {
  const START = 100;
  const [ops, setOps] = useState([]); // e.g. ['up', 'down']

  const values = [START];
  ops.forEach((op) => {
    const last = values[values.length - 1];
    values.push(Math.round(last * (op === 'up' ? 1.2 : 0.8) * 100) / 100);
  });

  const apply = (op) => {
    if (ops.length >= 2) return;
    soundEngine.playDragClick();
    setOps([...ops, op]);
    if (ops.length === 1) setTimeout(() => soundEngine.playBuzz(), 150);
  };

  const done = ops.length === 2;
  const final = values[values.length - 1];
  const base = 146;
  const maxH = 92;
  const SC = 150; // scale so even +20% +20% (144) fits
  const xs = [70, 200, 330];
  const labels = ['START', '1st CHANGE', '2nd CHANGE'];

  return (
    <div className="w-full flex flex-col items-center space-y-1.5">
      <svg viewBox="0 0 400 176" className="w-full h-36 md:h-40 select-none">
        {/* $100 guide line */}
        <line x1="10" y1={base - maxH * (START / SC)} x2="390" y2={base - maxH * (START / SC)} stroke="rgba(255,184,0,0.6)" strokeWidth="2" strokeDasharray="6 5" />
        <text x="392" y="12" textAnchor="end" fill="#FFB800" fontSize="11" fontWeight="900">- - -  $100 start line</text>
        <line x1="10" y1={base} x2="390" y2={base} stroke="#3B2D6B" strokeWidth="3" />

        {[0, 1, 2].map((i) => {
          const visible = i < values.length;
          const v = visible ? values[i] : 0;
          const h = visible ? (v / SC) * maxH : 0;
          const op = ops[i - 1];
          const color = i === 0 ? '#06B6D4' : op === 'up' ? '#10B981' : '#EC4899';
          return (
            <g key={i} opacity={visible ? 1 : 0.35}>
              {visible ? (
                <>
                  <rect x={xs[i] - 34} y={base - h} width="68" height={h} rx="8" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="3" />
                  <g transform={`translate(${xs[i]}, ${base - h - 15})`}>
                    <rect x="-34" y="-12" width="68" height="24" rx="7" fill="#161129" stroke={color} strokeWidth="2.5" />
                    <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900" fontFamily="Outfit, Inter, sans-serif">${v}</text>
                  </g>
                </>
              ) : (
                <rect x={xs[i] - 34} y={base - 30} width="68" height="30" rx="8" fill="none" stroke="#3B2D6B" strokeWidth="2.5" strokeDasharray="5 5" />
              )}
              <text x={xs[i]} y={base + 16} textAnchor="middle" fill="#A78BFA" fontSize="11" fontWeight="900" letterSpacing="1">{labels[i]}</text>
              {i > 0 && visible && (
                <text x={(xs[i - 1] + xs[i]) / 2} y="16" textAnchor="middle" fill={color} fontSize="18" fontWeight="900" fontFamily="Outfit, Inter, sans-serif">
                  {op === 'up' ? '+20%' : '−20%'} ➜
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => apply('up')}
          disabled={done}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs md:text-sm flex items-center gap-1 disabled:opacity-40 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" /> Raise 20%
        </button>
        <button
          onClick={() => apply('down')}
          disabled={done}
          className="px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-black text-xs md:text-sm flex items-center gap-1 disabled:opacity-40 cursor-pointer"
        >
          <ArrowDown className="w-4 h-4" /> Cut 20%
        </button>
        <button
          onClick={() => setOps([])}
          className="p-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-[#3B2D6B] text-slate-300 cursor-pointer"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className={`px-3 py-1 rounded-xl border font-black text-xs md:text-sm ${done ? (final === START ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' : 'bg-rose-950/80 border-rose-500 text-rose-300') : 'bg-purple-950/80 border-purple-600 text-amber-400'}`}>
          {done ? `Final: $${final} ${final === START ? '✓' : '— not $100!'}` : `Price now: $${final}`}
        </div>
      </div>
    </div>
  );
};

export default PriceTrapRig;
