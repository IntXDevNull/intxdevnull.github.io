// Character sets
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = "O0lI1";
const EASY_WORDS = ["tiger","river","cloud","stone","maple","ocean","flame","brave",
  "gentle","silver","forest","meadow","spark","echo","raven","cedar","amber","coral"];

// Cache DOM elements
const el = {
  output: document.getElementById("passwordOutput"),
  copyBtn: document.getElementById("copyBtn"),
  generateBtn: document.getElementById("generateBtn"),
  lengthSlider: document.getElementById("lengthSlider"),
  lengthInput: document.getElementById("lengthInput"),
  strengthBar: document.getElementById("strengthBar"),
  strengthLabel: document.getElementById("strengthLabel"),
  upper: document.getElementById("optUpper"),
  lower: document.getElementById("optLower"),
  numbers: document.getElementById("optNumbers"),
  symbols: document.getElementById("optSymbols"),
  excludeAmbiguous: document.getElementById("optExcludeAmbiguous"),
  noRepeat: document.getElementById("optNoRepeat"),
  presetBtns: document.querySelectorAll(".preset-btn")
};

// Get a cryptographically secure random integer in [0, max)
function secureRandomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

// Pick one random character from a string
function randomChar(str) {
  return str[secureRandomInt(str.length)];
}

// Build the character pool based on selected options
function buildCharPool() {
  let pool = "";
  if (el.upper.checked) pool += UPPER;
  if (el.lower.checked) pool += LOWER;
  if (el.numbers.checked) pool += NUMBERS;
  if (el.symbols.checked) pool += SYMBOLS;

  if (el.excludeAmbiguous.checked) {
    pool = [...pool].filter(c => !AMBIGUOUS.includes(c)).join("");
  }
  return pool;
}

// Generate a "medium" style password from letters + numbers
function generateStandardPassword(length, pool, noRepeat) {
  if (!pool) return "";
  let result = "";
  let usedChars = new Set();

  while (result.length < length) {
    const char = randomChar(pool);
    if (noRepeat && usedChars.has(char) && usedChars.size < pool.length) {
      continue; // skip duplicate, try again
    }
    result += char;
    usedChars.add(char);
  }
  return result;
}

// Generate an easy, pronounceable password from word list + numbers
function generateEasyPassword(length) {
  let result = "";
  while (result.length < length) {
    result += randomChar(EASY_WORDS);
    if (result.length < length) {
      result += secureRandomInt(10); // add a digit between words
    }
  }
  return result.slice(0, length);
}

// Main generate function, reads current UI state
function generatePassword() {
  const length = parseInt(el.lengthInput.value, 10);
  const noRepeat = el.noRepeat.checked;

  // "Easy" mode overrides custom pool with word-based generation
  const isEasyMode = document.querySelector(".preset-btn.active")?.dataset.preset === "easy";

  let password;
  if (isEasyMode) {
    password = generateEasyPassword(length);
  } else {
    const pool = buildCharPool();
    if (!pool) {
      el.output.value = "Select at least one option";
      updateStrength("");
      return;
    }
    password = generateStandardPassword(length, pool, noRepeat);
  }

  el.output.value = password;
  updateStrength(password);
}

// Estimate and display password strength
function updateStrength(password) {
  if (!password) {
    el.strengthBar.className = "strength-bar";
    el.strengthLabel.textContent = "—";
    return;
  }

  let variety = 0;
  if (/[A-Z]/.test(password)) variety++;
  if (/[a-z]/.test(password)) variety++;
  if (/[0-9]/.test(password)) variety++;
  if (/[^A-Za-z0-9]/.test(password)) variety++;

  let score = "weak";
  if (password.length >= 12 && variety >= 3) {
    score = "strong";
  } else if (password.length >= 8 && variety >= 2) {
    score = "medium";
  }

  el.strengthBar.className = "strength-bar " + score;
  el.strengthLabel.textContent = score.charAt(0).toUpperCase() + score.slice(1);
}

// Apply a preset's option configuration
function applyPreset(preset) {
  el.presetBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.preset === preset));

  if (preset === "easy") {
    // Word-based mode; checkboxes are irrelevant but reset for clarity
    el.upper.checked = false;
    el.lower.checked = true;
    el.numbers.checked = true;
    el.symbols.checked = false;
  } else if (preset === "medium") {
    el.upper.checked = true;
    el.lower.checked = true;
    el.numbers.checked = true;
    el.symbols.checked = false;
  } else if (preset === "strong") {
    el.upper.checked = true;
    el.lower.checked = true;
    el.numbers.checked = true;
    el.symbols.checked = true;
  }
  generatePassword();
}

// Sync slider and number input together
function syncLength(value) {
  const clamped = Math.min(128, Math.max(4, parseInt(value, 10) || 4));
  el.lengthSlider.value = clamped;
  el.lengthInput.value = clamped;
}

// Copy password to clipboard
async function copyPassword() {
  if (!el.output.value || el.output.value === "Select at least one option") return;
  try {
    await navigator.clipboard.writeText(el.output.value);
    const original = el.copyBtn.textContent;
    el.copyBtn.textContent = "✓";
    setTimeout(() => { el.copyBtn.textContent = original; }, 1200);
  } catch (err) {
    console.error("Copy failed:", err);
  }
}

// Event listeners
el.generateBtn.addEventListener("click", generatePassword);
el.copyBtn.addEventListener("click", copyPassword);

el.lengthSlider.addEventListener("input", () => {
  syncLength(el.lengthSlider.value);
  generatePassword();
});
el.lengthInput.addEventListener("input", () => {
  syncLength(el.lengthInput.value);
  generatePassword();
});

[el.upper, el.lower, el.numbers, el.symbols, el.excludeAmbiguous, el.noRepeat].forEach(cb => {
  cb.addEventListener("change", () => {
    el.presetBtns.forEach(btn => btn.classList.remove("active")); // custom = no preset active
    generatePassword();
  });
});

el.presetBtns.forEach(btn => {
  btn.addEventListener("click", () => applyPreset(btn.dataset.preset));
});

// Initial generation on page load
applyPreset("medium");
