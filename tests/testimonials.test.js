const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const nunjucks = require("nunjucks");
const testimonials = require("../src/data/testimonials.json");
const template = fs.readFileSync(path.join(__dirname, "../src/index.njk"), "utf8");
const section = template.match(/<section class="stories"[^>]*>[\s\S]*?<\/section>/)?.[0];

test("scrolling testimonials contain complete original quotes and hide loop copies from assistive technology", () => {
  assert.ok(section, "Testimonials must remain visible without reveal JavaScript");
  const html = nunjucks.renderString(section, { testimonials });
  const quotes = [...html.matchAll(/<article class="story">\s*<blockquote>“([\s\S]*?)”<\/blockquote>/g)].map(match => match[1]);
  assert.deepEqual(quotes, testimonials.testimonials.map(item => nunjucks.renderString("{{ quote }}", { quote: item.quote })));
  assert.equal((html.match(/class="story story-copy" aria-hidden="true"/g) || []).length, testimonials.testimonials.length);
  assert.doesNotMatch(section, /truncate\(/);
});

test("existing horizontal scrolling includes keyboard access, persistent pause and reduced-motion reading", () => {
  assert.match(section, /class="story-marquee" role="region" tabindex="0"/);
  assert.match(section, /type="checkbox" class="story-pause"/);
  assert.match(template, /animation: story-scroll 70s linear infinite/);
  assert.match(template, /\.story-pause:checked ~ \.story-marquee \.story-track/);
  assert.match(template, /\.story-copy, \.story-pause, \.story-pause-label \{ display: none; \}/);
  assert.doesNotMatch(template, /story-grid/);
});
