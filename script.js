(() => {
  "use strict";

  /* ── Year ─────────────────────────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Sticky header shrink on scroll ────────── */
  const header = document.querySelector(".site-header");
  if (header) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle("scrolled", window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav toggle ─────────────────────── */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "메뉴 열기");
      })
    );
  }

  /* ── Scroll reveal (Intersection Observer) ── */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ── Stats count-up animation ───────────────── */
  const statNumbers = document.querySelectorAll(".stat-number[data-count]");
  if (statNumbers.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      const duration = 1400;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(ease(progress) * target);
        el.textContent = value + "+";
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const statsIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            statsIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach((el) => statsIO.observe(el));
  }

  /* ── Contact form (client-side validation) ── */
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  if (form && feedback) {
    const validators = {
      name: (v) => (v.trim() ? "" : "이름을 입력해 주세요."),
      email: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
          ? ""
          : "올바른 이메일 주소를 입력해 주세요.",
      message: (v) => (v.trim() ? "" : "프로젝트 내용을 입력해 주세요."),
    };

    const showError = (name, msg) => {
      const el = form.querySelector(`[data-error-for="${name}"]`);
      if (el) el.textContent = msg;
    };
    const clearErrors = () =>
      form
        .querySelectorAll(".field-error")
        .forEach((el) => (el.textContent = ""));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();
      feedback.textContent = "";
      feedback.className = "form-feedback";

      let valid = true;
      Object.entries(validators).forEach(([field, fn]) => {
        const input = form.elements[field];
        const msg = fn(input ? input.value : "");
        if (msg) {
          showError(field, msg);
          valid = false;
        }
      });

      if (!valid) return;

      // Simulated success
      feedback.textContent =
        "감사합니다! 상담 요청이 정상적으로 접수되었습니다.";
      feedback.className = "form-feedback success";
      form.reset();
    });
  }

  /* ── Smooth scroll for anchor links ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
