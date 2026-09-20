import React, { useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { storySlides } from '../data/storySlides';
import soundEngine from '../utils/audio';

export const StoryStage = () => {
  const { storySlideIndex, setStorySlideIndex, setStage, resetWorldsProgress } = useAppStore();

  const currentSlide = storySlides[storySlideIndex] || storySlides[0];

  useEffect(() => {
    soundEngine.playText(`story_slide_${storySlideIndex + 1}`);
  }, [storySlideIndex]);

  const handleNext = () => {
    if (storySlideIndex < storySlides.length - 1) {
      setStorySlideIndex(storySlideIndex + 1);
    } else {
      setStage('simulate');
    }
  };

  const handlePrev = () => {
    if (storySlideIndex > 0) {
      setStorySlideIndex(storySlideIndex - 1);
    } else {
      setStage('wonder');
    }
  };

  const handleMascotSpeak = () => {
    soundEngine.playText(`story_slide_${storySlideIndex + 1}`);
  };

  return (
    <div className="phase-screen phase-screen--wide py-1 px-4 justify-between items-center select-none relative">
      {/* 1. Top Story Progress Bar Track */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-3 shrink-0 my-1 mx-auto">
        <div className="flex-1 bg-[#ffffff14] h-2.5 sm:h-3 rounded-full overflow-hidden p-0.5 border border-purple-400/30 shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 h-full rounded-full transition-all duration-300 shadow-[0_0_14px_rgba(250,204,21,0.9)]"
            style={{ width: `${((storySlideIndex + 1) / storySlides.length) * 100}%` }}
          />
        </div>
        <span className="text-sm sm:text-base font-display font-black text-amber-300 ml-2 sm:ml-3">
          {storySlideIndex + 1} / {storySlides.length}
        </span>
      </div>

      {/* 2. Centered Main Story Card (Image Left, Text Right) - Frame-Fitted Bounds */}
      <div className="main-card main-card--wide max-w-6xl p-3.5 sm:p-5 md:p-6 my-auto !flex-col sm:!flex-row flex items-center gap-3.5 sm:gap-5 md:gap-6 shadow-[0_24px_70px_rgba(0,0,0,0.75)] bg-[#150e33]/95 border-2 border-purple-500/40 rounded-3xl max-h-[calc(100vh-165px)] shrink min-h-0 overflow-hidden">
        
        {/* Left Column: Story Illustration Image - Responsive Scaling */}
        <div className="w-full sm:w-1/2 flex items-center justify-center shrink-0">
          <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-[260px] max-h-[32vh] rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-[#0a041c] shadow-2xl">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Slide Title, Narrative, Highlight Pill & Mascot Action Pill */}
        <div className="w-full sm:w-1/2 flex flex-col space-y-2 sm:space-y-3 text-left justify-center flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
          {/* Slide Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-black text-amber-400 leading-tight drop-shadow-md shrink-0">
            {currentSlide.title}
          </h2>

          {/* Narrative Paragraph */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-100 leading-relaxed font-body whitespace-pre-line shrink-0">
            {currentSlide.narrative}
          </p>

          {/* Highlight Pill Box */}
          <div className="border-2 border-amber-400/60 bg-[#140b2f] rounded-full px-3.5 py-1.5 text-center text-xs sm:text-sm md:text-base font-display font-black text-amber-300 shadow-[0_0_20px_rgba(250,204,21,0.35)] flex items-center justify-center gap-1.5 shrink-0">
            ✨ {currentSlide.keyPoint} ✨
          </div>

          {/* Mascot Circle + White Action Pill Button */}
          <div className="flex items-center gap-2.5 pt-0.5 shrink-0">
            <button
              onClick={handleMascotSpeak}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-[0_0_16px_rgba(250,204,21,0.5)] cursor-pointer hover:scale-105 transition-transform"
              title="Listen narration"
            >
              🦁
            </button>
            <button
              onClick={handleMascotSpeak}
              className="bg-white hover:bg-slate-100 text-slate-950 font-display font-black text-xs sm:text-sm px-3.5 py-1.5 sm:py-2 rounded-full shadow-xl text-center flex-1 flex items-center justify-between gap-1.5 cursor-pointer transition-colors"
            >
              <span className="truncate">{currentSlide.mascotDialogue || "Let's help Oliver group his items!"}</span>
              <span className="text-sm sm:text-base shrink-0">{currentSlide.emoji || "🍎"}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. Bottom Controls Row below Main Card */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-3 shrink-0 mx-auto my-1">
        {/* Back Button */}
        <button
          onClick={handlePrev}
          className="bg-[#ffffff14] hover:bg-white/20 border border-white/20 text-white font-display font-black text-xs sm:text-sm md:text-base px-6 py-2.5 rounded-full transition-all cursor-pointer shadow-md flex items-center gap-1.5"
        >
          ← Back
        </button>

        {/* Dot Pagination */}
        <div className="flex items-center gap-2.5">
          {storySlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStorySlideIndex(idx)}
              className={`transition-all cursor-pointer ${
                storySlideIndex === idx
                  ? 'w-3.5 h-3.5 bg-amber-400 rounded-full shadow-[0_0_14px_rgba(250,204,21,0.9)] scale-110'
                  : 'w-2.5 h-2.5 bg-purple-900/60 rounded-full hover:bg-purple-400'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next CTA Button */}
        <button
          onClick={handleNext}
          className="btn-gold text-xs sm:text-sm md:text-base px-8 py-2.5 cursor-pointer flex items-center gap-1.5"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default StoryStage;
