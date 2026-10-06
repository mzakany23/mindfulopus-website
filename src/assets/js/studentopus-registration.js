(function (root) {
  "use strict";

  function registrationOpen(session, now) {
    // An explicit offset keeps the advertised session fixed across visitor timezones.
    if (!session || !/(Z|[+-]\d{2}:\d{2})$/.test(session.registrationClosesAt || "")) return false;
    var cutoff = Date.parse(session.registrationClosesAt);
    return Number.isFinite(cutoff) && Number.isFinite(now) && now < cutoff;
  }

  if (typeof module === "object" && module.exports) module.exports = { registrationOpen: registrationOpen };
  if (!root.document) return;
  var config = root.document.getElementById("studentopus-session");
  var session;
  try { session = JSON.parse(config.textContent); } catch (_) { session = null; }
  var buttons = Array.prototype.slice.call(root.document.querySelectorAll("[data-session-reserve]"));
  var statuses = Array.prototype.slice.call(root.document.querySelectorAll("[data-session-status]"));
  var interestNotes = Array.prototype.slice.call(root.document.querySelectorAll(".interest-note"));
  var timer;

  function refresh() {
    root.clearTimeout(timer);
    var open = registrationOpen(session, Date.now());
    buttons.forEach(function (button) {
      var wasOpen = button.getAttribute("data-registration-state") === "open";
      button.setAttribute("data-registration-state", open ? "open" : "closed");
      button.textContent = open ? "Reserve my spot — $25" : "Join the interest list for the next session";
      if (open) {
        // Preserve the analytics reference if it has already been added to this URL.
        if (!wasOpen) button.setAttribute("href", session.paymentUrl);
        button.removeAttribute("data-track");
      } else {
        // Keep the HTML interest-list fallback even when configuration is invalid.
        if (session && session.interestUrl) button.setAttribute("href", session.interestUrl);
        button.setAttribute("data-track", "interest_click");
      }
    });
    interestNotes.forEach(function (note) { note.hidden = !open; });
    if (!open) statuses.forEach(function (status) {
      status.textContent = "Registration for this session has closed.";
    });
    if (open) timer = root.setTimeout(refresh, Math.min(60000,
      Date.parse(session.registrationClosesAt) - Date.now() + 1));
    return open;
  }

  function beforeNavigation(event) {
    if (event.target.closest && event.target.closest("[data-session-reserve]")) refresh();
  }
  // Switch the destination before the analytics listener and the browser follow it.
  root.document.addEventListener("click", beforeNavigation, true);
  root.document.addEventListener("auxclick", beforeNavigation, true);
  root.addEventListener("pageshow", refresh);
  root.addEventListener("focus", refresh);
  root.document.addEventListener("visibilitychange", refresh);
  refresh();
}(typeof window === "undefined" ? globalThis : window));
