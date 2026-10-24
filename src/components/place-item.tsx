import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Place } from '@/data/places';
import { won } from '@/lib/budget';
import { C, CAT_COLORS } from '@/theme';

export function PlaceItem({ place, perMeal, onPress }: { place: Place; perMeal: number; onPress: () => void }) {
  const ok = place.price <= perMeal;
  const cat = CAT_COLORS[place.cat];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${place.name} ${place.menu} ${won(place.price)}원, ${ok ? '예산 안' : '예산 초과'}. 눌러서 먹은 걸로 기록`}
      style={({ pressed }) => [
        styles.item,
        { borderColor: ok ? '#CFE0D4' : '#EBCFCB' },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}>
      <View style={[styles.icon, { backgroundColor: cat.bg }]}>
        <Text style={[styles.iconText, { color: cat.fg }]}>{place.cat}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {place.name}
          </Text>
          {place.studentDiscount && <Text style={styles.disc}>학생할인</Text>}
        </View>
        <Text style={styles.meta}>
          {place.menu} · 도보 {place.walk}분
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.price}>{won(place.price)}원</Text>
        <Text style={[styles.tag, { color: ok ? C.green : C.over }]}>
          {ok ? '예산 안' : `+${won(place.price - perMeal)}원 초과`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: C.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 13, fontWeight: '700' },
  body: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 15, fontWeight: '700', color: C.ink, flexShrink: 1 },
  disc: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A3F0E',
    backgroundColor: C.orangeSoft,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  meta: { fontSize: 12, color: C.muted },
  right: { alignItems: 'flex-end', gap: 2 },
  price: { fontSize: 15, fontWeight: '700', color: C.ink },
  tag: { fontSize: 11, fontWeight: '700' },
});
