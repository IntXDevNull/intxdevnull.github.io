/**
 * GTA VI Countdown
 * Vanilla JS, no dependencies. Calculates time remaining using the
 * visitor's local system clock, so timezone and daylight-saving are
 * handled automatically by the JavaScript Date object.
 */

(function () {
  'use strict';

  // Release date: November 19, 2026, midnight, interpreted in the
  // visitor's local timezone (the Date constructor below builds the
  // date from local calendar fields, so it is correct everywhere and
  // shifts automatically across DST changes).
  var RELEASE_DATE = new Date(2026, 10, 19, 0, 0, 0);

  // Anchor for the progress bar: the date GTA VI was first officially
  // revealed (Trailer 1, December 5, 2023). Used only to show how far
  // along we are, not for the countdown itself.
  var ANNOUNCEMENT_DATE = new Date(2023, 11, 5, 0, 0, 0);

  var elements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    countdown: document.getElementById('countdown'),
    released: document.getElementById('released'),
    progressFill: document.getElementById('progress-fill'),
    progressLabel: document.getElementById('progress-label'),
    localZone: document.getElementById('local-zone'),
  };

  var hasFinished = false;
  var intervalId = null;

  function pad(number) {
    return String(number).padStart(2, '0');
  }

  function describeTimezone() {
    try {
      var offsetMinutes = -new Date().getTimezoneOffset();
      var sign = offsetMinutes >= 0 ? '+' : '-';
      var abs = Math.abs(offsetMinutes);
      var hours = pad(Math.floor(abs / 60));
      var minutes = pad(abs % 60);
      var zoneName = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      return 'Shown in your local time (UTC' + sign + hours + ':' + minutes + (zoneName ? ', ' + zoneName : '') + ')';
    } catch (err) {
      return 'Shown in your local time';
    }
  }

  function updateProgress(now) {
    var total = RELEASE_DATE.getTime() - ANNOUNCEMENT_DATE.getTime();
    var elapsed = now.getTime() - ANNOUNCEMENT_DATE.getTime();
    var percent = (elapsed / total) * 100;
    percent = Math.min(100, Math.max(0, percent));

    elements.progressFill.style.width = percent.toFixed(2) + '%';
    elements.progressLabel.textContent =
      percent >= 100
        ? 'The full journey since the reveal trailer is complete.'
        : percent.toFixed(1) + '% of the way from the reveal trailer to launch day.';
  }

  function showReleasedState() {
    if (hasFinished) return;
    hasFinished = true;

    elements.countdown.hidden = true;
    elements.released.hidden = false;
    elements.progressFill.style.width = '100%';
    elements.progressLabel.textContent = 'The full journey since the reveal trailer is complete.';

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function tick() {
    var now = new Date();
    var diff = RELEASE_DATE.getTime() - now.getTime();

    if (diff <= 0) {
      showReleasedState();
      return;
    }

    var totalSeconds = Math.floor(diff / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    elements.days.textContent = pad(days);
    elements.hours.textContent = pad(hours);
    elements.minutes.textContent = pad(minutes);
    elements.seconds.textContent = pad(seconds);

    updateProgress(now);
  }

  function init() {
    if (elements.localZone) {
      elements.localZone.textContent = describeTimezone();
    }

    // Run immediately so there is no blank/zero flash on load or refresh,
    // then keep the display in sync every second.
    tick();

    if (RELEASE_DATE.getTime() - Date.now() <= 0) {
      showReleasedState();
      return;
    }

    intervalId = setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
