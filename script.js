

const display = document.getElementById("display");
const startPauseBtn = document.getElementById("startPauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const clearLapsBtn = document.getElementById("clearLapsBtn");
const lapList = document.getElementById("lapList");
const statusPill = document.getElementById("statusPill");

let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let lapCount = 0;
let lastLapTime = 0;

function formatTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function updateDisplay() {
  const currentTime = Date.now() - startTime + elapsedTime;
  display.textContent = formatTime(currentTime);
}

function startStopwatch() {
  startTime = Date.now();
  timerInterval = setInterval(updateDisplay, 10);
  isRunning = true;

  startPauseBtn.textContent = "Pause";
  lapBtn.disabled = false;
  resetBtn.disabled = false;
  statusPill.textContent = "Running";
}

function pauseStopwatch() {
  clearInterval(timerInterval);
  elapsedTime += Date.now() - startTime;
  isRunning = false;

  startPauseBtn.textContent = "Start";
  lapBtn.disabled = true;
  statusPill.textContent = "Paused";
}

function resetStopwatch() {
  clearInterval(timerInterval);

  isRunning = false;
  startTime = 0;
  elapsedTime = 0;
  lapCount = 0;
  lastLapTime = 0;

  display.textContent = "00:00:00.00";
  startPauseBtn.textContent = "Start";
  lapBtn.disabled = true;
  resetBtn.disabled = true;
  clearLapsBtn.disabled = true;
  lapList.innerHTML = `<li class="empty-state">No laps recorded yet.</li>`;
  statusPill.textContent = "Ready";
}

function recordLap() {
  if (!isRunning) return;

  const currentTime = Date.now() - startTime + elapsedTime;
  const lapInterval = currentTime - lastLapTime;
  lastLapTime = currentTime;
  lapCount++;

  if (lapCount === 1) {
    lapList.innerHTML = "";
  }

  const lapItem = document.createElement("li");
  lapItem.className = "lap-item";
  lapItem.innerHTML = `
    <span class="lap-number">Lap ${lapCount}</span>
    <span class="lap-split">${formatTime(currentTime)}</span>
    <span class="lap-total">+ ${formatTime(lapInterval)}</span>
  `;

  lapList.prepend(lapItem);
  clearLapsBtn.disabled = false;
}

function clearLaps() {
  lapCount = 0;
  lastLapTime = Date.now() - startTime + elapsedTime;
  lapList.innerHTML = `<li class="empty-state">No laps recorded yet.</li>`;
  clearLapsBtn.disabled = true;
}

startPauseBtn.addEventListener("click", () => {
  if (isRunning) {
    pauseStopwatch();
  } else {
    startStopwatch();
  }
});

lapBtn.addEventListener("click", recordLap);
resetBtn.addEventListener("click", resetStopwatch);
clearLapsBtn.addEventListener("click", clearLaps);