import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChatCircleDots, EnvelopeSimple, PaperPlaneTilt, Phone } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '@alansar/i18n';
import { lightTheme, fonts } from '@alansar/theme';

import { BackButton } from '@/components/BackButton';
import { PressableScale } from '@/components/PressableScale';

const { colors, spacing, radius, typography, shadows } = lightTheme;

/** Operator contact points. Replace with the real support line/inbox. */
const SUPPORT_PHONE = '+8809600000000';
const SUPPORT_EMAIL = 'support@alansartaxi.com';

/**
 * Help & support. Until a live chat backend exists, this offers the reliable
 * channels — call and email — and lets the rider draft a message that opens in
 * their email app addressed to support.
 */
export function SupportScreen() {
  const insets = useSafeAreaInsets();
  const t = useT();
  const [message, setMessage] = useState('');

  const sendEmail = () => {
    const body = encodeURIComponent(message.trim());
    const subject = encodeURIComponent('Al Ansar Ride — support');
    void Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}${body ? `&body=${body}` : ''}`);
  };

  const call = () => void Linking.openURL(`tel:${SUPPORT_PHONE}`);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton />
        <Text style={styles.title}>{t('support.title')}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hello}>
          <View style={styles.helloIcon}>
            <ChatCircleDots size={24} color={colors.brand} weight="fill" />
          </View>
          <Text style={styles.helloTitle}>{t('support.greeting')}</Text>
          <Text style={styles.helloBody}>{t('support.subtitle')}</Text>
        </View>

        <View style={styles.channels}>
          <PressableScale style={styles.channel} accessibilityRole="button" onPress={call}>
            <Phone size={22} color={colors.text} weight="duotone" />
            <Text style={styles.channelLabel}>{t('support.callUs')}</Text>
          </PressableScale>
          <PressableScale style={styles.channel} accessibilityRole="button" onPress={sendEmail}>
            <EnvelopeSimple size={22} color={colors.text} weight="duotone" />
            <Text style={styles.channelLabel}>{t('support.emailUs')}</Text>
          </PressableScale>
        </View>

        <Text style={styles.composeHint}>{t('support.empty')}</Text>
        <View style={styles.composeCard}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={t('support.inputPlaceholder')}
            placeholderTextColor={colors.placeholder}
            multiline
            style={styles.input}
            accessibilityLabel={t('support.inputPlaceholder')}
          />
          <PressableScale
            accessibilityRole="button"
            style={[styles.send, !message.trim() && styles.sendDisabled]}
            disabled={!message.trim()}
            onPress={sendEmail}
          >
            <PaperPlaneTilt size={18} color={colors.onPrimary} weight="fill" />
            <Text style={styles.sendText}>{t('support.send')}</Text>
          </PressableScale>
        </View>
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
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  hello: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  helloIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  helloTitle: {
    ...typography.headline,
    color: colors.text,
    textAlign: 'center',
  },
  helloBody: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
  channels: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  channel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    boxShadow: shadows.card,
  },
  channelLabel: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  composeHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: -spacing.sm,
  },
  composeCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: spacing.md,
  },
  input: {
    minHeight: 96,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  send: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  sendDisabled: {
    opacity: 0.5,
  },
  sendText: {
    ...typography.bodyStrong,
    color: colors.onPrimary,
  },
});
