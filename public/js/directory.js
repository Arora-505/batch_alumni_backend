(function () {
  "use strict";

  var gridEl = document.getElementById("profile-grid");
  var emptyEl = document.getElementById("directory-empty");
  var modalEl = document.getElementById("profile-modal");
  var modalBody = document.getElementById("modal-body");

  function fallbackPhoto(profile) {
    return profile.photoUrl
      ? window.BatchMate.API_BASE + profile.photoUrl
      : "https://i.pravatar.cc/240?u=" +
          encodeURIComponent(profile.email || profile.name || "student");
  }

  function cardHTML(profile) {
    return (
      '<article class="card">' +
      '<img class="avatar" src="' +
      window.BatchMate.esc(fallbackPhoto(profile)) +
      '" alt="' +
      window.BatchMate.esc(profile.name) +
      '">' +
      "<h3>" +
      window.BatchMate.esc(profile.name || "Unnamed Student") +
      "</h3>" +
      '<p class="muted">' +
      window.BatchMate.esc(profile.currentCityCountry || "City not set") +
      "</p>" +
      '<p class="muted">' +
      window.BatchMate.esc(profile.profession || "Profession not set") +
      "</p>" +
      '<p class="chip">' +
      window.BatchMate.esc(profile.bloodGroup || "Blood group N/A") +
      "</p>" +
      '<div class="social-row">' +
      (profile.facebookUrl
        ? '<a href="' +
          window.BatchMate.esc(profile.facebookUrl) +
          '" target="_blank" rel="noreferrer">f</a>'
        : "") +
      (profile.linkedinUrl
        ? '<a href="' +
          window.BatchMate.esc(profile.linkedinUrl) +
          '" target="_blank" rel="noreferrer">in</a>'
        : "") +
      (profile.githubUrl
        ? '<a href="' +
          window.BatchMate.esc(profile.githubUrl) +
          '" target="_blank" rel="noreferrer">gh</a>'
        : "") +
      "</div>" +
      '<button class="btn btn-primary" data-view-id="' +
      window.BatchMate.esc(profile._id) +
      '">View Profile</button>' +
      "</article>"
    );
  }

  function modalHTML(profile) {
    function row(label, value) {
      return (
        '<div class="meta-row"><strong>' +
        window.BatchMate.esc(label) +
        ":</strong> " +
        window.BatchMate.esc(value || "—") +
        "</div>"
      );
    }
    return (
      '<div class="modal-top">' +
      '<img class="avatar large" src="' +
      window.BatchMate.esc(fallbackPhoto(profile)) +
      '" alt="' +
      window.BatchMate.esc(profile.name) +
      '">' +
      "<div><h2>" +
      window.BatchMate.esc(profile.name) +
      "</h2><p class='muted'>" +
      window.BatchMate.esc(profile.email) +
      "</p></div></div>" +
      row("City/Country", profile.currentCityCountry) +
      row("Profession", profile.profession) +
      row("Job Sector", profile.desiredJobSector) +
      row("Hometown", profile.hometown) +
      row("School", profile.schoolName) +
      row("College", profile.collegeName) +
      row("Father", profile.fatherName) +
      row("Mother", profile.motherName) +
      row("Phone", profile.phoneNumber) +
      row("Bio", profile.bio) +
      row("Hobbies", profile.hobbies) +
      row("Passions", profile.passions)
    );
  }

  async function loadDirectory() {
    try {
      var profiles = await window.BatchMate.api("/api/profiles");
      if (!profiles.length) {
        emptyEl.hidden = false;
        return;
      }
      emptyEl.hidden = true;
      gridEl.innerHTML = profiles.map(cardHTML).join("");
    } catch (err) {
      emptyEl.hidden = false;
      emptyEl.textContent = err.message || "Failed to load directory.";
    }
  }

  async function openProfile(profileId) {
    try {
      var profile = await window.BatchMate.api(
        "/api/profiles/" + encodeURIComponent(profileId),
      );
      modalBody.innerHTML = modalHTML(profile);
      modalEl.hidden = false;
    } catch (err) {
      alert(err.message || "Failed to load profile");
    }
  }

  function closeModal() {
    modalEl.hidden = true;
    // Clear modal content after a short delay to prevent flash of old content
    setTimeout(function () {
      modalBody.innerHTML = "";
    }, 300);
  }

  function bindActions() {
    gridEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-view-id]");
      if (!btn) return;
      openProfile(btn.getAttribute("data-view-id"));
    });

    // Close button handler - uses event delegation on modalEl for reliability
    modalEl.addEventListener("click", function (e) {
      var closeBtn = e.target.closest("#modal-close");
      if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
        return;
      }
      // Click outside modal-card closes modal
      if (e.target === modalEl) {
        closeModal();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modalEl.hidden) {
        closeModal();
      }
    });
  }

  function init() {
    if (!gridEl) return;
    bindActions();
    loadDirectory();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();