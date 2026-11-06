import type { ComponentType } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  CheckCircle,
  GlobeHemisphereEast,
  MapTrifold,
  Translate,
  type IconProps,
} from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { i18n, useLanguage, useT, type Language } from '@alansar/i18n';
import { lightTheme } from '@alansar/theme';

import { BackButton } from '@/components/BackButton';
import { PressableScale } from '@/components/PressableScale';
import { hasMapboxToken } from '@/components/map/mapConfig';
import { mapPrefs, useMapProvider, type MapProvider } from '@/store/mapPrefs';

const { colors, spacing, radius, typography, shadows } = lightTheme;

/** App preferences: map and language, grouped in one place (Account → Settings). */
export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const t = useT();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton />
        <Text style={styles.title}>{t('settings.title')}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Group title={t('account.language')}>
          <Option
            icon={Translate}
            label={t('account.languageEnglish')}
            selected={useLanguage() === 'en'}
            onPress={() => i18n.set('en')}
          />
          <Option
            icon={Translate}
            label={t('account.languageBangla')}
            selected={useLanguage() === 'bn'}
            onPress={() => i18n.set('bn')}
          />
        </Group>

        <Group title={t('account.map')}>
          <MapOption value="google" icon={MapTrifold} label={t('account.mapGoogle')} body={t('account.mapGoogleBody')} />
          <MapOption
            value="mapbox"
            icon={GlobeHemisphereEast}
            label={t('account.mapMapbox')}
            body={hasMapboxToken ? t('account.mapMapboxBody') : t('account.mapMapboxNoToken')}
          />
        </Group>
      </ScrollView>
    </View>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.groupWrap}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

/** A radio row with an icon, label and optional body line. */
function Option({
  icon: Icon,
  label,
  body,
  selected,
  onPress,
}: {
  icon: ComponentType<IconProps>;
  label: string;
  body?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={styles.row}
      onPress={onPress}
    >
      <View style={styles.rowIcon}>
        <Icon size={20} color={colors.text} weight="duotone" />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        {body ? <Text style={styles.body}>{body}</Text> : null}
      </View>
      {selected ? <CheckCircle size={22} color={colors.brand} weight="fill" /> : <View style={styles.radio} />}
    </PressableScale>
  );
}

function MapOption({
  value,
  icon,
  label,
  body,
}: {
  value: MapProvider;
  icon: ComponentType<IconProps>;
  label: string;
  body: string;
}) {
  return <Option icon={icon} label={label} body={body} selected={useMapProvider() === value} onPress={() => mapPrefs.set(value)} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    flex: 1,
    textAlign: 'center',
    color: colors.text,
  },
  spacer: {
    width: 44,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  groupWrap: {},
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
  rowText: {
    flex: 1,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  body: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.disabled,
  },
});
