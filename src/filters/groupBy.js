/**
 * Group a flat list into labeled runs for season / year demarcation.
 * Each item keeps `_n` (1-based position in the original list) for "show first N".
 */

function groupBySeason(episodes) {
  if (!Array.isArray(episodes)) return [];
  const groups = [];
  let current = null;
  let n = 0;
  for (const episode of episodes) {
    n += 1;
    const key = episode.season == null ? "other" : String(episode.season);
    if (!current || current.key !== key) {
      let label = "More episodes";
      if (episode.isTrailer) label = "Trailer";
      else if (episode.season != null) label = `Season ${episode.season}`;
      current = { key, label, season: episode.season, episodes: [] };
      groups.push(current);
    }
    current.episodes.push({ ...episode, _n: n });
  }
  return groups;
}

function groupByYear(articles) {
  if (!Array.isArray(articles)) return [];
  const groups = [];
  let current = null;
  let n = 0;
  for (const article of articles) {
    n += 1;
    const year = String(article.date || "").slice(0, 4) || "Notes";
    if (!current || current.year !== year) {
      current = { year, articles: [] };
      groups.push(current);
    }
    current.articles.push({ ...article, _n: n });
  }
  return groups;
}

module.exports = { groupBySeason, groupByYear };
