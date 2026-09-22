import React, { useEffect, useState } from 'react';
import useAppStore from '../store/useAppStore';
import PercentDiagramSVG from '../components/PercentDiagramSVG';
import { worldsData } from '../data/worlds';
import soundEngine from '../utils/audio';
import { Heart, Flame, Star, RotateCcw, LogOut, ArrowLeft, Lightbulb } from 'lucide-react';

export const PracticeStage = () => {
  const {
    activeWorldId,
    startWorldSession,
    exitWorld,
    session,
    answerQuestion,
    advanceQuestion,
    useHint: triggerHint,
    progress,
  } = useAppStore();

  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!activeWorldId) {
      soundEngine.playText('practice_welcome');
    }
    return () => {
      soundEngine.stop();
    };
  }, [activeWorldId]);

  const currentQ = session.questions ? session.questions[session.currentIndex] : null;
  const activeWorld = worldsData.find(w => w.id === activeWorldId);

  // Trigger question prompt audio
  useEffect(() => {
    if (activeWorldId && currentQ && !session.outOfHearts && !session.completed) {
      soundEngine.playText(`w${activeWorldId}_q${session.currentIndex + 1}_prompt`);
    }
    return () => {
      soundEngine.stop();
    };
  }, [activeWorldId, session.currentIndex]);

  const handleHintClick = () => {
    if (!currentQ || session.completed || session.outOfHearts) return;
    triggerHint();
    soundEngine.playText(`w${activeWorldId}_q${session.currentIndex + 1}_hint`);
  };

  const handleStartWorld = (worldId) => {
    setSelectedOption(null);
    setFeedback(null);
    startWorldSession(worldId);
  };

  const handleExitWorld = () => {
    setSelectedOption(null);
    setFeedback(null);
    exitWorld();
  };

  const handleOptionClick = (optionVal) => {
    if (feedback || session.completed || session.outOfHearts) return;

    setSelectedOption(optionVal);
    const result = answerQuestion(optionVal);

    if (result.isCorrect) {
      soundEngine.playText('correct_cheer');
      setFeedback({ isCorrect: true, explanation: currentQ.explanation });
    } else {
      soundEngine.playText('incorrect_try_again');
      setFeedback({ isCorrect: false, explanation: currentQ.explanation });
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setFeedback(null);
    advanceQuestion();
  };

  // Auto-switch to next question after 1.2s (1 sec visible display time for student)
  useEffect(() => {
    if (feedback && !session.completed && !session.outOfHearts) {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [feedback, session.completed, session.outOfHearts]);

  // Rule title mapping for the yellow pill badge floating over the inner card
  const getRuleTitle = () => {
    if (!activeWorld) return '✦ PERCENTAGE RULE';
    switch (activeWorldId) {
      case 1: return '✦ CHANGE FAMILY RULE';
      case 2: return '✦ PERCENT OF A NUMBER RULE';
      case 3: return '✦ PERCENTAGE INCREASE RULE';
      case 4: return '✦ PERCENTAGE DECREASE RULE';
      case 5: return '✦ PERCENT CHANGE FORMULA RULE';
      case 6: return '✦ MULTIPLIER MAGIC RULE';
      case 7: return '✦ UP THEN DOWN TRAP RULE';
      case 8: return '✦ REVERSE DETECTIVE RULE';
      case 9: return '✦ WORD PROBLEM RULE';
      case 10: return '✦ SINGAPORE EXAM RULE';
      default: return '✦ PERCENTAGE RULE';
    }
  };

  // Translucent background math numbers floating in background exactly as in screenshot
  const bgNumbers = [
    { text: '100', style: 'top-12 left-10 -rotate-12 text-6xl sm:text-7xl md:text-8xl' },
    { text: '180°', style: 'top-1/3 left-6 -rotate-12 text-6xl sm:text-8xl md:text-9xl' },
    { text: '200', style: 'bottom-20 left-16 -rotate-6 text-6xl sm:text-8xl md:text-9xl' },
    { text: '90°', style: 'bottom-16 left-1/3 rotate-12 text-6xl sm:text-7xl md:text-8xl' },
    { text: '500', style: 'top-8 right-16 rotate-12 text-6xl sm:text-8xl md:text-9xl' },
    { text: '347', style: 'top-1/3 right-12 rotate-12 text-6xl sm:text-8xl md:text-9xl' },
    { text: '123', style: 'bottom-1/3 right-8 -rotate-12 text-5xl sm:text-7xl md:text-8xl' },
    { text: '999', style: 'bottom-12 right-20 rotate-12 text-6xl sm:text-8xl md:text-9xl' },
  ];

  // World Icons for 10 worlds
  const worldIcons = ['🍎', '⭐', '🧸', '🐶', '✏️', '🚀', '🧺', '🔢', '🌈', '🏰'];

  // 1. World Selector List Screen
  if (!activeWorldId) {
    return (
      <div className="phase-screen phase-screen--wide py-2 px-4 justify-center items-center select-none relative overflow-hidden">
        {/* Floating Translucent Background Numbers */}
        {bgNumbers.map((num, i) => (
          <span key={i} className={`absolute font-display font-black text-purple-900/15 select-none pointer-events-none ${num.style}`}>
            {num.text}
          </span>
        ))}

        {/* Header Title & Subtitle */}
        <div className="flex flex-col items-center text-center space-y-1.5 shrink-0 my-1 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white flex items-center justify-center gap-2.5">
            <span>🎮</span>
            <span>Practice — Choose Your World!</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-bold text-purple-200 font-body">
            Answer questions in each world. Earn stars and XP!
          </p>
        </div>

        {/* 2x5 Grid of World Cards */}
        <div className="my-auto w-full max-w-6xl grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4 p-2 mx-auto max-h-[calc(100vh-120px)] shrink min-h-0 overflow-hidden z-10">
          {worldsData.map((world, idx) => {
            const isUnlocked = progress.unlockedWorlds.includes(world.id);
            const icon = worldIcons[idx] || '⭐';

            return (
              <div
                key={world.id}
                className={`rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-between text-center transition-all relative ${
                  isUnlocked
                    ? 'bg-[#ffffff18] border-2 border-purple-300 shadow-[0_0_24px_rgba(192,132,252,0.4)] scale-105 hover:border-amber-400'
                    : 'bg-[#ffffff08] border border-white/10 opacity-60'
                }`}
              >
                {!isUnlocked && (
                  <span className="absolute top-2.5 right-2.5 text-sm text-purple-300/80">🔒</span>
                )}

                <span className="text-4xl sm:text-5xl md:text-6xl my-1.5">{icon}</span>

                <div className="my-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-display font-black text-white leading-tight">{world.title}</h3>
                  <p className="text-xs sm:text-sm font-bold text-purple-200 font-body mt-0.5">Questions {idx * 10 + 1}–{(idx + 1) * 10}</p>
                </div>

                {isUnlocked ? (
                  <button
                    onClick={() => handleStartWorld(world.id)}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-display font-black text-xs sm:text-sm md:text-base px-5 py-2 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer mt-1.5"
                  >
                    ▶ PRACTICE
                  </button>
                ) : (
                  <div className="h-7" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Out of Hearts Screen
  if (session.outOfHearts) {
    return (
      <div className="phase-screen phase-screen--narrow py-4 px-4 justify-center items-center text-center select-none relative overflow-hidden">
        {bgNumbers.map((num, i) => (
          <span key={i} className={`absolute font-display font-black text-purple-900/15 select-none pointer-events-none ${num.style}`}>
            {num.text}
          </span>
        ))}
        <div className="main-card max-w-xl p-8 space-y-4 z-10">
          <span className="text-7xl animate-bounce">🥺</span>
          <h2 className="text-4xl font-display font-black text-rose-500">Out of Hearts!</h2>
          <p className="text-lg md:text-xl font-bold text-purple-200 font-body">
            Robo says: "No worries! Let's practice some more. Try again to master this world!"
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <button onClick={() => handleStartWorld(activeWorldId)} className="btn-gold text-base sm:text-lg px-7 py-3 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" /> Retry
            </button>
            <button onClick={handleExitWorld} className="px-7 py-3 rounded-full bg-white/10 text-white text-base sm:text-lg font-bold border border-white/20">
              <LogOut className="w-5 h-5" /> Quit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. World Complete Screen
  if (session.completed) {
    return (
      <div className="phase-screen phase-screen--narrow py-4 px-4 justify-center items-center text-center select-none relative overflow-hidden">
        {bgNumbers.map((num, i) => (
          <span key={i} className={`absolute font-display font-black text-purple-900/15 select-none pointer-events-none ${num.style}`}>
            {num.text}
          </span>
        ))}
        <div className="main-card max-w-xl p-8 space-y-4 border-emerald-500/60 shadow-[0_0_30px_rgba(52,211,153,0.4)] z-10">
          <span className="text-7xl animate-bounce">🏆</span>
          <h2 className="text-4xl font-display font-black text-white">World Cleared!</h2>
          <div className="text-xl md:text-2xl font-display font-black text-emerald-300">+100 XP Earned ⭐</div>
          <div className="flex items-center justify-center gap-4 pt-2">
            {activeWorldId < 10 && (
              <button onClick={() => handleStartWorld(activeWorldId + 1)} className="btn-gold text-base sm:text-lg px-7 py-3">
                Next World 🚀
              </button>
            )}
            <button onClick={handleExitWorld} className="px-7 py-3 rounded-full bg-white/10 text-white text-base sm:text-lg font-bold border border-white/20">
              World Map 🗺️
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const currentNum = session.currentIndex + 1;
  const totalNum = 10;
  const pctProgress = Math.round((session.currentIndex / totalNum) * 100);

  // 4. Per-Question Quiz Play View — Exact match to screenshot!
  return (
    <div className="phase-screen phase-screen--wide py-1 px-4 flex flex-col justify-between items-center select-none relative overflow-hidden">
      {/* Floating Translucent Background Numbers */}
      {bgNumbers.map((num, i) => (
        <span key={i} className={`absolute font-display font-black text-purple-900/20 select-none pointer-events-none ${num.style}`}>
          {num.text}
        </span>
      ))}

      {/* Main Quiz Column (Expanded Max Width 3XL) */}
      <div className="w-full max-w-3xl flex flex-col items-center z-10 my-auto max-h-[calc(100vh-65px)] shrink min-h-0 overflow-y-auto custom-scrollbar p-1">
        {/* Top Header Row: Exit Worlds Button & Title Pill Badge */}
        <div className="w-full flex items-center justify-between mb-2 relative shrink-0">
          <button
            onClick={handleExitWorld}
            className="bg-[#1a1038] hover:bg-[#25184f] text-purple-200 hover:text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-black border border-purple-800/50 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Worlds</span>
          </button>

          {/* Centered Pink Glowing Title Pill */}
          <div className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white px-5 sm:px-8 py-1.5 sm:py-2 rounded-full font-display font-black text-sm sm:text-base md:text-lg shadow-[0_0_24px_rgba(244,63,94,0.7)] flex items-center gap-2 border border-pink-300/40 whitespace-nowrap">
            <span className="text-amber-300">⭐</span>
            <span>{activeWorld ? activeWorld.title.replace(/^World \d+:\s*/, '') : 'Ramp Rally'}</span>
          </div>

          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* Stats Row & Progress Bar Bar */}
        <div className="w-full flex flex-col gap-1 mb-1.5 shrink-0">
          <div className="flex items-center justify-between px-1">
            {/* XP Pill */}
            <div className="bg-[#1a103c] border border-purple-800/60 px-3.5 sm:px-4 py-1 rounded-full text-xs sm:text-sm md:text-base font-black text-amber-400 flex items-center gap-1.5 sm:gap-2 shadow-sm">
              <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-amber-400 text-amber-400" />
              <span>{session.xp} XP</span>
            </div>

            {/* Lives / Hearts */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[1, 2, 3].map((h) => (
                <Heart key={h} className={`w-6 h-6 sm:w-7 sm:h-7 transition-all ${h <= session.hearts ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.7)]' : 'text-purple-950 fill-purple-950/40'}`} />
              ))}
            </div>

            {/* Streak Pill */}
            <div className="bg-[#1a103c] border border-purple-800/60 px-3.5 sm:px-4 py-1 rounded-full text-xs sm:text-sm md:text-base font-black text-amber-400 flex items-center gap-1.5 sm:gap-2 shadow-sm">
              <Flame className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-amber-400 text-amber-400" />
              <span>{session.streak}x Streak</span>
            </div>
          </div>

          {/* Progress Bar Label & Bar */}
          <div className="w-full flex flex-col gap-0.5 sm:gap-1">
            <div className="flex justify-between items-center text-xs sm:text-sm md:text-base font-black text-purple-200 px-1 font-display">
              <span>Question {currentNum}/{totalNum}</span>
              <span>{pctProgress}%</span>
            </div>
            <div className="w-full bg-[#180e38] h-2.5 sm:h-3 rounded-full overflow-hidden border border-purple-900/60 p-0.5">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                style={{ width: `${Math.max(5, (currentNum / totalNum) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Outer Card Container */}
        <div className="bg-[#130b2e] border border-purple-800/60 rounded-[28px] sm:rounded-[32px] p-3 sm:p-4 md:p-5 w-full relative shadow-[0_0_50px_rgba(0,0,0,0.85)] mt-2.5 flex flex-col items-center shrink min-h-0">
          {/* Floating Yellow Rule Badge */}
          <div className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-display font-black text-xs sm:text-sm md:text-base px-5 sm:px-7 py-1 rounded-full border-2 border-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.65)] uppercase tracking-wider flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <span>{getRuleTitle()}</span>
          </div>

          {/* Inner Question Box (Dark Violet with Cyan Glowing Border) */}
          <div className="bg-[#0c061e] border-2 border-cyan-500/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 w-full text-center flex flex-col items-center justify-center relative mt-1.5 sm:mt-2 shadow-inner shrink min-h-0">
            {currentQ.diagram && (
              <div className="w-44 h-44 sm:w-60 sm:h-60 md:w-68 md:h-68 max-h-[28vh] max-w-[28vh] rounded-2xl bg-[#130b2c] border-2 border-purple-400/40 p-2.5 flex items-center justify-center mb-2.5 shadow-inner shrink-0">
                <PercentDiagramSVG diagram={currentQ.diagram} />
              </div>
            )}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-black text-white leading-relaxed max-w-2xl">
              {currentQ.prompt}
            </h2>

            {/* Hint Button & Hint Box */}
            <div className="mt-2.5 w-full flex flex-col items-center justify-center shrink-0">
              {!session.hintUsed ? (
                <button
                  onClick={handleHintClick}
                  className="bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-display font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-105"
                  title="Listen & view hint"
                >
                  <Lightbulb className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>💡 Get Hint</span>
                </button>
              ) : (
                <div className="bg-[#1c123d] border-2 border-amber-400/70 rounded-xl p-2.5 sm:p-3 text-amber-200 text-xs sm:text-sm md:text-base font-bold font-body text-center shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center justify-center gap-2 max-w-xl">
                  <span className="text-amber-400 text-base sm:text-lg shrink-0">💡</span>
                  <span>{currentQ.hint}</span>
                </div>
              )}
            </div>
          </div>

          {/* 2x2 Option Buttons Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3.5 w-full mt-2.5 sm:mt-3 shrink-0">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let btnStyle = "bg-[#170c38] hover:bg-[#20124d] border-2 border-purple-800/60 hover:border-cyan-400/80 text-white shadow-purple-950/50";
              if (feedback) {
                if (opt === currentQ.correctAnswer) {
                  btnStyle = "bg-emerald-950 border-emerald-400 text-emerald-300 font-black shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-[1.02]";
                } else if (isSelected && !feedback.isCorrect) {
                  btnStyle = "bg-rose-950/80 border-rose-500 text-rose-300 opacity-70";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(opt)}
                  disabled={!!feedback}
                  className={`py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-2xl border-2 font-display text-base sm:text-lg md:text-xl lg:text-2xl font-black transition-all flex items-center justify-center cursor-pointer shadow-md ${btnStyle}`}
                >
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Centered Modal Popup for Correct / Incorrect Answers - Exact match to user screenshots! */}
      {feedback && (
        <div 
          onClick={handleNextQuestion}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer select-none"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className={`max-w-md w-full rounded-[36px] p-7 sm:p-9 text-center text-white shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center animate-pop-in border-4 border-white/25 transition-all ${
              feedback.isCorrect ? 'bg-[#3bb54a]' : 'bg-[#e24444]'
            }`}
          >
            {/* Top Icon Badge */}
            <div className="text-6xl sm:text-7xl mb-3 shrink-0 drop-shadow-md animate-bounce">
              {feedback.isCorrect ? '🎉' : '🥺'}
            </div>

            {/* Title Header */}
            <h3 className="text-3xl sm:text-4xl font-display font-black text-white mb-2 tracking-wide drop-shadow-sm flex items-center justify-center gap-2">
              {feedback.isCorrect ? (
                <>
                  <span>Correct!</span>
                  <span>🎉</span>
                </>
              ) : (
                <span>Not quite!</span>
              )}
            </h3>

            {/* Explanation / Narrative text */}
            <p className="text-base sm:text-lg font-bold font-body text-white/95 leading-relaxed max-w-xs sm:max-w-sm mt-1.5">
              {feedback.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeStage;

