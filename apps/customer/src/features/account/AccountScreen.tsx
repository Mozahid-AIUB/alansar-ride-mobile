import type { ComponentType } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  CalendarCheck,
  CaretRight,
  CheckCircle,
  GlobeHemisphereEast,
  MapTrifold,
  EnvelopeSimple,
  FileText,
  Lifebuoy,
  Phone,
  ShieldCheck,
  SignOut,
  type IconProps,
} from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { signOut } from '@alansar/auth';
import { gradients, lightTheme, onHero } from '@alansar/theme';
import { formatBdPhone, initialsOf } from '@alansar/utils';

import { MapArt } from '@/components/illustrations/MapArt';
import { PressableScale } from '@/components/PressableScale';
import { Toast, useToast } from '@/components/Toast';
import { useSession } from '@/hooks/useSession';
import { hasMapboxToken } from '@/components/map/mapConfig';
import { mapPrefs, useMapProvider, type MapProvider } from '@/store/mapPrefs';

const { colors, spacing, radius, typography, shadows } = lightTheme;

const memberSince = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
};

export function AccountScreen() {
  const insets = useSafeAreaInsets();
  const state = useSession();
  const toast = useToast();

  if (state.status !== 'signedIn') return null;
  const { user } = state;
  const name = user.full_name?.trim() || 'Al Ansar rider';
  const since = memberSince(user.created_at);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          {...gradients.header}
          style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}
        >
          <MapArt quiet />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(name) || 'A'}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          {since ? <Text style={styles.since}>Member since {since}</Text> : null}
        </LinearGradient>

        <View style={styles.body}>
          <Group title="Personal info">
            {user.phone ? <InfoRow icon={Phone} label="Mobile" value={formatBdPhone(user.phone)} /> : null}
            {user.email ? <InfoRow icon={EnvelopeSimple} label="Email" value={user.email} /> : null}
            <InfoRow icon={ShieldCheck} label="Account" value={user.status === 'active' ? 'Active' : user.status} />
          </Group>

          <Group title="Map">
            <MapOption value="google" icon={MapTrifold} label="Google Maps" body="Default. Apple Maps on iPhone." />
            <MapOption
              value="mapbox"
              icon={GlobeHemisphereEast}
              label="Mapbox"
              body={hasMapboxToken ? 'Clean, detailed maps by Mapbox.' : 'Needs a Mapbox token; showing OpenStreetMap for now.'}
            />
          </Group>

          <Group title="More">
            <ActionRow icon={CalendarCheck} label="Scheduled rides" onPress={() => router.navigate('/activity')} />
            <ActionRow icon={Lifebuoy} label="Help & support" onPress={() => toast.show('Support chat is coming soon.')} />
            <ActionRow icon={FileText} label="Terms & privacy" onPress={() => toast.show('Terms and privacy pages are coming soon.')} />
          </Group>

          <View style={styles.group}>
            <ActionRow icon={SignOut} label="Log out" tone="danger" onPress={() => void signOut()} />
          </View>

          <Text style={styles.version}>Al Ansar Ride · v2.0.0</Text>
        </View>
      </ScrollView>
      <Toast toast={toast.toast} />
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

function MapOption({
  value,
  icon: Icon,
  label,
  body,
}: {
  value: MapProvider;
  icon: ComponentType<IconProps>;
  label: string;
  body: string;
}) {
  const selected = useMapProvider() === value;
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={styles.row}
      onPress={() => mapPrefs.set(value)}
    >
      <View style={styles.rowIcon}>
        <Icon size={20} color={colors.text} weight="duotone" />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.actionLabel}>{label}</Text>
        <Text style={styles.rowLabel}>{body}</Text>
      </View>
      {selected ? (
        <CheckCircle size={22} color={colors.brand} weight="fill" />
      ) : (
        <View style={styles.radio} />
      )}
    </PressableScale>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: ComponentType<IconProps>; label: string; value: string }) {
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

function ActionRow({
  icon: Icon,
  label,
  onPress,
  tone = 'default',
}: {
  icon: ComponentType<IconProps>;
  label: string;
  onPress: () => void;
  tone?: 'default' | 'danger';
}) {
  const danger = tone === 'danger';
  return (
    <PressableScale accessibilityRole="button" style={styles.row} onPress={onPress}>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Icon size={20} color={danger ? colors.danger : colors.text} weight="duotone" />
      </View>
      <Text style={[styles.actionLabel, danger && styles.danger]}>{label}</Text>
      {danger ? null : <CaretRight size={18} color={colors.textSubtle} weight="bold" />}
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
    overflow: 'hidden',
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
  since: {
    ...typography.caption,
    color: onHero.textMuted,
    marginTop: 2,
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
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.disabled,
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
  version: {
    ...typography.caption,
    color: colors.textSubtle,
    textAlign: 'center',
  },
});
