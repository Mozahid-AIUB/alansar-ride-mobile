import type { ComponentType } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  BellSimple,
  Car,
  ChatCircleDots,
  HandCoins,
  Megaphone,
  type IconProps,
} from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { describeError, type AppNotification } from '@alansar/api';
import { lightTheme } from '@alansar/theme';
import { formatTimeAgo } from '@alansar/utils';

import { BackButton } from '@/components/BackButton';
import { Notice } from '@/components/Notice';
import { PressableScale } from '@/components/PressableScale';
import { useMarkAllRead, useMarkRead, useNotifications, useUnreadCount } from '@/hooks/queries';

const { colors, spacing, radius, typography, shadows } = lightTheme;

const iconFor = (type: string | null): ComponentType<IconProps> => {
  const t = (type ?? '').toLowerCase();
  if (t.includes('offer') || t.includes('fare')) return HandCoins;
  if (t.includes('ride') || t.includes('driver') || t.includes('trip')) return Car;
  if (t.includes('support') || t.includes('ticket')) return ChatCircleDots;
  if (t.includes('broadcast') || t.includes('announce') || t.includes('promo')) return Megaphone;
  return BellSimple;
};

export function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const list = useNotifications();
  const unread = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const items = list.data?.items ?? [];

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <BackButton />
        {unread.data ? (
          <PressableScale
            accessibilityRole="button"
            hitSlop={8}
            style={styles.markAll}
            disabled={markAllRead.isPending}
            onPress={() => markAllRead.mutate(undefined)}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </PressableScale>
        ) : null}
      </View>
      <Text style={styles.title}>Notifications</Text>

      {list.isError ? (
        <View style={styles.pad}>
          <Notice tone="error" message={describeError(list.error)} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(n) => n.id}
          renderItem={({ item }) => (
            <Row
              notification={item}
              onPress={() => {
                if (!item.is_read) markRead.mutate(item.id);
              }}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={items.length ? styles.list : styles.listEmpty}
          refreshControl={
            <RefreshControl
              refreshing={list.isRefetching}
              onRefresh={() => void list.refetch()}
              tintColor={colors.brand}
            />
          }
          ListEmptyComponent={
            list.isPending ? (
              <Text style={styles.muted}>Loading…</Text>
            ) : (
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <Bell size={40} color={colors.brand} weight="duotone" />
                </View>
                <Text style={styles.emptyTitle}>You're all caught up</Text>
                <Text style={styles.emptyBody}>
                  Ride updates, receipts and news from Al Ansar will show up here.
                </Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

function Row({ notification, onPress }: { notification: AppNotification; onPress: () => void }) {
  const Icon = iconFor(notification.type);
  const unread = !notification.is_read;

  return (
    <PressableScale accessibilityRole="button" haptic={false} style={styles.row} onPress={onPress}>
      <View style={[styles.rowIcon, unread && styles.rowIconUnread]}>
        <Icon size={22} color={unread ? colors.brand : colors.textMuted} weight="duotone" />
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowTitle, unread && styles.rowTitleUnread]} numberOfLines={1}>
          {notification.title}
        </Text>
        {notification.body ? (
          <Text style={styles.rowText} numberOfLines={2}>
            {notification.body}
          </Text>
        ) : null}
        <Text style={styles.rowTime}>{formatTimeAgo(notification.created_at)}</Text>
      </View>
      {unread ? <View style={styles.unreadDot} /> : null}
    </PressableScale>
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
  },
  markAll: {
    paddingVertical: spacing.xs,
  },
  markAllText: {
    ...typography.titleSmall,
    color: colors.brandStrong,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  pad: {
    paddingHorizontal: spacing.lg,
  },
  list: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    boxShadow: shadows.card,
  },
  listEmpty: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 4,
    paddingVertical: spacing.sm + 6,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconUnread: {
    backgroundColor: colors.brandTint,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    ...typography.bodyStrong,
    color: colors.textMuted,
  },
  rowTitleUnread: {
    color: colors.text,
  },
  rowText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  rowTime: {
    ...typography.caption,
    color: colors.textSubtle,
    marginTop: spacing.xs,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.brand,
    marginTop: spacing.sm,
  },
  muted: {
    ...typography.bodySmall,
    color: colors.textSubtle,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.headline,
    color: colors.text,
  },
  emptyBody: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    maxWidth: 270,
  },
});
