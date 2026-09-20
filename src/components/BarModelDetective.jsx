import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { RefreshCw, CheckCircle, Search, HelpCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import soundEngine from '../utils/audio';
import { detectiveCases } from '../data/stationData';

const fmtNum = (n) => Number(Math.round(n * 100) / 100).toLocaleString('en-US');

// Station C — Reverse Percentages with 10% Unit Blocks
export const BarModelDetective = () => {
  const [caseIdx, setCaseIdx] = useState(0);
  const [step, setStep] = useState(0); // 0: find blocks/pct, 1: find 1 block value, 2: find original 100%, 3: solved
  const [wrong, setWrong] = useState(null);
  const [activeBlock, setActiveBlock] = useState(null);
  const [showClue, setShowClue] = useState(false);

  const cs = detectiveCases[caseIdx];
  const money = cs.money !== false;
  const fmt = (v) => `${money ? '$' : ''}${fmtNum(v)}${cs.suffix || ''}`;
  const up = cs.change > 0;
  const nowBlocks = 10 + cs.change / 10; // blocks making up the NEW amount
  const paidPct = nowBlocks * 10;

  // Clear, student-friendly 3-step questions and options
  const steps = useMemo(() => {
    const mk = (correct, cands) => {
      const set = [correct];
      cands.forEach((c) => { if (c > 0 && !set.includes(c) && set.length < 4) set.push(c); });
      let k = 1;
      while (set.length < 4) { if (!set.includes(correct + k)) set.push(correct + k); k += 1; }
      const rot = (caseIdx + 1) % 4;
      return rot === 0 ? set : set.slice(-rot).concat(set.slice(0, -rot));
    };

    const q1 = up
      ? `Step 1: Total bill is 100% + ${cs.change}% = ${paidPct}%. How many 10% blocks equal the final price (${fmt(cs.now)})?`
      : `Step 1: After a ${Math.abs(cs.change)}% discount, you pay ${paidPct}% (100% − ${Math.abs(cs.change)}%). How many 10% blocks equal ${fmt(cs.now)}?`;

    const hint1 = up
      ? `100% + ${cs.change}% = ${paidPct}%. Dividing by 10% gives ${nowBlocks} blocks!`
      : `100% − ${Math.abs(cs.change)}% = ${paidPct}%. Dividing by 10% gives ${nowBlocks} blocks!`;

    return [
      {
        q: q1,
        correct: nowBlocks,
        opts: mk(nowBlocks, [10, nowBlocks + 2, nowBlocks - 2, nowBlocks + 1]),
        f: (v) => `${v} blocks (${v * 10}%)`,
        hint: hint1
      },
      {
        q: `Step 2: The price ${fmt(cs.now)} is shared across ${nowBlocks} blocks. What is the value of ONE 10% block?`,
        correct: cs.block,
        opts: mk(cs.block, [cs.now / 10, cs.block + 2, cs.block * 2, cs.block - 2]),
        f: fmt,
        hint: `Divide price by block count: ${fmt(cs.now)} ÷ ${nowBlocks} blocks = ${fmt(cs.block)} per block!`
      },
      {
        q: `Step 3: The original price is the full 100% (10 blocks). What was the ORIGINAL price before change?`,
        correct: cs.original,
        opts: mk(cs.original, [cs.now, cs.now + cs.block * 2, cs.original + cs.block, cs.original - cs.block]),
        f: fmt,
        hint: `Multiply 1 block value by 10: ${fmt(cs.block)} × 10 blocks = ${fmt(cs.original)}!`
      },
    ];
  // eslint-disable-next-line
  }, [caseIdx]);

  const choose = (v) => {
    if (step > 2) return;
    if (v === steps[step].correct) {
      setWrong(null);
      soundEngine.playDragClick();
      if (step === 2) {
        setStep(3);
        soundEngine.playChime();
        soundEngine.playText('case_solved');
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } else setStep(step + 1);
    } else {
      setWrong(v);
      soundEngine.playBuzz();
      soundEngine.playText('incorrect_try_again');
    }
  };

  const switchCase = (targetIdx) => {
    const next = (targetIdx + detectiveCases.length) % detectiveCases.length;
    setCaseIdx(next);
    setStep(0);
    setWrong(null);
    setActiveBlock(null);
    setShowClue(false);
  };

  // Block strip construction
  const total = Math.max(10, nowBlocks);
  const blocks = Array.from({ length: total }, (_, i) => {
    const inOriginal = i < 10;
    const inNow = i < nowBlocks;
    let cls;
    if (up) cls = inOriginal ? 'bg-amber-500/40 border-amber-400' : 'bg-emerald-500/50 border-emerald-400';
    else cls = inNow ? 'bg-amber-500/40 border-amber-400' : 'bg-pink-500/10 border-pink-500 border-dashed opacity-60';
    const counted = up ? true : inNow;
    return { i, cls, counted, label: step >= 1 && counted ? fmtNum(cs.block) : '10%' };
  });

  return (
    <div className="w-full flex flex-col items-center space-y-1.5 h-full justify-between">
      {/* Case Selector Tabs & Case File Title */}
      <div className="w-full flex items-center justify-between gap-1.5 bg-[#161129] border border-purple-700/60 rounded-xl px-2.5 py-1 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => switchCase(caseIdx - 1)} className="p-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-amber-300 cursor-pointer" title="Prev Case">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-black text-amber-300 font-display">Case #{caseIdx + 1}: {cs.item}</span>
          <button onClick={() => switchCase(caseIdx + 1)} className="p-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-amber-300 cursor-pointer" title="Next Case">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Case Quick Selector Chips */}
        <div className="flex items-center gap-1 shrink-0">
          {detectiveCases.map((c, i) => (
            <button
              key={c.id}
              onClick={() => switchCase(i)}
              className={`px-2 py-0.5 rounded-lg text-xs font-black cursor-pointer transition-all ${caseIdx === i ? 'bg-amber-400 text-slate-950 scale-105 shadow-glow-gold' : 'bg-[#1A1333] text-purple-300 border border-purple-800/60 hover:text-white'}`}
            >
              #{i + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowClue(!showClue)}
            className="bg-purple-900/80 hover:bg-purple-800 text-amber-300 px-2 py-0.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer border border-purple-600/50"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{showClue ? 'Hide Hint' : 'Hint'}</span>
          </button>
          <button
            onClick={() => switchCase(caseIdx + 1)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-2 py-0.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-glow-gold transition-transform hover:scale-105"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Next ➜</span>
          </button>
        </div>
      </div>

      {/* Case Story Statement */}
      <div className="w-full bg-[#130E26]/90 border border-purple-900/80 rounded-2xl px-3 py-1.5 text-center shrink-0">
        <p className="text-xs sm:text-sm font-black text-slate-100 font-display">
          "{cs.story}"
        </p>
        {showClue ? (
          <p className="text-xs font-bold text-amber-300 bg-amber-950/70 rounded-xl py-1 px-2.5 mt-1 border border-amber-500/50 animate-pop-in">
            💡 Detective Rule: Final Price is {fmt(cs.now)}. Since {cs.change > 0 ? `+${cs.change}% tax/increase` : `${Math.abs(cs.change)}% discount`} is applied, {paidPct}% of original = {fmt(cs.now)}. So 10% = {fmt(cs.now)} ÷ {nowBlocks} = {fmt(cs.block)}.
          </p>
        ) : (
          <p className="text-[11px] font-bold text-cyan-300 mt-0.5">
            Work backwards: Paid Price {fmt(cs.now)} = {nowBlocks} blocks ({paidPct}%). Solve original 100%!
          </p>
        )}
      </div>

      {/* Visual 3-Step Pipeline Cards */}
      <div className="w-full grid grid-cols-3 gap-1.5 shrink-0">
        <div className={`p-1.5 rounded-xl border text-center transition-all ${step === 0 ? 'bg-amber-950/60 border-amber-400 shadow-glow-gold scale-[1.02]' : step > 0 ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-[#161129] border-purple-800/40 opacity-70'}`}>
          <div className="text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1">
            {step > 0 && <Check className="w-3 h-3 text-emerald-400" />}
            <span>Step 1: Find Paid %</span>
          </div>
          <div className="text-xs font-black mt-0.5">{paidPct}% = {nowBlocks} blocks</div>
        </div>

        <div className={`p-1.5 rounded-xl border text-center transition-all ${step === 1 ? 'bg-amber-950/60 border-amber-400 shadow-glow-gold scale-[1.02]' : step > 1 ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-[#161129] border-purple-800/40 opacity-70'}`}>
          <div className="text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1">
            {step > 1 && <Check className="w-3 h-3 text-emerald-400" />}
            <span>Step 2: Value of 1 Block</span>
          </div>
          <div className="text-xs font-black mt-0.5">{step >= 1 ? `1 Block (10%) = ${fmt(cs.block)}` : '?'}</div>
        </div>

        <div className={`p-1.5 rounded-xl border text-center transition-all ${step === 2 ? 'bg-amber-950/60 border-amber-400 shadow-glow-gold scale-[1.02]' : step === 3 ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-[#161129] border-purple-800/40 opacity-70'}`}>
          <div className="text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1">
            {step === 3 && <Check className="w-3 h-3 text-emerald-400" />}
            <span>Step 3: Original (100%)</span>
          </div>
          <div className="text-xs font-black mt-0.5">{step === 3 ? `Original = ${fmt(cs.original)}` : '?'}</div>
        </div>
      </div>

      {/* 10% Unit Bar Model Strip with Clickable Tooltip Inspector */}
      <div className="w-full bg-[#130E26]/80 border border-purple-900/60 rounded-2xl p-2.5 flex-1 min-h-0 flex flex-col justify-center relative">
        <div className="flex gap-1 w-full my-auto">
          {blocks.map((b) => (
            <div
              key={b.i}
              onClick={() => { soundEngine.playDragClick(); setActiveBlock(activeBlock === b.i ? null : b.i); }}
              className={`flex-1 h-9 md:h-11 rounded-md border-2 flex items-center justify-center text-[9px] md:text-[11px] font-black text-white transition-all cursor-pointer hover:scale-105 ${activeBlock === b.i ? 'ring-4 ring-amber-400 border-white scale-110 z-10' : ''} ${b.cls}`}
            >
              {b.label}
            </div>
          ))}
        </div>

        {/* Active Block Inspector Tooltip */}
        {activeBlock !== null && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black shadow-xl border border-white animate-pop-in flex items-center gap-1.5 z-20">
            <span>Block #{activeBlock + 1} = 10%</span>
            <span>•</span>
            <span>Value: {fmt(cs.block)}</span>
            <span>•</span>
            <span>{activeBlock < nowBlocks ? 'Part of paid price' : 'Discounted portion'}</span>
          </div>
        )}

        <div className="flex justify-between text-[10px] md:text-xs font-black mt-1.5 px-0.5">
          <span className="text-cyan-300">
            {up ? `Original (10 blocks = 100%) = ${step === 3 ? fmt(cs.original) : '?'}` : `Paid Price (${fmt(cs.now)}) = ${nowBlocks} blocks (${paidPct}%)`}
          </span>
          <span className={up ? 'text-emerald-300' : 'text-pink-300'}>
            {up ? `Final Total (${fmt(cs.now)}) = ${nowBlocks} blocks (${paidPct}%)` : `Discount (${Math.abs(cs.change)}%) = Dashed Blocks`}
          </span>
        </div>
      </div>

      {/* Guided 3-Step Math Solution Controls */}
      <div className="w-full flex flex-col items-center gap-1.5 shrink-0">
        {step <= 2 ? (
          <>
            <div className="text-xs sm:text-sm font-black text-amber-300 text-center">
              {steps[step].q}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {steps[step].opts.map((v) => (
                <button
                  key={v}
                  onClick={() => choose(v)}
                  className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border shadow-md ${wrong === v ? 'bg-red-950 border-red-500 text-red-300 animate-shake-x' : 'bg-[#1A1333] text-purple-100 hover:text-white hover:border-amber-400 border-purple-700/60 hover:scale-105'}`}
                >
                  {steps[step].f(v)}
                </button>
              ))}
            </div>

            {/* Smart Helpful Hint Box on Wrong Choice */}
            {wrong !== null && (
              <div className="text-xs font-bold text-rose-300 bg-rose-950/80 px-3 py-1 rounded-xl border border-rose-500/50 animate-shake-x text-center">
                💡 Hint: {steps[step].hint}
              </div>
            )}
          </>
        ) : (
          <div className="bg-emerald-950 border-2 border-emerald-500 text-emerald-300 px-4 py-1.5 rounded-2xl text-xs md:text-sm font-black shadow-glow-green flex items-center justify-between gap-2 animate-pop-in text-center w-full">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Case Solved! {nowBlocks} blocks ({paidPct}%) = {fmt(cs.now)} → 1 block (10%) = {fmt(cs.block)} → Original (100%) = <span className="underline font-bold text-white">{fmt(cs.original)}</span>
              </span>
            </div>
            <button onClick={() => switchCase(caseIdx + 1)} className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-lg text-xs font-black shrink-0 hover:bg-amber-300 cursor-pointer">
              Next Case ➜
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarModelDetective;



