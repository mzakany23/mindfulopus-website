/**
 * Flatten school → event data into linkable event records with upcoming/past.
 * Used by Eleventy pagination for /flyers/{school}/{yyyy}/{mm}/{dd}/{slug}/ pages.
 */
const { DateTime } = require("luxon");
const flyers = require("./flyers.json");

function todayISO() {
  return DateTime.now().toISODate();
}

function formatDate(iso) {
  return DateTime.fromISO(iso).toFormat("MMMM d, yyyy");
}

function eventUrl(schoolSlug, dateIso, slug) {
  const dt = DateTime.fromISO(dateIso);
  const y = dt.toFormat("yyyy");
  const m = dt.toFormat("MM");
  const d = dt.toFormat("dd");
  return `/flyers/${schoolSlug}/${y}/${m}/${d}/${slug}/`;
}

module.exports = function () {
  const today = todayISO();
  const events = [];

  for (const school of flyers.schools) {
    for (const event of school.events) {
      const primary =
        event.flyers.find((f) => f.primary) || event.flyers[0] || null;
      events.push({
        ...event,
        schoolSlug: school.slug,
        schoolName: school.name,
        schoolShort: school.shortName,
        status: event.date >= today ? "upcoming" : "past",
        dateLabel: formatDate(event.date),
        primaryFlyer: primary,
        url: eventUrl(school.slug, event.date, event.slug),
        schoolUrl: `/flyers/${school.slug}/`,
      });
    }
  }

  return events.sort((a, b) => b.date.localeCompare(a.date));
};
