// Reflect stage topics — shared by ReflectStage.jsx (on-screen) and scripts/generate_audio.js (audio)
// so that the on-screen text and the narration are always word-for-word identical.

export const reflectTopics = [
  {
    id: 1,
    title: 'Topic 1 🔑',
    question: 'How do you find a percentage increase or decrease?',
    answer: 'Subtract to find the change, divide the change by the ORIGINAL amount, then multiply by 100. That is (Change ÷ Original) × 100!',
  },
  {
    id: 2,
    title: 'Topic 2',
    question: 'What is the golden rule about the base of a percentage change?',
    answer: 'A percentage change is always measured from the original amount, the amount you started with!',
  },
  {
    id: 3,
    title: 'Topic 3',
    question: 'How can a multiplier help you find a new amount quickly?',
    answer: 'For an increase, multiply by 1 plus the percent. For a decrease, multiply by 1 minus the percent. So +20% is ×1.2 and −20% is ×0.8!',
  },
  {
    id: 4,
    title: 'Topic 4',
    question: 'Why does +20% followed by −20% not bring you back to the start?',
    answer: 'The 20% decrease is taken from the bigger, new amount, so it takes off more than the increase added. 100 × 1.2 × 0.8 = 96!',
  },
  {
    id: 5,
    title: 'Topic 5',
    question: 'How do you find the original amount when you know the new amount and the percent change?',
    answer: 'Divide the new amount by the multiplier. If a 25% increase gives $100, the original is 100 ÷ 1.25 = $80!',
  },
  {
    id: 6,
    title: 'Topic 6',
    question: 'Where can you see percentage increase and decrease in real life?',
    answer: 'Sale discounts, population growth, savings and interest, phone battery levels, and price rises!',
  },
];

export default reflectTopics;
