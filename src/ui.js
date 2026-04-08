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
    this._showFeedback(selectedIndex, result.correctIndex, score);

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

  _showFeedback(selectedIndex, correctIndex, score) {
    const buttons = this._app.querySelectorAll('.answer-btn');
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctIndex) btn.classList.add('correct');
      if (i === selectedIndex && selectedIndex !== correctIndex) btn.classList.add('wrong');
    });

    const scoreEl = this._app.querySelector('.score-display strong');
    if (scoreEl) scoreEl.textContent = score;

    if (selectedIndex === correctIndex) {
      const toast = document.createElement('div');
      toast.className = 'points-toast';
      toast.textContent = '+10';
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
    this._showFeedback(-1, result.correctIndex, this._engine.getState().score);
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

    this._app.innerHTML = `
      <div class="screen-card" style="text-align: center;">
        <p class="result-label">Final Score</p>
        <p class="result-score">${summary.score}</p>
        <p class="result-accuracy ${accuracyClass}">${pct}% accuracy</p>
        <p style="color: #94a3b8; margin-bottom: 1.5rem;">
          ${summary.answers.filter((a) => a.correct).length} / ${summary.total} correct
        </p>
        <button id="play-again-btn" class="btn-primary">Play Again</button>
      </div>
    `;

    this._app.querySelector('#play-again-btn').addEventListener('click', () => {
      this._engine.start();
      this._renderStart();
    });
  }
}
