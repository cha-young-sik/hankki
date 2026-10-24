import { useToast } from '@/components/toast';
import { PLACES, type Place } from '@/data/places';
import { won } from '@/lib/budget';
import { useBudget } from '@/store/budget-store';

/** 식당 선택(기록) + 자동 선택. 결과를 토스트로 알려준다. */
export function useEat() {
  const { eat, summary } = useBudget();
  const toast = useToast();

  const pick = (place: Place) => {
    const delta = eat(place);
    if (!delta) {
      toast('예산 기간이 끝났어요. 예산 탭에서 새 기간을 시작하세요.');
      return;
    }
    const dir = delta.after >= delta.before ? '늘었어요' : '줄었어요';
    toast(`${place.name} ${won(place.price)}원 차감 · 한 끼 권장 ${won(delta.after)}원으로 ${dir}`);
  };

  /** 지금 한 끼 권장 금액 이하에서 무작위로 고른다. 없으면 가장 싼 곳. */
  const pickRandom = (candidates: Place[] = PLACES) => {
    const pool = candidates.filter((p) => p.price <= summary.perMeal);
    const choices = pool.length ? pool : [...candidates].sort((a, b) => a.price - b.price).slice(0, 1);
    if (!choices.length) return;
    pick(choices[Math.floor(Math.random() * choices.length)]);
  };

  return { pick, pickRandom };
}
