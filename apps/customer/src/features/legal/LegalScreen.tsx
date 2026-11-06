import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLanguage, useT } from '@alansar/i18n';
import { lightTheme } from '@alansar/theme';

import { BackButton } from '@/components/BackButton';

import { privacy, terms, type LegalDoc } from './content';

const { colors, spacing, typography } = lightTheme;

/** Terms of Service or Privacy Policy, in the current language. */
export function LegalScreen({ doc }: { doc: 'terms' | 'privacy' }) {
  const insets = useSafeAreaInsets();
  const t = useT();
  const lang = useLanguage();

  const source: LegalDoc = (doc === 'terms' ? terms : privacy)[lang] ?? (doc === 'terms' ? terms.en : privacy.en);
  const title = t(doc === 'terms' ? 'legal.terms.title' : 'legal.privacy.title');

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton />
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updated}>{source.updated}</Text>
        {source.sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            {section.body.map((para, i) => (
              <Text key={i} style={styles.para}>
                {para}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
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
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  updated: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  section: {
    gap: spacing.sm,
  },
  heading: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  para: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
});
