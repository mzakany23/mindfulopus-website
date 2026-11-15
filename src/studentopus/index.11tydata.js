const { DateTime } = require("luxon");
const session = require("../data/studentopus.json");
const start = DateTime.fromISO(session.startsAt, { zone: "America/New_York" });
const cutoff = DateTime.fromISO(session.registrationClosesAt, { zone: "America/New_York" });
const end = DateTime.fromISO(session.endsAt, { zone: "America/New_York" });
const explicitTimes = [session.startsAt, session.endsAt, session.registrationClosesAt].every(value => /(Z|[+-]\d{2}:\d{2})$/.test(value || ""));
if (!explicitTimes || cutoff > start || !end.isValid || end <= start || !start.isValid || !cutoff.isValid || cutoff.toISODate() !== start.toISODate()) {
  throw new Error("Invalid StudentOpus session configuration");
}
const { sessionEnded } = require("../assets/js/studentopus-registration.js");
module.exports = {
  sessionEnded: sessionEnded(session, Date.now()),
  sessionMonth: start.toFormat("LLLL"),
  sessionDate: start.toFormat("cccc, LLLL d"),
  sessionCutoff: cutoff.toFormat("h:mm a") + " ET",
};
