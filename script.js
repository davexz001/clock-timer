document.addEventListener('DOMContentLoaded', () => {
  let minutes = 1;
  let seconds = 10;

  const digits = {
    minutesTens: document.getElementById('minutes-tens'),
    minutesOnes: document.getElementById('minutes-ones'),
    secondsTens: document.getElementById('seconds-tens'),
    secondsOnes: document.getElementById('seconds-ones')
  };

  function updateDigit(flipDigit, value) {
    const top = flipDigit.querySelector('.top');
    const bottom = flipDigit.querySelector('.bottom');

    if (top.textContent !== value) {
      flipDigit.classList.add('flip');

      setTimeout(() => {
        top.textContent = value;
        bottom.textContent = value;
        flipDigit.classList.remove('flip');
      }, 250);
    }
  }

  function updateDisplay() {
    const mins = String(minutes).padStart(2, '0');
    const secs = String(seconds).padStart(2, '0');

    updateDigit(digits.minutesTens, mins[0]);
    updateDigit(digits.minutesOnes, mins[1]);
    updateDigit(digits.secondsTens, secs[0]);
    updateDigit(digits.secondsOnes, secs[1]);
  }

  function countdown() {
    if (minutes === 0 && seconds === 0) return;

    if (seconds === 0) {
      if (minutes > 0) {
        minutes--;
        seconds = 59;
      }
    } else {
      seconds--;
    }

    updateDisplay();
  }

  updateDisplay();
  setInterval(countdown, 1000);
});
