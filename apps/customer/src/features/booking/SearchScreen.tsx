import { useEffect, useRef, useState, type ComponentType } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Buildings,
  MapPin,
  MapTrifold,
  NavigationArrow,
  Star,
  X,
  type IconProps,
} from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { lightTheme, fonts } from '@alansar/theme';

import { BackButton } from '@/components/BackButton';
import { Notice } from '@/components/Notice';
import { PressableScale } from '@/components/PressableScale';
import { useAnywhereSearch, usePlaceSearch, usePopularPlaces } from '@/hooks/queries';
import { useDebounced } from '@/hooks/useDebounced';
import { currentPlace } from '@/services/location';
import { placesProvider, type PlaceHit } from '@/services/places';
import { booking, coordOf, fromCatalogue, useBooking, type Place } from '@/store/booking';

const { colors, spacing, radius, typography, shadows, controls } = lightTheme;

type Field = 'pickup' | 'dropoff';

/** Booking step 1: where from, where to. Picking a destination opens the ride options. */
export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { pickup, dropoff } = useBooking();
  const [active, setActive] = useState<Field>('dropoff');
  // What the passenger has typed; null shows the chosen place's name, so a
  // place set on the map appears here on return.
  const [pickupDraft, setPickupDraft] = useState<string | null>(null);
  const [dropoffDraft, setDropoffDraft] = useState<string | null>(null);
  const pickupText = pickupDraft ?? pickup?.name ?? '';
  const dropoffText = dropoffDraft ?? dropoff?.name ?? '';
  const [locating, setLocating] = useState(false);
  const [locateFailed, setLocateFailed] = useState(false);
  // Key of the hit being turned into coordinates (Google resolves on tap).
  const [resolvingKey, setResolvingKey] = useState<string | null>(null);
  const [resolveFailed, setResolveFailed] = useState(false);
  const dropoffInput = useRef<TextInput>(null);

  const text = active === 'pickup' ? pickupText : dropoffText;
  // A box still showing its chosen place's name is not a search.
  const chosen = active === 'pickup' ? pickup : dropoff;
  const query = chosen && text === chosen.name ? '' : text.trim();
  const catalogueQuery = useDebounced(query, 250);
  const anywhereQuery = useDebounced(query, 700);

  const popular = usePopularPlaces();
  const catalogue = usePlaceSearch(catalogueQuery);
  const anywhere = useAnywhereSearch(anywhereQuery, coordOf(pickup));

  const locate = async () => {
    setLocating(true);
    setLocateFailed(false);
    const place = await currentPlace();
    setLocating(false);
    if (place) {
      booking.set({ pickup: place });
      setPickupDraft(null);
      setActive('dropoff');
      dropoffInput.current?.focus();
    } else {
      setLocateFailed(true);
    }
  };

  // First open: start from where the phone is.
  useEffect(() => {
    if (!booking.get().pickup) void locate();
  }, []);

  const choose = (place: Place) => {
    if (active === 'pickup') {
      booking.set({ pickup: place });
      setPickupDraft(null);
      setActive('dropoff');
      dropoffInput.current?.focus();
      if (booking.get().dropoff) router.push('/booking/review');
      return;
    }
    booking.set({ dropoff: place });
    setDropoffDraft(null);
    if (booking.get().pickup) {
      router.push('/booking/review');
    } else {
      setActive('pickup');
    }
  };

  // A search hit may not carry coordinates yet (Google autocomplete resolves on
  // tap). Fetch them, then pick the place.
  const chooseHit = async (hit: PlaceHit) => {
    setResolveFailed(false);
    if (hit.place) {
      choose(hit.place);
      return;
    }
    setResolvingKey(hit.key);
    try {
      const place = await placesProvider.resolve(hit);
      choose(place);
    } catch {
      setResolveFailed(true);
    } finally {
      setResolvingKey(null);
    }
  };

  const pickOnMap = () => {
    if (active === 'pickup') setPickupDraft(null);
    else setDropoffDraft(null);
    router.push({ pathname: '/booking/pick', params: { field: active } });
  };

  const catalogueHits = query.length >= 2 ? (catalogue.data ?? []).map(fromCatalogue) : [];
  const names = new Set(catalogueHits.map((p) => p.name.toLowerCase()));
  const anywhereHits =
    query.length >= 3
      ? (anywhere.data?.hits ?? []).filter((h) => !names.has(h.name.toLowerCase()))
      : [];
  const searching = query.length >= 2;
  // The full text found nothing; these came from a shorter version of it.
  const loosened = anywhereHits.length > 0 && anywhere.data && anywhere.data.matched !== query ? anywhere.data.matched : null;
  const setOnMap = (
    <PlaceRow
      icon={MapTrifold}
      title="Set location on map"
      subtitle={active === 'pickup' ? 'Drag the map to your pickup spot' : 'Drag the map to your destination'}
      onPress={pickOnMap}
    />
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Plan your ride</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.fieldsCard}>
        <View style={styles.rail}>
          <View style={styles.railPickup} />
          <View style={styles.railLine} />
          <View style={styles.railDropoff} />
        </View>
        <View style={styles.fields}>
          <SearchInput
            value={pickupText}
            onChangeText={setPickupDraft}
            placeholder={locating ? 'Finding your location…' : 'Pickup location'}
            focused={active === 'pickup'}
            onFocus={() => setActive('pickup')}
          />
          <SearchInput
            ref={dropoffInput}
            value={dropoffText}
            onChangeText={setDropoffDraft}
            placeholder="Where to?"
            focused={active === 'dropoff'}
            onFocus={() => setActive('dropoff')}
            autoFocus
          />
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.results, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        {active === 'pickup' && !searching ? (
          <PlaceRow
            icon={NavigationArrow}
            tone="brand"
            title={locating ? 'Finding your location…' : 'Use my current location'}
            subtitle={locateFailed ? 'Location is off. Allow it, or type your pickup.' : 'Pickup where you are now'}
            onPress={() => void locate()}
          />
        ) : null}
        {!searching ? setOnMap : null}

        {searching ? (
          <>
            {catalogueHits.map((place) => (
              <PlaceRow key={`c-${place.locationId}`} icon={Buildings} title={place.name} subtitle={place.address} onPress={() => choose(place)} />
            ))}
            {anywhereHits.length ? (
              <Text style={styles.groupTitle}>{loosened ? `Places matching “${loosened}”` : 'More places'}</Text>
            ) : null}
            {anywhereHits.map((hit) => (
              <PlaceRow
                key={`g-${hit.key}`}
                icon={MapPin}
                title={hit.name}
                subtitle={hit.address}
                busy={resolvingKey === hit.key}
                onPress={() => void chooseHit(hit)}
              />
            ))}
            {resolveFailed ? (
              <Text style={styles.muted}>Couldn't load that place. Try another, or set it on the map.</Text>
            ) : null}
            {!catalogueHits.length && !anywhereHits.length ? (
              <Text style={styles.muted}>
                {query.length < 3
                  ? 'Keep typing…'
                  : catalogue.isFetching || anywhere.isFetching
                    ? 'Searching…'
                    : `No places match “${query}”. Try a nearby landmark, or set it on the map.`}
              </Text>
            ) : null}
            {setOnMap}
          </>
        ) : (
          <>
            <Text style={styles.groupTitle}>Popular places</Text>
            {popular.isError ? <Notice tone="error" message="Couldn't load popular places." /> : null}
            {(popular.data ?? []).map((l) => {
              const place = fromCatalogue(l);
              return (
                <PlaceRow key={l.id} icon={Star} title={place.name} subtitle={place.address} onPress={() => choose(place)} />
              );
            })}
          </>
        )}

        {dropoff && pickup && !searching ? (
          <View style={styles.continue}>
            <PlaceRow icon={MapPin} tone="brand" title={`Continue to ${dropoff.name}`} subtitle="See rides and fares" onPress={() => router.push('/booking/review')} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  focused: boolean;
  onFocus: () => void;
  autoFocus?: boolean;
  ref?: React.Ref<TextInput>;
};

function SearchInput({ value, onChangeText, placeholder, focused, onFocus, autoFocus, ref }: SearchInputProps) {
  return (
    <View style={[styles.input, focused && styles.inputFocused]}>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        onFocus={onFocus}
        autoFocus={autoFocus}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
        style={styles.inputText}
      />
      {focused && value ? (
        <PressableScale accessibilityLabel="Clear" hitSlop={10} haptic={false} onPress={() => onChangeText('')}>
          <X size={16} color={colors.textSubtle} weight="bold" />
        </PressableScale>
      ) : null}
    </View>
  );
}

function PlaceRow({
  icon: Icon,
  title,
  subtitle,
  onPress,
  tone = 'default',
  busy = false,
}: {
  icon: ComponentType<IconProps>;
  title: string;
  subtitle: string | null;
  onPress: () => void;
  tone?: 'default' | 'brand';
  busy?: boolean;
}) {
  const brand = tone === 'brand';
  return (
    <PressableScale accessibilityRole="button" haptic={false} style={styles.row} onPress={onPress} disabled={busy}>
      <View style={[styles.rowIcon, brand && styles.rowIconBrand]}>
        <Icon size={20} color={brand ? colors.brand : colors.textMuted} weight={brand ? 'fill' : 'regular'} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {busy ? <ActivityIndicator size="small" color={colors.brand} style={styles.rowSpinner} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  headerSpacer: {
    width: 44,
  },
  fieldsCard: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.sm + 4,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    boxShadow: shadows.raised,
  },
  rail: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  railPickup: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand,
  },
  railLine: {
    flex: 1,
    width: 2,
    marginVertical: 4,
    backgroundColor: colors.border,
  },
  railDropoff: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.text,
  },
  fields: {
    flex: 1,
    gap: spacing.sm,
  },
  input: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: radius.md,
    borderWidth: controls.borderWidth,
    borderColor: 'transparent',
    backgroundColor: colors.inputFill,
  },
  inputFocused: {
    borderColor: colors.brand,
    backgroundColor: colors.surface,
  },
  inputText: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  results: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  groupTitle: {
    ...typography.label,
    color: colors.textSubtle,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    paddingVertical: spacing.sm + 2,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconBrand: {
    backgroundColor: colors.brandTint,
  },
  rowText: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    paddingBottom: spacing.sm + 2,
  },
  rowTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  rowSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  rowSpinner: {
    marginLeft: spacing.sm,
  },
  muted: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    paddingVertical: spacing.md,
  },
  continue: {
    marginTop: spacing.md,
  },
});
