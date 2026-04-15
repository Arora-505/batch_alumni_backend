/**
 * Batch Alumni Directory — loads alumni from API; search + filter when logged in.
 */

(function () {
  "use strict";

  var API_BASE = "http://localhost:5000";
  var TOKEN_KEY = "alumni_jwt";

  var students = [];

  var searchNameEl = document.getElementById("search-name");
  var filterCityEl = document.getElementById("filter-city");
  var studentsGridEl = document.getElementById("students-grid");
  var noResultsEl = document.getElementById("no-results");
  var profileModalEl = document.getElementById("profile-modal");
  var lastFilteredStudents = [];

  var searchControlsBound = false;

  function parseJsonSafe(text) {
    if (!text || !String(text).trim()) {
      return null;
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  function strOrDash(v) {
    if (v == null || v === "") {
      return "—";
    }
    return String(v);
  }

  function socialHref(v) {
    if (v == null || String(v).trim() === "") {
      return "#";
    }
    return String(v);
  }

  function normalizeAlumniRecord(raw) {
    if (!raw || typeof raw !== "object") {
      raw = {};
    }
    var r = raw;
    var name = strOrDash(r.name);
    if (name === "—" && r.email) {
      name = strOrDash(r.email);
    }

    var img =
      r.image ||
      r.photo ||
      r.avatar ||
      r.picture ||
      "";
    if (!img) {
      img =
        "https://i.pravatar.cc/400?u=" +
        encodeURIComponent(String(r.name || r.email || "alumni"));
    }

    var city = strOrDash(r.city);
    var currentLoc =
      r.currentLocation != null
        ? String(r.currentLocation)
        : r.current_location != null
          ? String(r.current_location)
          : "";

    return {
      name: name,
      city: city,
      profession: strOrDash(r.profession),
      image: img,
      facebook: socialHref(r.facebook || r.facebook_url),
      linkedin: socialHref(r.linkedin || r.linkedin_url),
      github: socialHref(r.github || r.github_url),
      roll: strOrDash(r.roll),
      company: strOrDash(r.company),
      currentLocation: currentLoc,
      email: r.email != null ? String(r.email) : "",
      phone: strOrDash(r.phone),
      hometown: strOrDash(r.hometown),
      bloodGroup: strOrDash(r.bloodGroup || r.blood_group),
      university: strOrDash(r.university),
      department: strOrDash(r.department),
      batch: strOrDash(r.batch),
      school: strOrDash(r.school),
      college: strOrDash(r.college),
      parentsName: strOrDash(r.parentsName || r.parents_name),
      interests: strOrDash(r.interests),
      workSector: strOrDash(r.workSector || r.work_sector),
      bio: strOrDash(r.bio),
    };
  }

  function normalizeAlumniPayload(data) {
    var list = [];
    if (Array.isArray(data)) {
      list = data;
    } else if (data && Array.isArray(data.alumni)) {
      list = data.alumni;
    } else if (data && Array.isArray(data.data)) {
      list = data.data;
    } else if (data && Array.isArray(data.results)) {
      list = data.results;
    }
    return list.map(normalizeAlumniRecord);
  }

  function setSearchSectionVisible(visible) {
    var section = document.getElementById("find");
    if (section) {
      section.hidden = !visible;
    }
  }

  function showLoginPrompt() {
    if (!studentsGridEl) {
      return;
    }
    studentsGridEl.innerHTML = "";
    var p = document.createElement("p");
    p.className = "no-results";
    p.appendChild(document.createTextNode("Please "));
    var a = document.createElement("a");
    a.href = "login.html";
    a.textContent = "log in";
    p.appendChild(a);
    p.appendChild(document.createTextNode(" to view the alumni directory."));
    studentsGridEl.appendChild(p);
    if (noResultsEl) {
      noResultsEl.hidden = true;
    }
  }

  function showDirectoryError(message) {
    if (!studentsGridEl) {
      return;
    }
    studentsGridEl.innerHTML = "";
    var p = document.createElement("p");
    p.className = "no-results";
    p.textContent = message;
    studentsGridEl.appendChild(p);
    if (noResultsEl) {
      noResultsEl.hidden = true;
    }
  }

  function showLoadingState() {
    if (!studentsGridEl) {
      return;
    }
    studentsGridEl.innerHTML = "";
    var p = document.createElement("p");
    p.className = "no-results";
    p.textContent = "Loading alumni…";
    studentsGridEl.appendChild(p);
  }

  function bindSearchControls() {
    if (searchControlsBound) {
      return;
    }
    searchControlsBound = true;
    if (searchNameEl) {
      searchNameEl.addEventListener("input", handleSearchAndFilter);
    }
    if (filterCityEl) {
      filterCityEl.addEventListener("change", handleSearchAndFilter);
    }
  }

  async function loadAlumniFromApi(token) {
    setSearchSectionVisible(false);
    showLoadingState();

    try {
      var res = await fetch(API_BASE + "/api/alumni", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
      });

      var rawText = await res.text();
      var data = parseJsonSafe(rawText);

      if (res.status === 401) {
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch (e) {}
        students = [];
        lastFilteredStudents = [];
        setSearchSectionVisible(false);
        if (!studentsGridEl) {
          return;
        }
        studentsGridEl.innerHTML = "";
        var p401 = document.createElement("p");
        p401.className = "no-results";
        p401.appendChild(document.createTextNode("Your session has expired. Please "));
        var a401 = document.createElement("a");
        a401.href = "login.html";
        a401.textContent = "log in again";
        p401.appendChild(a401);
        p401.appendChild(document.createTextNode("."));
        studentsGridEl.appendChild(p401);
        if (noResultsEl) {
          noResultsEl.hidden = true;
        }
        return;
      }

      if (!res.ok) {
        students = [];
        lastFilteredStudents = [];
        var msg = "We could not load the alumni list.";
        if (data && typeof data.message === "string") {
          msg = data.message;
        } else if (data && typeof data.error === "string") {
          msg = data.error;
        }
        setSearchSectionVisible(false);
        showDirectoryError(msg + " Please try again later.");
        return;
      }

      students = normalizeAlumniPayload(data);
      setSearchSectionVisible(true);
      fillCityFilter();
      handleSearchAndFilter();
      bindSearchControls();
    } catch (err) {
      students = [];
      lastFilteredStudents = [];
      setSearchSectionVisible(false);
      showDirectoryError(
        "Could not reach the server. Make sure it is running, then refresh this page."
      );
    }
  }

  function getUniqueCities() {
    var seen = {};
    return students
      .map(function (s) {
        return s.city;
      })
      .filter(function (city) {
        if (seen[city]) return false;
        seen[city] = true;
        return true;
      })
      .sort();
  }

  function fillCityFilter() {
    if (!filterCityEl) return;
    var cities = getUniqueCities();
    var options = filterCityEl.querySelectorAll("option");
    for (var i = 1; i < options.length; i++) {
      options[i].remove();
    }
    cities.forEach(function (city) {
      var opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      filterCityEl.appendChild(opt);
    });
  }

  function filterStudents() {
    var nameQuery =
      searchNameEl && searchNameEl.value
        ? searchNameEl.value.trim().toLowerCase()
        : "";
    var cityValue =
      filterCityEl && filterCityEl.value ? filterCityEl.value : "";

    return students.filter(function (s) {
      var matchName =
        !nameQuery || s.name.toLowerCase().indexOf(nameQuery) !== -1;
      var matchCity = !cityValue || s.city === cityValue;
      return matchName && matchCity;
    });
  }

  function renderStudentCard(student, index) {
    var card = document.createElement("article");
    card.className = "student-card";
    if (typeof index === "number") {
      card.setAttribute("data-student-index", String(index));
    }

    var imageWrap = document.createElement("div");
    imageWrap.className = "student-card-image-wrap";

    var img = document.createElement("img");
    img.className = "student-card-image";
    img.src = student.image;
    img.alt = student.name;
    imageWrap.appendChild(img);

    var body = document.createElement("div");
    body.className = "student-card-body";

    var nameEl = document.createElement("h3");
    nameEl.className = "student-card-name";
    nameEl.textContent = student.name;

    var professionEl = document.createElement("p");
    professionEl.className = "student-card-profession";
    professionEl.textContent = student.profession;

    var cityEl = document.createElement("p");
    cityEl.className = "student-card-city";
    cityEl.textContent = student.city;

    var social = document.createElement("div");
    social.className = "student-card-social";
    [
      { url: student.facebook, label: "Facebook", icon: "f" },
      { url: student.linkedin, label: "LinkedIn", icon: "in" },
      { url: student.github, label: "GitHub", icon: "gh" },
    ].forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.url;
      a.setAttribute("aria-label", item.label);
      a.textContent = item.icon;
      social.appendChild(a);
    });

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "student-card-btn";
    btn.textContent = "View Profile";

    body.appendChild(nameEl);
    body.appendChild(professionEl);
    body.appendChild(cityEl);
    body.appendChild(social);
    body.appendChild(btn);

    card.appendChild(imageWrap);
    card.appendChild(body);
    return card;
  }

  function renderStudents(filtered) {
    if (!studentsGridEl) return;

    studentsGridEl.innerHTML = "";

    if (filtered.length === 0) {
      if (noResultsEl) {
        noResultsEl.hidden = false;
      }
      return;
    }

    if (noResultsEl) noResultsEl.hidden = true;
    lastFilteredStudents = filtered;
    filtered.forEach(function (student, i) {
      studentsGridEl.appendChild(renderStudentCard(student, i));
    });
  }

  function setModalText(id, value) {
    var el = document.getElementById(id);
    if (!el) return;
    if (value != null && String(value).trim() !== "") {
      el.textContent = value;
    } else {
      el.textContent = "—";
    }
  }

  function setModalLink(id, href, text) {
    var el = document.getElementById(id);
    if (!el || el.tagName.toLowerCase() !== "a") return;
    el.href = href || "#";
    if (text) {
      el.textContent = text;
    }
  }

  function openProfileModal(student) {
    if (!profileModalEl || !student) return;

    // Set header image
    var modalImage = document.getElementById("modal-image");
    if (modalImage) {
      modalImage.src = student.image || "";
      modalImage.alt = student.name || "";
    }

    // Set header fields
    setModalText("modal-name", student.name);
    setModalText("modal-profession", student.profession);
    setModalText("modal-roll", student.roll);

    // Set quick info grid
    setModalText("modal-company", student.company);
    setModalText("modal-current-location", student.currentLocation || student.city);
    setModalText("modal-hometown", student.hometown);
    setModalText("modal-blood-group", student.bloodGroup);
    setModalText("modal-phone", student.phone);

    // Set email link
    var emailEl = document.getElementById("modal-email");
    if (emailEl) {
      if (student.email) {
        emailEl.href = "mailto:" + student.email;
        emailEl.textContent = student.email;
      } else {
        emailEl.href = "#";
        emailEl.textContent = "—";
      }
    }

    // Set education fields
    setModalText("modal-university", student.university);
    setModalText("modal-department", student.department);
    setModalText("modal-batch", student.batch);
    setModalText("modal-school", student.school);
    setModalText("modal-college", student.college);

    // Set family
    setModalText("modal-parents-name", student.parentsName);

    // Set interests & work
    setModalText("modal-interests", student.interests);
    setModalText("modal-work-sector", student.workSector);

    // Set about section
    setModalText("modal-bio", student.bio);

    // Set social links
    var linkedinEl = document.getElementById("modal-linkedin");
    if (linkedinEl) {
      linkedinEl.href = student.linkedin || "#";
    }

    var githubEl = document.getElementById("modal-github");
    if (githubEl) {
      githubEl.href = student.github || "#";
    }

    var facebookEl = document.getElementById("modal-facebook");
    if (facebookEl) {
      facebookEl.href = student.facebook || "#";
    }

    // Show modal
    profileModalEl.removeAttribute("hidden");
    profileModalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    profileModalEl.classList.add("profile-modal--open");

    var contentBox = profileModalEl.querySelector(".profile-modal__content");
    if (contentBox) {
      contentBox.classList.add("profile-modal__content--open");
    }

    // Focus management
    var closeBtn = profileModalEl.querySelector(".profile-modal-close");
    if (closeBtn) {
      setTimeout(function () {
        closeBtn.focus();
      }, 100);
    }
  }

  function closeProfileModal() {
    if (!profileModalEl) return;

    profileModalEl.setAttribute("hidden", "");
    profileModalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    profileModalEl.classList.remove("profile-modal--open");

    var contentBox = profileModalEl.querySelector(".profile-modal__content");
    if (contentBox) {
      contentBox.classList.remove("profile-modal__content--open");
    }
  }

  function initProfileModal() {
    if (!profileModalEl) return;

    // Set initial state
    profileModalEl.setAttribute("aria-hidden", "true");

    // Close on backdrop click
    var backdrop = profileModalEl.querySelector(".profile-modal__backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", closeProfileModal);
    }

    // Close on clicking outside content (on modal itself)
    profileModalEl.addEventListener("click", function (e) {
      if (e.target === profileModalEl) {
        closeProfileModal();
      }
    });

    // Prevent content clicks from closing modal
    var contentBox = profileModalEl.querySelector(".profile-modal__content");
    if (contentBox) {
      contentBox.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    // Close button
    var closeBtn = profileModalEl.querySelector(".profile-modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeProfileModal();
      });
    }

    // ESC key handler
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        if (profileModalEl && !profileModalEl.hasAttribute("hidden")) {
          closeProfileModal();
        }
      }
    });
  }

  function initViewProfileDelegation() {
    if (!studentsGridEl) return;

    studentsGridEl.addEventListener("click", function (e) {
      // Find the clicked button
      var btn = e.target.closest(".student-card-btn");
      if (!btn) return;

      // Find the parent card
      var card = btn.closest(".student-card");
      if (!card) return;

      // Get student index from data attribute
      var indexStr = card.getAttribute("data-student-index");
      if (indexStr === null || indexStr === "") return;

      var index = parseInt(indexStr, 10);
      if (isNaN(index) || index < 0) return;

      // Get student from filtered list
      var student = lastFilteredStudents[index];
      if (student) {
        openProfileModal(student);
      }
    });
  }

  function handleSearchAndFilter() {
    var filtered = filterStudents();
    renderStudents(filtered);
  }

  function initMobileMenu() {
    var toggle = document.querySelector(".navbar-toggle");
    var menu = document.querySelector(".navbar-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      toggle.classList.toggle("is-active");
      menu.classList.toggle("is-open");
    });

    menu.querySelectorAll(".navbar-link, .navbar-btn").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.classList.remove("is-active");
        menu.classList.remove("is-open");
      });
    });
  }

  function init() {
    initMobileMenu();

    if (!studentsGridEl) {
      return;
    }

    initProfileModal();
    initViewProfileDelegation();

    var token = null;
    try {
      token = localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      token = null;
    }

    if (!token) {
      setSearchSectionVisible(false);
      showLoginPrompt();
      return;
    }

    loadAlumniFromApi(token);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();