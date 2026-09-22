import React, { useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import soundEngine from '../utils/audio';
import { Sparkles, Search, BookOpen, Sliders, Gamepad2, Trophy, ArrowRight, X } from 'lucide-react';

export const HomeScreen = () => {
  const { setStage } = useAppStore();

  useEffect(() => {
    soundEngine.playText('home_intro');
    return () => {
      soundEngine.stop();
    };
  }, []);

  const handleMascotSpeak = () => {
    soundEngine.playText('home_intro');
  };

  return (
    <div className="relative w-full h-full max-h-screen flex flex-col items-center justify-between p-2 sm:p-4 overflow-hidden select-none">
      {/* Top Right Exit Button matching screenshot */}
      <button
        onClick={() => setStage('story')}
        className="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md transition-colors cursor-pointer absolute top-3.5 right-3.5 z-50"
        title="Exit / Continue"
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Main Centered Wrapper */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl w-full my-auto space-y-2.5 sm:space-y-3.5 pt-1 flex-1 min-h-0 justify-center">

        {/* 1. MOE Curriculum Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-sm sm:text-base md:text-lg font-display font-black text-slate-100 bg-[#ffffff14] border border-white/20 shadow-md">
          <Sparkles className="w-4.5 h-4.5 text-amber-400" />
          <span>MOE Curriculum • Grade 6</span>
        </div>

        {/* 2. Large Two-Tone Title */}
        <div className="flex flex-col items-center leading-tight">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-white drop-shadow-md tracking-tight">
            Percentage Increase
          </h1>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-amber-400 mt-0.5 drop-shadow-[0_4px_24px_rgba(250,204,21,0.6)] tracking-tight">
            &amp; Decrease!
          </h1>
        </div>

        {/* 3. Mascot Avatar + White Action Speech Pill Button */}
        <div className="flex items-center gap-3.5 justify-center pt-1">
          <button
            onClick={handleMascotSpeak}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#160b33] border-2 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_20px_rgba(250,204,21,0.5)] shrink-0 hover:scale-105 transition-transform cursor-pointer"
            title="Listen narration"
          >
            🦁
          </button>

          <button
            onClick={handleMascotSpeak}
            className="bg-white hover:bg-slate-100 text-slate-950 font-display font-black text-sm sm:text-base md:text-lg lg:text-xl px-7 py-3 rounded-full shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer transition-colors"
          >
            <span>Ready to see how prices, scores and crowds go up and down? Let's roll!</span>
            <span className="text-2xl">🎉</span>
          </button>
        </div>

        {/* 4. Sub-Description Paragraph */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-200 max-w-3xl leading-relaxed px-2 font-body">
          Discover how to measure any increase or decrease as a percentage of the ORIGINAL — plus multipliers and finding the original amount!
        </p>

        {/* 5. "YOUR LEARNING JOURNEY" Card */}
        <div className="bg-[#140b2f]/90 border-2 border-purple-500/40 rounded-2xl p-4 sm:p-5 max-w-3xl w-full text-center shadow-2xl backdrop-blur-md space-y-2.5">
          <h2 className="text-amber-400 font-display font-black text-sm sm:text-base tracking-wider uppercase">
            YOUR LEARNING JOURNEY
          </h2>

          {/* Top Row: 3 Steps (Wonder, Story, Simulate) */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
            {/* Step 1: Wonder */}
            <button
              onClick={() => setStage('wonder')}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border-2 border-purple-400 bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_14px_rgba(192,132,252,0.4)]">
                <Search className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm sm:text-base md:text-lg font-display font-black text-white group-hover:text-amber-300 transition-colors">Wonder</h3>
                <p className="text-xs sm:text-sm text-purple-200 font-bold">Spark curiosity</p>
              </div>
            </button>

            <ArrowRight className="w-4.5 h-4.5 text-purple-400/60 shrink-0" />

            {/* Step 2: Story */}
            <button
              onClick={() => setStage('story')}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_14px_rgba(251,191,36,0.4)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm sm:text-base md:text-lg font-display font-black text-white group-hover:text-amber-300 transition-colors">Story</h3>
                <p className="text-xs sm:text-sm text-purple-200 font-bold">Hear the tale</p>
              </div>
            </button>

            <ArrowRight className="w-4.5 h-4.5 text-purple-400/60 shrink-0" />

            {/* Step 3: Simulate */}
            <button
              onClick={() => setStage('simulate')}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border-2 border-sky-400 bg-cyan-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_14px_rgba(56,189,248,0.4)]">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm sm:text-base md:text-lg font-display font-black text-white group-hover:text-amber-300 transition-colors">Simulate</h3>
                <p className="text-xs sm:text-sm text-purple-200 font-bold">Explore &amp; discover</p>
              </div>
            </button>
          </div>

          {/* Bottom Row: 2 Steps Centered (Practice, Reflect) */}
          <div className="flex items-center justify-center gap-5 sm:gap-8 pt-1 flex-wrap">
            {/* Step 4: Practice */}
            <button
              onClick={() => setStage('practice')}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_14px_rgba(52,211,153,0.4)]">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm sm:text-base md:text-lg font-display font-black text-white group-hover:text-amber-300 transition-colors">Practice</h3>
                <p className="text-xs sm:text-sm text-purple-200 font-bold">Test your skills</p>
              </div>
            </button>

            <ArrowRight className="w-4.5 h-4.5 text-purple-400/60 shrink-0" />

            {/* Step 5: Reflect */}
            <button
              onClick={() => setStage('reflect')}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border-2 border-indigo-400 bg-indigo-900/40 text-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_14px_rgba(129,140,248,0.4)]">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm sm:text-base md:text-lg font-display font-black text-white group-hover:text-amber-300 transition-colors">Reflect</h3>
                <p className="text-xs sm:text-sm text-purple-200 font-bold">What did you learn?</p>
              </div>
            </button>
          </div>
        </div>

        {/* 6. Glowing Primary CTA Button */}
        <button
          onClick={() => setStage('story')}
          className="btn-gold max-w-lg w-full flex items-center justify-center gap-2.5 text-xl sm:text-2xl md:text-3xl py-3.5 rounded-full cursor-pointer shadow-[0_0_30px_rgba(250,204,21,0.7)] my-1.5"
        >
          <span>🚀 Begin Your Journey!</span>
        </button>

        {/* 7. Bottom 3 Feature Cards */}
        <div className="grid grid-cols-3 gap-3 max-w-3xl w-full">
          {/* Card 1 */}
          <div className="bg-[#ffffff0d] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-0.5 hover:bg-white/10 transition-all shadow-md">
            <span className="text-3xl sm:text-4xl">📈</span>
            <h4 className="text-sm sm:text-base md:text-lg font-display font-black text-white">3 Percent Tools</h4>
            <p className="text-xs sm:text-sm text-purple-200 font-bold">Formula, multiplier, reverse</p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#ffffff0d] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-0.5 hover:bg-white/10 transition-all shadow-md">
            <span className="text-3xl sm:text-4xl">🧩</span>
            <h4 className="text-sm sm:text-base md:text-lg font-display font-black text-white">4 Simulations</h4>
            <p className="text-xs sm:text-sm text-purple-200 font-bold">Interactive labs</p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#ffffff0d] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-0.5 hover:bg-white/10 transition-all shadow-md">
            <span className="text-3xl sm:text-4xl">🏆</span>
            <h4 className="text-sm sm:text-base md:text-lg font-display font-black text-white">10 Game Worlds</h4>
            <p className="text-xs sm:text-sm text-purple-200 font-bold">Quizzes &amp; rewards</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeScreen;

