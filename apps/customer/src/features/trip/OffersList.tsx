import { StyleSheet, Text, View } from 'react-native';
import { Star } from 'phosphor-react-native';

import type { FareOffer } from '@alansar/api';
import { lightTheme } from '@alansar/theme';
import { formatTaka, initialsOf } from '@alansar/utils';

import { Button } from '@/components/Button';

const { colors, spacing, radius, typography } = lightTheme;

type Props = {
  offers: FareOffer[];
  busyId: string | null;
  onAccept: (offer: FareOffer) => void;
  onDecline: (offer: FareOffer) => void;
};

/** Drivers' counter-prices, cheapest first. Accepting one assigns that driver. */
export function OffersList({ offers, busyId, onAccept, onDecline }: Props) {
  if (!offers.length) return null;

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Drivers' offers</Text>
      {offers.map((offer) => {
        const rating = offer.driver_rating ? Number(offer.driver_rating) : null;
        const busy = busyId === offer.id;
        return (
          <View key={offer.id} style={styles.card}>
            <View style={styles.head}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initialsOf(offer.driver_name ?? 'D') || 'D'}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1}>
                  {offer.driver_name ?? 'Driver'}
                </Text>
                <View style={styles.metaRow}>
                  {rating ? (
                    <View style={styles.rating}>
                      <Star size={12} color={colors.star} weight="fill" />
                      <Text style={styles.meta}>{rating.toFixed(1)}</Text>
                    </View>
                  ) : null}
                  <Text style={styles.meta} numberOfLines={1}>
                    {[offer.vehicle_type_name, offer.vehicle_number].filter(Boolean).join(' · ')}
                  </Text>
                </View>
              </View>
              <Text style={styles.amount}>{formatTaka(offer.amount)}</Text>
            </View>
            {offer.note ? <Text style={styles.note}>“{offer.note}”</Text> : null}
            <View style={styles.actions}>
              <View style={styles.action}>
                <Button size="sm" variant="outline" label="Decline" disabled={!!busyId} onPress={() => onDecline(offer)} />
              </View>
              <View style={styles.action}>
                <Button size="sm" label="Accept" loading={busy} disabled={!!busyId && !busy} onPress={() => onAccept(offer)} />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm + 2,
  },
  title: {
    ...typography.titleSmall,
    color: colors.text,
  },
  card: {
    gap: spacing.sm + 2,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.titleSmall,
    color: colors.onPrimary,
  },
  body: {
    flex: 1,
  },
  name: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    flexShrink: 1,
  },
  amount: {
    ...typography.headline,
    color: colors.text,
  },
  note: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
  },
});
