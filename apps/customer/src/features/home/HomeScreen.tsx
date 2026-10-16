import { useState, type ComponentType } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  CalendarBlank,
  Car,
  Clock,
  EnvelopeSimple,
  MagnifyingGlass,
  Phone,
  SignOut,
  type IconProps,
} from 'phosphor-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { signOut } from '@alansar/auth';
import { gradients, lightTheme, onHero } from '@alansar/theme';
import { formatBdPhone } from '@alansar/utils';

import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { PressableScale } from '@/components/PressableScale';
import { useSession } from '@/hooks/useSession';

const { colors, spacing, radius, typography, shadows, controls } = lightTheme;

const enter = (delay: number) => FadeInDown.delay(delay).duration(480);

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

/** Signed-in home. Booking lands here next; for now it shows the account and what's coming. */
export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const state = useSession();
  const [bookingTapped, setBookingTapped] = useState(false);

  if (state.status !== 'signedIn') return null;
  const { user } = state;
  const name = user.full_name?.trim() || 'there';

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.lg }}
        bounces={false}
      >
        <LinearGradient
          {...gradients.header}
          style={[styles.hero, { paddingTop: insets.top + spacing.md }]}
        >
          <View style={[styles.orb, styles.orbTop]} />

          <View style={styles.heroRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(name) || '🙂'}</Text>
            </View>
            <View style={styles.heroText}>
              <Text style={styles.hello}>{greeting()}</Text>
              <Text style={styles.name} numberOfLines={1}>
                {name.split(' ')[0]}
              </Text>
            </View>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Log out"
              hitSlop={8}
              style={styles.glassButton}
              onPress={() => void signOut()}
            >
              <SignOut size={20} color={onHero.text} weight="bold" />
            </PressableScale>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <Animated.View entering={enter(0)}>
            <PressableScale
              accessibilityRole="button"
              style={styles.search}
              onPress={() => setBookingTapped(true)}
            >
              <MagnifyingGlass size={22} color={colors.text} weight="bold" />
              <Text style={styles.searchText}>Where to?</Text>
              <View style={styles.nowChip}>
                <Clock size={16} color={colors.text} />
                <Text style={styles.nowText}>Now</Text>
              </View>
            </PressableScale>
          </Animated.View>

          {bookingTapped ? (
            <Notice message="Booking a ride is the next screen we build." />
          ) : null}

          <Animated.View entering={enter(80)} style={styles.actions}>
            <QuickAction icon={Car} label="Ride" onPress={() => setBookingTapped(true)} />
            <QuickAction
              icon={CalendarBlank}
              label="Schedule"
              onPress={() => setBookingTapped(true)}
            />
          </Animated.View>

          <Animated.View entering={enter(160)}>
            <Text style={styles.sectionTitle}>Recent rides</Text>
            <View style={styles.card}>
              <View style={styles.emptyIcon}>
                <Car size={26} color={colors.primary} weight="duotone" />
              </View>
              <Text style={styles.emptyTitle}>No rides yet</Text>
              <Text style={styles.emptyBody}>Your trips will show up here.</Text>
            </View>
          </Animated.View>

          <Animated.View entering={enter(240)}>
            <Text style={styles.sectionTitle}>Your account</Text>
            <View style={[styles.card, styles.accountCard]}>
              {user.phone ? (
                <AccountRow icon={Phone} value={formatBdPhone(user.phone)} />
              ) : null}
              {user.email ? <AccountRow icon={EnvelopeSimple} value={user.email} /> : null}
            </View>
          </Animated.View>

          <Animated.View entering={enter(320)}>
            <Button variant="outline" label="Log out" onPress={() => void signOut()} />
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onPress,
}: {
  icon: ComponentType<IconProps>;
  label: string;
  onPress: () => void;
}) {
  return (
    <PressableScale accessibilityRole="button" style={styles.action} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Icon size={26} color={colors.primary} weight="duotone" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </PressableScale>
  );
}

function AccountRow({ icon: Icon, value }: { icon: ComponentType<IconProps>; value: string }) {
  return (
    <View style={styles.accountRow}>
      <Icon size={20} color={colors.textSubtle} />
      <Text style={styles.accountValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + spacing.lg,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: radius.pill,
    backgroundColor: onHero.orb,
  },
  orbTop: {
    width: 240,
    height: 240,
    top: -120,
    right: -60,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: onHero.glass,
    borderWidth: controls.borderWidth,
    borderColor: onHero.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.title,
    color: onHero.text,
  },
  heroText: {
    flex: 1,
  },
  hello: {
    ...typography.bodySmall,
    color: onHero.textMuted,
  },
  name: {
    ...typography.headline,
    color: onHero.text,
  },
  glassButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: onHero.glass,
    borderWidth: controls.borderWidth,
    borderColor: onHero.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    marginTop: -spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  search: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    paddingLeft: spacing.md + 4,
    paddingRight: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    boxShadow: shadows.raised,
  },
  searchText: {
    ...typography.title,
    flex: 1,
    color: colors.text,
  },
  nowChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 4,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  nowText: {
    ...typography.titleSmall,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    boxShadow: shadows.card,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    ...typography.titleSmall,
    color: colors.text,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm + 4,
  },
  card: {
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    boxShadow: shadows.card,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm + 4,
  },
  emptyTitle: {
    ...typography.titleSmall,
    color: colors.text,
  },
  emptyBody: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  accountCard: {
    alignItems: 'stretch',
    gap: spacing.md,
    paddingVertical: spacing.md + 4,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  accountValue: {
    ...typography.body,
    flex: 1,
    color: colors.text,
  },
});
