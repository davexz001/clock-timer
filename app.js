'use strict';

var DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function el(tag, cls) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

/* ── create one digit card ── */
function createCard() {
  var card  = el('div', 'card');
  var gap   = el('div', 'card-gap');

  var sTop  = el('div', 's-top');
  var sTopD = el('div', 'digit');
  sTop.appendChild(sTopD);

  var sBot  = el('div', 's-bot');
  var sBotD = el('div', 'digit');
  sBot.appendChild(sBotD);

  var fTop  = el('div', 'f-top');
  var fTopD = el('div', 'digit');
  fTop.appendChild(fTopD);

  var fBot  = el('div', 'f-bot');
  var fBotD = el('div', 'digit');
  fBot.appendChild(fBotD);

  card.appendChild(sTop);
  card.appendChild(sBot);
  card.appendChild(fTop);
  card.appendChild(fBot);
  card.appendChild(gap);

  return {
    card  : card,
    sTopD : sTopD,
    sBotD : sBotD,
    fTop  : fTop,
    fBot  : fBot,
    fTopD : fTopD,
    fBotD : fBotD,
    current : null,
    busy    : false
  };
}

/* ── create a group (label + 2 cards) ── */
function createGroup(label) {
  var group = el('div', 'group');
  var pair  = el('div', 'pair');
  var c0    = createCard();
  var c1    = createCard();
  pair.appendChild(c0.card);
  pair.appendChild(c1.card);
  var lbl   = el('div', 'group-label');
  lbl.textContent = label;
  group.appendChild(pair);
  group.appendChild(lbl);
  return { group: group, cards: [c0, c1] };
}

/* ── create separator ── */
function createSep() {
  var sep = el('div', 'sep');
  sep.appendChild(el('div', 'sep-dot'));
  sep.appendChild(el('div', 'sep-dot'));
  return sep;
}

/* ── flip one card to a new character ── */
function flipCard(c, next) {
  if (c.current === next || c.busy) return;
  var old   = c.current || next;
  c.busy    = true;
  c.current = next;

  /* static halves already show the new digit */
  c.sTopD.textContent = next;
  c.sBotD.textContent = next;

  /* top flap: shows OLD, starts flat, will fold away */
  c.fTopD.textContent     = old;
  c.fTop.style.transition = 'none';
  c.fTop.style.transform  = 'rotateX(0deg)';

  /* bottom flap: shows NEW, starts hidden, will swing down */
  c.fBotD.textContent     = next;
  c.fBot.style.transition = 'none';
  c.fBot.style.transform  = 'rotateX(90deg)';

  /* double rAF so the "none" transition takes effect first */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {

      c.fTop.style.transition = 'transform 0.22s ease-in';
      c.fTop.style.transform  = 'rotateX(-90deg)';

      setTimeout(function () {
        c.fBot.style.transition = 'transform 0.22s ease-out';
        c.fBot.style.transform  = 'rotateX(0deg)';

        setTimeout(function () {
          c.fTop.style.transition = 'none';
          c.fTop.style.transform  = 'rotateX(0deg)';
          c.fBot.style.transition = 'none';
          c.fBot.style.transform  = 'rotateX(90deg)';
          c.busy = false;
        }, 230);
      }, 210);

    });
  });
}

/* ── build clock ── */
var timeRow = document.getElementById('time-row');
var gH = createGroup('hours');
var gM = createGroup('min');
var gS = createGroup('sec');
timeRow.appendChild(gH.group);
timeRow.appendChild(createSep());
timeRow.appendChild(gM.group);
timeRow.appendChild(createSep());
timeRow.appendChild(gS.group);

/* ── seed without animation ── */
function seed() {
  var now = new Date();
  var hs  = pad(now.getHours());
  var ms  = pad(now.getMinutes());
  var ss  = pad(now.getSeconds());
  var all = [[gH.cards, hs], [gM.cards, ms], [gS.cards, ss]];
  for (var i = 0; i < all.length; i++) {
    var cards = all[i][0];
    var val   = all[i][1];
    for (var j = 0; j < cards.length; j++) {
      cards[j].current           = val[j];
      cards[j].sTopD.textContent = val[j];
      cards[j].sBotD.textContent = val[j];
    }
  }
}

/* ── tick every second ── */
function tick() {
  var now = new Date();
  var hs  = pad(now.getHours());
  var ms  = pad(now.getMinutes());
  var ss  = pad(now.getSeconds());

  flipCard(gH.cards[0], hs[0]); flipCard(gH.cards[1], hs[1]);
  flipCard(gM.cards[0], ms[0]); flipCard(gM.cards[1], ms[1]);
  flipCard(gS.cards[0], ss[0]); flipCard(gS.cards[1], ss[1]);

  document.getElementById('date-line').textContent =
    DAYS[now.getDay()] + '  \u00b7  ' +
    MONTHS[now.getMonth()] + ' ' +
    now.getDate() + ', ' + now.getFullYear();
}

seed();
tick();
setInterval(tick, 1000);
