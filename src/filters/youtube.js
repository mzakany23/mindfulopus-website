/**
 * Extract a YouTube video id from a watch or youtu.be URL.
 * @param {string} url
 * @returns {string}
 */
function youtubeId(url) {
  if (!url) return "";
  const match = String(url).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return match ? match[1] : "";
}

/**
 * YouTube thumbnail URL (hqdefault) for an episode watch link.
 * @param {string} url
 * @returns {string}
 */
function youtubeThumb(url) {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

module.exports = { youtubeId, youtubeThumb };
