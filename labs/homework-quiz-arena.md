# Homework: Build a Quiz Web App

**Type:** Take-home assignment
**Rule:** All code must be written by Claude Code. You may not write code by hand. Your role is to direct, review, and iterate.

---

## Requirements

### Core (must have)

1. **Quiz flow** — show one question at a time, 4 answer buttons, advance on click
2. **Scoring** — track points per question, show running total
3. **Timer** — 15-second countdown per question, auto-skip if time runs out
4. **Results screen** — final score, accuracy %, time taken

### Gamification (pick at least 2)

5. **Streak bonus** — 2x points after 3 correct in a row, 3x after 5
6. **Leaderboard** — save top 10 scores in localStorage, show after each game
7. **Difficulty levels** — easy (20s), medium (15s), hard (10s)
8. **Progress bar** — visual indicator of questions remaining
9. **Animations** — correct/wrong answer feedback (color flash, shake, confetti)
10. **Sound effects** — use Web Audio API for correct/wrong/timer sounds

### Bonus (optional)

11. Add 10+ questions on any topic you like
12. Add categories (e.g. Claude Code, game design, general knowledge)
13. Multiplayer — two players take turns on same screen
14. Custom theme — match your team's branding

---

## Workflow: Practice What You Learned

This is not a coding exercise. This is an **agentic coding** exercise.

1. **Start with CLAUDE.md** — run `/init`, then edit it with build commands, conventions, and a NEVER list
2. **One feature at a time** — don't overload Claude with 5 features in one prompt. Build the quiz flow first, then layer on features
3. **Be specific** — "add a 15-second timer that shows a countdown bar and auto-skips on timeout" > "add a timer"
4. **Set up hooks** — auto-format and auto-test after every edit, so Claude checks its own work
5. **Review and refine** — test in the browser after each feature. Tell Claude exactly what's wrong when something breaks
6. **Use subagents** — when you need an audit or want to explore multiple approaches without polluting your main context

---

## Grading Rubric

| Criteria | Points |
|----------|--------|
| Quiz flow works (show > answer > next > results) | 25 |
| Scoring is correct | 15 |
| Timer works with auto-skip | 15 |
| At least 2 gamification features | 20 |
| CLAUDE.md exists and is useful | 10 |
| Code is clean (no console errors, responsive layout) | 10 |
| Creativity bonus (extra features, polish, fun factor) | 5 |
| **Total** | **100** |

---

## Submission

Push your project to a personal git repo and share the link. Include a short note (2-3 sentences) on what was easy and what was hard about directing Claude Code.
