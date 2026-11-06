import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Star } from 'phosphor-react-native';

import { describeError, ridesApi } from '@alansar/api';
import { useT, type TranslationKey } from '@alansar/i18n';
import { lightTheme } from '@alansar/theme';

import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { PressableScale } from '@/components/PressableScale';
import { TextField } from '@/components/TextField';

const { colors, spacing, typography } = lightTheme;

const LABEL_KEYS: (TranslationKey | '')[] = ['', 'rating.poor', 'rating.couldBeBetter', 'rating.okay', 'rating.good', 'rating.excellent'];

/** Five stars and an optional comment for the driver, after a completed trip. */
export function RatingPanel({ rideId, driverName, onDone }: { rideId: string; driverName: string; onDone: () => void }) {
  const t = useT();
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState('');
  const rate = useMutation({
    mutationFn: () => ridesApi.rate(rideId, stars, review.trim() || undefined),
    onSuccess: onDone,
  });

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{t('rating.title', { name: driverName })}</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <PressableScale key={n} accessibilityRole="button" accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`} hitSlop={4} onPress={() => setStars(n)}>
            <Star size={38} color={n <= stars ? colors.star : colors.disabled} weight={n <= stars ? 'fill' : 'regular'} />
          </PressableScale>
        ))}
      </View>
      <Text style={styles.label}>{LABEL_KEYS[stars] ? t(LABEL_KEYS[stars] as TranslationKey) : t('rating.tapStar')}</Text>
      {stars ? (
        <TextField label={t('rating.comment')} value={review} onChangeText={setReview} maxLength={1000} returnKeyType="done" />
      ) : null}
      {rate.isError ? <Notice tone="error" message={describeError(rate.error)} /> : null}
      <Button label={t('rating.submit')} disabled={!stars} loading={rate.isPending} onPress={() => rate.mutate()} />
      <Button variant="outline" label={t('rating.skip')} onPress={onDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm + 4,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textSubtle,
    textAlign: 'center',
  },
});
