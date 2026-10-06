const { DateTime } = require("luxon");
const session = require("../data/studentopus.json");
const start = DateTime.fromISO(session.startsAt, { zone: "America/New_York" });
const cutoff = DateTime.fromISO(session.registrationClosesAt, { zone: "America/New_York" });
if (!start.isValid || !cutoff.isValid || cutoff.toISODate() !== start.toISODate()) {
  throw new Error("Invalid StudentOpus session configuration");
}
module.exports = {
  sessionMonth: start.toFormat("LLLL"),
  sessionDate: start.toFormat("cccc, LLLL d"),
  sessionCutoff: cutoff.toFormat("h:mm a") + " ET",
};
