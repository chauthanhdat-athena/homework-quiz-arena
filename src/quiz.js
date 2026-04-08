export class QuizEngine {
  constructor(questions) {
    this._questions = questions;
    this._index = 0;
    this._score = 0;
    this._answers = [];
  }

  start() {
    this._index = 0;
    this._score = 0;
    this._streak = 0;
    this._answers = [];
    this._startTime = Date.now();
    this._questionStartTime = Date.now();
    this._endTime = null;
  }

  getCurrentQuestion() {
    if (this._index >= this._questions.length) return null;
    return this._questions[this._index];
  }

  answer(answerIndex) {
    if (this._index >= this._questions.length) {
      throw new Error("Quiz is already finished");
    }
    const question = this._questions[this._index];
    const correct = answerIndex === question.correct;

    if (correct) {
      this._streak++;
    } else {
      this._streak = 0;
    }

    const multiplier = this._streak >= 5 ? 3 : this._streak >= 3 ? 2 : 1;
    const pointsEarned = correct ? 10 * multiplier : 0;

    const timeTaken = Math.round((Date.now() - this._questionStartTime) / 1000);
    this._score += pointsEarned;
    this._answers.push({ answerIndex, correct, timeTaken, pointsEarned, multiplier: correct ? multiplier : 1 });
    this._index++;
    this._questionStartTime = Date.now();

    const isLast = this._index >= this._questions.length;
    if (isLast) this._endTime = Date.now();

    return {
      correct,
      correctIndex: question.correct,
      pointsEarned,
      multiplier: correct ? multiplier : 1,
      streak: this._streak,
      isLast,
    };
  }

  getState() {
    return {
      currentQuestionIndex: this._index,
      score: this._score,
      total: this._questions.length,
      answers: [...this._answers],
      isFinished: this._index >= this._questions.length,
    };
  }

  getResults() {
    const correct = this._answers.filter((a) => a.correct).length;
    const elapsed = Math.round(((this._endTime ?? Date.now()) - this._startTime) / 1000);
    return {
      score: this._score,
      total: this._questions.length,
      accuracy: this._answers.length > 0 ? correct / this._answers.length : 0,
      answers: [...this._answers],
      timeTaken: elapsed,
    };
  }
}
