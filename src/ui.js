import { QuizEngine } from './quiz.js';
import questions from './questions.js';

const FEEDBACK_DELAY_MS = 800;

export class UI {
  constructor(appEl) {
    this._app = appEl;
    this._engine = new QuizEngine(questions);
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
      this._renderQuestion(q, state.currentQuestionIndex, state.total);
    });
  }

  _renderQuestion(question, index, total) {
    const answersHTML = question.answers
      .map(
        (a, i) =>
          `<button class="answer-btn" data-index="${i}">${a}</button>`
      )
      .join('');

    this._app.innerHTML = `
      <p class="progress-text">Question ${index + 1} of ${total}</p>
      <div class="screen-card">
        <p class="question-text">${question.question}</p>
        <div class="answers-grid">${answersHTML}</div>
      </div>
    `;

    this._app.querySelectorAll('.answer-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this._onAnswerClick(Number(btn.dataset.index));
      });
    });
  }

  _onAnswerClick(selectedIndex) {
    const result = this._engine.answer(selectedIndex);
    this._showFeedback(selectedIndex, result.correctIndex);

    setTimeout(() => {
      if (result.isLast) {
        this._renderResults(this._engine.getResults());
      } else {
        const q = this._engine.getCurrentQuestion();
        const state = this._engine.getState();
        this._renderQuestion(q, state.currentQuestionIndex, state.total);
      }
    }, FEEDBACK_DELAY_MS);
  }

  _showFeedback(selectedIndex, correctIndex) {
    const buttons = this._app.querySelectorAll('.answer-btn');
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctIndex) btn.classList.add('correct');
      if (i === selectedIndex && selectedIndex !== correctIndex) btn.classList.add('wrong');
    });
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
