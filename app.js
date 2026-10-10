(function () {
  "use strict";

  // Accessible UWP-style SplitView navigation.
  var menuToggle = document.getElementById("menu-toggle");
  var menuDrawer = document.getElementById("app-navigation");
  var menuScrim = document.getElementById("drawer-scrim");
  var menuClose = document.getElementById("drawer-close");
  var menuPreviouslyFocused = null;

  if (menuToggle && menuDrawer && menuScrim && menuClose) {
    function setMenuOpen(open, restoreFocus) {
      var isOpen = document.body.classList.contains("drawer-open");
      if (open === isOpen) return;
      document.body.classList.toggle("drawer-open", open);
      menuDrawer.setAttribute("aria-hidden", String(!open));
      if (open) menuDrawer.removeAttribute("inert");
      else menuDrawer.setAttribute("inert", "");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      menuScrim.hidden = !open;
      if (open) {
        menuPreviouslyFocused = document.activeElement;
        menuClose.focus();
      } else if (restoreFocus && menuPreviouslyFocused && typeof menuPreviouslyFocused.focus === "function") {
        menuPreviouslyFocused.focus();
      }
    }

    menuToggle.addEventListener("click", function () {
      setMenuOpen(!document.body.classList.contains("drawer-open"), true);
    });
    menuClose.addEventListener("click", function () { setMenuOpen(false, true); });
    menuScrim.addEventListener("click", function () { setMenuOpen(false, true); });
    menuDrawer.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest("a") : null;
      if (link) setMenuOpen(false, false);
    });
    document.addEventListener("keydown", function (event) {
      if (!document.body.classList.contains("drawer-open")) return;
      if (event.key === "Escape" || event.key === "Esc") {
        event.preventDefault();
        setMenuOpen(false, true);
      }
      if (event.key === "Tab") {
        var focusables = Array.prototype.slice.call(menuDrawer.querySelectorAll('a[href], button:not([disabled])'));
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (event.shiftKey && (document.activeElement === first || !menuDrawer.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !menuDrawer.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  var search = document.getElementById("version-search");
  if (search) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".download-card"));
    var count = document.getElementById("version-count");
    var empty = document.getElementById("empty-state");
    function filterVersions() {
      var query = search.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var matches = card.textContent.toLowerCase().indexOf(query) !== -1;
        card.hidden = !matches;
        card.style.display = matches ? "" : "none";
        if (matches) visible++;
      });
      if (count) count.textContent = visible + (visible === 1 ? " version" : " versions");
      if (empty) empty.hidden = visible !== 0;
    }
    search.addEventListener("input", filterVersions);
    filterVersions();
  }

  var dialog = document.getElementById("release-dialog");
  var title = document.getElementById("dialog-release-title");
  var close = document.getElementById("dialog-confirm");
  var exit = document.getElementById("dialog-close");
  Array.prototype.forEach.call(document.querySelectorAll("[data-release]"), function (button) {
    button.addEventListener("click", function () {
      var name = button.getAttribute("data-release");
      if (!dialog || typeof dialog.showModal !== "function") {
        window.alert(name + "\n\nDownload is not available yet.");
        return;
      }
      title.textContent = name;
      dialog.showModal();
    });
  });
  if (dialog) {
    if (close) close.addEventListener("click", function () { dialog.close(); });
    if (exit) exit.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
  }
})();
