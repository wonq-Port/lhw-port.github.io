/**
 * Portfolio Interactive Scripts
 * Pure Vanilla JavaScript (No Framework Dependency)
 * Full Keyboard & Mouse Accessibility & Zero Console Errors
 */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-link');
  const logoBtn = document.getElementById('logo-btn');
  const motionToggleBtn = document.getElementById('motion-toggle-btn');
  const sections = ['hero', 'about', 'scope', 'work', 'skills', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const modal = document.getElementById('image-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalCode = document.getElementById('modal-code');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  let lastActiveElement = null;

  // 1. Scroll Progress & Navbar Style on Scroll
  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (navbar) {
      if (scrollY > 48) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Active Section Spy
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          navLinks.forEach(link => {
            if (link.dataset.section === currentId || link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  // 3. Smooth Scroll Navigation
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });

  // 4. Motion Reduction Toggle
  if (motionToggleBtn) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyMotionSetting = (shouldReduce) => {
      if (shouldReduce) {
        document.body.classList.add('reduce-motion');
        motionToggleBtn.setAttribute('aria-pressed', 'true');
        motionToggleBtn.textContent = '모션 줄이기: ON';
      } else {
        document.body.classList.remove('reduce-motion');
        motionToggleBtn.setAttribute('aria-pressed', 'false');
        motionToggleBtn.textContent = '모션 줄이기: OFF';
      }
    };

    if (mediaQuery.matches) {
      applyMotionSetting(true);
    }

    motionToggleBtn.addEventListener('click', () => {
      const isCurrentlyReduced = document.body.classList.contains('reduce-motion');
      applyMotionSetting(!isCurrentlyReduced);
    });
  }

  // 5. Project Accordion Expand/Collapse (Mouse & Keyboard Enter/Space)
  const projectItems = document.querySelectorAll('.project-item');
  projectItems.forEach(item => {
    const toggleBtn = item.querySelector('.project-toggle-btn');
    const toggleText = item.querySelector('.toggle-text');
    const arrow = item.querySelector('.project-toggle-btn .arrow-icon');

    const toggleProject = (e) => {
      if (e.target.closest('.evidence-modal-trigger')) return;

      const isExpanded = item.classList.contains('is-expanded');
      item.classList.toggle('is-expanded');
      item.setAttribute('aria-expanded', String(!isExpanded));

      if (toggleText) {
        toggleText.textContent = !isExpanded ? '세부 분석 과정 닫기' : '세부 분석 과정 펼치기';
      }
      if (arrow) {
        arrow.textContent = !isExpanded ? '↑' : '↓';
      }
    };

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleProject(e);
      });
    }

    item.addEventListener('click', toggleProject);

    item.addEventListener('keydown', (e) => {
      if (e.target === item && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        toggleProject(e);
      }
    });
  });

  // 6. Evidence Lightbox Modal Interaction
  const evidenceData = {
    evidence1: {
      title: "Snort & Suricata 기반 침입 탐지(IDS) 룰셋 및 탐지 검증 보고서",
      desc: "Kali Linux 발 SYN Flag Scanning 및 비정상 패킷 공격 시나리오에 대해 Snort 및 Suricata 침입 탐지 엔진의 룰셋을 작성하고 실시간 알림 로그를 검증한 실증 결과입니다.",
      code: "[Snort Rule 명세]\nalert tcp any any -> $HOME_NET any (msg:\"SYN Flag Scanning Detected\"; flags:S; threshold:type threshold, track by_src, count 5, seconds 3; sid:1000005; rev:1;)\nalert icmp any any -> $HOME_NET any (msg:\"ICMP Echo Request Detected\"; itype:8; sid:1000001; rev:1;)\n\n[검증 결과]\n- Kali 발 포트 스캔 유입 시 alert 파일 내 timestamp, src IP, dst port 정확 매칭\n- 오탐 방지: 내부 DNS/NTP 통신 포트 예외 처리 완료"
    },
    evidence2: {
      title: "GNS3 가상 토폴로지 구축 및 Cisco ASAv 방화벽 망 분리 설계서",
      desc: "GNS3 환경에서 라우터 이중화(HSRP)와 Cisco ASAv 방화벽을 배치하여 내부망(Inside), DMZ 웹 서버망, 인터넷 구간을 격리하고 인터페이스별 보안 레벨 정책을 적용한 보고서입니다.",
      code: "[Cisco ASAv 방화벽 인터페이스 보안 레벨]\ninterface GigabitEthernet0/0 -> nameif inside, security-level 100\ninterface GigabitEthernet0/1 -> nameif dmz, security-level 50\ninterface GigabitEthernet0/2 -> nameif outside, security-level 0\n\n[ACL 패킷 필터링 정책]\naccess-list DMZ_IN extended permit tcp any host 192.168.20.10 eq 80\naccess-list DMZ_IN extended permit tcp any host 192.168.20.10 eq 23\naccess-list DMZ_IN extended deny ip any any"
    },
    evidence3: {
      title: "OSSEC(HIDS) 및 Zabbix 기반 호스트 관제 체계 구축 명세서",
      desc: "Ubuntu 중앙 관제 서버에 OSSEC HIDS 서버를 구축하고 Windows 및 Rocky Linux 노드에 Agent를 연동하여 파일 무결성 및 시스템 가용성을 실시간 모니터링한 구성 문서입니다.",
      code: "[OSSEC HIDS 에이전트 연동 상태]\n- Server: Ubuntu 22.04 LTS (IP: 192.168.10.50)\n- Agent 001: Windows 10 (IP: 192.168.10.101) - Status: Active\n- Agent 002: Rocky Linux 9 (IP: 192.168.10.102) - Status: Active\n\n[Syscheck 무결성 감시]\n- 감시 대상: /etc/passwd, /etc/shadow, C:\\Windows\\System32\\drivers\\etc\\hosts\n- Zabbix 연동: CPU 점유율 85% 초과 또는 Agent Unreachable 시 즉시 대시보드 경보"
    }
  };

  const openModal = (key) => {
    if (!modal) return;
    const data = evidenceData[key];
    if (!data) return;

    lastActiveElement = document.activeElement;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalCode) modalCode.textContent = data.code;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (modalClose) modalClose.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  document.querySelectorAll('.open-evidence-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.dataset.evidence;
      openModal(key);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });
});
