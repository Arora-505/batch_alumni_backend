(function () {
  "use strict";

  var form = document.getElementById("find-form");
  var gridEl = document.getElementById("find-grid");
  var emptyEl = document.getElementById("find-empty");

  function photoUrl(p) {
    return p.photoUrl
      ? window.BatchMate.API_BASE + p.photoUrl
      : "https://i.pravatar.cc/240?u=" + encodeURIComponent(p.email || p.name);
  }

  function renderCard(p) {
    return (
      '<article class="card">' +
      '<img class="avatar" src="' +
      window.BatchMate.esc(photoUrl(p)) +
      '" alt="' +
      window.BatchMate.esc(p.name) +
      '">' +
      "<h3>" +
      window.BatchMate.esc(p.name) +
      "</h3>" +
      '<p class="muted">' +
      window.BatchMate.esc(p.currentCityCountry || "City/Country not set") +
      "</p>" +
      '<p class="muted">' +
      window.BatchMate.esc(p.profession || "Profession not set") +
      "</p>" +
      "</article>"
    );
  }

  async function runSearch() {
    var name = form.elements.name.value.trim();
    var city = form.elements.city.value.trim();
    var country = form.elements.country.value.trim();
    var query = new URLSearchParams();
    if (name) query.set("name", name);
    if (city) query.set("city", city);
    if (country) query.set("country", country);
    try {
      var rows = await window.BatchMate.api(
        "/api/profiles?" + query.toString(),
      );
      gridEl.innerHTML = rows.map(renderCard).join("");
      emptyEl.hidden = rows.length > 0;
    } catch (err) {
      emptyEl.hidden = false;
      emptyEl.textContent = err.message || "Search failed";
    }
  }

  function init() {
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      runSearch();
    });
    ["name", "city", "country"].forEach(function (k) {
      form.elements[k].addEventListener("input", runSearch);
    });
    runSearch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();