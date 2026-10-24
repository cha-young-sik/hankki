import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PlaceItem } from '@/components/place-item';
import { PrimaryButton, Screen, Sub, Title, styles as ui } from '@/components/ui';
import { PLACES } from '@/data/places';
import { useEat } from '@/hooks/use-eat';
import { formatDate, won } from '@/lib/budget';
import { useBudget } from '@/store/budget-store';
import { C, STATUS } from '@/theme';

export default function HomeScreen() {
  const { summary: s, settings, lastDelta } = useBudget();
  const { pick, pickRandom } = useEat();
  const status = STATUS[s.status];

  // 예산 안에서 가장 비싼 곳부터 3개 (예산을 알차게 쓰는 순서)
  const fits = PLACES.filter((p) => p.price <= s.perMeal).sort((a, b) => b.price - a.price);
  const top = (fits.length ? fits : [...PLACES].sort((a, b) => a.price - b.price)).slice(0, 3);
  const usedPct = settings.amount > 0 ? Math.min(100, Math.max(0, (s.spent / settings.amount) * 100)) : 0;

  return (
    <Screen>
      <View>
        <Sub>{formatDate(new Date())}</Sub>
        <Title>[학교명] 정문 근처</Title>
      </View>

      {s.ended && (
        <Pressable onPress={() => router.navigate('/budget')} style={styles.ended} accessibilityRole="button">
          <Text style={styles.endedText}>예산 기간이 끝났어요. 눌러서 새 기간을 시작하세요.</Text>
        </Pressable>
      )}

      <View style={[styles.hero, { backgroundColor: status.color }]}>
        <View style={ui.row}>
          <Text style={styles.heroLabel}>다음 한 끼 권장 금액</Text>
          <Text style={[styles.pill, { color: status.color }]}>{status.label}</Text>
        </View>
        <View style={styles.bigRow}>
          <Text style={styles.bigNum}>{won(s.perMeal)}</Text>
          <Text style={styles.bigUnit}>원</Text>
        </View>
        <View style={styles.miniRow}>
          <View style={styles.mini}>
            <Text style={styles.miniLabel}>하루 권장</Text>
            <Text style={styles.miniVal}>{won(s.perDay)}원</Text>
          </View>
          <View style={styles.mini}>
            <Text style={styles.miniLabel}>남은 끼니 · 일수</Text>
            <Text style={styles.miniVal}>
              {s.mealsLeft}끼 · {s.daysLeft}일
            </Text>
          </View>
        </View>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${usedPct}%` }]} />
        </View>
        <View style={ui.row}>
          <Text style={styles.heroSmall}>{won(s.spent)}원 사용</Text>
          <Text style={styles.heroSmall}>남은 예산 {won(s.remain)}원</Text>
        </View>
        {lastDelta && (
          <Text style={styles.delta}>
            {`${lastDelta.name} ${won(lastDelta.price)}원 차감 → 한 끼 권장 ${won(lastDelta.before)}원에서 ${won(
              lastDelta.after,
            )}원으로 ${lastDelta.after >= lastDelta.before ? '늘었어요' : '줄었어요'}`}
          </Text>
        )}
      </View>

      <View style={ui.row}>
        <Text style={ui.sec}>오늘 예산에 맞는 추천</Text>
        <Pressable onPress={() => router.navigate('/recommend')} hitSlop={12} accessibilityRole="link">
          <Text style={styles.link}>전체 보기</Text>
        </Pressable>
      </View>
      <View style={{ gap: 10 }}>
        {top.map((p) => (
          <PlaceItem key={p.id} place={p} perMeal={s.perMeal} onPress={() => pick(p)} />
        ))}
      </View>

      <PrimaryButton label="오늘 뭐 먹지? 자동 선택" icon="dice-outline" onPress={() => pickRandom()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  ended: { backgroundColor: C.orangeSoft, borderRadius: 14, padding: 14 },
  endedText: { color: '#8A3F0E', fontSize: 14, fontWeight: '700' },
  hero: { borderRadius: 24, padding: 22, gap: 12 },
  heroLabel: { color: '#fff', fontSize: 14, fontWeight: '500' },
  heroSmall: { color: '#fff', fontSize: 12 },
  pill: {
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  bigRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  bigNum: { color: '#fff', fontSize: 46, fontWeight: '900', letterSpacing: -1 },
  bigUnit: { color: '#fff', fontSize: 18, fontWeight: '700' },
  miniRow: { flexDirection: 'row', gap: 8 },
  mini: { flex: 1, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: 10, gap: 2 },
  miniLabel: { color: '#fff', fontSize: 11 },
  miniVal: { color: '#fff', fontSize: 16, fontWeight: '700' },
  bar: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4, backgroundColor: '#fff' },
  delta: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 10,
    padding: 8,
    overflow: 'hidden',
  },
  link: { fontSize: 13, fontWeight: '500', color: C.green },
});
