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
  const quotes = [...html.matchAll(/<article class="story">[\s\S]*?<span class="story-full">“([\s\S]*?)”<\/span>/g)].map(match => match[1]);
  assert.deepEqual(quotes, testimonials.testimonials.map(item => nunjucks.renderString("{{ quote }}", { quote: item.quote })));
  assert.equal((html.match(/class="story story-copy" aria-hidden="true"/g) || []).length, testimonials.testimonials.length);
  assert.match(section, /class="story-excerpt" hidden/);
});

test("original marquee has per-card expansion and no pause checkbox", () => {
  assert.match(section, /class="story-more" type="button" aria-expanded="false"/);
  assert.doesNotMatch(template, /story-pause|type="checkbox"|story-grid/);
  assert.match(template, /testimonial-expand\.js/);
  assert.match(template, /animation: story-scroll 70s linear infinite/);
  assert.match(template, /\.story-marquee:hover \.story-track/);
  assert.match(template, /data-reading="true"/);
});
