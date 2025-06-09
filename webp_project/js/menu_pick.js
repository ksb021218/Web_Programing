import { restaurant_data } from './restaurant_data.js';

function pickMenu() {
  const selectedCategories = Array.from(document.querySelectorAll('.pick_category input:checked'))
                                   .map(cb => cb.value);

  const filteredRestaurants = restaurant_data.filter(r =>
    r.category.some(c => selectedCategories.includes(c))
  );

  const resultArea = document.getElementById("result");

  if (filteredRestaurants.length === 0) {
    resultArea.innerText = "⚠ 선택한 카테고리에 해당하는 식당이 없어요!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
  const result = filteredRestaurants[randomIndex];

  resultArea.innerText = `👉 ${result.name} 추천!`;
}

// 버튼튼 이벤트 연결 (모듈이므로 DOM 완전히 로드된 후 실행 필요)
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pick_button").addEventListener("click", pickMenu);
});
