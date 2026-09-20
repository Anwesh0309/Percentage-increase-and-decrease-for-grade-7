import React, { useEffect } from 'react';
import useAppStore from './store/useAppStore';
import TopNav from './components/TopNav';
import HomeScreen from './stages/HomeScreen';
import WonderStage from './stages/WonderStage';
import StoryStage from './stages/StoryStage';
import SimulateStage from './stages/SimulateStage';
import PracticeStage from './stages/PracticeStage';
import ReflectStage from './stages/ReflectStage';

export function App() {
  const { currentStage, resetWorldsProgress } = useAppStore();

  useEffect(() => {
    // Reset all user progress whenever module mounts/loads
    resetWorldsProgress();
  }, []);

  const renderStage = () => {
    switch (currentStage) {
      case 'home':
        return <HomeScreen />;
      case 'wonder':
        return <WonderStage />;
      case 'story':
        return <StoryStage />;
      case 'simulate':
        return <SimulateStage />;
      case 'practice':
        return <PracticeStage />;
      case 'reflect':
        return <ReflectStage />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="app-container select-none relative overflow-hidden">
      {/* Background Oversized Watermark Numerals matching Screenshots */}
      <div className="bg-numeral top-20 left-16 text-8xl rotate-[-12deg]">100</div>
      <div className="bg-numeral top-10 right-32 text-8xl rotate-[10deg]">500</div>
      <div className="bg-numeral top-44 right-16 text-7xl rotate-[-15deg]">347</div>
      <div className="bg-numeral bottom-40 right-24 text-6xl rotate-[8deg]">123</div>
      <div className="bg-numeral bottom-12 right-12 text-9xl rotate-[-10deg]">999</div>
      <div className="bg-numeral bottom-24 left-20 text-8xl rotate-[-8deg]">200</div>
      <div className="bg-numeral top-72 left-10 text-7xl rotate-[12deg]">H</div>
      <div className="bg-numeral top-24 left-[35%] text-7xl rotate-[5deg]">T</div>

      {/* Fixed Top Navigation Bar (Hidden on Intro / Home stage) */}
      {currentStage !== 'home' && <TopNav />}

      {/* Main Viewport Active Stage View */}
      <main className={currentStage !== 'home' ? 'app-main' : 'w-full h-screen overflow-hidden z-10'}>
        {renderStage()}
      </main>
    </div>
  );
}

export default App;
