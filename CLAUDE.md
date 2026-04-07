# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Quiz Web App built as a take-home assignment. All code must be written by Claude Code — the human directs, reviews, and iterates. See [labs/homework-quiz-arena.md](labs/homework-quiz-arena.md) for the full spec.

## Commands

- `npm run dev` — start Vite dev server (http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build

## Requirements

### Core (required)
- Quiz flow: one question at a time, 4 answer buttons, advance on click
- Scoring: points per question, running total displayed
- Timer: 15-second countdown per question, auto-skip on timeout
- Results screen: final score, accuracy %, time taken

### Gamification (implement ≥2)
- Streak bonus: 2× points after 3 correct in a row, 3× after 5
- Leaderboard: top 10 scores persisted in `localStorage`
- Difficulty levels: easy (20s), medium (15s), hard (10s)
- Progress bar: visual indicator of questions remaining
- Animations: correct/wrong feedback (color flash, shake, confetti)
- Sound effects: Web Audio API for correct/wrong/timer sounds

## Architecture

When built, the app should follow a clear state machine:

```
start → question → [answer | timeout] → next question | results
```

Key state to track:
- `currentQuestionIndex`, `score`, `streak`, `timeLeft`, `answers[]`
- Timer is owned by the question component/module — reset on each new question
- Leaderboard reads/writes `localStorage` key `quiz-leaderboard`

Organize code into clear modules (whether vanilla JS or a framework):
- `quiz.js` / `QuizEngine` — pure game logic (no DOM), easy to test
- `timer.js` — countdown logic, fires callback on tick and on expire
- `ui.js` / components — all DOM manipulation
- `leaderboard.js` — localStorage read/write
- `questions.js` — question data array

## NEVER

- Do not write inline event handlers in HTML (`onclick="..."`)
- Do not store state in the DOM — keep a JS state object as source of truth
- Do not use `alert()` or `confirm()` for any UI
