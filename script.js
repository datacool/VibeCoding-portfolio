document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const yearEl = document.getElementById("year");
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const header = document.querySelector(".site-header");

  // Year
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Mobile nav toggle
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Header shrink on scroll
  if (header) {
    let lastScrollY = 0;
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 60) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
      lastScrollY = scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Scroll reveal with IntersectionObserver
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // Stat count-up animation
  const statNumbers = document.querySelectorAll(".stat-number");
  if (statNumbers.length > 0) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.textContent, 10);
            if (isNaN(target)) return;

            let current = 0;
            const duration = 1200;
            const step = Math.max(1, Math.floor(target / (duration / 30)));
            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = String(current);
            }, 30);

            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((el) => countObserver.observe(el));
  }

  // Contact form
  if (form && feedback) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      feedback.textContent = "";
      feedback.classList.remove("success", "error");
      clearFieldErrors();

      const formData = new FormData(form);
      const name = (formData.get("name") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const message = (formData.get("message") || "").toString().trim();

      let hasError = false;

      if (!name) {
        setFieldError("name", "이름을 입력해 주세요.");
        hasError = true;
      }

      if (!email) {
        setFieldError("email", "이메일을 입력해 주세요.");
        hasError = true;
      } else if (!isValidEmail(email)) {
        setFieldError("email", "올바른 이메일 형식을 입력해 주세요.");
        hasError = true;
      }

      if (!message) {
        setFieldError("message", "메시지를 입력해 주세요.");
        hasError = true;
      }

      if (hasError) {
        feedback.textContent = "필수 항목을 확인해 주세요.";
        feedback.classList.add("error");
        return;
      }

      feedback.textContent =
        "브라우저 보안 정책상 직접 전송은 되지 않지만, 내용은 아래 연락처로 보내주시면 됩니다: kesugwa@gmail.com";
      feedback.classList.add("success");
      form.reset();
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function clearFieldErrors() {
    document.querySelectorAll(".field-error").forEach((el) => {
      el.textContent = "";
    });
  }

  function setFieldError(fieldName, message) {
    const errorElement = document.querySelector(
      `.field-error[data-error-for="${fieldName}"]`,
    );
    if (errorElement) {
      errorElement.textContent = message;
    }
  }
});
