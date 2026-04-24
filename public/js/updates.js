(function () {
  "use strict";

  var listEl = document.getElementById("updates-list");

  function updateHTML(item) {
    return (
      '<article class="notice-card">' +
      "<h3>" +
      window.BatchMate.esc(item.userName) +
      "</h3>" +
      '<p class="muted">' +
      window.BatchMate.esc(item.action) +
      "</p>" +
      '<p class="muted small">' +
      window.BatchMate.esc(window.BatchMate.formatRelative(item.createdAt)) +
      "</p>" +
      "</article>"
    );
  }

  async function load() {
    try {
      var rows = await window.BatchMate.api("/api/updates");
      listEl.innerHTML = rows.map(updateHTML).join("");
    } catch (err) {
      listEl.innerHTML =
        '<p class="muted">' +
        window.BatchMate.esc(err.message || "Failed to load updates") +
        "</p>";
    }
  }

  function init() {
    if (!listEl) return;
    load();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();