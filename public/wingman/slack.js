/* Wingman — the working Slack replay (ported from the PAB waitlist animation;
   format with a tip of the cap to Every's Plus One).
   Tool calls stream in, collapse to app icons, then the scheduled morning
   arrives on its own. TODO[crew]: add Colin's and Tristan's agents for the
   multi-agent team workflow when the avatars land. */
(function () {
  'use strict';

  var feed = document.getElementById('slack');
  var win = document.getElementById('slack-window');
  if (!feed) return;

  var AGENT = 'FRIDAY';
  var AVATARS = {
    agent: '/wingman/assets/friday-pfp.png',
    mitch: '/wingman/assets/mitch.png',
  };
  var APPS = {
    supabase: { t: 'S', c: '#3ECF8E', name: 'Supabase' },
    kit:      { t: 'K', c: '#FB6F70', name: 'Kit' },
    slack:    { t: '#', c: '#4A154B', name: 'Slack' },
    calendar: { t: '◷', c: '#1a73e8', name: 'Calendar' },
  };

  var MSGS = [
    { who: 'mitch', ts: '9:01 AM', html: '<span class="at">@friday</span> pull last night’s leads and draft the follow-ups.' },
    { who: 'agent', ts: '9:01 AM', think: 900, t: 'On it.' },
    { who: 'agent', ts: '9:02 AM', tools: ['supabase.query(leads)', 'kit.draft(follow-ups)', 'kit.queue()'], t: '23 new leads synced. Follow-ups drafted in your voice and queued for review. ✓' },
    { who: 'mitch', ts: '9:04 AM', html: '<span class="at">@friday</span> what’s the <span class="at">#support</span> channel asking this week?' },
    { who: 'agent', ts: '9:04 AM', tools: ['slack.read(#support)', 'cluster(themes)'], t: 'Three themes: onboarding, billing, and a feature request that keeps coming up. Replies drafted. Want me to post the first two?' },
    { who: 'mitch', ts: '9:05 AM', html: 'send them.' },
    { who: 'agent', ts: '9:05 AM', tools: ['slack.post(reply ×2)'], t: 'Posted. ✓ I’ll keep watching the channel and draft more as they come in.' },
    { who: 'divider', label: 'Next morning · 7:00 AM · scheduled' },
    { who: 'agent', ts: '7:00 AM', proactive: true, tools: ['supabase.query(overnight)', 'slack.scan(#billing)', 'calendar.read(today)'], t: 'Morning. While you slept: 12 new signups, 1 refund risk flagged in #billing (reply drafted), and your 9:00 has a prep doc in your inbox. Nothing needs you yet. ✓' },
  ];

  function imgAvatar(src) { var av = document.createElement('div'); av.className = 'av'; var i = document.createElement('img'); i.src = src; i.alt = ''; av.appendChild(i); return av; }
  function avatar(who) { return imgAvatar(who === 'agent' ? AVATARS.agent : AVATARS.mitch); }
  function scroll() { feed.scrollTop = feed.scrollHeight; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function greenCheck(t) { return t.replace(/✓/g, '<span class="ok">✓</span>'); }

  function appsFor(tools) {
    var seen = {}, out = [];
    (tools || []).forEach(function (tool) {
      var key = tool.split(/[.( ]/)[0];
      if (APPS[key] && !seen[key]) { seen[key] = 1; out.push(APPS[key]); }
    });
    return out;
  }
  function appiconsEl(tools) {
    var apps = appsFor(tools);
    if (!apps.length) return null;
    var wrap = document.createElement('div'); wrap.className = 'appicons';
    var lbl = document.createElement('span'); lbl.className = 'lbl'; lbl.textContent = 'ran'; wrap.appendChild(lbl);
    apps.forEach(function (a) { var c = document.createElement('span'); c.className = 'ai'; c.style.background = a.c; c.textContent = a.t; c.title = a.name; wrap.appendChild(c); });
    return wrap;
  }

  function streamText(el, plain, speed) {
    return new Promise(function (res) {
      var i = 0;
      (function step() {
        el.innerHTML = greenCheck(plain.slice(0, i)) + '<span class="stream-cur"></span>';
        scroll();
        if (i++ <= plain.length) setTimeout(step, speed); else res();
      })();
    });
  }

  function mitchRow(mm) {
    var row = document.createElement('div'); row.className = 'msg human';
    row.appendChild(avatar('mitch'));
    var body = document.createElement('div'); body.className = 'body';
    body.innerHTML = '<div class="h"><span class="name">Mitch</span><span class="ts">' + mm.ts + '</span></div><div class="text">' + mm.html + '</div>';
    row.appendChild(body); feed.appendChild(row); scroll();
  }
  function dividerRow(mm) {
    var dv = document.createElement('div'); dv.className = 'slack-div';
    dv.innerHTML = '<span class="ln"></span><span class="t">' + mm.label + '</span><span class="ln"></span>';
    feed.appendChild(dv); scroll();
  }
  function agentRow(mm) {
    var row = document.createElement('div'); row.className = 'msg agent';
    row.appendChild(avatar('agent'));
    var body = document.createElement('div'); body.className = 'body';
    var auto = mm.proactive ? '<span class="badge auto">⏰ scheduled</span>' : '';
    body.innerHTML = '<div class="h"><span class="name working">' + AGENT + '</span><span class="badge">Mitch’s wingman</span>' + auto + '<span class="ts">' + mm.ts + '</span></div><div class="extras"></div><div class="text"></div>';
    row.appendChild(body); feed.appendChild(row); scroll();
    return row;
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderStatic() {
    feed.innerHTML = '';
    MSGS.forEach(function (mm) {
      if (mm.who === 'divider') { dividerRow(mm); return; }
      if (mm.who === 'mitch') { mitchRow(mm); return; }
      var row = agentRow(mm); row.querySelector('.name').classList.remove('working');
      var ic = appiconsEl(mm.tools); if (ic) row.querySelector('.extras').appendChild(ic);
      row.querySelector('.text').innerHTML = greenCheck(mm.t);
    });
  }

  async function agentMsg(mm, runId) {
    var row = agentRow(mm);
    var nameEl = row.querySelector('.name'), extras = row.querySelector('.extras'), textEl = row.querySelector('.text');

    if (mm.tools) {
      var tools = document.createElement('div'); tools.className = 'tools'; extras.appendChild(tools);
      for (var i = 0; i < mm.tools.length; i++) {
        if (runId !== runToken) return;
        var tc = document.createElement('div'); tc.className = 'tcall'; tc.textContent = '→ ' + mm.tools[i] + '  …';
        tools.appendChild(tc); scroll(); await sleep(560);
        tc.innerHTML = '→ ' + mm.tools[i] + '  <span class="ok">ok</span>'; scroll(); await sleep(150);
      }
    } else {
      var ty = document.createElement('div'); ty.className = 'typing'; ty.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
      extras.appendChild(ty); scroll(); await sleep(mm.think || 900); ty.remove();
    }

    if (runId !== runToken) return;
    await streamText(textEl, mm.t, 17);
    textEl.innerHTML = greenCheck(mm.t);
    nameEl.classList.remove('working');

    extras.innerHTML = '';
    var ic = appiconsEl(mm.tools);
    if (ic) { extras.appendChild(ic); scroll(); }
  }

  var runToken = 0, started = false;

  async function run() {
    var runId = ++runToken;
    feed.innerHTML = '';
    for (var i = 0; i < MSGS.length; i++) {
      if (runId !== runToken) return;
      var mm = MSGS[i];
      if (mm.who === 'divider') { dividerRow(mm); await sleep(1400); }
      else if (mm.who === 'mitch') { mitchRow(mm); await sleep(1100); }
      else { await agentMsg(mm, runId); await sleep(800); }
    }
    // plays once, then rests on the completed thread
  }

  function start() {
    if (started) return;
    started = true;
    if (reduce) { renderStatic(); return; }
    run();
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { start(); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(feed);
  } else {
    start();
  }

  if (win) win.addEventListener('click', function () { if (started && !reduce) run(); });
})();
