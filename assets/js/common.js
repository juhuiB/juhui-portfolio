document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  /**
   * 메뉴 활성화 상태를 업데이트하는 함수
   * @param {string} id - 활성화할 섹션의 ID (해시 제외)
   */
  const activateMenu = (id) => {
    navLinks.forEach((link) => {
      const targetHref = link.getAttribute("href").replace("#", "");
      const isTarget = targetHref === id;
      // 부모 li 안에서 active-bar를 찾습니다.
      const bar = link.parentElement.querySelector(".active-bar");

      if (isTarget) {
        // 활성화 스타일
        link.classList.add("text-blue-600", "dark:text-blue-500");
        link.classList.remove("text-neutral-600", "dark:text-neutral-400");
        bar?.classList.remove("hidden");
      } else {
        // 비활성화 스타일
        link.classList.remove("text-blue-600", "dark:text-blue-500");
        link.classList.add("text-neutral-600", "dark:text-neutral-400");
        bar?.classList.add("hidden");
      }
    });
  };

  // 1. 클릭 이벤트: 부드러운 스크롤 및 즉각적인 UI 피드백
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // 이동하기 전 메뉴 불부터 즉시 켭니다 (사용자 경험 향상)
        activateMenu(targetId.replace("#", ""));

        // 해당 섹션으로 부드럽게 이동
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // 2. 스크롤 감지 (Intersection Observer)
  const observerOptions = {
    root: null,
    // 화면의 상/하단 40%는 무시하고 중앙 20% 영역에 섹션이 들어올 때 메뉴를 변경합니다.
    // 이 설정이 "프로젝트를 눌렀는데 어바웃에 불이 들어오는" 현상을 방지합니다.
    rootMargin: "-40% 0px -40% 0px",
    threshold: 0,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activateMenu(entry.target.id);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // ID가 있는 모든 섹션을 관찰 대상으로 등록
  sections.forEach((section) => observer.observe(section));

  // 3. 초기 로드 시 현재 스크롤 위치에 맞는 메뉴 활성화
  // (새로고침 했을 때 첫 섹션에 불이 들어오게 함)
  const currentSection = Array.from(sections).find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top >= 0 && rect.top <= window.innerHeight / 2;
  });
  if (currentSection) activateMenu(currentSection.id);

  // 프로젝트 카드 애니메이션 로직
  const scrollAnimateElements = document.querySelectorAll(".fade-in-up");

  const scrollObserverOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1, // 카드가 10% 정도 보일 때 애니메이션 시작
  };

  const scrollObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 화면에 들어오면 is-visible 클래스 추가
        entry.target.classList.add("is-visible");
        // 한 번 나타난 뒤에는 관찰을 중단 (다시 스크롤 올렸을 때 사라지는 걸 원치 않을 경우)
        observer.unobserve(entry.target);
      }
    });
  };

  const scrollObserver = new IntersectionObserver(
    scrollObserverCallback,
    scrollObserverOptions,
  );

  scrollAnimateElements.forEach((el) => {
    scrollObserver.observe(el);
  });
});
