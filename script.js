let use24 = false;

// Current digit values
const current = { h0: null, h1: null, m0: null, m1: null, s0: null, s1: null };

/**
 * Flip a single tile from oldVal → newVal
 *
 * Structure during animation:
 *   - tile-top    (static) → shows NEW value (revealed as flap folds away)
 *   - tile-bottom (static) → shows OLD value (hidden as flap-back unfolds over it)
 *   - flap-front  (animated) → shows OLD value, folds from 0° to -180° (top half going down)
 *   - flap-back   (animated) → shows NEW value, unfolds from 180° to 0° (bottom half appearing)
 *   - shadow overlays for realism
 */
function flip(id, newVal) {
  if (current[id] === newVal) return;

  const tile = document.getElementById(id);
  const oldVal = current[id];
  current[id] = newVal;

  const tileTop = tile.querySelector('.tile-top span');
  const tileBottom = tile.querySelector('.tile-bottom span');

  // First load — just set values, no animation
  if (oldVal === null) {
    tileTop.textContent = newVal;
    tileBottom.textContent = newVal;
    return;
  }

  // Clean up any previous animation elements
  tile.querySelectorAll('.flap-front, .flap-back, .shadow-top, .shadow-bottom').forEach(e => e.remove());

  // 1. Set static top to NEW (it will be revealed as flap-front folds away)
  tileTop.textContent = newVal;

  // 2. Keep static bottom as OLD (it will be covered by flap-back)
  tileBottom.textContent = oldVal;

  // 3. Create flap-front (shows OLD value, starts flat, folds down to -180°)
  const flapFront = document.createElement('div');
  flapFront.className = 'flap-front';
  flapFront.innerHTML = '<span>' + oldVal + '</span>';
  tile.appendChild(flapFront);

  // 4. Create flap-back (shows NEW value, starts at 180°, unfolds to 0°)
  const flapBack = document.createElement('div');
  flapBack.className = 'flap-back';
  flapBack.innerHTML = '<span>' + newVal + '</span>';
  tile.appendChild(flapBack);

  // 5. Shadow overlays
  const shadowTop = document.createElement('div');
  shadowTop.className = 'shadow-top';
  tile.appendChild(shadowTop);

  const shadowBottom = document.createElement('div');
  shadowBottom.className = 'shadow-bottom';
  tile.appendChild(shadowBottom);

  // 6. Trigger animation (force reflow first)
  void tile.offsetWidth;
  flapFront.classList.add('animating');
  flapBack.classList.add('animating');
  shadowTop.classList.add('animating');
  shadowBottom.classList.add('animating');

  // 7. Cleanup after animation finishes
  setTimeout(() => {
    tileBottom.textContent = newVal;
    flapFront.remove();
    flapBack.remove();
    shadowTop.remove();
    shadowBottom.remove();
  }, 800);
}

function getGreeting(h) {
  if (h >= 5 && h < 12) return '☀️  Good Morning';
  if (h >= 12 && h < 17) return '🌤️  Good Afternoon';
  if (h >= 17 && h < 21) return '🌅  Good Evening';
  return '🌙  Good Night';
}

function tick() {
  const now = new Date();
  let h = now.getHours();
  const mi = now.getMinutes();
  const s = now.getSeconds();
  const ap = document.getElementById('ampm');

  document.getElementById('greeting').textContent = getGreeting(h);

  if (!use24) {
    const label = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    ap.textContent = label;
    ap.style.display = '';
  } else {
    ap.style.display = 'none';
  }

  const hh = String(h).padStart(2, '0');
  const mm = String(mi).padStart(2, '0');
  const ss = String(s).padStart(2, '0');

  flip('h0', hh[0]);
  flip('h1', hh[1]);
  flip('m0', mm[0]);
  flip('m1', mm[1]);
  flip('s0', ss[0]);
  flip('s1', ss[1]);

  document.getElementById('secBar').style.width = ((s / 59) * 100) + '%';

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June',
                   'July','August','September','October','November','December'];
  document.getElementById('dateText').textContent =
    days[now.getDay()] + '  ·  ' + months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
}

function toggleMode() {
  use24 = !use24;
  document.getElementById('modeSwitch').classList.toggle('on');
  Object.keys(current).forEach(k => current[k] = null);
  tick();
}

tick();
setInterval(tick, 1000);
