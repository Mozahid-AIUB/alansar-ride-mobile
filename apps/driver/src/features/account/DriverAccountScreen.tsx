import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { EnvelopeSimple, Phone, SignOut, Translate } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { signOut } from '@alansar/auth';
import { i18n, useLanguage, useT } from '@alansar/i18n';
import { gradients, lightTheme, onHero } from '@alansar/theme';
import { formatBdPhone, initialsOf } from '@alansar/utils';

import { PressableScale } from '@/components/PressableScale';
import { useSession } from '@/hooks/useSession';

const { colors, spacing, radius, typography, shadows } = lightTheme;

/** Driver account: profile, language, and log out. */
export function DriverAccountScreen() {
  const insets = useSafeAreaInsets();
  const t = useT();
  const lang = useLanguage();
  const state = useSession();

  if (state.status !== 'signedIn') return null;
  const { user } = state;
  const name = user.full_name?.trim() || 'Al Ansar driver';

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient {...gradients.header} style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(name) || 'D'}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
        </LinearGradient>

        <View style={styles.body}>
          <Group title={t('account.personalInfo')}>
            {user.phone ? <InfoRow icon={Phone} label={t('account.mobile')} value={formatBdPhone(user.phone)} /> : null}
            {user.email ? <InfoRow icon={EnvelopeSimple} label={t('account.email')} value={user.email} /> : null}
          </Group>

          <Group title={t('account.language')}>
            <LangRow label={t('account.languageEnglish')} selected={lang === 'en'} onPress={() => i18n.set('en')} />
            <LangRow label={t('account.languageBangla')} selected={lang === 'bn'} onPress={() => i18n.set('bn')} />
          </Group>

          <View style={styles.group}>
            <PressableScale accessibilityRole="button" style={styles.row} onPress={() => void signOut()}>
              <View style={[styles.rowIcon, styles.rowIconDanger]}>
                <SignOut size={20} color={colors.danger} weight="duotone" />
              </View>
              <Text style={[styles.actionLabel, styles.danger]}>{t('driverHome.logout')}</Text>
            </PressableScale>
          </View>

          <Text style={styles.version}>Al Ansar Driver · v2.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon size={20} color={colors.text} weight="duotone" />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function LangRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <PressableScale accessibilityRole="radio" accessibilityState={{ selected }} style={styles.row} onPress={onPress}>
      <View style={styles.rowIcon}>
        <Translate size={20} color={colors.text} weight="duotone" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
      <View style={[styles.radio, selected && styles.radioOn]} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: onHero.glass,
    borderWidth: 3,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.headline,
    color: onHero.text,
  },
  name: {
    ...typography.headline,
    color: onHero.text,
    marginTop: spacing.sm + 4,
  },
  body: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  groupTitle: {
    ...typography.label,
    color: colors.textSubtle,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  group: {
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    boxShadow: shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    paddingVertical: spacing.sm + 6,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconDanger: {
    backgroundColor: colors.dangerTint,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  rowValue: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  actionLabel: {
    ...typography.bodyStrong,
    flex: 1,
    color: colors.text,
  },
  danger: {
    color: colors.danger,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.disabled,
  },
  radioOn: {
    borderColor: colors.brand,
    backgroundColor: colors.brand,
  },
  version: {
    ...typography.caption,
    color: colors.textSubtle,
    textAlign: 'center',
  },
});
