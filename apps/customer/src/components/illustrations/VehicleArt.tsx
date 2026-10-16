import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { palette } from '@alansar/theme';

/**
 * Side-view vehicle illustrations in the brand palette, one per vehicle-type
 * slug. The API stores no category images yet, so these stand in; when a type
 * has an `image_url` the card can show that instead.
 */

const INK = palette.ink900;
const WHEEL = palette.ink950;
const HUB = palette.ink300;
const GLASS = palette.ink100;
const GREEN = palette.green500;
const LIGHT = palette.lime;

type Kind = 'car' | 'premium' | 'motorcycle' | 'scooter' | 'auto' | 'rickshaw';

export const vehicleKind = (slug: string): Kind => {
  const s = slug.toLowerCase();
  if (s.includes('auto') || s.includes('cng')) return 'auto';
  if (s.includes('rickshaw') || s.includes('mishuk')) return 'rickshaw';
  if (s.includes('motor')) return 'motorcycle';
  if (s.includes('bike') || s.includes('scoot')) return 'scooter';
  if (s.includes('private') || s.includes('premium') || s.includes('suv')) return 'premium';
  return 'car';
};

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r} fill={WHEEL} />
      <Circle cx={cx} cy={cy} r={r * 0.42} fill={HUB} />
    </G>
  );
}

function Shadow() {
  return <Ellipse cx={32} cy={34} rx={25} ry={1.8} fill={INK} fillOpacity={0.1} />;
}

function Car() {
  return (
    <G>
      <Shadow />
      <Path
        d="M6 24c0-4 2-6 6-6.5l8-1.5 7-5.5c1.5-1.2 3.4-2 5.4-2H42c2.4 0 4.6 1.1 6 3l4 5.5 4 1c2.4.6 4 2.6 4 5V27a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z"
        fill={INK}
      />
      <Path d="M23 16.5l6-4.6c1-.7 2.2-1.1 3.4-1.1H37v5.7z" fill={GLASS} />
      <Path d="M39 10.8h3c1.8 0 3.4.8 4.4 2.2l2.6 3.5H39z" fill={GLASS} />
      <Rect x={10} y={21} width={44} height={1.6} rx={0.8} fill={GREEN} />
      <Rect x={56.4} y={20} width={3} height={2} rx={1} fill={LIGHT} />
      <Wheel cx={18} cy={28} r={5.5} />
      <Wheel cx={48} cy={28} r={5.5} />
    </G>
  );
}

function Premium() {
  return (
    <G>
      <Shadow />
      <Rect x={25} y={4.6} width={20} height={1.4} rx={0.7} fill={INK} />
      <Path
        d="M6 25c0-4 2-5.5 5-6l5-1 5-8.5C22 8 23.6 7 25.4 7H46c2 0 3.8 1.2 4.6 3l3.4 8 3 .8c2 .5 3 2.2 3 4.2v5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z"
        fill={INK}
      />
      <Path d="M23 17.5l3-7c.4-.9 1.3-1.5 2.3-1.5H35v8.5z" fill={GLASS} />
      <Path d="M37 9h8.5c1.1 0 2.1.7 2.5 1.7l3 6.8H37z" fill={GLASS} />
      <Rect x={10} y={22} width={44} height={1.6} rx={0.8} fill={LIGHT} />
      <Rect x={56.4} y={20.5} width={3} height={2} rx={1} fill={LIGHT} />
      <Wheel cx={18} cy={29} r={6} />
      <Wheel cx={48} cy={29} r={6} />
    </G>
  );
}

function Motorcycle() {
  return (
    <G>
      <Shadow />
      <Circle cx={14} cy={26} r={7.5} fill="none" stroke={WHEEL} strokeWidth={3} />
      <Circle cx={50} cy={26} r={7.5} fill="none" stroke={WHEEL} strokeWidth={3} />
      <Circle cx={14} cy={26} r={2} fill={HUB} />
      <Circle cx={50} cy={26} r={2} fill={HUB} />
      <Path d="M14 26l12-9h14l10 9" fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <Rect x={27} y={17} width={11} height={6} rx={1.6} fill={palette.ink700} />
      <Path d="M23 13a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2H23z" fill={INK} />
      <Path d="M37.5 11.5h6.5l2 5.5h-7.5z" fill={GREEN} />
      <Path d="M44 12l4-6" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <Path d="M46 6h4" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <Circle cx={49.5} cy={10} r={1.6} fill={LIGHT} />
    </G>
  );
}

function Scooter() {
  return (
    <G>
      <Shadow />
      <Path d="M8 24a8 8 0 0 1 8-8h14a2 2 0 0 1 2 2v6z" fill={GREEN} />
      <Path d="M12 15a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v1H12z" fill={INK} />
      <Rect x={30} y={22} width={15} height={3} rx={1.5} fill={INK} />
      <Path d="M41 12h5l2.5 13h-4.5z" fill={palette.green600} />
      <Path d="M44.5 13L41 6" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <Path d="M38 6h6" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <Circle cx={46} cy={14} r={1.5} fill={LIGHT} />
      <Wheel cx={15} cy={28} r={5.5} />
      <Wheel cx={49} cy={28} r={5.5} />
    </G>
  );
}

/** Bangladesh's CNG auto-rickshaw: green body, canopy roof, three wheels. */
function Auto() {
  return (
    <G>
      <Shadow />
      <Rect x={10} y={4.5} width={34} height={2} rx={1} fill={INK} />
      <Path
        d="M10 24V10a4 4 0 0 1 4-4h28c4.5 0 8.4 3.1 9.4 7.5l2.1 8.5H56a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z"
        fill={GREEN}
      />
      <Rect x={15} y={10} width={15} height={9} rx={2} fill={GLASS} />
      <Path d="M33 10h8.5c2.3 0 4.3 1.5 4.9 3.7l1.4 5.3H33z" fill={GLASS} />
      <Rect x={10} y={25} width={48} height={3} rx={1.5} fill={INK} />
      <Circle cx={55.5} cy={20} r={1.4} fill={LIGHT} />
      <Wheel cx={20} cy={29} r={5} />
      <Wheel cx={50} cy={29} r={5} />
    </G>
  );
}

/** Cycle rickshaw: big rear wheels under a hooded seat, rider up front. */
function Rickshaw() {
  return (
    <G>
      <Shadow />
      <Circle cx={18} cy={25} r={8.5} fill="none" stroke={WHEEL} strokeWidth={2.6} />
      <Circle cx={18} cy={25} r={1.8} fill={HUB} />
      <Circle cx={50} cy={28} r={5.5} fill="none" stroke={WHEEL} strokeWidth={2.6} />
      <Circle cx={50} cy={28} r={1.5} fill={HUB} />
      <Path d="M8 18c0-8 6-13 14-13h6a3 3 0 0 1 3 3v10z" fill={GREEN} />
      <Path d="M12 12c2-4 6-5.5 10-5.5" fill="none" stroke={LIGHT} strokeWidth={1.5} strokeLinecap="round" />
      <Rect x={9} y={16} width={22} height={5} rx={1.5} fill={INK} />
      <Path d="M30 20l10 1 10 7" fill="none" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <Rect x={38} y={14.5} width={7} height={2.6} rx={1.2} fill={INK} />
      <Path d="M41.5 17l-.5 4" stroke={INK} strokeWidth={2} />
      <Path d="M50 28l-3-15" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M45 13h5" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
    </G>
  );
}

const ART: Record<Kind, () => React.JSX.Element> = {
  car: Car,
  premium: Premium,
  motorcycle: Motorcycle,
  scooter: Scooter,
  auto: Auto,
  rickshaw: Rickshaw,
};

export function VehicleArt({ slug, width = 72 }: { slug: string; width?: number }) {
  const Art = ART[vehicleKind(slug)];
  return (
    <Svg width={width} height={(width * 36) / 64} viewBox="0 0 64 36">
      <Art />
    </Svg>
  );
}
