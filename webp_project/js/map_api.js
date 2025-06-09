import { NCP_CLIENT_ID, NCP_CLIENT_SECRET } from './config.js';

// ✅ 지도 생성 함수
export function map_api() {
  window.map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 18
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const userLocation = new naver.maps.LatLng(lat, lng);

        window.map.setCenter(userLocation);

        new naver.maps.Marker({
          position: userLocation,
          map: window.map,
          icon: {
            content: '<div style="color:blue;">📍</div>',
            anchor: new naver.maps.Point(12, 12)
          }
        });
      },
      function (error) {
        alert("위치 정보를 가져올 수 없습니다.");
        console.error(error);
      }
    );
  } else {
    alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
  }

  return window.map;
}

// ✅ 주소 검색 (지번/도로명 주소만 지원)
export async function geocoding(query) {
  return new Promise((resolve, reject) => {
    naver.maps.Service.geocode({ address: query }, (status, response) => {
      if (status === naver.maps.Service.Status.OK && response.result.items.length > 0) {
        const item = response.result.items[0];
        resolve({ lat: item.point.y, lng: item.point.x });
      } else {
        reject(new Error("주소를 찾을 수 없습니다."));
      }
    });
  });
}

// ✅ 좌표 → 주소
export function reverse_geocoding(lat, lng) {
  return new Promise((resolve, reject) => {
    const tryOrders = [
      naver.maps.Service.OrderType.ROAD_ADDR,
      naver.maps.Service.OrderType.ADDR,
      naver.maps.Service.OrderType.LEGALCODE
    ];

    function tryNext(i) {
      if (i >= tryOrders.length) {
        reject(new Error("주소를 찾을 수 없습니다."));
        return;
      }

      naver.maps.Service.reverseGeocode({
        location: new naver.maps.LatLng(lat, lng),
        orders: tryOrders[i]
      }, function (status, response) {
        if (
          status === naver.maps.Service.Status.OK &&
          response.result?.items?.length > 0
        ) {
          const item = response.result.items[0];
          const addr = item.roadAddress || item.jibunAddress || item.address || "주소 정보 없음";
          resolve(addr);
        } else {
          tryNext(i + 1);
        }
      });
    }

    tryNext(0);
  });
}
