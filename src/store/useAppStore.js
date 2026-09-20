import { create } from 'zustand';
import { buildWorldSession } from '../data/questionBank';
import { soundEngine } from '../utils/audio';

const STORAGE_KEY = 'percentage_increase_decrease_progress_v1';

// Always reset progress whenever user enters the module
function getFreshInitialProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return {
    unlockedWorlds: [1],
    worldStars: {},
    totalXP: 0,
    totalStars: 0,
    totalCorrect: 0,
    badges: [],
  };
}

export const useAppStore = create((set, get) => ({
  // Stage & Sub-Navigation State
  currentStage: 'story',
  storySlideIndex: 0,
  simulateStation: 'A',
  activeWorldId: null,
  audioEnabled: true,

  // Saved Progress (Fresh state on entry)
  progress: getFreshInitialProgress(),

  // Current World Quiz Session State
  session: {
    questions: [],
    currentIndex: 0,
    hearts: 3,
    xp: 0,
    streak: 0,
    correct: 0,
    hintUsed: false,
    outOfHearts: false,
    completed: false,
    starsEarned: 0,
  },

  // Actions
  setStage: (stage) => {
    soundEngine.stop();
    if (stage === 'home') {
      get().resetWorldsProgress();
    } else {
      set({ currentStage: stage });
    }
  },

  setStorySlideIndex: (idx) => {
    set({ storySlideIndex: idx });
  },

  setSimulateStation: (station) => {
    soundEngine.stop();
    set({ simulateStation: station });
  },

  toggleAudio: () => {
    const nextState = !get().audioEnabled;
    soundEngine.setAudioEnabled(nextState);
    set({ audioEnabled: nextState });
  },

  startWorldSession: (worldId) => {
    soundEngine.stop();
    const questions = buildWorldSession(worldId, 10);
    set({
      activeWorldId: worldId,
      session: {
        questions,
        currentIndex: 0,
        hearts: 3,
        xp: 0,
        streak: 0,
        correct: 0,
        hintUsed: false,
        outOfHearts: false,
        completed: false,
        starsEarned: 0,
      }
    });
  },

  exitWorld: () => {
    soundEngine.stop();
    set({
      activeWorldId: null,
      session: {
        questions: [],
        currentIndex: 0,
        hearts: 3,
        xp: 0,
        streak: 0,
        correct: 0,
        hintUsed: false,
        outOfHearts: false,
        completed: false,
        starsEarned: 0,
      }
    });
  },

  answerQuestion: (selectedOption) => {
    const { session, activeWorldId, progress } = get();
    if (session.completed || session.outOfHearts) return;

    const currentQ = session.questions[session.currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      const nextStreak = session.streak + 1;
      const baseXP = 50 + (activeWorldId * 10);
      const streakBonus = Math.min(nextStreak * 10, 50);
      const totalQuestionXP = baseXP + streakBonus;

      const updatedSession = {
        ...session,
        xp: session.xp + totalQuestionXP,
        streak: nextStreak,
        correct: (session.correct || 0) + 1,
      };

      set({ session: updatedSession });
      return { isCorrect: true };
    } else {
      const nextHearts = session.hearts - 1;
      const isOutOfHearts = nextHearts <= 0;

      const updatedSession = {
        ...session,
        hearts: nextHearts,
        streak: 0,
        outOfHearts: isOutOfHearts,
      };

      set({ session: updatedSession });
      return { isCorrect: false, isOutOfHearts };
    }
  },

  advanceQuestion: () => {
    const { session, activeWorldId, progress } = get();
    if (session.completed || session.outOfHearts) return;

    const nextIndex = session.currentIndex + 1;
    const isWorldFinished = nextIndex >= session.questions.length;

    let starsEarned = 0;
    if (isWorldFinished) {
      if (session.hearts === 3) starsEarned = 3;
      else if (session.hearts === 2) starsEarned = 2;
      else starsEarned = 1;
    }

    const updatedSession = {
      ...session,
      currentIndex: nextIndex,
      hintUsed: false,
      completed: isWorldFinished,
      starsEarned,
    };

    let updatedProgress = { ...progress };

    if (isWorldFinished) {
      const nextWorldId = activeWorldId + 1;
      const unlockedWorlds = new Set([...progress.unlockedWorlds]);
      if (nextWorldId <= 10) {
        unlockedWorlds.add(nextWorldId);
      }

      const prevStars = progress.worldStars[activeWorldId] || 0;
      const newStarsMap = {
        ...progress.worldStars,
        [activeWorldId]: Math.max(prevStars, starsEarned)
      };

      const totalStars = Object.values(newStarsMap).reduce((a, b) => a + b, 0);

      // Check badges
      const badges = new Set([...progress.badges]);
      if (starsEarned === 3) badges.add('Perfect World');
      if (totalStars >= 10) badges.add('100% Master');
      if (activeWorldId >= 4) badges.add('Sale Star');
      if (activeWorldId >= 7) badges.add('Detective Badge');

      updatedProgress = {
        ...progress,
        unlockedWorlds: Array.from(unlockedWorlds),
        worldStars: newStarsMap,
        totalXP: progress.totalXP + updatedSession.xp,
        totalCorrect: (progress.totalCorrect || 0) + (updatedSession.correct || 0),
        totalStars,
        badges: Array.from(badges),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
      } catch (e) {}
    }

    set({ session: updatedSession, progress: updatedProgress });
  },

  useHint: () => {
    set((state) => ({
      session: { ...state.session, hintUsed: true }
    }));
  },

  resetWorldsProgress: () => {
    const defaultProgress = getFreshInitialProgress();
    set({
      progress: defaultProgress,
      currentStage: 'home',
      storySlideIndex: 0,
      simulateStation: 'A',
      activeWorldId: null,
      session: {
        questions: [],
        currentIndex: 0,
        hearts: 3,
        xp: 0,
        streak: 0,
        correct: 0,
        hintUsed: false,
        outOfHearts: false,
        completed: false,
        starsEarned: 0,
      }
    });
  }
}));

export default useAppStore;
