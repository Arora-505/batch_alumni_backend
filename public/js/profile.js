(function () {
  "use strict";

  var form = document.getElementById("profile-form");
  var photoForm = document.getElementById("photo-form");
  var msgEl = document.getElementById("profile-msg");

  var fields = [
    "name",
    "email",
    "bloodGroup",
    "hometown",
    "hideHometown",
    "schoolName",
    "collegeName",
    "fatherName",
    "hideFatherName",
    "motherName",
    "hideMotherName",
    "phoneNumber",
    "facebookUrl",
    "linkedinUrl",
    "githubUrl",
    "currentCityCountry",
    "profession",
    "desiredJobSector",
    "bio",
    "hobbies",
    "passions",
  ];

  function setMessage(message, isError) {
    msgEl.textContent = message;
    msgEl.className = isError ? "alert error" : "alert success";
    msgEl.hidden = false;
  }

  function getValue(name) {
    var el = form.elements[name];
    if (!el) return "";
    if (el.type === "checkbox") return el.checked;
    return el.value.trim();
  }

  function setValue(name, value) {
    var el = form.elements[name];
    if (!el) return;
    if (el.type === "checkbox") {
      el.checked = !!value;
    } else {
      el.value = value || "";
    }
  }

  async function loadProfile() {
    try {
      var profile = await window.BatchMate.api("/api/profiles/me/current");
      fields.forEach(function (name) {
        setValue(name, profile[name]);
      });
      setValue("email", profile.email);
      // Update photo preview if user has a photo
      if (profile.photoUrl) {
        var img = document.getElementById("profile-preview");
        if (img) img.src = window.BatchMate.API_BASE + profile.photoUrl;
      }
    } catch (err) {
      if (err.status === 401) {
        window.location.href = "login.html";
        return;
      }
      setMessage(err.message || "Failed to load profile", true);
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    var payload = {};
    fields.forEach(function (name) {
      if (name === "email") return;
      payload[name] = getValue(name);
    });
    try {
      await window.BatchMate.api("/api/profiles/me/current", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setMessage("Profile saved successfully.", false);
    } catch (err) {
      setMessage(err.message || "Failed to save profile", true);
    }
  }

  async function uploadPhoto(e) {
    e.preventDefault();
    var fileInput = document.getElementById("photo");
    if (!fileInput.files || !fileInput.files[0]) {
      setMessage("Select an image first.", true);
      return;
    }
    var fd = new FormData();
    fd.append("photo", fileInput.files[0]);
    try {
      var data = await window.BatchMate.api("/api/profiles/me/photo", {
        method: "POST",
        body: fd,
      });
      var img = document.getElementById("profile-preview");
      if (img) img.src = window.BatchMate.API_BASE + data.photoUrl;
      setMessage("Profile photo updated.", false);
    } catch (err) {
      setMessage(err.message || "Photo upload failed", true);
    }
  }

  function init() {
    if (!form) return;
    form.addEventListener("submit", saveProfile);
    photoForm.addEventListener("submit", uploadPhoto);
    loadProfile();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();