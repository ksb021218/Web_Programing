import { map_api, geocoding, reverse_geocoding } from './map_api.js';
import { NCP_CLIENT_ID } from './config.js';
import { restaurant_data } from './restaurant_data.js';

// 네이버 지도 API 로드
const script = document.createElement("script");
script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NCP_CLIENT_ID}&submodules=geocoder`;
document.head.appendChild(script);

// 전역 변수
let map_instance = null;

// 지도 API 로드 완료 시
script.onload = async () => {
  map_instance = await map_api();

  const input = document.getElementById('search_input');
  const button = document.getElementById('search_button');

  if (button && input) {
    button.addEventListener('click', async () => {
      const query = input.value.trim();
      if (!query) return;

      try {
        const { lat, lng } = await geocoding(query);
        const position = new naver.maps.LatLng(lat, lng);

        map_instance.setCenter(position);
      } catch (error) {
        alert('주소를 찾을 수 없습니다.');
        console.error(error);
      }
    });
  }

  // map 생성 이후 클릭 이벤트 등록
  naver.maps.Event.addListener(map_instance, 'click', async function(e) {
    const lat = e.coord.lat();
    const lng = e.coord.lng();

    try {
      const address = await reverse_geocoding(lat, lng);

      // 기존 정보창 닫기
      if (window.infoWindow) {
        window.infoWindow.close();
      }

      // 정보창 생성
      window.infoWindow = new naver.maps.InfoWindow({
        content: `
        <div style="padding:10px; font-size:14px; line-height:1.6;">
          <strong>주소:</strong> ${address}<br>
          <strong>위도:</strong> ${lat.toFixed(5)}<br>
          <strong>경도:</strong> ${lng.toFixed(5)}
        </div>`
      });

      window.infoWindow.open(map_instance, new naver.maps.LatLng(lat, lng));
    } catch (err) {
      console.error("Reverse geocoding 실패:", err);
      alert("주소를 불러올 수 없습니다.");
    }
  });

  // 식당 마커 표시
  loadRestaurantMarkers(map_instance);
};

// 식당 마커!
function loadRestaurantMarkers(map) {
  restaurant_data.forEach(({ name, lat, lng, description }) => {
    const position = new naver.maps.LatLng(lat, lng);

    const marker = new naver.maps.Marker({
      position,
      map,
      icon: {
        content: `<div style="width:24px; height:24px; background-color:#1e90ff; border-radius:50%; box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>`,
        size: new naver.maps.Size(14, 14),
        anchor: new naver.maps.Point(12, 12),
      },
    });

    const infoWindow = new naver.maps.InfoWindow({
      content: `
        <div style="padding:10px; font-size:14px; line-height:1.4;">
          <strong>${name}</strong><br>
          <span>${description}</span>
        </div>`
    });

    naver.maps.Event.addListener(marker, 'click', () => {
      if (window.infoWindow) window.infoWindow.close();
      window.infoWindow = infoWindow;
      infoWindow.open(map, marker);
    });
  });
}