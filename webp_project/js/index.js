window.addEventListener('load', () => {
  // menu.html이 비동기로 삽입되기 때문에 약간 지연 후 실행
  setTimeout(() => {
    const navBar = document.querySelector('.nav_bar');
    const navSubBar = document.querySelector('.nav_subbar');
    
    // 현재 메뉴 확장은 CSS :hover로 처리 중
    // JS를 통한 mouseover/mouseout 제어는 아래에 주석 보관
    /*
    const navItems = document.querySelectorAll('.nav_item');
    navItems.forEach(item => {
      const subBar = item.querySelector('.nav_subbar');
      if (subBar) {
        item.addEventListener('mouseover', () => {
          subBar.style.display = 'block';
        });
        item.addEventListener('mouseout', () => {
          subBar.style.display = 'none';
        });
      }
    });
    */

    // 추후 업데이트 안내 함수
    window.showUpdateMessage = function () {
      alert("💡 해당 기능은 추후 업데이트 예정입니다!");
    };

    // 로그아웃 안내 함수
    window.showLogoutMessage = function () {
      alert("로그아웃 되었습니다!");
    };
  }, 300);
});
