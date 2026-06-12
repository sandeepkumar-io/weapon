'use client';

import { CSSProperties } from 'react';

const CYAN = '#22d3ee';
const AMBER = '#f59e0b';

// Which diagram shapes light up for a given hovered part key.
const HIGHLIGHT: Record<string, string[]> = {
  projectile: ['jacket', 'core', 'mouth'],
  jacket: ['jacket'],
  core: ['core'],
  mouth: ['mouth'],
  case: ['case'],
  powder: ['powder'],
  primer: ['primer'],
  flash: ['flash'],
  rim: ['rim'],
};

const ACCENT: Record<string, string> = {
  jacket: CYAN, core: CYAN, mouth: CYAN,
  case: AMBER, powder: AMBER, primer: AMBER, flash: AMBER, rim: AMBER,
};

interface Props {
  hovered: string | null;
  onHover: (key: string | null) => void;
}

export default function CartridgeDiagram({ hovered, onHover }: Props) {
  // Style for a shape group keyed by `k`.
  const g = (k: string): CSSProperties => {
    const on = hovered ? HIGHLIGHT[hovered]?.includes(k) : true;
    return {
      opacity: on ? 1 : 0.18,
      filter: hovered && on ? `drop-shadow(0 0 7px ${ACCENT[k]})` : 'none',
      transition: 'opacity .25s ease, filter .25s ease',
      cursor: 'pointer',
    };
  };
  // Hovering a diagram shape selects the matching card.
  const enter = (k: string) => () => onHover(k);
  const leave = () => onHover(null);

  const labelsOpacity = hovered ? 0.18 : 1;

  return (
    <svg viewBox="0 0 1000 680" fontFamily="Inter, Segoe UI, sans-serif" className="w-full h-auto">
      <defs>
        <linearGradient id="d-brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a5a1e" /><stop offset="0.25" stopColor="#d9b25a" />
          <stop offset="0.5" stopColor="#f3d889" /><stop offset="0.75" stopColor="#c79a40" />
          <stop offset="1" stopColor="#6e4f1a" />
        </linearGradient>
        <linearGradient id="d-copper" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a3d1d" /><stop offset="0.3" stopColor="#c97b43" />
          <stop offset="0.55" stopColor="#e6a06a" /><stop offset="0.8" stopColor="#b56a36" />
          <stop offset="1" stopColor="#6e3618" />
        </linearGradient>
        <linearGradient id="d-lead" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5b626c" /><stop offset="0.5" stopColor="#aab0b8" /><stop offset="1" stopColor="#565c66" />
        </linearGradient>
        <radialGradient id="d-primer" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#e7c474" /><stop offset="1" stopColor="#7c5a22" />
        </radialGradient>
      </defs>

      {/* Title */}
      <text x="500" y="52" textAnchor="middle" fill="#ffffff" fontSize="32" fontWeight="700" letterSpacing="2">9×19mm PARABELLUM</text>
      <text x="500" y="80" textAnchor="middle" fill={CYAN} fontSize="13" letterSpacing="6">CARTRIDGE ANATOMY · SECTIONAL VIEW</text>

      {/* ---- parts ---- */}
      <g style={g('case')} onMouseEnter={enter('case')} onMouseLeave={leave}>
        <path d="M426 250 L426 545 Q426 582 462 582 L498 582 Q534 582 534 545 L534 250 Q534 240 524 240 L436 240 Q426 240 426 250 Z" fill="url(#d-brass)" stroke="#3a2c10" strokeWidth="1.5" />
      </g>

      <g style={g('powder')} onMouseEnter={enter('powder')} onMouseLeave={leave}>
        <rect x="436" y="300" width="88" height="225" rx="10" fill="#15140f" />
        <g fill="#d1a23a" opacity="0.85">
          <circle cx="452" cy="320" r="4" /><circle cx="470" cy="330" r="4" /><circle cx="490" cy="318" r="4" /><circle cx="508" cy="332" r="4" />
          <circle cx="460" cy="352" r="4" /><circle cx="482" cy="346" r="4" /><circle cx="502" cy="356" r="4" /><circle cx="446" cy="372" r="4" />
          <circle cx="468" cy="378" r="4" /><circle cx="492" cy="384" r="4" /><circle cx="512" cy="372" r="4" /><circle cx="456" cy="404" r="4" />
          <circle cx="480" cy="410" r="4" /><circle cx="504" cy="402" r="4" /><circle cx="464" cy="432" r="4" /><circle cx="488" cy="438" r="4" />
          <circle cx="510" cy="430" r="4" /><circle cx="450" cy="458" r="4" /><circle cx="476" cy="464" r="4" /><circle cx="500" cy="468" r="4" />
          <circle cx="466" cy="490" r="4" /><circle cx="492" cy="494" r="4" /><circle cx="480" cy="512" r="4" />
        </g>
      </g>

      <g style={g('jacket')} onMouseEnter={enter('jacket')} onMouseLeave={leave}>
        <path d="M480 118 Q452 150 446 200 L446 250 Q446 300 480 300 Q514 300 514 250 L514 200 Q508 150 480 118 Z" fill="url(#d-copper)" stroke="#3a1c0c" strokeWidth="1.5" />
      </g>
      <g style={g('core')} onMouseEnter={enter('core')} onMouseLeave={leave}>
        <path d="M480 150 Q462 178 458 210 L458 250 Q458 286 480 286 Q502 286 502 250 L502 210 Q498 178 480 150 Z" fill="url(#d-lead)" />
      </g>
      <g style={g('mouth')} onMouseEnter={enter('mouth')} onMouseLeave={leave}>
        <path d="M446 240 L446 262 Q446 252 458 250 L502 250 Q514 252 514 262 L514 240 Z" fill="url(#d-brass)" opacity="0.95" />
      </g>

      <g style={g('rim')} onMouseEnter={enter('rim')} onMouseLeave={leave}>
        <rect x="420" y="556" width="120" height="10" rx="4" fill="#0d0d0d" opacity="0.55" />
        <path d="M414 582 L546 582 L538 596 Q534 604 524 604 L436 604 Q426 604 422 596 Z" fill="url(#d-brass)" stroke="#3a2c10" strokeWidth="1.5" />
      </g>
      <g style={g('flash')} onMouseEnter={enter('flash')} onMouseLeave={leave}>
        <line x1="480" y1="525" x2="480" y2="572" stroke="#0a0a0a" strokeWidth="4" />
      </g>
      <g style={g('primer')} onMouseEnter={enter('primer')} onMouseLeave={leave}>
        <circle cx="480" cy="586" r="15" fill="url(#d-primer)" stroke="#4a3614" strokeWidth="1.5" />
      </g>

      {/* sheen */}
      <rect x="452" y="118" width="10" height="470" fill="#ffffff" opacity="0.08" />

      {/* labels (dim while a part is focused) */}
      <g fontSize="16" fill="#e5e7eb" style={{ opacity: labelsOpacity, transition: 'opacity .25s' }}>
        <g stroke={CYAN} strokeWidth="1.5">
          <line x1="470" y1="150" x2="300" y2="150" /><line x1="450" y1="205" x2="300" y2="210" />
          <line x1="480" y1="220" x2="300" y2="270" /><line x1="450" y1="256" x2="300" y2="330" />
        </g>
        <g fill={CYAN}><circle cx="470" cy="150" r="3.5" /><circle cx="450" cy="205" r="3.5" /><circle cx="480" cy="220" r="3.5" /><circle cx="450" cy="256" r="3.5" /></g>
        <text x="294" y="146" textAnchor="end" fontWeight="600">Bullet — projectile (FMJ)</text>
        <text x="294" y="214" textAnchor="end" fontWeight="600">Copper jacket</text>
        <text x="294" y="274" textAnchor="end" fontWeight="600">Lead core</text>
        <text x="294" y="334" textAnchor="end" fontWeight="600">Case mouth / neck</text>

        <g stroke={AMBER} strokeWidth="1.5">
          <line x1="505" y1="400" x2="660" y2="400" /><line x1="534" y1="470" x2="660" y2="470" />
          <line x1="486" y1="540" x2="660" y2="540" /><line x1="480" y1="586" x2="660" y2="600" /><line x1="540" y1="595" x2="660" y2="650" />
        </g>
        <g fill={AMBER}><circle cx="505" cy="400" r="3.5" /><circle cx="534" cy="470" r="3.5" /><circle cx="486" cy="540" r="3.5" /><circle cx="480" cy="586" r="3.5" /><circle cx="540" cy="595" r="3.5" /></g>
        <text x="666" y="396" fontWeight="600">Propellant (powder)</text>
        <text x="666" y="466" fontWeight="600">Brass case</text>
        <text x="666" y="536" fontWeight="600">Flash hole</text>
        <text x="666" y="604" fontWeight="600">Primer (Boxer)</text>
        <text x="666" y="654" fontWeight="600">Rim / extractor groove</text>
      </g>

      <text x="500" y="676" textAnchor="middle" fill="#9aa0aa" fontSize="13">
        Caliber 9 mm · Case length 19 mm · Overall 29.7 mm · Rimless · Cal .355&quot;
      </text>
    </svg>
  );
}
