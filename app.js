(function () {
  "use strict";
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
