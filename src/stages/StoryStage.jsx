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
      {/* 1. Top Story Progress Bar Track matching Screenshot */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-3 shrink-0 my-1 mx-auto">
        <div className="flex-1 bg-[#ffffff14] h-3 rounded-full overflow-hidden p-0.5 border border-purple-400/30 shadow-inner">
          <div
            className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 h-full rounded-full transition-all duration-300 shadow-[0_0_14px_rgba(250,204,21,0.9)]"
            style={{ width: `${((storySlideIndex + 1) / storySlides.length) * 100}%` }}
          />
        </div>
        <span className="text-base sm:text-lg font-display font-black text-amber-300 ml-3">
          {storySlideIndex + 1} / {storySlides.length}
        </span>
      </div>

      {/* 2. Centered Main Story Card (Image Left, Text Right) - Responsive Frame */}
      <div className="main-card main-card--wide max-w-6xl p-4 sm:p-5 md:p-6 lg:p-7 my-auto !flex-col sm:!flex-row flex items-center gap-4 sm:gap-6 md:gap-8 shadow-[0_24px_70px_rgba(0,0,0,0.75)] bg-[#150e33]/95 border-2 border-purple-500/40 rounded-3xl max-h-[calc(100vh-100px)] shrink min-h-0 overflow-hidden">
        
        {/* Left Column: Story Illustration Image - Responsive Scaling */}
        <div className="w-full sm:w-1/2 flex items-center justify-center shrink-0">
          <div className="relative w-full h-44 sm:h-64 md:h-72 lg:h-[320px] max-h-[40vh] rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-[#0a041c] shadow-2xl">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Slide Title, Narrative, Highlight Pill & Mascot Action Pill */}
        <div className="w-full sm:w-1/2 flex flex-col space-y-2 sm:space-y-3 md:space-y-3.5 text-left justify-center flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
          {/* Slide Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black text-amber-400 leading-tight drop-shadow-md shrink-0">
            {currentSlide.title}
          </h2>

          {/* Narrative Paragraph */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-100 leading-relaxed font-body whitespace-pre-line shrink-0">
            {currentSlide.narrative}
          </p>

          {/* Highlight Pill Box */}
          <div className="border-2 border-amber-400/60 bg-[#140b2f] rounded-full px-4 py-2 text-center text-xs sm:text-sm md:text-base lg:text-lg font-display font-black text-amber-300 shadow-[0_0_20px_rgba(250,204,21,0.35)] flex items-center justify-center gap-2 shrink-0">
            ✨ {currentSlide.keyPoint} ✨
          </div>

          {/* Mascot Circle + White Action Pill Button */}
          <div className="flex items-center gap-3 pt-0.5 shrink-0">
            <button
              onClick={handleMascotSpeak}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-[0_0_16px_rgba(250,204,21,0.5)] cursor-pointer hover:scale-105 transition-transform"
              title="Listen narration"
            >
              🦁
            </button>
            <button
              onClick={handleMascotSpeak}
              className="bg-white hover:bg-slate-100 text-slate-950 font-display font-black text-xs sm:text-sm md:text-base px-4 py-2 sm:py-2.5 rounded-full shadow-xl text-center flex-1 flex items-center justify-between gap-2 cursor-pointer transition-colors"
            >
              <span className="truncate">{currentSlide.mascotDialogue || "Let's help Oliver group his items!"}</span>
              <span className="text-base sm:text-lg shrink-0">{currentSlide.emoji || "🍎"}</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. Bottom Controls Row below Main Card */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-4 shrink-0 mx-auto my-1">
        {/* Back Button */}
        <button
          onClick={handlePrev}
          className="bg-[#ffffff14] hover:bg-white/20 border border-white/20 text-white font-display font-black text-sm sm:text-base md:text-lg px-7 py-3 rounded-full transition-all cursor-pointer shadow-md flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Dot Pagination */}
        <div className="flex items-center gap-3">
          {storySlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStorySlideIndex(idx)}
              className={`transition-all cursor-pointer ${
                storySlideIndex === idx
                  ? 'w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_14px_rgba(250,204,21,0.9)] scale-110'
                  : 'w-3 h-3 bg-purple-900/60 rounded-full hover:bg-purple-400'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next CTA Button */}
        <button
          onClick={handleNext}
          className="btn-gold text-sm sm:text-base md:text-lg px-9 py-3 cursor-pointer flex items-center gap-2"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default StoryStage;
