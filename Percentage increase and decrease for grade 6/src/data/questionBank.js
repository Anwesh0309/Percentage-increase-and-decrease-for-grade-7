// 100 Deterministic Practice Questions across 10 Worlds (10 Questions per World)
// Topic: Percentage Increase & Decrease (Grade 6)
// Every answer is computed from the numbers in the question, so the bank stays correct.

const fmtNum = (n) => Number(n).toLocaleString('en-US');
const $ = (n) => `$${fmtNum(n)}`;
const pc = (n) => `${fmtNum(n)}%`;
const unit = (u) => (n) => `${fmtNum(n)} ${u}`;
const plain = (n) => fmtNum(n);
const times = (n) => `×${n}`;

// Build 4 options: correct + first 3 unique wrong candidates; rotate so the
// correct answer lands in a different position from question to question.
function buildOptions(correct, candidates, rotateBy) {
  const seen = new Set([String(correct)]);
  const wrongs = [];
  for (const c of candidates) {
    if (c === null || c === undefined) continue;
    const s = String(c);
    if (seen.has(s)) continue;
    seen.add(s);
    wrongs.push(c);
    if (wrongs.length === 3) break;
  }
  if (wrongs.length < 3) {
    throw new Error(`Not enough distinct options for correct answer ${correct}`);
  }
  const arr = [correct, ...wrongs];
  const k = ((rotateBy % 4) + 4) % 4;
  return k === 0 ? arr : arr.slice(-k).concat(arr.slice(0, -k));
}

const validNums = (list) =>
  list.filter((n) => Number.isFinite(n) && Number.isInteger(n) && n > 0);

function make(worldId, idx, difficulty, fact, prompt, diagram, correctVal, wrongVals, f, hint, explanation) {
  const correct = typeof correctVal === 'string' ? correctVal : f(correctVal);
  const candidates = wrongVals.map((w) => (typeof w === 'string' ? w : Number.isFinite(w) && Number.isInteger(w) && w > 0 ? f(w) : null));
  return {
    id: `w${worldId}_q${idx + 1}`,
    worldId,
    difficulty,
    fact,
    prompt,
    diagram,
    options: buildOptions(correct, candidates, worldId + idx),
    correctAnswer: correct,
    hint,
    explanation,
  };
}

/* ------------------------------------------------------------------ */
/* WORLD 1 — Meet the Change Family (change = new − original)          */
/* ------------------------------------------------------------------ */
const world1 = (() => {
  const W = 1, D = 'Easy', F = 'change_amount';
  const q = [];
  q.push(make(W, 0, D, F,
    'A video game costs $50. After a price rise it costs $60. What is the increase in price?',
    { type: 'bars', unit: '$', original: 50, newVal: 60, hide: 'change' },
    10, [110, 60, 50, 5], $,
    'Increase = New price − Original price. Subtract 60 − 50.',
    'Increase = $60 − $50 = $10.'));
  q.push(make(W, 1, D, F,
    'A shirt was $80. In a sale it costs $72. What is the decrease in price?',
    { type: 'bars', unit: '$', original: 80, newVal: 72, hide: 'change' },
    8, [152, 72, 88, 12], $,
    'Decrease = Original price − New price. Subtract 80 − 72.',
    'Decrease = $80 − $72 = $8.'));
  q.push(make(W, 2, D, F,
    'A bus ticket rises from $2 to $3. Which number is the ORIGINAL amount?',
    { type: 'bars', unit: '$', original: 2, newVal: 3, hide: 'original' },
    2, [3, 1, 5], $,
    'The original amount is the one you START with, before the change happens.',
    'The ticket started at $2 and changed to $3, so the original amount is $2.'));
  q.push(make(W, 3, D, F,
    'A town had 4,000 people. Now it has 4,600 people. What is the increase?',
    { type: 'bars', unit: '', original: 4000, newVal: 4600, hide: 'change' },
    600, [8600, 4600, 400, 4000], plain,
    'Increase = New − Original. Subtract 4,600 − 4,000.',
    'Increase = 4,600 − 4,000 = 600 people.'));
  q.push(make(W, 4, D, F,
    'A plant was 30 cm tall. It grows to 45 cm. What is the increase in height?',
    { type: 'bars', unit: '', suffix: ' cm', original: 30, newVal: 45, hide: 'change' },
    15, [75, 45, 30, 20], unit('cm'),
    'Increase = New height − Original height. Subtract 45 − 30.',
    'Increase = 45 cm − 30 cm = 15 cm.'));
  q.push(make(W, 5, D, F,
    'A ticket costs $40. After a price rise the increase is $12. What is the new price?',
    { type: 'bars', unit: '$', original: 40, newVal: 52, hide: 'new' },
    52, [28, 12, 40, 48], $,
    'New = Original + Increase. Add 40 + 12.',
    'New price = $40 + $12 = $52.'));
  q.push(make(W, 6, D, F,
    'A bag costs $90. In a sale the decrease is $15. What is the new price?',
    { type: 'bars', unit: '$', original: 90, newVal: 75, hide: 'new' },
    75, [105, 15, 90, 85], $,
    'New = Original − Decrease. Subtract 90 − 15.',
    'New price = $90 − $15 = $75.'));
  q.push(make(W, 7, D, F,
    'A price goes from $90 to $75. Which one describes the change?',
    { type: 'bars', unit: '$', original: 90, newVal: 75, hide: 'change' },
    'Decrease of $15', ['Increase of $15', 'Decrease of $165', 'Increase of $75'], (x) => x,
    'The new price is smaller than the original price. Then find the difference.',
    'The price went DOWN from $90 to $75: a decrease of $15.'));
  q.push(make(W, 8, D, F,
    'A phone costs $600. After an update the price is $650. Which one describes the change?',
    { type: 'bars', unit: '$', original: 600, newVal: 650, hide: 'change' },
    'Increase of $50', ['Decrease of $50', 'Increase of $1,250', 'Decrease of $650'], (x) => x,
    'The new price is bigger than the original price. Then find the difference.',
    'The price went UP from $600 to $650: an increase of $50.'));
  q.push(make(W, 9, D, F,
    'A class had 30 students. Now there are 27 students. What is the decrease?',
    { type: 'bars', unit: '', original: 30, newVal: 27, hide: 'change' },
    3, [57, 27, 30, 13], plain,
    'Decrease = Original − New. Subtract 30 − 27.',
    'Decrease = 30 − 27 = 3 students.'));
  return q;
})();

/* ------------------------------------------------------------------ */
/* WORLD 2 — Percent of a Number                                       */
/* ------------------------------------------------------------------ */
const world2 = (() => {
  const W = 2, D = 'Easy-Med', F = 'percent_of';
  const items = [
    { p: 10, t: 200, f: $, u: '$', prompt: 'What is 10% of $200?', hint: '10% means 10 out of 100. Divide $200 by 10.' },
    { p: 50, t: 64, f: unit('kg'), u: '', suffix: ' kg', prompt: 'A bag of rice weighs 64 kg. 50% of it is used. How many kg are used?', hint: '50% is half. Divide 64 by 2.' },
    { p: 25, t: 80, f: $, u: '$', prompt: 'What is 25% of $80?', hint: '25% is one quarter. Divide $80 by 4.' },
    { p: 20, t: 150, f: plain, u: '', prompt: 'A school has 150 students. 20% take the bus. How many students take the bus?', hint: '10% of 150 is 15. So 20% is double that.' },
    { p: 5, t: 120, f: $, u: '$', prompt: 'A meal costs $120. The service charge is 5%. How much is the service charge?', hint: '10% of $120 is $12. So 5% is half of that.' },
    { p: 75, t: 40, f: unit('cm'), u: '', suffix: ' cm', prompt: 'A ribbon is 40 cm long. 75% of it is painted red. How many cm are red?', hint: '75% is three quarters. One quarter of 40 is 10.' },
    { p: 30, t: 90, f: $, u: '$', prompt: 'Sam has $90 and saves 30% of it. How much does Sam save?', hint: '10% of $90 is $9. So 30% is 3 times that.' },
    { p: 40, t: 250, f: $, u: '$', prompt: 'A class wants to raise $250. So far 40% has been raised. How much is that?', hint: '10% of $250 is $25. So 40% is 4 times that.' },
    { p: 15, t: 60, f: plain, u: '', prompt: 'A pack has 60 stickers. 15% are gold. How many gold stickers are there?', hint: '10% of 60 is 6 and 5% is 3. Add them: 6 + 3.' },
    { p: 60, t: 150, f: unit('km'), u: '', suffix: ' km', prompt: 'A trail is 150 km long. Hikers have walked 60% of it. How many km is that?', hint: '10% of 150 is 15. So 60% is 6 times that.' },
  ];
  return items.map((it, i) => {
    const part = (it.p * it.t) / 100;
    return make(W, i, D, F, it.prompt,
      { type: 'blocks', unit: it.u, suffix: it.suffix || '', total: it.t, pct: it.p },
      part,
      [it.p, it.t - part, part * 2, part + 10, Math.round(it.t / it.p)].filter((n) => n !== part),
      it.f, it.hint,
      `${it.p}% of ${fmtNum(it.t)} = ${it.p} ÷ 100 × ${fmtNum(it.t)} = ${fmtNum(part)}.`);
  });
})();

/* ------------------------------------------------------------------ */
/* WORLD 3 — Percentage Increase: find the NEW amount                  */
/* ------------------------------------------------------------------ */
const world3 = (() => {
  const W = 3, D = 'Easy-Med', F = 'pct_increase_new';
  const items = [
    { o: 50, p: 20, f: $, u: '$', s: '', prompt: 'A video game costs $50. The price rises by 20%. What is the new price?' },
    { o: 80, p: 25, f: $, u: '$', s: '', prompt: 'A bike helmet costs $80. Its price goes up by 25%. Find the new price.' },
    { o: 200, p: 10, f: plain, u: '', s: '', prompt: 'A club has 200 members. The number of members rises by 10%. How many members are there now?' },
    { o: 40, p: 50, f: unit('cm'), u: '', s: ' cm', prompt: 'A plant is 40 cm tall. It grows 50% taller. What is its new height?' },
    { o: 120, p: 5, f: $, u: '$', s: '', prompt: 'A phone plan costs $120 a year. The price rises by 5%. Find the new cost.' },
    { o: 60, p: 15, f: $, u: '$', s: '', prompt: 'Ella has $60 in savings. Her savings increase by 15%. How much does she have now?' },
    { o: 150, p: 40, f: plain, u: '', s: '', prompt: 'A library has 150 books. The number of books increases by 40%. How many books are there now?' },
    { o: 90, p: 10, f: $, u: '$', s: '', prompt: 'A concert ticket costs $90. The price goes up by 10%. What is the new price?' },
    { o: 240, p: 25, f: unit('kg'), u: '', s: ' kg', prompt: 'A farm picked 240 kg of mangoes. This year it picks 25% more. How many kg is that?' },
    { o: 300, p: 12, f: plain, u: '', s: '', prompt: 'A factory makes 300 toys a day. Its output rises by 12%. How many toys does it make now?' },
  ];
  return items.map((it, i) => {
    const inc = (it.o * it.p) / 100;
    const n = it.o + inc;
    return make(W, i, D, F, it.prompt,
      { type: 'bars', unit: it.u, suffix: it.s, original: it.o, newVal: n, hide: 'new', pct: it.p },
      n,
      [inc, it.o - inc, it.o + it.p, it.o + inc * 2, it.o + inc + 5],
      it.f,
      `Find ${it.p}% of ${fmtNum(it.o)} first. Then ADD it to the original.`,
      `Increase = ${it.p}% × ${fmtNum(it.o)} = ${fmtNum(inc)}. New = ${fmtNum(it.o)} + ${fmtNum(inc)} = ${fmtNum(n)}.`);
  });
})();

/* ------------------------------------------------------------------ */
/* WORLD 4 — Percentage Decrease: discounts & shrinking                */
/* ------------------------------------------------------------------ */
const world4 = (() => {
  const W = 4, D = 'Medium', F = 'pct_decrease_new';
  const items = [
    { o: 80, p: 25, f: $, u: '$', s: '', prompt: 'A backpack costs $80. It is on sale for 25% off. What is the sale price?' },
    { o: 50, p: 20, f: $, u: '$', s: '', prompt: 'A cap costs $50. There is a 20% discount. How much do you pay?' },
    { o: 200, p: 10, f: plain, u: '', s: '', prompt: 'A cinema has 200 seats. 10% of the seats are broken. How many seats still work?' },
    { o: 120, p: 50, f: $, u: '$', s: '', prompt: 'A pair of trainers costs $120. It is half price (50% off). What is the sale price?' },
    { o: 60, p: 15, f: $, u: '$', s: '', prompt: 'A book costs $60. It is reduced by 15%. What is the new price?' },
    { o: 150, p: 20, f: unit('litres'), u: '', s: ' L', prompt: 'A tank holds 150 litres of water. 20% is used. How many litres are left?' },
    { o: 90, p: 30, f: $, u: '$', s: '', prompt: 'A jacket costs $90. It is reduced by 30%. Find the new price.' },
    { o: 250, p: 40, f: $, u: '$', s: '', prompt: 'A tablet costs $250. There is a 40% discount. What is the sale price?' },
    { o: 400, p: 5, f: plain, u: '', s: '', prompt: 'A village has 400 people. The population falls by 5%. How many people live there now?' },
    { o: 75, p: 20, f: $, u: '$', s: '', prompt: 'A dinner costs $75. A coupon gives 20% off. How much do you pay?' },
  ];
  return items.map((it, i) => {
    const dec = (it.o * it.p) / 100;
    const n = it.o - dec;
    return make(W, i, D, F, it.prompt,
      { type: 'bars', unit: it.u, suffix: it.s, original: it.o, newVal: n, hide: 'new', pct: -it.p },
      n,
      [dec, it.o + dec, it.o - it.p, it.o - dec * 2, it.o + it.p],
      it.f,
      `Find ${it.p}% of ${fmtNum(it.o)} first. Then SUBTRACT it from the original.`,
      `Decrease = ${it.p}% × ${fmtNum(it.o)} = ${fmtNum(dec)}. New = ${fmtNum(it.o)} − ${fmtNum(dec)} = ${fmtNum(n)}.`);
  });
})();

/* ------------------------------------------------------------------ */
/* WORLD 5 — Find the Percentage Change                                */
/* ------------------------------------------------------------------ */
const world5 = (() => {
  const W = 5, D = 'Med-Hard', F = 'find_pct_change';
  const items = [
    { o: 40, n: 50, u: '$', s: '', prompt: "A video game's price rises from $40 to $50. What is the percentage increase?" },
    { o: 80, n: 68, u: '$', s: '', prompt: "A jacket's price falls from $80 to $68. What is the percentage decrease?" },
    { o: 50, n: 75, u: '', s: '', prompt: 'A club grows from 50 members to 75 members. Find the percentage increase.' },
    { o: 200, n: 150, u: '', s: ' L', prompt: 'A water tank drops from 200 litres to 150 litres. Find the percentage decrease.' },
    { o: 60, n: 72, u: '', s: ' cm', prompt: 'A sunflower grows from 60 cm to 72 cm. What is the percentage increase?' },
    { o: 120, n: 84, u: '', s: '', prompt: 'A cinema audience falls from 120 people to 84 people. What is the percentage decrease?' },
    { o: 25, n: 35, u: '$', s: '', prompt: 'A bus fare rises from $25 to $35. What is the percentage increase?' },
    { o: 90, n: 99, u: '', s: '', prompt: "A pupil's score goes up from 90 marks to 99 marks. What is the percentage increase?" },
    { o: 150, n: 120, u: '', s: ' min', prompt: 'Screen time is cut from 150 minutes to 120 minutes a day. What is the percentage decrease?' },
    { o: 40, n: 64, u: '', s: ' kg', prompt: "A pumpkin's weight grows from 40 kg to 64 kg. What is the percentage increase?" },
  ];
  return items.map((it, i) => {
    const change = Math.abs(it.n - it.o);
    const p = (change / it.o) * 100;
    const up = it.n > it.o;
    return make(W, i, D, F, it.prompt,
      { type: 'bars', unit: it.u, suffix: it.s, original: it.o, newVal: it.n, hide: 'pct', pct: up ? p : -p },
      pc(p),
      [pc(Math.round((change / it.n) * 100)), pc(change), pc(100 - p), pc(p * 2), pc(p + 5)],
      (x) => x,
      `Step 1: change = ${up ? 'New − Original' : 'Original − New'}. Step 2: divide the change by the ORIGINAL, then × 100.`,
      `Change = ${fmtNum(change)}. ${fmtNum(change)} ÷ ${fmtNum(it.o)} × 100 = ${p}% ${up ? 'increase' : 'decrease'}.`);
  });
})();

/* ------------------------------------------------------------------ */
/* WORLD 6 — Multiplier Magic                                          */
/* ------------------------------------------------------------------ */
const world6 = (() => {
  const W = 6, D = 'Medium', F = 'multiplier';
  const q = [];
  q.push(make(W, 0, D, F,
    'Which multiplier represents a 20% increase?',
    { type: 'bars', unit: '', original: 100, newVal: 120, hide: 'new', pct: 20, factor: '×?' },
    times('1.2'), [times('0.8'), times('1.02'), times('2.0'), times('0.2')], (x) => x,
    'An increase is 100% + 20% = 120%. As a decimal, 120% = 1.2.',
    '100% + 20% = 120% = 1.2, so the multiplier is ×1.2.'));
  q.push(make(W, 1, D, F,
    'Which multiplier represents a 25% decrease?',
    { type: 'bars', unit: '', original: 100, newVal: 75, hide: 'new', pct: -25, factor: '×?' },
    times('0.75'), [times('0.25'), times('1.25'), times('0.025'), times('0.7')], (x) => x,
    'A decrease is 100% − 25% = 75%. As a decimal, 75% = 0.75.',
    '100% − 25% = 75% = 0.75, so the multiplier is ×0.75.'));
  q.push(make(W, 2, D, F,
    'Increase $60 by 15% using the multiplier ×1.15. What is the new amount?',
    { type: 'bars', unit: '$', original: 60, newVal: 69, hide: 'new', pct: 15, factor: '×1.15' },
    69, [9, 51, 75, 66], $,
    'Multiply the original by 1.15: 60 × 1.15.',
    '$60 × 1.15 = $69.'));
  q.push(make(W, 3, D, F,
    'Decrease 240 by 30% using the multiplier ×0.7. What is the new amount?',
    { type: 'bars', unit: '', original: 240, newVal: 168, hide: 'new', pct: -30, factor: '×0.7' },
    168, [72, 312, 210, 170], plain,
    'Multiply the original by 0.7: 240 × 0.7.',
    '240 × 0.7 = 168.'));
  q.push(make(W, 4, D, F,
    'Which multiplier represents a 5% increase?',
    { type: 'bars', unit: '', original: 100, newVal: 105, hide: 'new', pct: 5, factor: '×?' },
    times('1.05'), [times('1.5'), times('0.95'), times('0.05'), times('1.005')], (x) => x,
    '100% + 5% = 105%. As a decimal, 105% = 1.05.',
    '100% + 5% = 105% = 1.05, so the multiplier is ×1.05.'));
  q.push(make(W, 5, D, F,
    'A price is multiplied by 0.9. What percentage change is that?',
    { type: 'bars', unit: '', original: 100, newVal: 90, hide: 'pct', factor: '×0.9' },
    '10% decrease', ['10% increase', '90% decrease', '90% increase'], (x) => x,
    '0.9 means 90% of the original is left. Is that more or less than 100%?',
    '0.9 = 90%, and 100% − 90% = 10%. The price goes DOWN by 10%.'));
  q.push(make(W, 6, D, F,
    'An amount is multiplied by 1.35. What percentage change is that?',
    { type: 'bars', unit: '', original: 100, newVal: 135, hide: 'pct', factor: '×1.35' },
    '35% increase', ['35% decrease', '135% increase', '65% decrease'], (x) => x,
    '1.35 = 135%. Is that more or less than 100%?',
    '1.35 = 135%, and 135% − 100% = 35%. The amount goes UP by 35%.'));
  q.push(make(W, 7, D, F,
    'An amount is multiplied by 0.6. What percentage change is that?',
    { type: 'bars', unit: '', original: 100, newVal: 60, hide: 'pct', factor: '×0.6' },
    '40% decrease', ['40% increase', '60% decrease', '60% increase'], (x) => x,
    '0.6 = 60%. How much is missing from 100%?',
    '0.6 = 60%, and 100% − 60% = 40%. The amount goes DOWN by 40%.'));
  q.push(make(W, 8, D, F,
    'Increase 150 by 8% using a multiplier. What is the new amount?',
    { type: 'bars', unit: '', original: 150, newVal: 162, hide: 'new', pct: 8, factor: '×1.08' },
    162, [12, 138, 158, 180], plain,
    'The multiplier for an 8% increase is 1.08. Calculate 150 × 1.08.',
    '150 × 1.08 = 162.'));
  q.push(make(W, 9, D, F,
    'Decrease 350 by 12% using a multiplier. What is the new amount?',
    { type: 'bars', unit: '', original: 350, newVal: 308, hide: 'new', pct: -12, factor: '×0.88' },
    308, [42, 392, 338, 300], plain,
    'The multiplier for a 12% decrease is 0.88. Calculate 350 × 0.88.',
    '350 × 0.88 = 308.'));
  return q;
})();

/* ------------------------------------------------------------------ */
/* WORLD 7 — Up Then Down (successive changes)                         */
/* ------------------------------------------------------------------ */
const world7 = (() => {
  const W = 7, D = 'Med-Hard', F = 'successive';
  const CMP = ['Higher than the start', 'Lower than the start', 'Same as the start', 'Cannot tell'];
  const items = [
    { s: 100, a: 20, b: -20, kind: 'final', f: $, u: '$', ctx: 'A game costs $100. The shop raises the price by 20%. Then a sale cuts the new price by 20%. What is the final price?' },
    { s: 200, a: 50, b: -50, kind: 'compare', f: $, u: '$', ctx: 'A toy costs $200. Its price goes up by 50%, then down by 50%. How does the final price compare with the start?' },
    { s: 100, a: -20, b: 20, kind: 'final', f: $, u: '$', ctx: 'A jacket costs $100. A sale takes off 20%. After the sale the new price goes up by 20%. What is the final price?' },
    { s: 80, a: 25, b: -20, kind: 'compare', f: $, u: '$', ctx: 'A watch costs $80. Its price goes up by 25%, then down by 20%. How does the final price compare with the start?' },
    { s: 50, a: 100, b: -50, kind: 'final', f: $, u: '$', ctx: 'A card costs $50. Its price doubles (up 100%) and then is cut by 50%. What is the final price?' },
    { s: 200, a: 10, b: 10, kind: 'final', f: plain, u: '', ctx: 'A town has 200 people. Its population grows 10% in year 1 and 10% again in year 2. How many people live there after 2 years?' },
    { s: 400, a: -25, b: -20, kind: 'final', f: $, u: '$', ctx: 'A bike costs $400. It is reduced by 25%, and then the new price is reduced by another 20%. What is the final price?' },
    { s: 60, a: 50, b: -20, kind: 'final', f: $, u: '$', ctx: 'A bag costs $60. The price rises by 50% and then falls by 20%. What is the final price?' },
    { s: 500, a: -10, b: 10, kind: 'final', f: $, u: '$', ctx: 'Amy has $500 in a fund. It falls by 10% one month and rises by 10% the next month. How much is in the fund now?' },
    { s: 120, a: 25, b: 20, kind: 'final', f: plain, u: '', ctx: 'A pond has 120 fish. The number of fish grows by 25%, then grows by another 20%. How many fish are there now?' },
  ];
  return items.map((it, i) => {
    const mid = (it.s * (100 + it.a)) / 100;
    const fin = (mid * (100 + it.b)) / 100;
    const diagram = {
      type: 'chain', unit: it.u, start: it.s, steps: [it.a, it.b], values: [it.s, mid, fin], hideLast: true,
    };
    const hint = it.kind === 'compare'
      ? 'Use multipliers: multiply the two together and see whether the result is more than, less than, or equal to 1.'
      : 'Do it in TWO steps. The second percentage is taken from the NEW amount, not from the start.';
    const expl = `${fmtNum(it.s)} → ${fmtNum(mid)} (${it.a > 0 ? '+' : '−'}${Math.abs(it.a)}%) → ${fmtNum(fin)} (${it.b > 0 ? '+' : '−'}${Math.abs(it.b)}%).`;
    if (it.kind === 'compare') {
      const ans = fin > it.s ? CMP[0] : fin < it.s ? CMP[1] : CMP[2];
      const wrongs = CMP.filter((c) => c !== ans);
      return make(W, i, D, F, it.ctx, diagram, ans, wrongs, (x) => x, hint,
        `${expl} The final amount is ${it.f(fin)}, which is ${ans.toLowerCase()}.`);
    }
    const A = Math.round((it.s * (100 + it.a + it.b)) / 100);
    const C = Math.round((it.s * (100 + it.b)) / 100);
    return make(W, i, D, F, it.ctx, diagram, fin,
      [A, mid, it.s, C, fin + 10, fin - 10], it.f, hint, expl);
  });
})();

/* ------------------------------------------------------------------ */
/* WORLD 8 — Reverse Detective: find the ORIGINAL                      */
/* ------------------------------------------------------------------ */
const world8 = (() => {
  const W = 8, D = 'Hard', F = 'find_original';
  const items = [
    { n: 60, p: 20, f: $, u: '$', s: '', ctx: 'After a 20% price rise, a video game costs $60. What was the original price?' },
    { n: 100, p: 25, f: $, u: '$', s: '', ctx: 'After a 25% price rise, a helmet costs $100. What was the original price?' },
    { n: 80, p: -20, f: $, u: '$', s: '', ctx: 'A bag costs $80 after a 20% discount. What was the original price?' },
    { n: 150, p: -25, f: $, u: '$', s: '', ctx: 'A watch costs $150 after a 25% discount. What was the original price?' },
    { n: 90, p: 50, f: unit('cm'), u: '', s: ' cm', ctx: 'A tree is 90 cm tall after growing 50% taller. How tall was it before?' },
    { n: 45, p: -10, f: $, u: '$', s: '', ctx: 'A ticket costs $45 after a 10% discount. What was the original price?' },
    { n: 165, p: 10, f: $, u: '$', s: '', ctx: 'After a 10% pay rise, Kim earns $165 a week. What did Kim earn before the rise?' },
    { n: 72, p: -40, f: $, u: '$', s: '', ctx: 'A jacket costs $72 after 40% off. What was the original price?' },
    { n: 260, p: 30, f: plain, u: '', s: '', ctx: 'A library has 260 books after a 30% increase. How many books did it have before?' },
    { n: 210, p: -30, f: $, u: '$', s: '', ctx: 'A phone costs $210 after 30% off. What was the original price?' },
  ];
  return items.map((it, i) => {
    const mult = (100 + it.p) / 100;
    const o = it.n / mult;
    const up = it.p > 0;
    const a = Math.abs(it.p);
    return make(W, i, D, F, it.ctx,
      { type: 'bars', unit: it.u, suffix: it.s, original: o, newVal: it.n, hide: 'original', pct: it.p },
      o,
      [
        (it.n * (100 - it.p)) / 100, // wrong: apply the % to the NEW amount, opposite direction
        (it.n * (100 + it.p)) / 100, // wrong: apply the % to the NEW amount, same direction
        it.n - it.p, it.n + it.p, o + 10, o - 10,
      ].filter((v) => Number.isInteger(v)),
      it.f,
      `The new amount is ${100 + it.p}% of the original. Find 1% or 10% first, then scale up to 100%. Or divide by ${mult}.`,
      `New = ${100 + it.p}% of Original. ${fmtNum(it.n)} ÷ ${mult} = ${fmtNum(o)}. (${up ? 'increase' : 'decrease'} of ${a}%)`);
  });
})();

/* ------------------------------------------------------------------ */
/* WORLD 9 — Percentage Word Problems (real life)                      */
/* ------------------------------------------------------------------ */
const world9 = (() => {
  const W = 9, D = 'Hard', F = 'word_problem';
  const q = [];
  q.push(make(W, 0, D, F,
    "A town's population rose from 8,000 to 9,200. What is the percentage increase?",
    { type: 'bars', unit: '', original: 8000, newVal: 9200, hide: 'pct', pct: 15 },
    '15%', ['13%', '20%', '12%'], (x) => x,
    'Change = 9,200 − 8,000. Divide by the ORIGINAL 8,000, then × 100.',
    'Change = 1,200. 1,200 ÷ 8,000 × 100 = 15%.'));
  q.push(make(W, 1, D, F,
    'A water tank held 250 litres. It now holds 200 litres. What is the percentage decrease?',
    { type: 'bars', unit: '', suffix: ' L', original: 250, newVal: 200, hide: 'pct', pct: -20 },
    '20%', ['25%', '50%', '10%'], (x) => x,
    'Change = 250 − 200. Divide by the ORIGINAL 250, then × 100.',
    'Change = 50. 50 ÷ 250 × 100 = 20%.'));
  q.push(make(W, 2, D, F,
    'Mia saved $40 in January. In February she saved 25% more. How much did she save in February?',
    { type: 'bars', unit: '$', original: 40, newVal: 50, hide: 'new', pct: 25 },
    '$50', ['$10', '$65', '$30'], (x) => x,
    '25% of $40 is $10. Then add it to $40.',
    '25% of $40 = $10. $40 + $10 = $50.'));
  q.push(make(W, 3, D, F,
    'There are 40 pupils in a class. 10% are absent. How many pupils are present?',
    { type: 'bars', unit: '', original: 40, newVal: 36, hide: 'new', pct: -10 },
    '36', ['4', '30', '44'], (x) => x,
    '10% of 40 is 4 pupils absent. Subtract from 40.',
    '10% of 40 = 4 absent. 40 − 4 = 36 present.'));
  q.push(make(W, 4, D, F,
    'Tom is 150 cm tall. He grows 4% taller. How tall is Tom now?',
    { type: 'bars', unit: '', suffix: ' cm', original: 150, newVal: 156, hide: 'new', pct: 4 },
    '156 cm', ['154 cm', '6 cm', '144 cm'], (x) => x,
    '1% of 150 is 1.5 cm. So 4% is 6 cm. Then add it.',
    '4% of 150 = 6 cm. 150 + 6 = 156 cm.'));
  q.push(make(W, 5, D, F,
    'Jeans cost $60. There is a 30% discount. How much do you pay?',
    { type: 'bars', unit: '$', original: 60, newVal: 42, hide: 'new', pct: -30 },
    '$42', ['$18', '$30', '$78'], (x) => x,
    'You pay 70% of the price (100% − 30%). Find 70% of 60.',
    '30% of $60 = $18. $60 − $18 = $42.'));
  q.push(make(W, 6, D, F,
    'A ticket cost $20 last year and $25 this year. What is the percentage increase?',
    { type: 'bars', unit: '$', original: 20, newVal: 25, hide: 'pct', pct: 25 },
    '25%', ['20%', '5%', '50%'], (x) => x,
    'Change = $5. Divide by last year’s price $20 (the ORIGINAL).',
    'Change = $5. 5 ÷ 20 × 100 = 25%.'));
  q.push(make(W, 7, D, F,
    'An electricity bill of $120 falls by 15%. What is the new bill?',
    { type: 'bars', unit: '$', original: 120, newVal: 102, hide: 'new', pct: -15 },
    '$102', ['$18', '$135', '$105'], (x) => x,
    '10% of 120 is 12 and 5% is 6, so 15% is 18. Then subtract.',
    '15% of $120 = $18. $120 − $18 = $102.'));
  q.push(make(W, 8, D, F,
    'A hamster weighs 200 g. A month later it weighs 260 g. What is the percentage increase?',
    { type: 'bars', unit: '', suffix: ' g', original: 200, newVal: 260, hide: 'pct', pct: 30 },
    '30%', ['23%', '60%', '20%'], (x) => x,
    'Change = 60 g. Divide by the ORIGINAL 200 g, then × 100.',
    'Change = 60 g. 60 ÷ 200 × 100 = 30%.'));
  q.push(make(W, 9, D, F,
    'A school has 500 students. 8% of them leave. How many students remain?',
    { type: 'bars', unit: '', original: 500, newVal: 460, hide: 'new', pct: -8 },
    '460', ['40', '540', '492'], (x) => x,
    '1% of 500 is 5, so 8% is 40 students. Then subtract.',
    '8% of 500 = 40. 500 − 40 = 460.'));
  return q;
})();

/* ------------------------------------------------------------------ */
/* WORLD 10 — Singapore Percent Challenge (MOE exam style)             */
/* ------------------------------------------------------------------ */
const world10 = (() => {
  const W = 10, D = 'Hard', F = 'moe_challenge';
  const q = [];
  q.push(make(W, 0, D, F,
    'A bag costs $80. It is on sale at 25% off. Then a coupon takes a further $10 off. What is the final price?',
    { type: 'bars', unit: '$', original: 80, newVal: 50, hide: 'new', pct: -37.5, noPct: true },
    '$50', ['$60', '$45', '$70'], (x) => x,
    'First find the price after 25% off. Then subtract the $10 coupon.',
    '25% off $80 = $60. $60 − $10 = $50.'));
  q.push(make(W, 1, D, F,
    'After a 20% discount, a jacket costs $96. How much was the discount in dollars?',
    { type: 'bars', unit: '$', original: 120, newVal: 96, hide: 'change', pct: -20 },
    '$24', ['$20', '$120', '$30'], (x) => x,
    '$96 is 80% of the original. Find the original first, then subtract $96.',
    '80% = $96, so 10% = $12 and 100% = $120. Discount = $120 − $96 = $24.'));
  q.push(make(W, 2, D, F,
    'Ali has $300. Ben has 20% more than Ali. How much do they have altogether?',
    { type: 'bars', unit: '$', original: 300, newVal: 360, hide: 'new', pct: 20 },
    '$660', ['$360', '$600', '$620'], (x) => x,
    'Find Ben’s money first (300 + 20% of 300). Then add Ali’s $300.',
    'Ben = $300 + $60 = $360. Together = $300 + $360 = $660.'));
  q.push(make(W, 3, D, F,
    'A shirt costs $40 after a 20% discount. What is the total cost of 3 such shirts at the ORIGINAL price?',
    { type: 'bars', unit: '$', original: 50, newVal: 40, hide: 'original', pct: -20 },
    '$150', ['$120', '$144', '$160'], (x) => x,
    '$40 is 80% of the original. Find the original price of one shirt, then × 3.',
    '80% = $40, so 10% = $5 and 100% = $50. Three shirts = 3 × $50 = $150.'));
  q.push(make(W, 4, D, F,
    'Tank A has 40% more water than Tank B. Tank B has 150 litres. How many litres are in Tank A?',
    { type: 'bars', unit: '', suffix: ' L', original: 150, newVal: 210, hide: 'new', pct: 40 },
    '210 litres', ['60 litres', '90 litres', '190 litres'], (x) => x,
    'Tank B is the ORIGINAL (100%). Tank A is 140% of it.',
    '40% of 150 = 60. Tank A = 150 + 60 = 210 litres.'));
  q.push(make(W, 5, D, F,
    'After a 20% pay rise, Mr Lim earns $3,600. What did he earn before the rise?',
    { type: 'bars', unit: '$', original: 3000, newVal: 3600, hide: 'original', pct: 20 },
    '$3,000', ['$2,880', '$3,580', '$3,200'], (x) => x,
    'The new pay is 120% of the old pay. Divide $3,600 by 1.2.',
    '120% = $3,600, so 10% = $300 and 100% = $3,000.'));
  q.push(make(W, 6, D, F,
    "A laptop's price falls from $1,200 to $1,080. What is the percentage decrease?",
    { type: 'bars', unit: '$', original: 1200, newVal: 1080, hide: 'pct', pct: -10 },
    '10%', ['11%', '12%', '20%'], (x) => x,
    'Change = $120. Divide by the ORIGINAL $1,200, then × 100.',
    '$120 ÷ $1,200 × 100 = 10%.'));
  q.push(make(W, 7, D, F,
    'In Test 1 Sam scored 60. In Test 2 he scored 75. In Test 3 he scored 20% higher than in Test 2. What was his Test 3 score?',
    { type: 'bars', unit: '', original: 75, newVal: 90, hide: 'new', pct: 20 },
    '90', ['95', '72', '85'], (x) => x,
    'Test 3 is compared with Test 2 (not Test 1). Find 20% of 75 and add it.',
    '20% of 75 = 15. Test 3 = 75 + 15 = 90.'));
  q.push(make(W, 8, D, F,
    'A number is increased by 20% to give 90. What is the number?',
    { type: 'bars', unit: '', original: 75, newVal: 90, hide: 'original', pct: 20 },
    '75', ['72', '70', '108'], (x) => x,
    '90 is 120% of the number. Divide 90 by 1.2.',
    '120% = 90, so 10% = 7.5 and 100% = 75. Check: 75 × 1.2 = 90.'));
  q.push(make(W, 9, D, F,
    'A toy costs $50. Its price is raised by 20%. Later a 20% discount is given on the new price. What is the final price?',
    { type: 'chain', unit: '$', start: 50, steps: [20, -20], values: [50, 60, 48], hideLast: true },
    '$48', ['$50', '$60', '$40'], (x) => x,
    'Two steps. The discount is taken from the NEW price, not from $50.',
    '$50 → $60 (+20%) → $48 (−20% of $60 = $12).'));
  return q;
})();

export const staticQuestionBank = {
  1: world1, 2: world2, 3: world3, 4: world4, 5: world5,
  6: world6, 7: world7, 8: world8, 9: world9, 10: world10,
};

export function buildWorldSession(worldId, sessionSize = 10) {
  const worldQuestions = staticQuestionBank[worldId] || staticQuestionBank[1];
  return [...worldQuestions].slice(0, sessionSize);
}

export function generateQuestionForWorld(worldId) {
  const worldQuestions = staticQuestionBank[worldId] || staticQuestionBank[1];
  return worldQuestions[0];
}

export default staticQuestionBank;
