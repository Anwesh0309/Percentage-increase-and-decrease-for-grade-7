import React from 'react';

const fmtNum = (n) => Number(Math.round(n * 100) / 100).toLocaleString('en-US');

const makeFmt = (unit = '', suffix = '') => (v) => `${unit}${fmtNum(v)}${suffix}`;
const signPct = (p) => `${p > 0 ? '+' : p < 0 ? '−' : ''}${fmtNum(Math.abs(p))}%`;

const Badge = ({ x, y, w = 92, h = 30, text, stroke, fill = "#F3F4F6", fontSize = 18 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="8" fill="#161129" stroke={stroke} strokeWidth="2.5" />
    <text x="0" y={fontSize * 0.36} textAnchor="middle" fill={fill} fontSize={fontSize} fontWeight="900" fontFamily="Outfit, Inter, sans-serif">
      {text}
    </text>
  </g>
);

const Label = ({ x, y, text, fill = '#A78BFA', size = 13 }) => (
  <text x={x} y={y} textAnchor="middle" fill={fill} fontSize={size} fontWeight="900" fontFamily="Outfit, Inter, sans-serif" letterSpacing="1.5">
    {text}
  </text>
);

export const PercentDiagramSVG = ({ diagram }) => {
  if (!diagram) return null;
  const { type = 'bars' } = diagram;

  /* ---------------- 10% BLOCKS (percent of a number) ---------------- */
  if (type === 'blocks') {
    const { total, pct, unit = '', suffix = '' } = diagram;
    const fmt = makeFmt(unit, suffix);
    const shaded = Math.round(pct / 5);
    const cells = [];
    for (let i = 0; i < 20; i += 1) {
      const col = i % 10;
      const row = Math.floor(i / 10);
      const on = i < shaded;
      cells.push(
        <rect
          key={i}
          x={26 + col * 25}
          y={104 + row * 30}
          width="22"
          height="26"
          rx="5"
          fill={on ? '#F59E0B' : '#231A48'}
          fillOpacity={on ? 0.85 : 1}
          stroke={on ? '#FBBF24' : '#3B2D6B'}
          strokeWidth="2"
        />,
      );
    }
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full max-w-[340px] select-none">
        <Label x={150} y={52} text="WHOLE = 100%" />
        <Badge x={150} y={78} w={150} text={`100% = ${fmt(total)}`} stroke="#06B6D4" />
        {cells}
        <text x="150" y="182" textAnchor="middle" fill="#A78BFA" fontSize="12" fontWeight="800" fontFamily="Inter, sans-serif">
          each block = 5%
        </text>
        <Badge x={150} y={226} w={150} text={`${pct}% = ?`} stroke="#EF4444" fill="#EF4444" />
      </svg>
    );
  }

  /* ---------------- CHAIN (successive changes) ---------------- */
  if (type === 'chain') {
    const { unit = '', suffix = '', steps = [], values = [], hideLast = true } = diagram;
    const fmt = makeFmt(unit, suffix);
    const maxV = Math.max(...values) || 1;
    const base = 226;
    const maxH = 130;
    const xs = [56, 150, 244];
    const labels = ['START', 'STEP 1', 'STEP 2'];
    const colors = ['#06B6D4', steps[0] >= 0 ? '#10B981' : '#EC4899', steps[1] >= 0 ? '#10B981' : '#EC4899'];
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full max-w-[340px] select-none">
        {/* Start level guide */}
        <line x1="14" y1={base - (values[0] / maxV) * maxH} x2="286" y2={base - (values[0] / maxV) * maxH} stroke="rgba(255,184,0,0.45)" strokeWidth="2" strokeDasharray="5 5" />
        <line x1="14" y1={base} x2="286" y2={base} stroke="#3B2D6B" strokeWidth="3" />

        {values.map((v, i) => {
          const h = Math.max((v / maxV) * maxH, 8);
          const isHidden = hideLast && i === values.length - 1;
          return (
            <g key={i}>
              <rect
                x={xs[i] - 28}
                y={base - h}
                width="56"
                height={h}
                rx="8"
                fill={isHidden ? '#EF4444' : colors[i]}
                fillOpacity={isHidden ? 0.25 : 0.4}
                stroke={isHidden ? '#EF4444' : colors[i]}
                strokeWidth="3"
                strokeDasharray={isHidden ? '6 5' : '0'}
              />
              <Badge
                x={xs[i]}
                y={base - h - 22}
                w={isHidden ? 44 : 72}
                h={28}
                text={isHidden ? '?' : fmt(v)}
                stroke={isHidden ? '#EF4444' : colors[i]}
                fill={isHidden ? '#EF4444' : '#F3F4F6'}
                fontSize={isHidden ? 18 : 14}
              />
              <Label x={xs[i]} y={base + 22} text={labels[i]} size={11} />
            </g>
          );
        })}

        {steps.map((s, i) => (
          <g key={`s-${i}`}>
            <text x={(xs[i] + xs[i + 1]) / 2} y="52" textAnchor="middle" fill={s >= 0 ? '#10B981' : '#EC4899'} fontSize="20" fontWeight="900" fontFamily="Outfit, Inter, sans-serif">
              {signPct(s)}
            </text>
            <text x={(xs[i] + xs[i + 1]) / 2} y="74" textAnchor="middle" fill="#A78BFA" fontSize="18" fontWeight="900">
              ➜
            </text>
          </g>
        ))}
      </svg>
    );
  }

  /* ---------------- BARS (original vs new) ---------------- */
  const { unit = '', suffix = '', original, newVal, hide = null, pct, factor, noPct = false } = diagram;
  const fmt = makeFmt(unit, suffix);
  const maxV = Math.max(original, newVal) || 1;
  const left = 24;
  const maxW = 252;
  const origW = (original / maxV) * maxW;
  const newW = (newVal / maxV) * maxW;
  const isUp = newVal >= original;
  const change = newVal - original;

  const origHidden = hide === 'original';
  const newHidden = hide === 'new';
  const changeHidden = hide === 'change';
  const pctHidden = hide === 'pct';

  const showPct = !noPct && (pct !== undefined || pctHidden);
  const changeText = changeHidden ? '?' : `${change >= 0 ? '+' : '−'}${fmt(Math.abs(change))}`;
  const pctText = pctHidden ? '?%' : pct !== undefined ? signPct(pct) : '';
  const changeColor = isUp ? '#10B981' : '#EC4899';

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full max-w-[340px] select-none">
      {/* Original bar */}
      <Label x={left + 34} y={54} text="ORIGINAL" />
      <rect x={left} y="62" width={origHidden ? origW : origW} height="44" rx="9" fill="#06B6D4" fillOpacity={origHidden ? 0.15 : 0.35} stroke="#06B6D4" strokeWidth="3" strokeDasharray={origHidden ? '7 5' : '0'} />
      <Badge x={left + origW / 2} y={84} text={origHidden ? '?' : fmt(original)} stroke={origHidden ? '#EF4444' : '#06B6D4'} fill={origHidden ? '#EF4444' : '#F3F4F6'} w={origHidden ? 44 : 92} fontSize={origHidden ? 20 : 16} />

      {/* Link between bars: multiplier chip or arrow */}
      {factor ? (
        <g transform="translate(150, 132)">
          <rect x="-40" y="-14" width="80" height="28" rx="14" fill="#161129" stroke="#F59E0B" strokeWidth="2.5" />
          <text x="0" y="6" textAnchor="middle" fill="#F59E0B" fontSize="16" fontWeight="900" fontFamily="Outfit, Inter, sans-serif">
            {factor}
          </text>
        </g>
      ) : (
        <text x="150" y="140" textAnchor="middle" fill="#8B5CF6" fontSize="22" fontWeight="900">▼</text>
      )}

      {/* New bar */}
      <Label x={left + 20} y={158} text="NEW" />
      {isUp ? (
        <>
          <rect x={left} y="166" width={Math.min(origW, newW)} height="44" rx="9" fill="#F59E0B" fillOpacity="0.38" stroke="#F59E0B" strokeWidth="3" />
          <rect x={left + origW} y="166" width={Math.max(newW - origW, 0)} height="44" rx="9" fill="#10B981" fillOpacity={newHidden ? 0.15 : 0.5} stroke="#10B981" strokeWidth="3" strokeDasharray={changeHidden ? '6 5' : '0'} />
        </>
      ) : (
        <>
          <rect x={left} y="166" width={newW} height="44" rx="9" fill="#F59E0B" fillOpacity="0.38" stroke="#F59E0B" strokeWidth="3" />
          <rect x={left + newW} y="166" width={Math.max(origW - newW, 0)} height="44" rx="9" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="3" strokeDasharray="6 5" />
        </>
      )}
      <Badge x={left + (isUp ? newW / 2 : newW / 2)} y={188} text={newHidden ? '?' : fmt(newVal)} stroke={newHidden ? '#EF4444' : '#F59E0B'} fill={newHidden ? '#EF4444' : '#F3F4F6'} w={newHidden ? 44 : 92} fontSize={newHidden ? 20 : 16} />

      {/* Change & percent badges */}
      <Label x={showPct ? 92 : 150} y={246} text="CHANGE" size={11} />
      <Badge x={showPct ? 92 : 150} y={268} w={showPct ? 108 : 132} text={changeText} stroke={changeHidden ? '#EF4444' : changeColor} fill={changeHidden ? '#EF4444' : '#F3F4F6'} fontSize={changeHidden ? 20 : 16} />
      {showPct && (
        <>
          <Label x={208} y={246} text="% CHANGE" size={11} />
          <Badge x={208} y={268} w={108} text={pctText} stroke={pctHidden ? '#EF4444' : changeColor} fill={pctHidden ? '#EF4444' : '#F3F4F6'} fontSize={pctHidden ? 20 : 16} />
        </>
      )}
    </svg>
  );
};

export default PercentDiagramSVG;
