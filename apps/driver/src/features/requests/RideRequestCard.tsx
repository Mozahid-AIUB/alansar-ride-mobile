import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { MapPin, NavigationArrow } from 'phosphor-react-native';

import { driversApi, type RideDetail } from '@alansar/api';
import { useT } from '@alansar/i18n';
import { fonts, lightTheme } from '@alansar/theme';
import { formatTaka } from '@alansar/utils';

import { PressableScale } from '@/components/PressableScale';

const { colors, spacing, radius, typography, controls } = lightTheme;

/**
 * One incoming ride request. The rider may have named their own fare; the
 * driver can take it as offered or counter with their own price.
 */
export function RideRequestCard({ ride }: { ride: RideDetail }) {
  const t = useT();
  const [countering, setCountering] = useState(false);
  const [price, setPrice] = useState('');
  const [sent, setSent] = useState(false);

  const riderFare = Number(ride.requested_fare ?? 0);
  const km = Number(ride.distance_km ?? 0);

  const offer = useMutation({
    mutationFn: (amount: number) => driversApi.makeOffer(ride.id, amount),
    onSuccess: () => setSent(true),
  });

  if (sent) {
    return (
      <View style={[styles.card, styles.sentCard]}>
        <Text style={styles.sentText}>{t('request.offerSent')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.route}>
        <Row icon={NavigationArrow} text={ride.pickup_name ?? ride.pickup_address ?? '—'} />
        <View style={styles.rail} />
        <Row icon={MapPin} text={ride.dropoff_name ?? ride.dropoff_address ?? '—'} />
      </View>

      <View style={styles.meta}>
        {km ? <Text style={styles.metaText}>{t('request.km', { km: km.toFixed(1) })}</Text> : null}
        <Text style={styles.fare}>
          {t('request.riderFare')}: <Text style={styles.fareValue}>{formatTaka(riderFare)}</Text>
        </Text>
      </View>

      {offer.isError ? <Text style={styles.error}>{t('request.offerFailed')}</Text> : null}

      {countering ? (
        <View style={styles.counter}>
          <View style={styles.priceInput}>
            <Text style={styles.currency}>৳</Text>
            <TextInput
              value={price}
              onChangeText={(v) => setPrice(v.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder={String(Math.round(riderFare) || '')}
              placeholderTextColor={colors.placeholder}
              keyboardType="number-pad"
              autoFocus
              accessibilityLabel={t('request.yourPrice')}
              style={styles.priceText}
            />
          </View>
          <View style={styles.actions}>
            <PressableScale style={[styles.btn, styles.btnGhost]} onPress={() => setCountering(false)}>
              <Text style={styles.btnGhostText}>{t('request.cancel')}</Text>
            </PressableScale>
            <PressableScale
              style={[styles.btn, styles.btnPrimary, !Number(price) && styles.btnDisabled]}
              disabled={!Number(price) || offer.isPending}
              onPress={() => offer.mutate(Number(price))}
            >
              {offer.isPending ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.btnPrimaryText}>{t('request.sendOffer')}</Text>
              )}
            </PressableScale>
          </View>
        </View>
      ) : (
        <View style={styles.actions}>
          <PressableScale style={[styles.btn, styles.btnGhost]} onPress={() => setCountering(true)}>
            <Text style={styles.btnGhostText}>{t('request.counter')}</Text>
          </PressableScale>
          <PressableScale
            style={[styles.btn, styles.btnPrimary]}
            disabled={offer.isPending}
            onPress={() => offer.mutate(riderFare)}
          >
            {offer.isPending ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={styles.btnPrimaryText}>{t('request.accept', { fare: formatTaka(riderFare) })}</Text>
            )}
          </PressableScale>
        </View>
      )}
    </View>
  );
}

function Row({ icon: Icon, text }: { icon: typeof MapPin; text: string }) {
  return (
    <View style={styles.row}>
      <Icon size={16} color={colors.brand} weight="fill" />
      <Text style={styles.rowText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: spacing.md,
  },
  sentCard: {
    alignItems: 'center',
  },
  sentText: {
    ...typography.bodyStrong,
    color: colors.brandStrong,
    paddingVertical: spacing.sm,
  },
  route: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowText: {
    ...typography.bodyStrong,
    flex: 1,
    color: colors.text,
  },
  rail: {
    width: 2,
    height: 14,
    marginLeft: 7,
    backgroundColor: colors.border,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: {
    ...typography.caption,
    color: colors.textSubtle,
  },
  fare: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  fareValue: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
  counter: {
    gap: spacing.sm,
  },
  priceInput: {
    height: controls.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: controls.focusBorderWidth,
    borderColor: colors.brand,
  },
  currency: {
    ...typography.headline,
    color: colors.text,
  },
  priceText: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.text,
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.brand,
  },
  btnPrimaryText: {
    ...typography.bodyStrong,
    color: colors.onPrimary,
  },
  btnGhost: {
    borderWidth: controls.borderWidth,
    borderColor: colors.border,
  },
  btnGhostText: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
