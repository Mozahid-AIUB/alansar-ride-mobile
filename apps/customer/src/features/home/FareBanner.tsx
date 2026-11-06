import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HandCoins } from 'phosphor-react-native';

import { useT } from '@alansar/i18n';
import { gradients, lightTheme, onHero } from '@alansar/theme';

const { radius, spacing, typography } = lightTheme;

/** The product's differentiator: the passenger can offer a fare and drivers accept or counter. */
export function FareBanner() {
  const t = useT();
  return (
    <LinearGradient {...gradients.brand} style={styles.banner}>
      <View style={styles.ring} />
      <View style={styles.text}>
        <Text style={styles.kicker}>{t('home.fareKicker')}</Text>
        <Text style={styles.title}>{t('home.fareTitle')}</Text>
        <Text style={styles.body}>{t('home.fareBody')}</Text>
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
