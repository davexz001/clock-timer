/* =============================================
   FLIP CLOCK — app.js
   ============================================= */

'use strict';

const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday'
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function pad(n) {
  return String(n).padStart(2, '0');
}

/* ── Build a single digit card ── */
function createCard() {
  const card  = document.createElement('div'); card.className  = 'card';
  const gap   = document.createElement('div'); gap.className   = 'card-gap';

  const sTop  = document.createElement('div'); sTop.className  = 's-top';
  const sTopD = document.createElement('div'); sTopD.className = 'digit';
  sTop.appendChild(sTopD);

  const sBot  = document.createElement('div'); sBot.className  = 's-bot';
  const sBotD = document.createElement('div'); sBotD.className = 'digit';
  sBot.appendChild(sBotD);

  const fTop  = document.createElement('div'); fTop.className  = 'f-top';
  const fTopD = document.createElement('div'); fTopD.className = 'digit';
  fTop.appendChild(fTopD);

  const fBot  = document.createElement('div'); fBot.className  = 'f-bot';
  const fBotD = document.createElement('div'); fBotD.className = 'digit';
  fBot.appendChild(fBotD);

  card.append(sTop, sBot, fTop, fBot, gap);

  return {
    card,
    sTopD, sBotD,
    fTop,  fBot,
    fTopD, fBotD,
    current: null,
    busy: false
  };
}

/* ── Build a group of 2 cards with a label ── */
function createGroup(label) {
  const group = document.createElement('div'); group.className = 'group';
  const pair  = document.createElement('div'); pair.className  = 'pair';

  const c0 = createCard();
  const c1 = createCard();
  pair.append(c0.card, c1.card);

  const lbl = document.createElement('div');
  lbl.className   = 'group-label';
  lbl.textContent = label;

  group.append(pair, lbl);
  return { group, cards: [c0, c1] };
}

/* ── Build separator dots ── */
function createSep() {
  const sep = document.createElement('div');
  sep.className = 'sep';
  sep.innerHTML = '<div class="sep-dot"></div><div class="sep-dot"></div>';
  return sep;
}

/* ── Flip a single card to a new digit ── */
function flipCard(c, next) {
  if (c.current === next || c.busy) return;

  const old = c.current || next;
  c.busy    = true;
  c.current = next;

  // Static halves immediately show the new digit
  c.sTopD.textContent = next;
  c.sBotD.textContent = next;

  // Top flap: shows OLD digit, starts flat (0deg), will fold away to -90deg
  c.fTopD.textContent     = old;
  c.fTop.style.transition = 'none';
  c.fTop.style.transform  = 'rotateX(0deg)';

  // Bottom flap: shows NEW digit, starts hidden (90deg), will swing to 0deg
  c.fBotD.textContent     = next;
  c.fBot.style.transition = 'none';
  c.fBot.style.transform  = 'rotateX(90deg)';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    // Phase 1 — top flap folds away
    c.fTop.style.transition = 'transform 0.22s ease-in';
    c.fTop.style.transform  = 'rotateX(-90deg)';

    setTimeout(() => {
      // Phase 2 — bottom flap swings into place
      c.fBot.style.transition = 'transform 0.22s ease-out';
      c.fBot.style.transform  = 'rotateX(0deg)';

      setTimeout(() => {
        // Reset flaps silently back to starting positions
        c.fTop.style.transition = 'none';
        c.fTop.style.transform  = 'rotateX(0deg)';
        c.fBot.style.transition = 'none';
        c.fBot.style.transform  = 'rotateX(90deg)';
        c.busy = false;
      }, 230);
    }, 210);
  }));
}

/* ── Build the clock DOM ── */
const timeRow = document.getElementById('time-row');

const gH = createGroup('hours');
const gM = createGroup('min');
const gS = createGroup('sec');

timeRow.append(gH.group, createSep(), gM.group, createSep(), gS.group);

/* ── Seed initial values without animating ── */
function seed() {
  const now = new Date();
  const hs  = pad(now.getHours());
  const ms  = pad(now.getMinutes());
  const ss  = pad(now.getSeconds());

  [[gH.cards, hs], [gM.cards, ms], [gS.cards, ss]].forEach(([cards, val]) => {
    cards.forEach((c, i) => {
      c.current           = val[i];
      c.sTopD.textContent = val[i];
      c.sBotD.textContent = val[i];
    });
  });
}

/* ── Tick every second ── */
function tick() {
  const now = new Date();
  const hs  = pad(now.getHours());
  const ms  = pad(now.getMinutes());
  const ss  = pad(now.getSeconds());

  gH.cards.forEach((c, i) => flipCard(c, hs[i]));
  gM.cards.forEach((c, i) => flipCard(c, ms[i]));
  gS.cards.forEach((c, i) => flipCard(c, ss[i]));

  document.getElementById('date-line').textContent =
    DAYS[now.getDay()] + '  ·  ' +
    MONTHS[now.getMonth()] + ' ' +
    now.getDate() + ', ' +
    now.getFullYear();
}

seed();
tick();
setInterval(tick, 1000);
