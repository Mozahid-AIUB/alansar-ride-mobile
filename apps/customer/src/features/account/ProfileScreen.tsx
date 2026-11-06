import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMutation } from '@tanstack/react-query';
import { EnvelopeSimple, Phone, User as UserIcon } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usersApi } from '@alansar/api';
import { updateUser } from '@alansar/auth';
import { useT } from '@alansar/i18n';
import { lightTheme } from '@alansar/theme';
import { formatBdPhone, initialsOf, isValidEmail } from '@alansar/utils';

import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { TextField } from '@/components/TextField';
import { Toast, useToast } from '@/components/Toast';
import { useSession } from '@/hooks/useSession';

const { colors, spacing, radius, typography } = lightTheme;

/** Edit the signed-in user's name and email. Phone is the login and is locked. */
export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const state = useSession();
  const t = useT();
  const toast = useToast();

  const user = state.status === 'signedIn' ? state.user : null;
  const [name, setName] = useState(user?.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();

  const save = useMutation({
    mutationFn: () => usersApi.updateMe({ fullName: name.trim(), email: email.trim() || undefined }),
    onSuccess: async (fresh) => {
      await updateUser(fresh);
      toast.show(t('profile.saved'));
      setTimeout(() => (router.canGoBack() ? router.back() : router.replace('/account')), 600);
    },
  });

  if (!user) return null;

  const onSave = () => {
    let ok = true;
    if (!name.trim()) {
      setNameError(t('profile.nameRequired'));
      ok = false;
    } else setNameError(undefined);
    if (email.trim() && !isValidEmail(email.trim())) {
      setEmailError('—');
      ok = false;
    } else setEmailError(undefined);
    if (ok) save.mutate();
  };

  const displayName = name.trim() || t('account.riderFallback');

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton />
        <Text style={styles.title}>{t('profile.title')}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrap}>
          {user.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} contentFit="cover" transition={200} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(displayName) || 'A'}</Text>
            </View>
          )}
        </View>

        <View style={styles.form}>
          <TextField
            label={t('profile.fullName')}
            icon={UserIcon}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={nameError}
          />
          <TextField
            label={t('profile.email')}
            icon={EnvelopeSimple}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={emailError}
          />
          <View style={styles.locked}>
            <Phone size={20} color={colors.placeholder} />
            <View style={styles.lockedText}>
              <Text style={styles.lockedLabel}>{t('profile.mobile')}</Text>
              <Text style={styles.lockedValue}>{user.phone ? formatBdPhone(user.phone) : '—'}</Text>
            </View>
          </View>
          <Text style={styles.hint}>{t('profile.mobileLocked')}</Text>

          {save.isError ? <Notice tone="error" message={t('profile.saveError')} /> : null}

          <Button label={t('profile.save')} loading={save.isPending} onPress={onSave} />
        </View>
      </ScrollView>
      <Toast toast={toast.toast} />
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
  },
  avatarWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: colors.brandTint,
    borderWidth: 3,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.brand,
  },
  avatarText: {
    ...typography.headline,
    color: colors.brand,
  },
  form: {
    gap: spacing.md,
  },
  locked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    height: 56,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundAlt,
  },
  lockedText: {
    flex: 1,
  },
  lockedLabel: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  lockedValue: {
    ...typography.bodyStrong,
    color: colors.textMuted,
  },
  hint: {
    ...typography.caption,
    color: colors.textSubtle,
    marginTop: -spacing.xs,
    marginLeft: spacing.xs,
  },
});
