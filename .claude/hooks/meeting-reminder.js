// Meeting reminder hook: after 10 seconds on the page, show a one-time dialog.
// Reuses the page's existing <dialog> and .btn styles, so no extra CSS is needed.
(function () {
  var DELAY_MS = 10000;
  var MESSAGE = "IT project management meeting next Wednesday at 10:00 AM, Room 888.";

  function showReminder() {
    var dlg = document.createElement("dialog");
    dlg.setAttribute("aria-labelledby", "meeting-reminder-title");

    var body = document.createElement("div");
    body.style.padding = "var(--pad)";

    var title = document.createElement("h2");
    title.id = "meeting-reminder-title";
    title.textContent = "Meeting reminder";
    title.style.margin = "0 0 var(--gap)";

    var text = document.createElement("p");
    text.textContent = MESSAGE;
    text.style.margin = "0 0 var(--pad)";

    var ok = document.createElement("button");
    ok.type = "button";
    ok.className = "btn";
    ok.textContent = "Got it";
    ok.addEventListener("click", function () { dlg.close(); });

    body.append(title, text, ok);
    dlg.appendChild(body);
    dlg.addEventListener("close", function () { dlg.remove(); });
    document.body.appendChild(dlg);
    dlg.showModal();
    ok.focus();
  }

  setTimeout(showReminder, DELAY_MS);
})();
