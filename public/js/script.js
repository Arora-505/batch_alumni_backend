/**
 * Shared UI helpers (mobile nav and logout)
 */
(function () {
  "use strict";

  function initMobileMenu() {
    var toggle = document.querySelector(".navbar-toggle");
    var menu = document.querySelector(".navbar-menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
      toggle.classList.toggle("is-active");
    });
  }

  async function handleLogout(e) {
    e.preventDefault();
    try {
      if (window.BatchMate) {
        await window.BatchMate.api("/api/users/logout", { method: "POST" });
      }
    } catch (_err) {}
    window.location.href = "login.html";
  }

  function initLogoutButtons() {
    var btns = document.querySelectorAll("[data-logout]");
    btns.forEach(function (b) {
      b.addEventListener("click", handleLogout);
    });
  }

  function init() {
    initMobileMenu();
    initLogoutButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();