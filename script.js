// Pi digits (first 100 after the decimal)
const PI_100 = "141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067";

// Elements
const input = document.getElementById('piInput');
const timerEl = document.getElementById('timer');
const statusEl = document.getElementById('statusMessage');
const resetBtn = document.getElementById('resetBtn');
const appEl = document.getElementById('app');
const targetDigitsEl = document.getElementById('targetDigits');

// Show the target digits in the help section
if (targetDigitsEl) targetDigitsEl.textContent = PI_100;

// State
let started = false;
let done = false;
let errored = false;
let startTime = 0;
let rafId = 0;

function formatTime(ms) {
  // mm:ss.hh where hh is hundredths
  const totalHundredths = Math.floor(ms / 10);
  const hundredths = totalHundredths % 100;
  const totalSeconds = Math.floor(totalHundredths / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const hh = String(hundredths).padStart(2, '0');
  return `${mm}:${ss}.${hh}`;
}

function tick() {
  if (!started || done || errored) return;
  const now = performance.now();
  const elapsed = now - startTime;
  timerEl.textContent = formatTime(elapsed);
  rafId = requestAnimationFrame(tick);
}

function startTimer() {
  if (started) return;
  started = true;
  startTime = performance.now();
  rafId = requestAnimationFrame(tick);
}

function stopTimer() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
}

function resetAll() {
  stopTimer();
  started = false;
  done = false;
  errored = false;
  startTime = 0;
  timerEl.textContent = '00:00.00';
  statusEl.textContent = '';
  statusEl.className = 'status';
  appEl.classList.remove('flash-success', 'flash-error');
  input.value = '';
  input.removeAttribute('disabled');
  input.focus();
}

function handleInput(e) {
  if (done || errored) {
    // Prevent editing after terminal state
    e.preventDefault();
    return;
  }

  // Keep only digits, enforce max length 100, then format into 4 lines of 25
  let raw = input.value.replace(/\D/g, '');
  if (raw.length > 100) raw = raw.slice(0, 100);
  const chunks = [];
  for (let i = 0; i < raw.length; i += 25) {
    chunks.push(raw.slice(i, i + 25));
  }
  // The CSS left padding reserves space so digits align after '3.' on first row.
  // For subsequent rows, no extra indent is needed; visual alignment is handled by padding.
  const formatted = chunks.join('\n');
  if (formatted !== input.value) {
    const pos = input.selectionStart || 0;
    input.value = formatted;
    // Try to keep caret near the end; simpler approach: set to end
    input.selectionStart = input.selectionEnd = input.value.length;
  }

  if (raw.length === 0) {
    // Not started yet
    return;
  }

  // Start timer on first correct digit
  const nextIndex = raw.length - 1; // index of the last typed char
  const lastChar = raw[nextIndex];
  const expected = PI_100[nextIndex];

  // If it's the very first digit and correct, start timer
  if (!started && lastChar === expected && nextIndex === 0) {
    startTimer();
  }

  // Validate entire typed prefix matches (ignore newlines)
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] !== PI_100[i]) {
      errored = true;
      stopTimer();
      statusEl.textContent = 'Try Again';
      statusEl.className = 'status error-text';
      appEl.classList.remove('flash-success');
      appEl.classList.add('flash-error');
      input.setAttribute('disabled', 'true');
      return;
    }
  }

  // Completion at 100 digits
  if (raw.length === 100) {
    done = true;
    stopTimer();
    statusEl.textContent = 'Well Done';
    statusEl.className = 'status success-text';
    appEl.classList.remove('flash-error');
    appEl.classList.add('flash-success');
    input.setAttribute('disabled', 'true');
  }
}

// Event listeners
input.addEventListener('input', handleInput);
resetBtn.addEventListener('click', resetAll);

// Keyboard shortcut: R to reset
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r') {
    resetAll();
  }
});

// Initial focus
window.addEventListener('load', () => input.focus());
