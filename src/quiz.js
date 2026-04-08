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
    this._answers = [];
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
    const pointsEarned = correct ? 10 : 0;

    this._score += pointsEarned;
    this._answers.push({ answerIndex, correct });
    this._index++;

    return {
      correct,
      correctIndex: question.correct,
      pointsEarned,
      isLast: this._index >= this._questions.length,
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
    return {
      score: this._score,
      total: this._questions.length,
      accuracy: this._answers.length > 0 ? correct / this._answers.length : 0,
      answers: [...this._answers],
    };
  }
}
