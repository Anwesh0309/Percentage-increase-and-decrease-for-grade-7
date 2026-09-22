import React, { useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import PriceTrapRig from '../components/PriceTrapRig';
import soundEngine from '../utils/audio';

export const WonderStage = () => {
  const { setStage, resetWorldsProgress } = useAppStore();

  useEffect(() => {
    soundEngine.playText('wonder_prompt');
    soundEngine.enqueue('wonder_teaser');
    return () => {
      soundEngine.stop();
    };
  }, []);

  return (
    <div className="phase-screen phase-screen--narrow py-1.5 px-3 justify-center items-center select-none relative">
      {/* Centered Main Card */}
      <div className="main-card max-w-3xl text-center flex flex-col items-center justify-between p-4 sm:p-5 md:p-6 max-h-[calc(100vh-80px)] shrink min-h-0 overflow-hidden my-auto">
        {/* Top Glow Bar Indicator */}
        <div className="card-glow-bar card-glow-bar--wonder mb-1 shrink-0" />

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white flex items-center justify-center gap-2 mb-1 shrink-0">
          <span>🔮</span>
          <span>Wonder Hook</span>
        </h1>

        {/* Centered Robot Avatar Icon */}
        <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-[#140a2c] border-2 border-purple-400/60 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_18px_rgba(192,132,252,0.4)] my-1 shrink-0">
          🤖
        </div>

        {/* Inner Card Box (Price Trap Rig) */}
        <div className="w-full bg-[#130b2c] border border-purple-500/40 rounded-2xl p-3 sm:p-4 my-2 flex flex-col items-center justify-center shadow-inner shrink min-h-0">
          <PriceTrapRig />
        </div>

        {/* Question Text Paragraph */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-100 max-w-2xl leading-relaxed my-2 font-body">
          Robo spots a game that costs <span className="text-gold font-display font-black">$100</span>. The shop raises the price by <span className="text-gold font-display font-black">20%</span>, then a sale cuts the new price by <span className="text-gold font-display font-black">20%</span>. Alex says: <span className="text-purple-200 font-bold">"Up 20% and down 20% cancel out, so the price must be back to $100."</span> Is that actually true?
        </p>

        {/* Yellow CTA Button */}
        <button
          onClick={() => setStage('story')}
          className="btn-gold text-base sm:text-lg md:text-xl px-9 py-3 my-1 flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
        >
          <span>Discover the Story →</span>
        </button>
      </div>
    </div>
  );
};

export default WonderStage;
