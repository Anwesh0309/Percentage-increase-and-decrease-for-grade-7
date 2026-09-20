import React, { useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import PercentChangeRig from '../components/PercentChangeRig';
import MultiplierMachine from '../components/MultiplierMachine';
import BarModelDetective from '../components/BarModelDetective';
import ChainLab from '../components/ChainLab';
import soundEngine from '../utils/audio';

export const SimulateStage = () => {
  const { simulateStation, setSimulateStation, setStage, resetWorldsProgress } = useAppStore();

  const stationNarrationKey = {
    A: 'station_a_intro',
    B: 'station_b_intro',
    C: 'station_c_intro',
    D: 'station_d_intro',
  };

  useEffect(() => {
    soundEngine.playText(stationNarrationKey[simulateStation]);
  }, [simulateStation]);

  const stations = [
    { id: 'A', name: 'Station 1: Percent Change', icon: '🧱' },
    { id: 'B', name: 'Station 2: Multiplier Machine', icon: '⚙️' },
    { id: 'C', name: 'Station 3: Bar Model Detective', icon: '🕵️' },
    { id: 'D', name: 'Station 4: Up & Down Lab', icon: '🎢' },
  ];

  return (
    <div className="phase-screen phase-screen--wide py-0.5 px-4 justify-center items-center select-none relative h-full">
      {/* Centered Main Card - Expanded Frame Height */}
      <div className="main-card main-card--wide max-w-6xl p-4 sm:p-5 md:p-6 my-auto text-center flex flex-col items-center h-full max-h-[calc(100vh-64px)] shrink min-h-0 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.75)] border-2 border-purple-500/40">
        {/* Top Glow Bar Indicator */}
        <div className="card-glow-bar card-glow-bar--simulate shrink-0 mb-1.5" />

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white flex items-center justify-center gap-2 mb-3 shrink-0">
          <span>🧪</span>
          <span>Simulation Stations</span>
        </h1>

        {/* Split Grid Layout */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch text-left flex-1 min-h-0 overflow-hidden">
          
          {/* Left Sidebar Pane (Station Switcher) */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-2 flex-1 min-h-0">
            <div className="space-y-2.5">
              {stations.map((st) => {
                const isActive = simulateStation === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSimulateStation(st.id)}
                    className={`w-full p-3 sm:p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer font-display text-xs sm:text-sm md:text-base ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 text-white font-black shadow-[0_0_18px_rgba(56,189,248,0.4)] scale-[1.02]'
                        : 'bg-[#130b2c]/80 border-purple-800/40 text-purple-200 hover:text-white hover:bg-purple-900/40 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-xl sm:text-2xl">{st.icon}</span>
                      <span className="truncate">{st.name}</span>
                    </div>
                    <span className="text-sm text-amber-400 shrink-0">🔓</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Left CTA */}
            <button
              onClick={() => setStage('practice')}
              className="btn-gold w-full text-xs sm:text-sm md:text-base font-black py-3.5 rounded-full flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-xl shrink-0"
            >
              <span>Go to Practice Phase! →</span>
            </button>
          </div>

          {/* Right Workspace Pane */}
          <div className="md:col-span-8 bg-[#130b2c] border-2 border-purple-800/50 rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col justify-between flex-1 min-h-0 overflow-hidden shadow-inner">
            {/* Station Header */}
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-2 mb-2 shrink-0">
              <h3 className="text-sm sm:text-base md:text-lg font-display font-black text-white">
                {stations.find(s => s.id === simulateStation)?.name}
              </h3>
              <span className="text-xs sm:text-sm font-display font-bold text-purple-300 bg-purple-900/50 px-3 py-1 rounded-full border border-purple-500/30">
                Interactive Lab
              </span>
            </div>

            {/* Workspace Active Rig */}
            <div className="w-full flex-1 flex items-center justify-center my-auto min-h-0 overflow-hidden">
              {simulateStation === 'A' && <PercentChangeRig />}
              {simulateStation === 'B' && <MultiplierMachine />}
              {simulateStation === 'C' && <BarModelDetective />}
              {simulateStation === 'D' && <ChainLab />}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SimulateStage;
