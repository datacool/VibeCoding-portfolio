document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const yearEl = document.getElementById("year");
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

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

