import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PlaceItem } from '@/components/place-item';
import { PrimaryButton, Screen, Sub, Title, styles as ui } from '@/components/ui';
import { CATEGORIES, PLACES } from '@/data/places';
import { useEat } from '@/hooks/use-eat';
import { won } from '@/lib/budget';
import { useBudget } from '@/store/budget-store';
import { C } from '@/theme';

type SortKey = 'price' | 'walk';

export default function RecommendScreen() {
  const { summary: s } = useBudget();
  const { pick, pickRandom } = useEat();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('전체');
  const [sort, setSort] = useState<SortKey>('price');
  const [onlyFits, setOnlyFits] = useState(false);

  const byCat = PLACES.filter((p) => cat === '전체' || p.cat === cat);
  const list = byCat
    .filter((p) => !onlyFits || p.price <= s.perMeal)
    .sort((a, b) => (sort === 'price' ? a.price - b.price : a.walk - b.walk));
  const inBudget = byCat.filter((p) => p.price <= s.perMeal).length;

  return (
    <Screen>
      <Title>예산 맞춤 맛집</Title>

      <View style={styles.loc}>
        <Ionicons name="location-outline" size={20} color={C.green} />
        <Text style={styles.locText}>[학교명] 정문 · 반경 1km</Text>
        <Text style={styles.locLimit}>{won(s.perMeal)}원 이하</Text>
      </View>

      <View style={styles.chips}>
        {CATEGORIES.map((k) => (
          <Pressable
            key={k}
            onPress={() => setCat(k)}
            accessibilityRole="button"
            accessibilityState={{ selected: k === cat }}
            style={[styles.chip, k === cat && styles.chipOn]}>
            <Text style={[styles.chipText, k === cat && { color: '#fff' }]}>{k}</Text>
          </Pressable>
        ))}
      </View>

      <View style={ui.row}>
        <Pressable
          onPress={() => setOnlyFits(!onlyFits)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: onlyFits }}
          hitSlop={8}
          style={styles.check}>
          <Ionicons name={onlyFits ? 'checkbox' : 'square-outline'} size={20} color={onlyFits ? C.green : C.muted} />
          <Sub>
            예산 안만 보기 ({inBudget}/{byCat.length})
          </Sub>
        </Pressable>
        <Pressable
          onPress={() => setSort(sort === 'price' ? 'walk' : 'price')}
          accessibilityRole="button"
          hitSlop={8}
          style={styles.check}>
          <Ionicons name="swap-vertical" size={16} color={C.ink} />
          <Text style={styles.sortText}>{sort === 'price' ? '가격 낮은 순' : '가까운 순'}</Text>
        </Pressable>
      </View>

      <View style={{ gap: 10 }}>
        {list.length ? (
          list.map((p) => <PlaceItem key={p.id} place={p} perMeal={s.perMeal} onPress={() => pick(p)} />)
        ) : (
          <Text style={styles.empty}>지금 예산으로 갈 수 있는 곳이 없어요.</Text>
        )}
      </View>

      <PrimaryButton label="예산 안에서 자동 선택" icon="dice-outline" color={C.green} onPress={() => pickRandom(byCat)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loc: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locText: { flex: 1, fontSize: 14, fontWeight: '500', color: C.ink },
  locLimit: { fontSize: 13, fontWeight: '700', color: C.green },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  chipOn: { backgroundColor: C.ink, borderColor: C.ink },
  chipText: { fontSize: 13, fontWeight: '500', color: C.ink },
  check: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 32 },
  sortText: { fontSize: 13, fontWeight: '500', color: C.ink },
  empty: { fontSize: 14, color: C.muted, textAlign: 'center', paddingVertical: 24 },
});
