import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { onHero, palette } from '@alansar/theme';

const ROUTE = 'M110 205 C122 150 172 162 205 126 S256 72 300 62';

/**
 * Stylised city map for the ink headers: streets, blocks, a soft lime glow and
 * a route between a pickup dot and a destination pin. Decorative; fills its
 * parent. `quiet` fades the route so headline text over it stays crisp;
 * `showRoute={false}` leaves just the streets, as a backdrop for a real route.
 */
export function MapArt({ quiet = false, showRoute = true }: { quiet?: boolean; showRoute?: boolean }) {
  const route = quiet ? 0.32 : 1;

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="mapart-glow" cx="88%" cy="0%" r="70%">
          <Stop offset="0" stopColor={palette.lime} stopOpacity={quiet ? 0.22 : 0.3} />
          <Stop offset="1" stopColor={palette.lime} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={-50} y={-50} width={500} height={400} fill="url(#mapart-glow)" />

      <G stroke={onHero.street} strokeLinecap="round" fill="none">
        <Path d="M-20 70 L420 40" strokeWidth={14} />
        <Path d="M-20 192 L420 232" strokeWidth={10} />
        <Path d="M92 -20 L132 320" strokeWidth={10} />
        <Path d="M272 -20 L250 320" strokeWidth={14} />
        <Path d="M-20 132 C80 120 160 152 200 122 S330 92 420 122" strokeWidth={6} />
        <Path d="M182 -20 L202 320" strokeWidth={5} />
        <Path d="M332 -20 L362 320" strokeWidth={5} />
      </G>

      <G fill={onHero.block}>
        <Rect x={20} y={82} width={56} height={40} rx={6} />
        <Rect x={146} y={60} width={40} height={46} rx={6} />
        <Rect x={292} y={132} width={50} height={40} rx={6} />
        <Rect x={150} y={242} width={60} height={46} rx={6} />
        <Rect x={20} y={216} width={50} height={50} rx={6} />
        <Rect x={302} y={248} width={46} height={40} rx={6} />
      </G>

      {showRoute ? (
      <G opacity={route}>
        <Path d={ROUTE} stroke={palette.lime} strokeOpacity={0.22} strokeWidth={12} strokeLinecap="round" fill="none" />
        <Path d={ROUTE} stroke={palette.lime} strokeWidth={4} strokeLinecap="round" fill="none" />
        <Circle cx={110} cy={205} r={11} fill={palette.lime} fillOpacity={0.22} />
        <Circle cx={110} cy={205} r={6} fill={palette.lime} />
        <Circle cx={110} cy={205} r={2.4} fill={palette.ink900} />
        <Circle cx={300} cy={62} r={9.5} fill={palette.white} />
        <Rect x={296.5} y={58.5} width={7} height={7} rx={1.5} fill={palette.ink900} />
      </G>
      ) : null}
    </Svg>
  );
}
