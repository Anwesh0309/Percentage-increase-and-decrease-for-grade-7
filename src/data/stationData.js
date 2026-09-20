// Story-aligned puzzle & simulation data for the four Simulate stations.

// Station A — Percent Change Rig (Oliver's Bakery & Real-World Items)
export const rigOriginals = [
  { value: 40, label: '40 Biscuits', item: "Oliver's Bakery Biscuit Batch", unit: 'biscuits', icon: '🍪', money: false },
  { value: 50, label: '$50 Game', item: "Alex's Video Game Store Price", unit: '$', icon: '🎮', money: true },
  { value: 80, label: '$80 Jacket', item: "Detective's Trench Coat", unit: '$', icon: '🧥', money: true },
  { value: 200, label: '$200 Feast', item: "Restaurant Banquet Bill", unit: '$', icon: '🍕', money: true },
];

// Station B — Multiplier Machine (Real-World Retail & Bakery Items)
export const machinePuzzles = [
  { id: 1, icon: '🎮', item: "Alex's Video Game", story: "Game price increases from $50 to $60 (Story Slide 3)", input: 50, target: 60, direction: 'up', pct: 20 },
  { id: 2, icon: '🍪', item: "Oliver's Biscuit Tray", story: "Morning batch grows from 40 to 50 biscuits", input: 40, target: 50, direction: 'up', pct: 25, suffix: ' biscuits', money: false },
  { id: 3, icon: '🎒', item: "Backpack Clearance", story: "School bag drops from $80 to $60 during sale", input: 80, target: 60, direction: 'down', pct: 25 },
  { id: 4, icon: '👟', item: "Detective's Sneakers", story: "Sneakers cut from $120 to $96 in -20% sale (Story Slide 5)", input: 120, target: 96, direction: 'down', pct: 20 },
  { id: 5, icon: '🍕', item: "Cafe Party Dinner", story: "Food bill rises from $200 to $250 with tax & tip", input: 200, target: 250, direction: 'up', pct: 25 },
  { id: 6, icon: '🎧', item: "Audio Headphones", story: "Wireless headset drops from $90 to $63 on promo", input: 90, target: 63, direction: 'down', pct: 30 },
];

// Station C — Bar Model Detective (Reverse Percentages with 10% Unit Blocks)
export const detectiveCases = [
  { id: 1, story: "A detective's jacket costs $80 after a 20% sale discount (Story Slide 4).", item: 'Detective Jacket 🧥', change: -20, now: 80, block: 10, original: 100 },
  { id: 2, story: "Oliver's bakery delivery cargo bike costs $140 after a 30% winter discount.", item: 'Bakery Cargo Bike 🚲', change: -30, now: 140, block: 20, original: 200 },
  { id: 3, story: "A game arcade console costs $90 after a 40% clearance discount.", item: 'Arcade Console 🎮', change: -40, now: 90, block: 15, original: 150 },
  { id: 4, story: "A cafe dinner bill total is $132 including a 10% sales tax (Story Slide 7).", item: 'Cafe Feast Bill 🍕', change: 10, now: 132, block: 12, original: 120 },
  { id: 5, story: "Oliver's daily biscuit production reached 150 trays after a 50% weekend surge.", item: 'Bakery Trays 🍪', change: 50, now: 150, block: 10, original: 100, suffix: ' trays', money: false },
];

// Station D — Up & Down Lab (Chained Percentage Changes & Traps)
export const chainScenarios = [
  { id: 'game', icon: '🎮', name: "Alex's Game Price", start: 100, unit: '$', suffix: '', desc: '+20% price hike then -20% sale trap (Story Slide 5)' },
  { id: 'bakery', icon: '🍪', name: "Oliver's Flour Supply", start: 200, unit: '', suffix: ' kg', desc: '+25% stock delivery then -20% baking usage' },
  { id: 'jacket', icon: '🧥', name: "Detective's Coat", start: 80, unit: '$', suffix: '', desc: '+25% import tariff then -20% member coupon' },
  { id: 'cafe', icon: '🍕', name: "Cafe Meal Receipt", start: 40, unit: '$', suffix: '', desc: '+10% sales tax then +15% gratuity tip' },
];

export const chainChallenges = [
  { id: 1, step1: 25, answer: 20, note: '+25% (×1.25) requires −20% (÷1.25 = ×0.80) to return to 100%!' },
  { id: 2, step1: 100, answer: 50, note: '+100% (doubled to 200%) requires −50% (halved) to return to 100%!' },
  { id: 3, step1: 300, answer: 75, note: '+300% (quadrupled to 400%) requires −75% (÷4) to return to 100%!' },
];

export const stationTips = {
  A: "Oliver's Rule: Change = New − Original. % Change = (Change ÷ Original) × 100!",
  B: 'Multiplier Rule: Multiplier = 1 ± (Rate ÷ 100). New = Original × Multiplier!',
  C: 'Detective Rule: Divide final price by remaining % to find 1% or 10%, then ×100 for Original!',
  D: 'Real World Trap: +20% then −20% = ×1.20 × 0.80 = ×0.96 (a net 4% loss, NOT back to 0%)!',
};

