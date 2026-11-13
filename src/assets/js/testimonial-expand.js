(function () {
  'use strict';
  var region = document.querySelector('.story-marquee');
  if (!region) return;
  var track = region.querySelector('.story-track');
  var status = document.getElementById('story-status');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  var paused = motion.matches;
  var hovered = false;
  var pointer = null;
  var dragged = false;
  var keyboardFocus = false;
  var expanded = null;
  var position = region.scrollLeft;
  var previous = null;
  var frame;
  function update(announce) {
    region.dataset.paused = String(paused || hovered);
    if (announce) status.textContent = paused ? 'Testimonials paused.' : 'Testimonials scrolling.';
  }
  function pause(value, announce) {
    paused = value;
    position = region.scrollLeft;
    previous = null;
    update(announce);
  }
  function show(card, open) {
    card.querySelector('.story-full').hidden = !open;
    card.querySelector('.story-excerpt').hidden = open;
    var button = card.querySelector('.story-more');
    if (button) {
      button.textContent = open ? 'Read less' : 'Read more';
      button.setAttribute('aria-expanded', String(open));
    }
  }
  region.querySelectorAll('.story-more').forEach(function (button) {
    var card = button.closest('.story');
    show(card, false);
    button.hidden = false;
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      if (dragged) return;
      var opening = expanded !== card;
      if (expanded) show(expanded, false);
      expanded = opening ? card : null;
      if (opening) {
        show(card, true);
        pause(true, true);
        var rect = card.getBoundingClientRect();
        var bounds = region.getBoundingClientRect();
        // Native scroll coordinates keep the selected card fully readable.
        if (rect.left < bounds.left + 8) region.scrollLeft += rect.left - bounds.left - 16;
        else if (rect.right > bounds.right - 8) region.scrollLeft += rect.right - bounds.right + 16;
        position = region.scrollLeft;
      }
    });
  });
  document.addEventListener('keydown', function (event) { if (event.key === 'Tab') keyboardFocus = true; });
  region.addEventListener('pointerdown', function (event) {
    keyboardFocus = false;
    if (event.pointerType !== 'mouse') { hovered = false; update(false); }
    pointer = { x: event.clientX, y: event.clientY };
    dragged = false;
    position = region.scrollLeft;
  });
  region.addEventListener('pointermove', function (event) {
    if (pointer && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 8) {
      dragged = true;
      pause(true, false);
    }
  });
  window.addEventListener('pointerup', function () { pointer = null; });
  region.addEventListener('pointercancel', function () {
    pointer = null;
    dragged = true;
    pause(true, false);
  });
  region.addEventListener('click', function (event) {
    if (event.target.closest('button') || dragged || String(window.getSelection()).length) return;
    pause(!paused, true);
  });
  region.addEventListener('pointerenter', function (event) {
    if (event.pointerType === 'mouse' && canHover.matches) { hovered = true; update(false); }
  });
  region.addEventListener('pointerleave', function (event) {
    if (event.pointerType === 'mouse') { hovered = false; previous = null; update(false); }
  });
  region.addEventListener('focusin', function () {
    if (keyboardFocus) pause(true, false);
  });
  region.addEventListener('keydown', function (event) {
    if (event.target.closest('button')) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      pause(!paused, true);
    } else if (['ArrowLeft','ArrowRight','Home','End'].indexOf(event.key) !== -1) pause(true, false);
  });
  region.addEventListener('wheel', function () { pause(true, false); }, { passive: true });
  region.addEventListener('scroll', function () {
    if (paused || hovered || pointer) position = region.scrollLeft;
  }, { passive: true });
  motion.addEventListener('change', function () { pause(motion.matches, false); });
  function tick(time) {
    if (!paused && !hovered && !pointer && !document.hidden) {
      var first = track.querySelector('.story');
      var copy = track.querySelector('.story-copy');
      var cycle = copy.offsetLeft - first.offsetLeft;
      if (previous !== null && cycle > 0) {
        position += Math.min(time - previous, 50) * 0.035;
        if (position >= cycle) {
          position %= cycle;
          // A loop copy represents the same testimonial, but only the currently
          // selected visual card may be expanded.
          if (expanded && expanded.classList.contains('story-copy')) {
            var original = track.querySelector('.story:not(.story-copy)[data-story-id="' + expanded.dataset.storyId + '"]');
            show(expanded, false);
            expanded = original;
            show(original, true);
          }
        }
        region.scrollLeft = position;
      }
    }
    previous = time;
    frame = window.requestAnimationFrame(tick);
  }
  document.addEventListener('visibilitychange', function () { previous = null; });
  window.addEventListener('pagehide', function () { window.cancelAnimationFrame(frame); });
  window.addEventListener('pageshow', function (event) { if (event.persisted) { previous = null; frame = window.requestAnimationFrame(tick); } });
  update(false);
  frame = window.requestAnimationFrame(tick);
})();
