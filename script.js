let timerMinutes = 1; // Set timer duration
let timerSeconds = 0;

const minutesTens = document.getElementById('minutes-tens');
const minutesOnes = document.getElementById('minutes-ones');
const secondsTens = document.getElementById('seconds-tens');
const secondsOnes = document.getElementById('seconds-ones');

function updateDisplay() {
  const mins = String(timerMinutes).padStart(2, '0');
  const secs = String(timerSeconds).padStart(2, '0');

  // Flip digits if they change
  if (minutesTens.textContent !== mins[0]) flip(minutesTens, mins[0]);
  if (minutesOnes.textContent !== mins[1]) flip(minutesOnes, mins[1]);
  if (secondsTens.textContent !== secs[0]) flip(secondsTens, secs[0]);
  if (secondsOnes.textContent !== secs[1]) flip(secondsOnes, secs[1]);
}

function flip(digit, newValue) {
  digit.classList.add('flip');
  setTimeout(() => {
    digit.textContent = newValue;
    digit.classList.remove('flip');
  }, 250); // match half of the animation duration
}

function countdown() {
  if (timerMinutes === 0 && timerSeconds === 0) return;

  if (timerSeconds === 0) {
    timerSeconds = 59;
    timerMinutes--;
  } else {
    timerSeconds--;
  }
  updateDisplay();
}

updateDisplay();
setInterval(countdown, 1000);