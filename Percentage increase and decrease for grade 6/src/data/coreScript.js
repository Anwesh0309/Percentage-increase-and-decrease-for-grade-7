// Core narration script (source of truth for scripts/generate_audio.js).
// Rule: audio is generated ONLY for paragraph text and questions — never titles or headings.
// Each entry: { key, text, style }  — text may contain digits/symbols; the generator spells them out.

import { storySlides } from './storySlides.js';
import { reflectTopics } from './reflectTopics.js';

export const coreScript = [
  // Intro & Wonder
  { key: 'home_intro', style: 'emphasis',
    text: "Welcome to Percentage Increase and Decrease! Ready to see how prices, scores, and crowds go up and down? Let's roll!" },
  { key: 'wonder_prompt', style: 'statement',
    text: 'Robo spots a game that costs $100. The shop raises the price by 20%, then a sale cuts the new price by 20%. Alex says: "Up 20% and down 20% cancel out, so the price must be back to $100." Is that actually true? Remember, every percentage change is worked out from the amount you START with!' },
  { key: 'wonder_teaser', style: 'question',
    text: 'What if the sale came first and the price rise second? Would the answer change?' },

  // Story — 4 slides (paragraph only, never the slide title)
  ...storySlides.map((s) => ({ key: `story_slide_${s.id}`, style: 'statement', text: s.narrative })),

  // Simulate stations
  { key: 'station_a_intro', style: 'instruction',
    text: 'Welcome to the Percent Change Lab! Drag the knob on the new bar to make it bigger or smaller. Watch the change, the percent change, and the multiplier update live!' },
  { key: 'station_b_intro', style: 'instruction',
    text: 'Station B: The Multiplier Machine! Choose increase or decrease, turn the dial to a percent, and press Run. Can you make the machine turn the starting amount into the target amount?' },
  { key: 'station_c_intro', style: 'instruction',
    text: 'Station C: The Bar Model Detective! Each block is 10%. Count the blocks, find what one block is worth, and work backwards to find the original amount.' },
  { key: 'station_d_intro', style: 'instruction',
    text: 'Station D: The Up and Down Lab! Chain two percent changes together and see the final amount. Then try to get exactly back to where you started!' },
  { key: 'machine_match', style: 'celebration',
    text: "It's a match! The machine turned the starting amount into the target. You found the percent change!" },
  { key: 'machine_miss', style: 'encouragement',
    text: 'Not quite yet. Look at the change between the start and the target, then adjust the dial and run again!' },
  { key: 'case_solved', style: 'celebration',
    text: 'Case solved! Great detective work. You found the original amount!' },
  { key: 'back_to_start', style: 'celebration',
    text: 'Exactly back to the start! You found the decrease that undoes the increase!' },

  // Practice & session
  { key: 'practice_welcome', style: 'encouragement',
    text: 'Choose your world on the map! Beat each world to unlock the next. Earn stars and XP!' },
  { key: 'correct_cheer', style: 'celebration',
    text: 'Awesome job! You got it right!' },
  { key: 'incorrect_try_again', style: 'encouragement',
    text: 'Not quite. Remember, a percentage change is always worked out from the original amount!' },
  { key: 'out_of_hearts', style: 'encouragement',
    text: "Oh no! Out of hearts! Don't worry, try again to master this world!" },
  { key: 'world_complete', style: 'celebration',
    text: 'Congratulations! You completed the world and earned new stars!' },

  // Reflect
  { key: 'reflect_intro', style: 'celebration',
    text: "Your Performance! Amazing work! Let's reflect on what you learned." },
  ...reflectTopics.flatMap((t) => ([
    { key: `reflect_q${t.id}`, style: 'question', text: t.question },
    { key: `reflect_a${t.id}`, style: 'statement', text: t.answer },
  ])),
];

export default coreScript;
