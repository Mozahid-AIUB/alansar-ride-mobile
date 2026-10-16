import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { lightTheme } from '@alansar/theme';

import { PressableScale } from '@/components/PressableScale';

const { colors, spacing, radius, typography } = lightTheme;

/** Earliest bookable slot from now, in minutes; dispatch needs time to find a driver. */
const LEAD_MINUTES = 30;
const SLOT_MINUTES = 15;
const DAYS_AHEAD = 7;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const dayLabel = (day: Date, index: number) =>
  index === 0
    ? 'Today'
    : index === 1
      ? 'Tomorrow'
      : day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });

/** Bookable 15-minute slots on `day`, from 06:00 (or now + lead time) to 23:45. */
const slotsFor = (day: Date, now: Date) => {
  const earliest = new Date(now.getTime() + LEAD_MINUTES * 60_000);
  const slots: Date[] = [];
  for (let m = 6 * 60; m < 24 * 60; m += SLOT_MINUTES) {
    const slot = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(m / 60), m % 60);
    if (slot >= earliest) slots.push(slot);
  }
  return slots;
};

/**
 * Day chips over time chips — no native picker, so it looks and works the same
 * on Android, iOS and web.
 */
export function SchedulePicker({ value, onChange }: { value: Date | null; onChange: (when: Date) => void }) {
  const now = new Date();
  const days = Array.from({ length: DAYS_AHEAD }, (_, i) => {
    const d = startOfDay(now);
    d.setDate(d.getDate() + i);
    return d;
  }).filter((d) => slotsFor(d, now).length > 0);

  const selectedDay = value ? startOfDay(value).getTime() : days[0]?.getTime();
  const day = days.find((d) => d.getTime() === selectedDay) ?? days[0];
  const slots = day ? slotsFor(day, now) : [];

  return (
    <View style={styles.root}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {days.map((d) => {
          const selected = d.getTime() === day?.getTime();
          return (
            <Chip
              key={d.getTime()}
              label={dayLabel(d, Math.round((d.getTime() - startOfDay(now).getTime()) / 86_400_000))}
              selected={selected}
              onPress={() => {
                const first = slotsFor(d, now)[0];
                if (first) onChange(first);
              }}
            />
          );
        })}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {slots.map((slot) => (
          <Chip
            key={slot.getTime()}
            label={slot.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            selected={value?.getTime() === slot.getTime()}
            onPress={() => onChange(slot)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm,
  },
  chips: {
    gap: spacing.sm,
  },
  chip: {
    height: 38,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipText: {
    ...typography.titleSmall,
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.onPrimary,
  },
});
