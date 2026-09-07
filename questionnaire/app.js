(function () {
  "use strict";

  const PASS_THRESHOLD = 0.8; // 80% to pass

  // All state lives in memory only. Nothing is written to localStorage,
  // cookies, or any server. It disappears the moment the tab is closed.
  let current = 0;
  let answers = new Array(QUESTIONS.length).fill(null);
  let locked = false;

  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultsScreen = document.getElementById("results-screen");

  const nameInput = document.getElementById("name-input");
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");
  const downloadBtn = document.getElementById("download-btn");

  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const qNum = document.getElementById("q-num");
  const qText = document.getElementById("q-text");
  const optionsEl = document.getElementById("options");
  const feedbackEl = document.getElementById("feedback");

  function showScreen(el) {
    [startScreen, quizScreen, resultsScreen].forEach((s) => s.classList.remove("active"));
    el.classList.add("active");
  }

  function renderQuestion() {
    locked = false;
    const item = QUESTIONS[current];

    progressFill.style.width = ((current) / QUESTIONS.length) * 100 + "%";
    progressLabel.textContent = "Question " + (current + 1) + " of " + QUESTIONS.length;
    qNum.textContent = "Question " + (current + 1);
    qText.textContent = item.q;

    optionsEl.innerHTML = "";
    item.options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.type = "button";
      btn.innerHTML = '<span class="marker"></span><span>' + optText + "</span>";
      btn.addEventListener("click", () => selectOption(idx));
      optionsEl.appendChild(btn);
    });

    feedbackEl.className = "feedback";
    feedbackEl.textContent = "";
    nextBtn.disabled = true;
    nextBtn.textContent = current === QUESTIONS.length - 1 ? "See result" : "Next";
  }

  function selectOption(idx) {
    if (locked) return;
    locked = true;

    const item = QUESTIONS[current];
    answers[current] = idx;

    const optionEls = optionsEl.querySelectorAll(".option");
    optionEls.forEach((el, i) => {
      el.disabled = true;
      el.setAttribute("disabled", "true");
      if (i === item.correct) el.classList.add("correct");
      if (i === idx && idx !== item.correct) el.classList.add("incorrect");
      if (i === idx) el.classList.add("selected");
    });

    const isCorrect = idx === item.correct;
    feedbackEl.className = "feedback show " + (isCorrect ? "good" : "bad");
    feedbackEl.innerHTML =
      "<strong>" + (isCorrect ? "Correct." : "Not quite.") + "</strong>" + item.explanation;

    nextBtn.disabled = false;
  }

  function next() {
    if (current < QUESTIONS.length - 1) {
      current += 1;
      renderQuestion();
    } else {
      finish();
    }
  }

  function finish() {
    progressFill.style.width = "100%";
    const score = answers.reduce(
      (acc, a, i) => acc + (a === QUESTIONS[i].correct ? 1 : 0),
      0
    );
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const passed = score / QUESTIONS.length >= PASS_THRESHOLD;

    document.getElementById("score-big").textContent = score + " / " + QUESTIONS.length;
    document.getElementById("score-caption").textContent =
      pct + "% correct" + (nameInput.value.trim() ? " — " + nameInput.value.trim() : "");

    const pill = document.getElementById("status-pill");
    pill.textContent = passed ? "Pass" : "Needs review";
    pill.className = "status-pill " + (passed ? "pass" : "fail");

    const reviewList = document.getElementById("review-list");
    reviewList.innerHTML = "";
    QUESTIONS.forEach((item, i) => {
      const correct = answers[i] === item.correct;
      if (correct) return; // only surface missed questions for review
      const div = document.createElement("div");
      div.className = "review-item";
      div.innerHTML =
        '<p class="review-q">' + (i + 1) + ". " + item.q + "</p>" +
        '<p class="review-answer wrong">Your answer: ' + item.options[answers[i]] + "</p>" +
        '<p class="review-answer right">Correct answer: ' + item.options[item.correct] + "</p>" +
        '<p class="review-explain">' + item.explanation + "</p>";
      reviewList.appendChild(div);
    });

    if (reviewList.children.length === 0) {
      reviewList.innerHTML = '<p class="review-answer right" style="margin-top:12px;">All answers correct — nothing to review.</p>';
    }

    showScreen(resultsScreen);
  }

  function buildSummaryText() {
    const score = answers.reduce(
      (acc, a, i) => acc + (a === QUESTIONS[i].correct ? 1 : 0),
      0
    );
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const passed = score / QUESTIONS.length >= PASS_THRESHOLD;
    const name = nameInput.value.trim() || "(not provided)";
    const date = new Date().toISOString().slice(0, 10);

    let lines = [
      "AI Acceptable Use Policy — Comprehension Check",
      "Name: " + name,
      "Date: " + date,
      "Score: " + score + " / " + QUESTIONS.length + " (" + pct + "%)",
      "Result: " + (passed ? "Pass" : "Needs review"),
      "",
      "Missed questions:"
    ];

    let anyMissed = false;
    QUESTIONS.forEach((item, i) => {
      if (answers[i] !== item.correct) {
        anyMissed = true;
        lines.push("- Q" + (i + 1) + ": " + item.q);
        lines.push("  Your answer: " + item.options[answers[i]]);
        lines.push("  Correct answer: " + item.options[item.correct]);
      }
    });
    if (!anyMissed) lines.push("- None. All answers correct.");

    return lines.join("\n");
  }

  function download() {
    const text = buildSummaryText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = (nameInput.value.trim() || "anonymous").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    a.href = url;
    a.download = "ai-policy-check-" + safeName + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function restart() {
    current = 0;
    answers = new Array(QUESTIONS.length).fill(null);
    locked = false;
    showScreen(startScreen);
  }

  startBtn.addEventListener("click", () => {
    showScreen(quizScreen);
    renderQuestion();
  });
  nextBtn.addEventListener("click", next);
  downloadBtn.addEventListener("click", download);
  restartBtn.addEventListener("click", restart);
})();
