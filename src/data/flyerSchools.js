/**
 * School records with upcoming/past event lists for the /flyers hub
 * and /flyers/{school}/ list pages.
 */
const flyers = require("./flyers.json");
const flyerEvents = require("./flyerEvents.js");

module.exports = function () {
  const events = flyerEvents();
  return flyers.schools.map((school) => {
    const schoolEvents = events.filter((e) => e.schoolSlug === school.slug);
    const upcoming = schoolEvents.filter((e) => e.status === "upcoming");
    const past = schoolEvents.filter((e) => e.status === "past");
    return {
      ...school,
      url: `/flyers/${school.slug}/`,
      events: schoolEvents,
      upcoming,
      past,
      upcomingCount: upcoming.length,
      pastCount: past.length,
      eventCount: schoolEvents.length,
    };
  });
};
