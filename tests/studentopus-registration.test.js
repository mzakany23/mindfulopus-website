const test = require("node:test");
const assert = require("node:assert/strict");
const { registrationOpen } = require("../src/assets/js/studentopus-registration.js");
const session = require("../src/data/studentopus.json");
const vm = require("node:vm");
const fs = require("node:fs");

test("registration remains open until, but not at, the 11:59 AM cutoff", () => {
  assert.equal(registrationOpen(session, Date.parse("2026-10-06T11:00:00-04:00")), true);
  assert.equal(registrationOpen(session, Date.parse("2026-10-06T11:58:59.999-04:00")), true);
  assert.equal(registrationOpen(session, Date.parse("2026-10-06T11:59:00-04:00")), false);
  assert.equal(registrationOpen(session, Date.parse("2026-10-06T12:30:00-04:00")), false);
});

function pageAt(time, config = session) {
  const button = () => ({
    attrs: { href: session.interestUrl, "data-registration-state": "closed", "data-track": "interest_click" },
    getAttribute(name) { return this.attrs[name]; },
    setAttribute(name, value) { this.attrs[name] = value; },
    removeAttribute(name) { delete this.attrs[name]; },
  });
  const buttons = [button(), button()];
  const notes = [{ hidden: false }, { hidden: false }];
  const events = {};
  const page = { now: Date.parse(time), buttons, notes, events, timer: null };
  const document = {
    getElementById: () => ({ textContent: JSON.stringify(config) }),
    querySelectorAll: selector => selector === "[data-session-reserve]" ? buttons :
      selector === ".interest-note" ? notes : [{ textContent: "Register by 11:59 AM ET." }],
    addEventListener: (name, callback) => { events[name] = callback; },
  };
  const window = {
    document, clearTimeout() {},
    setTimeout(callback, delay) { page.timer = { callback, delay }; },
    addEventListener() {},
  };
  vm.runInNewContext(fs.readFileSync(require.resolve("../src/assets/js/studentopus-registration.js"), "utf8"), {
    window, Date: { now: () => page.now, parse: Date.parse },
  });
  return page;
}

test("open tabs switch both destinations to the interest form at the cutoff", () => {
  const page = pageAt("2026-10-06T11:58:59-04:00");
  assert.ok(page.buttons.every(b => b.attrs.href === session.paymentUrl));
  assert.equal(page.timer.delay, 1001);
  page.now = Date.parse("2026-10-06T11:59:00-04:00");
  page.timer.callback();
  assert.ok(page.buttons.every(b => b.attrs.href === session.interestUrl && b.attrs["data-track"] === "interest_click"));
  assert.ok(page.buttons.every(b => b.textContent === "Join the interest list for the next session"));
  assert.ok(page.notes.every(n => n.hidden));
});

test("a stale click switches to the interest form before navigation and analytics", () => {
  for (const kind of ["click", "auxclick"]) {
    const page = pageAt("2026-10-06T11:58:59-04:00");
    page.now = Date.parse("2026-10-06T11:59:00-04:00");
    page.events[kind]({ target: { closest: () => page.buttons[0] } });
    assert.equal(page.buttons[0].attrs.href, session.interestUrl);
    assert.equal(page.buttons[0].attrs["data-track"], "interest_click");
  }
});

test("a normal refresh preserves the Stripe analytics reference", () => {
  const page = pageAt("2026-10-06T11:58:00-04:00");
  const tagged = session.paymentUrl + "?client_reference_id=visitor123";
  page.buttons[0].attrs.href = tagged;
  page.timer.callback();
  assert.equal(page.buttons[0].attrs.href, tagged);
});

test("invalid configuration retains the HTML interest-list fallback", () => {
  const page = pageAt("2026-10-06T11:00:00-04:00", null);
  assert.ok(page.buttons.every(b => b.attrs.href === session.interestUrl));
});
test("old sessions never reopen on the following Tuesday or month", () => {
  assert.equal(registrationOpen(session, Date.parse("2026-10-13T11:00:00-04:00")), false);
  assert.equal(registrationOpen(session, Date.parse("2026-11-03T11:00:00-05:00")), false);
});
test("a winter session observes Eastern standard time regardless of visitor timezone", () => {
  const winter = { ...session, registrationClosesAt: "2026-11-03T11:59:00-05:00" };
  assert.equal(registrationOpen(winter, Date.parse("2026-11-03T16:58:59Z")), true);
  assert.equal(registrationOpen(winter, Date.parse("2026-11-03T16:59:00Z")), false);
});
test("missing, invalid, or timezone-ambiguous configuration fails closed", () => {
  for (const broken of [null, {}, { ...session, registrationClosesAt: "invalid" },
    { ...session, registrationClosesAt: "2026-10-06T11:59:00" }, { ...session, registrationClosesAt: undefined }]) {
    assert.equal(registrationOpen(broken, Date.now()), false);
  }
});
