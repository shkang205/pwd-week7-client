/* src/services/validation.test.ts */
import { describe, expect, test } from 'vitest';
import { isRestaurant, isSubmission } from './validation';

// pwd-week7 서버(Supabase)가 돌려주는 맛집 응답 형태
const restaurant = {
  id: 1,
  name: '송림식당',
  category: '한식',
  location: '경기 수원시 영통구 월드컵로193번길 21',
  priceRange: '7,000-10,000원',
  rating: 4.5,
  description: '아주대생들의 오랜 단골집.',
  recommendedMenu: ['순두부찌개', '김치찌개'],
  likes: 120,
  image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400',
};

function omit(value: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).filter(([key]) => !keys.includes(key)));
}

describe('isRestaurant', () => {
  test('서버 응답 형태의 맛집을 허용', () => {
    expect(isRestaurant(restaurant)).toBe(true);
  });

  test('선택 필드가 없는 맛집도 허용', () => {
    expect(isRestaurant(omit(restaurant, ['priceRange', 'description', 'image']))).toBe(true);
  });

  test('선택 필드가 null이면 거부 (서버는 null 필드를 생략해야 함)', () => {
    expect(isRestaurant({ ...restaurant, image: null })).toBe(false);
  });

  test('필수 필드 누락·잘못된 타입 거부', () => {
    expect(isRestaurant(omit(restaurant, ['name']))).toBe(false);
    expect(isRestaurant({ ...restaurant, rating: '4.5' })).toBe(false);
    expect(isRestaurant({ ...restaurant, recommendedMenu: '떡볶이' })).toBe(false);
  });
});

describe('isSubmission', () => {
  const submission = {
    id: 'a1', restaurantName: '새 식당', category: '분식', location: '아주대 후문', status: 'pending',
  };

  test('정상 제보 허용', () => {
    expect(isSubmission(submission)).toBe(true);
  });

  test('알 수 없는 상태 거부', () => {
    expect(isSubmission({ ...submission, status: 'done' })).toBe(false);
  });
});
