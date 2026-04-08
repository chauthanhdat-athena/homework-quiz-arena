const KEY = 'quiz-leaderboard';
const MAX_ENTRIES = 10;

export function saveScore(score, accuracy, timeTaken) {
  const board = getLeaderboard();
  board.push({ score, accuracy, timeTaken, date: new Date().toLocaleDateString() });
  board.sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);
  localStorage.setItem(KEY, JSON.stringify(board.slice(0, MAX_ENTRIES)));
  return board.slice(0, MAX_ENTRIES);
}

export function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}
