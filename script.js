let timer;
let isRunning = false;
let sessionCount = 0;
let workDuration = 25 * 60; // Default work duration in seconds (25 minutes)
let breakDuration = 5 * 60; // Default break duration in seconds (5 minutes)
let timeLeft = workDuration;
let isWorkSession = true; // Start with work session

const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const sessionCountDisplay = document.getElementById('session-count');
const sessionTypeDisplay = document.getElementById('session-type');
const container = document.querySelector('.container');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');
const savePreferencesButton = document.getElementById('save-preferences');

// Load saved preferences from local storage
function loadPreferences() {
  const savedWorkDuration = localStorage.getItem('workDuration');
  const savedBreakDuration = localStorage.getItem('breakDuration');
  
  if (savedWorkDuration) {
    workDuration = parseInt(savedWorkDuration) * 60;
    workDurationInput.value = savedWorkDuration;
  }

  if (savedBreakDuration) {
    breakDuration = parseInt(savedBreakDuration) * 60;
    breakDurationInput.value = savedBreakDuration;
  }

  timeLeft = workDuration; // Reset the timer to the work session duration
  updateDisplay();
}

// Update the timer display
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Start the timer
function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startButton.disabled = true;
  pauseButton.disabled = false;

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft === 0) {
      clearInterval(timer);
      isRunning = false;
      startButton.disabled = false;
      pauseButton.disabled = true;
      sessionCount++;
      sessionCountDisplay.textContent = sessionCount;

      // Notify user
      if (isWorkSession) {
        new Notification("Work session is over! Time for a break.");
        timeLeft = breakDuration; // Switch to break time
        sessionTypeDisplay.textContent = 'Break Session';
        container.style.backgroundColor = '#ffcccb'; // Light red for break
      } else {
        new Notification("Break session is over! Time to get back to work.");
        timeLeft = workDuration; // Switch to work time
        sessionTypeDisplay.textContent = 'Work Session';
        container.style.backgroundColor = '#d3ffd3'; // Light green for work
      }

      isWorkSession = !isWorkSession; // Toggle session type
      updateDisplay();
    }
  }, 1000);
}

// Pause the timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
}

// Reset the timer
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
  timeLeft = workDuration; // Reset to initial work duration
  sessionTypeDisplay.textContent = 'Work Session';
  container.style.backgroundColor = '#d3ffd3'; // Default background color (Work)
  updateDisplay();
}

// Save preferences to local storage
function savePreferences() {
  const newWorkDuration = parseInt(workDurationInput.value);
  const newBreakDuration = parseInt(breakDurationInput.value);

  if (newWorkDuration >= 1 && newBreakDuration >= 1) {
    localStorage.setItem('workDuration', newWorkDuration);
    localStorage.setItem('breakDuration', newBreakDuration);
    workDuration = newWorkDuration * 60;
    breakDuration = newBreakDuration * 60;
    timeLeft = workDuration;
    updateDisplay();
    alert("Preferences saved!");
  } else {
    alert("Please enter valid durations (positive numbers).");
  }
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
savePreferencesButton.addEventListener('click', savePreferences);

// Request notification permission from the user
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Load saved preferences when the page loads
loadPreferences();
