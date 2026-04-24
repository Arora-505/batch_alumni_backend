(function () {
  "use strict";

  var listEl = document.getElementById("notice-list");
  var form = document.getElementById("notice-form");
  var formWrap = document.getElementById("notice-form-wrap");

  function noticeHTML(n) {
    return (
      '<article class="notice-card">' +
      "<h3>" +
      window.BatchMate.esc(n.title) +
      "</h3>" +
      '<p class="muted">' +
      window.BatchMate.esc(n.description) +
      "</p>" +
      '<p class="muted small">' +
      new Date(n.createdAt).toLocaleString() +
      "</p>" +
      (n.canDelete
        ? '<button class="btn danger" data-delete="' +
          window.BatchMate.esc(n._id) +
          '">Delete</button>'
        : "") +
      "</article>"
    );
  }

  async function loadNotices() {
    try {
      // Try to get current user (may fail if not logged in, that's ok)
      var me = null;
      try {
        me = await window.BatchMate.api("/api/users/current");
      } catch (_e) {
        // Not logged in, hide admin form
      }
      formWrap.hidden = !me || me.role !== "admin";
      var notices = await window.BatchMate.api("/api/notices");
      listEl.innerHTML = notices
        .map(function (n) {
          n.canDelete = me && me.role === "admin";
          return noticeHTML(n);
        })
        .join("");
    } catch (err) {
      listEl.innerHTML =
        '<p class="muted">' +
        window.BatchMate.esc(err.message || "Failed to load notices") +
        "</p>";
    }
  }

  async function createNotice(e) {
    e.preventDefault();
    var payload = {
      title: form.elements.title.value.trim(),
      description: form.elements.description.value.trim(),
    };
    if (!payload.title || !payload.description) return;
    try {
      await window.BatchMate.api("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      form.reset();
      loadNotices();
    } catch (err) {
      alert(err.message || "Failed to create notice");
    }
  }

  async function deleteNotice(id) {
    if (!confirm("Delete this notice?")) return;
    try {
      await window.BatchMate.api("/api/notices/" + encodeURIComponent(id), {
        method: "DELETE",
      });
      loadNotices();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  function init() {
    if (!listEl) return;
    if (form) form.addEventListener("submit", createNotice);
    listEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-delete]");
      if (!btn) return;
      deleteNotice(btn.getAttribute("data-delete"));
    });
    loadNotices();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();