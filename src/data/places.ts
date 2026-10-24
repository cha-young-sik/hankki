// 예시 식당 데이터. 실제 학교 주변 식당과 메뉴 가격으로 바꿔서 사용한다.
// (다음 단계에서 앱 안에서 직접 등록할 수 있게 만들 예정)

export type Category = '한식' | '분식' | '중식' | '일식' | '양식';

export interface Place {
  id: string;
  name: string;
  menu: string;
  cat: Category;
  /** 도보 시간(분) */
  walk: number;
  price: number;
  studentDiscount: boolean;
}

export const CATEGORIES: ('전체' | Category)[] = ['전체', '한식', '분식', '중식', '일식', '양식'];

export const PLACES: Place[] = [
  { id: 'p1', name: '학교앞 김밥', menu: '참치김밥', cat: '분식', walk: 2, price: 3500, studentDiscount: false },
  { id: 'p2', name: '오늘컵밥', menu: '치킨마요 컵밥', cat: '한식', walk: 3, price: 3900, studentDiscount: true },
  { id: 'p3', name: '진짜떡볶이', menu: '떡볶이 1인분', cat: '분식', walk: 4, price: 4000, studentDiscount: true },
  { id: 'p4', name: '오니기리 하우스', menu: '삼각김밥 세트', cat: '일식', walk: 6, price: 4200, studentDiscount: false },
  { id: 'p5', name: '정문 칼국수', menu: '바지락칼국수', cat: '한식', walk: 5, price: 4500, studentDiscount: false },
  { id: 'p6', name: '후문 짜장', menu: '짜장면', cat: '중식', walk: 7, price: 4500, studentDiscount: true },
  { id: 'p7', name: '학교앞 김밥', menu: '참치김밥 + 라면', cat: '분식', walk: 2, price: 6500, studentDiscount: false },
  { id: 'p8', name: '든든국밥', menu: '돼지국밥', cat: '한식', walk: 4, price: 7000, studentDiscount: false },
  { id: 'p9', name: '파스타 공방', menu: '토마토 파스타', cat: '양식', walk: 8, price: 8900, studentDiscount: true },
  { id: 'p10', name: '돈가스 연구소', menu: '등심돈가스', cat: '일식', walk: 6, price: 9500, studentDiscount: false },
];
