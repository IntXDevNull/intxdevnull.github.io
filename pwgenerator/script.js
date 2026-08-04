// Character sets
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = "O0lI1";
const WORDLIST_FILE = "wordlist.txt";
const WORD_SEPARATOR = "-";

let wordList = [];
let wordListLoaded = false;

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

// Load the word list from wordlist.txt (one word per line)
async function loadWordList() {
  try {
    const response = await fetch(WORDLIST_FILE);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    wordList = text.split("\n").map(w => w.trim()).filter(w => w.length > 0);
    wordListLoaded = wordList.length > 0;
  } catch (err) {
    console.error("Failed to load wordlist.txt:", err);
    wordListLoaded = false;
  }

  if (!wordListLoaded) {
    const easyBtn = document.querySelector('[data-preset="easy"]');
    easyBtn.disabled = true;
    easyBtn.title = "wordlist.txt could not be loaded";
  }
}

// Get a cryptographically secure random integer in [0, max), unbiased
function secureRandomInt(max) {
  const range = Math.floor(0xFFFFFFFF / max) * max; // largest multiple of max <= 2^32
  const array = new Uint32Array(1);
  let value;
  do {
    crypto.getRandomValues(array);
    value = array[0];
  } while (value >= range); // reject values that would cause modulo bias
  return value % max;
}

// Pick one random character from a string
function randomChar(str) {
  return str[secureRandomInt(str.length)];
}

// Pick one random word from the loaded word list
function randomWord() {
  return wordList[secureRandomInt(wordList.length)];
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

// Generate a "medium/strong" style password from the custom char pool
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

// Generate an easy, word-based passphrase: word+digit-word+digit...
// Fills words until adding another would exceed the target length.
function generateEasyPassword(targetLength) {
  if (!wordListLoaded) return "";

  let parts = [];
  let currentLength = 0;

  while (true) {
    const word = randomWord();
    const digit = secureRandomInt(10);
    const chunk = word + digit;
    const addedLength = chunk.length + (parts.length > 0 ? WORD_SEPARATOR.length : 0);

    if (currentLength + addedLength > targetLength && parts.length > 0) break;

    parts.push(chunk);
    currentLength += addedLength;

    if (currentLength >= targetLength) break;
  }

  return parts.join(WORD_SEPARATOR);
}

// Main generate function, reads current UI state
function generatePassword() {
  const length = parseInt(el.lengthInput.value, 10);
  const noRepeat = el.noRepeat.checked;
  const isEasyMode = document.querySelector(".preset-btn.active")?.dataset.preset === "easy";

  let password;
  if (isEasyMode) {
    if (!wordListLoaded) {
      el.output.value = "Word list unavailable";
      updateStrength("");
      return;
    }
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
  if (preset === "easy" && !wordListLoaded) return; // guard against disabled button

  el.presetBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.preset === preset));

  if (preset === "easy") {
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
  if (!el.output.value || el.output.value.startsWith("Select") || el.output.value.startsWith("Word list")) return;
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

// Initial load: fetch word list, then generate default password
loadWordList().then(() => applyPreset("medium"));
