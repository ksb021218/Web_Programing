import { restaurant_data } from './restaurant_data.js';

let angle = 0;

function getFilteredRestaurants() {
  const selected = Array.from(document.querySelectorAll('.wheel_category input:checked'))
                      .map(cb => cb.value);
  return restaurant_data.filter(r =>
    r.category.some(c => selected.includes(c))
  );
}

function spinWheel() {
  const wheel = document.getElementById("wheel");
  const resultDiv = document.getElementById("result");
  const filtered = getFilteredRestaurants();

  if (filtered.length === 0) {
    resultDiv.innerText = "⚠ 선택한 카테고리에 해당하는 식당이 없어요!";
    return;
  }

  const rotateBy = 360 * 5 + Math.floor(Math.random() * 360); // 5바퀴 + 랜덤
  angle += rotateBy;
  wheel.style.transform = `rotate(${angle}deg)`;

  // 결과는 애니메이션 후 표시
  const chosen = filtered[Math.floor(Math.random() * filtered.length)];
  setTimeout(() => {
    resultDiv.innerText = `👉 ${chosen.name} 추천!`;
  }, 4000); // 애니메이션 시간과 맞춤
}

// DOM 로드 후 버튼 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("spin_button").addEventListener("click", spinWheel);
});
