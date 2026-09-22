import React, { useEffect, useState } from 'react';
import useAppStore from '../store/useAppStore';
import soundEngine from '../utils/audio';

export const ReflectStage = () => {
  const { progress } = useAppStore();
  const [reflectionText, setReflectionText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    soundEngine.playText('reflect_intro');
    return () => {
      soundEngine.stop();
    };
  }, []);

  const handleComplete = () => {
    soundEngine.playText('world_complete');
    setIsCompleted(true);
  };

  return (
    <div className="phase-screen phase-screen--wide py-0.5 px-4 justify-center items-center select-none relative h-full">
      {/* Centered Main Card - Expanded Frame Height & Width */}
      <div className="main-card main-card--wide max-w-5xl p-5 sm:p-6 md:p-7 text-center flex flex-col items-center justify-between h-full max-h-[calc(100vh-64px)] shrink min-h-0 overflow-hidden my-auto shadow-[0_24px_70px_rgba(0,0,0,0.75)] border-2 border-purple-500/40">
        {/* Top Glow Bar Indicator */}
        <div className="card-glow-bar card-glow-bar--reflect mb-1.5 shrink-0" />

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white flex items-center justify-center gap-2 mb-2 shrink-0">
          <span className="text-3xl sm:text-4xl">🏆</span>
          <span>Reflect &amp; Scoreboard</span>
        </h1>

        {/* 3 Top Stat Cards Row */}
        <div className="grid grid-cols-3 gap-3.5 w-full mb-2 shrink-0">
          {/* Card 1: XP */}
          <div className="bg-[#ffffff0d] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-md">
            <span className="text-3xl sm:text-4xl mb-0.5">✨</span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-amber-400">
              {progress.totalCorrect * 10 || 0}
            </span>
            <span className="text-xs sm:text-sm font-display font-bold text-slate-300">Total XP</span>
          </div>

          {/* Card 2: Stars */}
          <div className="bg-[#ffffff0d] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-md">
            <span className="text-3xl sm:text-4xl mb-0.5">⭐</span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-gold">
              {progress.totalStars || 0} / 30
            </span>
            <span className="text-xs sm:text-sm font-display font-bold text-slate-300">Stars</span>
          </div>

          {/* Card 3: Best Streak */}
          <div className="bg-[#ffffff0d] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-md">
            <span className="text-3xl sm:text-4xl mb-0.5">🔥</span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-amber-400">
              {progress.totalCorrect || 0}
            </span>
            <span className="text-xs sm:text-sm font-display font-bold text-slate-300">Best Streak</span>
          </div>
        </div>

        {/* Center Header: WORLD RESULTS */}
        <h3 className="text-xs sm:text-sm font-display font-black text-amber-400 uppercase tracking-widest mb-1.5 shrink-0">
          WORLD RESULTS
        </h3>

        {/* 10 World Mini Result Boxes */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 w-full mb-2 shrink-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((wNum) => {
            const stars = progress.worldStars[wNum] || 0;
            return (
              <div
                key={wNum}
                className="bg-[#130b2c] border border-purple-800/40 rounded-xl p-2 text-center flex flex-col items-center justify-center"
              >
                <span className="text-xs font-display font-bold text-purple-300">W{wNum}</span>
                <span className="text-xs sm:text-sm font-display font-black text-amber-400 mt-0.5">
                  {stars > 0 ? `⭐${stars}` : '—'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Horizontal Divider Line */}
        <div className="w-full border-t border-purple-800/40 my-2 shrink-0" />

        {/* Bottom Reflection Input Section */}
        <div className="w-full flex items-start gap-4 text-left my-1 shrink-0">
          {/* Robot Avatar Icon */}
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#140a2c] border-2 border-purple-400/60 flex items-center justify-center text-3xl shrink-0 shadow-md">
            🤖
          </div>

          <div className="flex-1 space-y-1.5">
            <h4 className="text-base sm:text-lg md:text-xl font-display font-black text-white">
              What did you learn about percentage increase &amp; decrease? Explain it to Robo with an example!
            </h4>

            {/* Textarea Response Box - Expanded Height */}
            <div className="relative w-full">
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Dear Robo, percentage increase is when we work out the change from the original amount..."
                className="w-full bg-[#130b2c] border-2 border-purple-800/60 rounded-xl p-3.5 text-slate-100 text-xs sm:text-sm md:text-base font-body resize-none h-24 sm:h-28 md:h-30 focus:outline-none focus:border-amber-400 placeholder-slate-500"
              />
              <span className="absolute bottom-2.5 right-3.5 text-xs font-bold text-purple-400 font-display">
                {reflectionText.length} / 10 min chars
              </span>
            </div>
          </div>
        </div>

        {/* Complete Lesson CTA Button */}
        {isCompleted ? (
          <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-display font-black rounded-full px-9 py-3 my-1 text-base sm:text-lg shrink-0">
            🎉 Lesson Completed! Great Job! 🎉
          </div>
        ) : (
          <button
            onClick={handleComplete}
            disabled={reflectionText.length < 5}
            className="btn-gold text-base sm:text-lg md:text-xl px-10 py-3.5 my-1 flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
          >
            <span>Complete Lesson! 🎉</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReflectStage;
