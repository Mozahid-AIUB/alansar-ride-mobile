import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HandCoins } from 'phosphor-react-native';

import { gradients, lightTheme, onHero } from '@alansar/theme';

const { radius, spacing, typography } = lightTheme;

/** The product's differentiator: the passenger can offer a fare and drivers accept or counter. */
export function FareBanner() {
  return (
    <LinearGradient {...gradients.brand} style={styles.banner}>
      <View style={styles.ring} />
      <View style={styles.text}>
        <Text style={styles.kicker}>ONLY ON AL ANSAR</Text>
        <Text style={styles.title}>Name your own fare</Text>
        <Text style={styles.body}>
          Offer a price. Drivers accept or counter, and you ride only at a fare you agreed.
        </Text>
      </View>
      <View style={styles.iconWrap}>
        <HandCoins size={34} color={onHero.text} weight="duotone" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md + 4,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    width: 180,
    height: 180,
    right: -50,
    top: -70,
    borderRadius: radius.pill,
    borderWidth: 28,
    borderColor: onHero.glass,
  },
  text: {
    flex: 1,
  },
  kicker: {
    ...typography.label,
    color: onHero.textSoft,
  },
  title: {
    ...typography.headline,
    color: onHero.text,
    marginTop: 2,
  },
  body: {
    ...typography.bodySmall,
    color: onHero.textSoft,
    marginTop: spacing.xs,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: onHero.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
