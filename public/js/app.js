(function () {
  "use strict";

  var API_BASE =
    (window.BATCHMATE_CONFIG && window.BATCHMATE_CONFIG.API_BASE_URL) ||
    "http://localhost:5001";

  function parseJSON(text) {
    if (!text || !String(text).trim()) return null;
    try {
      return JSON.parse(text);
    } catch (_e) {
      return null;
    }
  }

  async function api(path, options) {
    var response = await fetch(API_BASE + path, Object.assign({}, options || {}, { credentials: "include" }));
    var body = parseJSON(await response.text());
    if (!response.ok) {
      var message = body && (body.message || body.error) ? (body.message || body.error) : "Request failed";
      var err = new Error(message);
      err.status = response.status;
      err.body = body;
      throw err;
    }
    return body;
  }

  function formatRelative(dateString) {
    if (!dateString) return "";
    var now = Date.now();
    var t = new Date(dateString).getTime();
    if (Number.isNaN(t)) return "";
    var diff = Math.max(1, Math.floor((now - t) / 1000));
    if (diff < 60) return diff + " seconds ago";
    if (diff < 3600) return Math.floor(diff / 60) + " minutes ago";
    if (diff < 86400) return Math.floor(diff / 3600) + " hours ago";
    return Math.floor(diff / 86400) + " days ago";
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  window.BatchMate = {
    API_BASE: API_BASE,
    api: api,
    esc: esc,
    formatRelative: formatRelative,
  };
})();