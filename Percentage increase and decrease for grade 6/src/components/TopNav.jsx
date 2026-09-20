import React from 'react';
import useAppStore from '../store/useAppStore';
import { Volume2, VolumeX, Check, X } from 'lucide-react';

const STAGES = [
  { id: 'wonder', label: 'Wonder', number: '01', icon: '🐻' },
  { id: 'story', label: 'Story', number: '02', icon: '📖' },
  { id: 'simulate', label: 'Simulate', number: '03', icon: '✏️' },
  { id: 'practice', label: 'Practice', number: '04', icon: '🎮' },
  { id: 'reflect', label: 'Reflect', number: '05', icon: '📝' },
];

export const TopNav = () => {
  const { currentStage, setStage, audioEnabled, toggleAudio } = useAppStore();

  const currentIdx = STAGES.findIndex(s => s.id === currentStage);

  return (
    <header className="w-full z-50 bg-transparent flex items-center justify-between px-5 py-2.5 select-none relative">
      {/* 1. Left: Home Button Pill */}
      <button
        onClick={() => setStage('home')}
        className="btn-icon-glass cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-black text-white hover:bg-white/20 transition-all border border-white/20 shadow-md"
      >
        <span>🏠</span>
        <span>Home</span>
      </button>

      {/* 2. Center: Connected Navigation Pill Bar */}
      <nav className="flex items-center gap-1.5 bg-[#140b2f]/90 p-2 rounded-full border border-purple-400/30 shadow-2xl backdrop-blur-md">
        {STAGES.map((st, idx) => {
          const isActive = currentStage === st.id;
          const isCompleted = currentIdx > idx;

          return (
            <React.Fragment key={st.id}>
              <button
                onClick={() => setStage(st.id)}
                className={`px-3.5 py-1.5 rounded-full font-display text-xs md:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#1d1245] text-white font-black border-2 border-amber-400 shadow-[0_0_14px_rgba(250,204,21,0.7)] scale-105'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 font-bold'
                }`}
              >
                {isCompleted ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-[11px]">
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </span>
                ) : (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-black ${isActive ? 'bg-amber-400 text-slate-950' : 'bg-purple-900/60 text-amber-300'}`}>
                    {st.number}
                  </span>
                )}
                <span className="text-base">{st.icon}</span>
                <span>{st.label}</span>
              </button>

              {/* Separator dash line between pills */}
              {idx < STAGES.length - 1 && (
                <span className="text-purple-400/40 text-xs px-0.5 font-bold">—</span>
              )}
            </React.Fragment>
          );
        })}

        {/* Separator dash before Audio Pill */}
        <span className="text-purple-400/40 text-xs px-0.5 font-bold">—</span>

        {/* Audio Toggle Pill Button inside navbar */}
        <button
          onClick={toggleAudio}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-display font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all cursor-pointer"
          title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
        >
          {audioEnabled ? (
            <>
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
              <span>Audio</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 stroke-[2.5]" />
              <span>Muted</span>
            </>
          )}
        </button>
      </nav>

      {/* 3. Right: Exit '✕' Button */}
      <button
        onClick={() => setStage('home')}
        className="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-md transition-colors cursor-pointer"
        title="Exit Lesson"
      >
        <X className="w-5.5 h-5.5 stroke-[2.5]" />
      </button>
    </header>
  );
};

export default TopNav;
