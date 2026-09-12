const fs = require("fs");
const path = require("path");

/**
 * Event detail pages are the flyer itself at an SEO date URL —
 * /flyers/{school}/{yyyy}/{mm}/{dd}/{slug}/
 */
module.exports = class {
  data() {
    return {
      pagination: {
        data: "flyerEvents",
        size: 1,
        alias: "event",
        addAllPagesToCollections: false,
      },
      eleventyExcludeFromCollections: true,
      permalink: (data) => data.event.url,
    };
  }

  render({ event }) {
    const flyerPath = path.join(__dirname, event.primaryFlyer.file);
    let html = fs.readFileSync(flyerPath, "utf8");

    const title = `${event.title} — ${event.schoolShort} — ${event.dateLabel} — MindfulOpus`;
    const description = event.summary || `${event.series} at ${event.schoolName}`;
    const canonical = event.url;

    const seoTags = [
      `<title>${escapeHtml(title)}</title>`,
      `<meta name="description" content="${escapeAttr(description)}">`,
      `<meta property="og:title" content="${escapeAttr(`${event.title} — ${event.schoolShort}`)}">`,
      `<meta property="og:description" content="${escapeAttr(description)}">`,
      `<meta property="og:type" content="website">`,
      `<link rel="canonical" href="${escapeAttr(canonical)}">`,
    ].join("\n");

    if (/<title>[\s\S]*?<\/title>/i.test(html)) {
      html = html.replace(/<title>[\s\S]*?<\/title>/i, seoTags);
    } else if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (m) => `${m}\n${seoTags}`);
    } else {
      html = `<!DOCTYPE html><html lang="en"><head>${seoTags}</head><body>${html}</body></html>`;
    }

    return html;
  }
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}
