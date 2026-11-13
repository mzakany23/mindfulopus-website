(function () {
  'use strict';
  var region = document.querySelector('.story-marquee');
  if (!region) return;
  var track = region.querySelector('.story-track');
  var expanded = null;
  function collapse(card) {
    card.querySelector('.story-full').hidden = true;
    card.querySelector('.story-excerpt').hidden = false;
    var button = card.querySelector('.story-more');
    button.textContent = 'Read more';
    button.setAttribute('aria-expanded', 'false');
  }
  region.querySelectorAll('.story-more').forEach(function (button) {
    var card = button.closest('.story');
    collapse(card);
    button.hidden = false;
    button.addEventListener('click', function () {
      var opening = expanded !== card;
      if (expanded) collapse(expanded);
      expanded = opening ? card : null;
      region.dataset.reading = String(opening);
      track.style.removeProperty('--reading-offset');
      if (!opening) return;
      card.querySelector('.story-full').hidden = false;
      card.querySelector('.story-excerpt').hidden = true;
      button.textContent = 'Read less';
      button.setAttribute('aria-expanded', 'true');
      // Pause at this card and align it fully inside the viewport, including
      // when a partly visible card is tapped on a narrow phone screen.
      var bounds = region.getBoundingClientRect();
      var rect = card.getBoundingClientRect();
      var offset = 0;
      if (rect.left < bounds.left) offset = bounds.left + 16 - rect.left;
      else if (rect.right > bounds.right) offset = bounds.right - 16 - rect.right;
      track.style.setProperty('--reading-offset', offset + 'px');
    });
  });
})();
