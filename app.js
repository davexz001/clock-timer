'use strict';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function pad(n){ return String(n).padStart(2, '0'); }

function makeCard() {
  const el = document.createElement('div');
  el.className = 'card';

  const cTop = document.createElement('div'); cTop.className = 'c-top';
  const nTop = document.createElement('div'); nTop.className = 'num'; nTop.textContent = '0';
  cTop.appendChild(nTop);

  const cBot = document.createElement('div'); cBot.className = 'c-bot';
  const nBot = document.createElement('div'); nBot.className = 'num'; nBot.textContent = '0';
  cBot.appendChild(nBot);

  const cFlap = document.createElement('div'); cFlap.className = 'c-flap';
  const nFlap = document.createElement('div'); nFlap.className = 'num'; nFlap.textContent = '0';
  cFlap.appendChild(nFlap);

  const cReveal = document.createElement('div'); cReveal.className = 'c-reveal';
  const nReveal = document.createElement('div'); nReveal.className = 'num'; nReveal.textContent = '0';
  cReveal.appendChild(nReveal);

  el.append(cTop, cBot, cFlap, cReveal);

  return { el, nTop, nBot, nFlap, nReveal, cFlap, cReveal, current: null, busy: false };
}

function makeGroup(label, count) {
  const g = document.createElement('div'); g.className = 'group';
  const pair = document.createElement('div'); pair.className = 'pair';
  const cards = [];
  for (let i = 0; i < count; i++) {
    const c = makeCard();
    pair.appendChild(c.el);
    cards.push(c);
  }
  const lbl = document.createElement('div'); lbl.className = 'glabel'; lbl.textContent = label;
  g.append(pair, lbl);
  return { el: g, cards };
}

function makeSep() {
  const d = document.createElement('div'); d.className = 'dots';
  d.innerHTML = '<span></span><span></span>';
  return d;
}

function flip(card, next) {
  if (card.current === next || card.busy) return;
  const old = card.current;
  card.busy = true;
  card.current = next;

  card.nTop.textContent = next;
  card.nBot.textContent = next;

  card.nFlap.textContent = old;
  card.cFlap.style.transition = 'none';
  card.cFlap.style.transform = 'rotateX(0deg)';

  card.nReveal.textContent = next;
  card.cReveal.style.transition = 'none';
  card.cReveal.style.transform = 'rotateX(90deg)';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    card.cFlap.style.transition = 'transform 0.25s ease-in';
    card.cFlap.style.transform = 'rotateX(-90deg)';

    setTimeout(() => {
      card.cReveal.style.transition = 'transform 0.25s ease-out';
      card.cReveal.style.transform = 'rotateX(0deg)';
      setTimeout(() => {
        card.cFlap.style.transition = 'none';
        card.cFlap.style.transform = 'rotateX(0deg)';
        card.cReveal.style.transition = 'none';
        card.cReveal.style.transform = 'rotateX(90deg)';
        card.busy = false;
      }, 260);
    }, 240);
  }));
}

const row = document.getElementById('row');
const gH = makeGroup('hours', 2);
const gM = makeGroup('min', 2);
const gS = makeGroup('sec', 2);
row.append(gH.el, makeSep(), gM.el, makeSep(), gS.el);

function seed() {
  const n = new Date();
  const hs = pad(n.getHours()), ms = pad(n.getMinutes()), ss = pad(n.getSeconds());
  [[gH.cards, hs], [gM.cards, ms], [gS.cards, ss]].forEach(([cards, val]) => {
    cards.forEach((c, i) => {
      c.current = val[i];
      c.nTop.textContent = val[i];
      c.nBot.textContent = val[i];
    });
  });
}

function tick() {
  const n = new Date();
  const hs = pad(n.getHours()), ms = pad(n.getMinutes()), ss = pad(n.getSeconds());
  gH.cards.forEach((c, i) => flip(c, hs[i]));
  gM.cards.forEach((c, i) => flip(c, ms[i]));
  gS.cards.forEach((c, i) => flip(c, ss[i]));
  document.getElementById('dl').textContent =
    DAYS[n.getDay()] + '  ·  ' + MONTHS[n.getMonth()] + ' ' + n.getDate() + ', ' + n.getFullYear();
}

seed();
tick();
setInterval(tick, 1000);
