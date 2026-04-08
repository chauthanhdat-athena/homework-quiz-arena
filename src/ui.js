import { QuizEngine } from './quiz.js';
import { Timer } from './timer.js';
import questions from './questions.js';

const FEEDBACK_DELAY_MS = 800;
const QUESTION_TIME = 15;

export class UI {
  constructor(appEl) {
    this._app = appEl;
    this._engine = new QuizEngine(questions);
    this._timer = new Timer({
      duration: QUESTION_TIME,
      onTick: (t) => this._updateTimerDisplay(t),
      onExpire: () => this._onTimerExpire(),
    });
  }

  init() {
    this._engine.start();
    this._renderStart();
  }

  _renderStart() {
    this._app.innerHTML = `
      <div class="screen-card">
        <h1 class="start-title">Quiz Arena</h1>
        <p class="start-subtitle">${questions.length} questions &middot; Game Industry &amp; Development</p>
        <button id="start-btn" class="btn-primary">Start Quiz</button>
      </div>
    `;
    this._app.querySelector('#start-btn').addEventListener('click', () => {
      this._engine.start();
      const q = this._engine.getCurrentQuestion();
      const state = this._engine.getState();
      this._renderQuestion(q, state.currentQuestionIndex, state.total, state.score);
    });
  }

  _renderQuestion(question, index, total, score = 0) {
    const answersHTML = question.answers
      .map(
        (a, i) =>
          `<button class="answer-btn" data-index="${i}">${a}</button>`
      )
      .join('');

    this._app.innerHTML = `
      <div class="quiz-header">
        <span class="progress-text">Question ${index + 1} of ${total}</span>
        <span class="streak-badge"></span>
        <span class="score-display">Score: <strong>${score}</strong></span>
      </div>
      <div class="screen-card">
        <div class="timer-bar-track"><div class="timer-bar" id="timer-bar"></div></div>
        <p class="timer-text" id="timer-text">${QUESTION_TIME}s</p>
        <p class="question-text">${question.question}</p>
        <div class="answers-grid">${answersHTML}</div>
      </div>
    `;

    this._app.querySelectorAll('.answer-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this._onAnswerClick(Number(btn.dataset.index));
      });
    });

    this._timer.start();
  }

  _onAnswerClick(selectedIndex) {
    this._timer.stop();
    const result = this._engine.answer(selectedIndex);
    const { score } = this._engine.getState();
    this._showFeedback(selectedIndex, result.correctIndex, score, result.pointsEarned, result.multiplier, result.streak);

    setTimeout(() => {
      if (result.isLast) {
        this._renderResults(this._engine.getResults());
      } else {
        const q = this._engine.getCurrentQuestion();
        const state = this._engine.getState();
        this._renderQuestion(q, state.currentQuestionIndex, state.total, state.score);
      }
    }, FEEDBACK_DELAY_MS);
  }

  _showFeedback(selectedIndex, correctIndex, score, pointsEarned, multiplier, streak) {
    const buttons = this._app.querySelectorAll('.answer-btn');
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctIndex) btn.classList.add('correct');
      if (i === selectedIndex && selectedIndex !== correctIndex) btn.classList.add('wrong');
    });

    const scoreEl = this._app.querySelector('.score-display strong');
    if (scoreEl) scoreEl.textContent = score;

    const streakEl = this._app.querySelector('.streak-badge');
    if (streakEl) {
      if (streak >= 3) {
        streakEl.textContent = streak >= 5 ? `🔥 ${streak} streak · 3×` : `🔥 ${streak} streak · 2×`;
        streakEl.classList.add('active');
      } else {
        streakEl.textContent = '';
        streakEl.classList.remove('active');
      }
    }

    if (selectedIndex === correctIndex) {
      const toast = document.createElement('div');
      toast.className = 'points-toast';
      toast.textContent = multiplier > 1 ? `+${pointsEarned} ×${multiplier}` : `+${pointsEarned}`;
      this._app.querySelector('.screen-card').appendChild(toast);
    }
  }

  _updateTimerDisplay(t) {
    const bar = this._app.querySelector('#timer-bar');
    const text = this._app.querySelector('#timer-text');
    if (bar) bar.style.width = `${(t / QUESTION_TIME) * 100}%`;
    if (bar) bar.className = `timer-bar${t <= 5 ? ' urgent' : ''}`;
    if (text) text.textContent = `${t}s`;
  }

  _onTimerExpire() {
    const result = this._engine.answer(-1);
    this._showFeedback(-1, result.correctIndex, this._engine.getState().score, 0, 1, result.streak);
    setTimeout(() => {
      if (result.isLast) {
        this._renderResults(this._engine.getResults());
      } else {
        const q = this._engine.getCurrentQuestion();
        const state = this._engine.getState();
        this._renderQuestion(q, state.currentQuestionIndex, state.total, state.score);
      }
    }, FEEDBACK_DELAY_MS);
  }

  _renderResults(summary) {
    const pct = Math.round(summary.accuracy * 100);
    const accuracyClass = pct >= 70 ? 'text-success' : 'text-danger';
    const mins = Math.floor(summary.timeTaken / 60);
    const secs = summary.timeTaken % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    const rowsHTML = summary.answers.map((a, i) => `
      <tr>
        <td>Q${i + 1}</td>
        <td class="${a.correct ? 'text-success' : 'text-danger'}">${a.correct ? '✓' : '✗'}</td>
        <td>${a.timeTaken}s</td>
      </tr>
    `).join('');

    this._app.innerHTML = `
      <div class="screen-card" style="text-align: center;">
        <h2 style="margin-bottom: 1.5rem;">Results</h2>
        <div class="results-stats">
          <div class="result-stat">
            <p class="result-stat-label">Final Score</p>
            <p class="result-stat-value" style="color: #6366f1;">${summary.score}</p>
          </div>
          <div class="result-stat">
            <p class="result-stat-label">Accuracy</p>
            <p class="result-stat-value ${accuracyClass}">${pct}%</p>
          </div>
          <div class="result-stat">
            <p class="result-stat-label">Total Time</p>
            <p class="result-stat-value">${timeStr}</p>
          </div>
        </div>
        <table class="breakdown-table">
          <thead>
            <tr><th>Question</th><th>Result</th><th>Time</th></tr>
          </thead>
          <tbody>${rowsHTML}</tbody>
        </table>
        <button id="play-again-btn" class="btn-primary" style="margin-top: 1.5rem;">Play Again</button>
      </div>
    `;

    this._app.querySelector('#play-again-btn').addEventListener('click', () => {
      this._engine.start();
      this._renderStart();
    });
  }
}
