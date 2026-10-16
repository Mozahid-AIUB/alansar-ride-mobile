import { StyleSheet, View } from 'react-native';
import { Car } from 'phosphor-react-native';

import { lightTheme, palette } from '@alansar/theme';

const { colors, radius } = lightTheme;

/** Green dot with a white ring: where the passenger is picked up. */
export function PickupPin() {
  return (
    <View style={styles.pickupHalo}>
      <View style={styles.pickupDot} />
    </View>
  );
}

/** Ink square: the destination, as Uber marks it. */
export function DropoffPin() {
  return (
    <View style={styles.dropoffOuter}>
      <View style={styles.dropoffInner} />
    </View>
  );
}

export function DriverPin() {
  return (
    <View style={styles.driver}>
      <Car size={18} color={palette.white} weight="fill" />
    </View>
  );
}

const styles = StyleSheet.create({
  pickupHalo: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: palette.white,
    backgroundColor: colors.brand,
  },
  dropoffOuter: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: palette.ink900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropoffInner: {
    width: 8,
    height: 8,
    borderRadius: 1.5,
    backgroundColor: palette.white,
  },
  driver: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: palette.white,
    backgroundColor: palette.ink900,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
