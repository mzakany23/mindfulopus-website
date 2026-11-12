const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const nunjucks = require("nunjucks");
const testimonials = require("../src/data/testimonials.json");
const template = fs.readFileSync(path.join(__dirname, "../src/index.njk"), "utf8");
const section = template.match(/<section class="stories"[^>]*>[\s\S]*?<\/section>/)?.[0];

test("every testimonial renders once with its complete original quote", () => {
  assert.ok(section, "Testimonials must remain visible without reveal JavaScript");
  const html = nunjucks.renderString(section, { testimonials });
  const quotes = [...html.matchAll(/<blockquote>“([\s\S]*?)”<\/blockquote>/g)].map(match => match[1]);
  assert.deepEqual(quotes, testimonials.testimonials.map(item => nunjucks.renderString("{{ quote }}", { quote: item.quote })));
  assert.equal((html.match(/<article class="story">/g) || []).length, testimonials.testimonials.length);
});

test("testimonials use a responsive grid rather than a clipped animated marquee", () => {
  assert.match(section, /class="story-grid"/);
  assert.doesNotMatch(template, /story-marquee|story-track|story-scroll/);
  assert.match(template, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(template, /@media \(max-width: 600px\)\s*\{\s*\.story-grid \{ grid-template-columns: minmax\(0, 1fr\)/);
});
