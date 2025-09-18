# User Story & Teaching Goals — LearnPickle Game Design Pack (v2025.09.18)

> Source: `ReadMe.txt` (normalized on 9-18-25)

## Purpose
This document captures the **player persona, learning objectives, and gameplay outcomes** that the MVP must support. It serves as acceptance criteria for Copilot and developers.

## Primary User Story (from ReadMe)
As a **new or returning pickleball player**, I want to **practice rules, scoring, and core etiquette** through short, arcade-style drills so that I can **play real games with confidence**.

## Teaching Goals
- Serve rules and flow (who serves, from where, sequence)
- Two-bounce/return rule (what counts, typical mistakes)
- Kitchen (NVZ) basics (what’s allowed, common violations)
- Score-calling discipline (three-number call, examples)
- Post-rally explanations (what happened, why a point/side-out did or didn’t occur)
- Basic court positions & rotations (doubles focus for future)

## Success Criteria (MVP)
- Short sessions (3–8 minutes) with **clear progress feedback**
- Plain-English **umpire-style call** after each rally (e.g., *“Fault: volleyed in the Kitchen.”*)
- Show **scoreboard** and announce **three-number score** after legal scoring events
- Gentle **nudge copy** (“you’re almost there!”) when one learning badge remains
- All content runs **offline** once installed (PWA), and requires **no login**

## A11y & UX Expectations
- Large tap targets; visible keyboard focus
- Clear `h1` per view; skip-to-content link; focus management on route change
- High-contrast toggle available in Settings

## Engineering Hooks (how this informs code)
- Provide `RulesComponent`, `PracticeComponent`, `QuizComponent` with **progress events**
- `ProgressService` writes `lp/*` keys to `localStorage`
- Badge logic consumes progress keys and exposes derived state for Home

---

## Appendix A — Verbatim Source (ReadMe.txt)
```
user story:
	Amy is a very frustrated newbie pickleball player. She struggles to hit the ball but worse has no understanding of what people mean when the announce the score and server and talk about the kitchen. She wants a fun, easy way to learn the rules without reading all the articles or watching videos
solution: 
	LearnPickle, a Nintendo-style animated pong-like game Angular PWA. 
	The game has controls, scoreboard, and text display that expands between Rallies
play
	When the user opens the app, a game is set up displaying the pickle court with 4 players in positions, instructions on controlling the play, and a "start" button. 
	On start, brief explaination of player position and count-down till play begins. 
	The rally (right word?) ends according to standard PickleBall rules.
	After rally ends, game displays umpire call in Pickle-speak with a plain english explaination beneath and a continue button. 
	Scoreboard updates, game announces the score and server in standard pickle ball terms (e.g., 0-0-1) with a plain english explaination beneath and a continue button. 
	During the course of a game, the user should be exposed to essential rules and terminology
	The challenge to balance teaching without ruining the fun and overwhelming with new data
	perhaps have rules by level: newbie, beginer, advanced beginner?
	We also need a way to check learning, maybe micro-quizzes interspersed stategically though play to re-inforce without breaking game flow.
		Underhand Serve: You must serve underhand, contacting the ball below your waist. 
		Behind the Baseline: The serve must be performed from behind the baseline. 
		Diagonal Serve: The serve must be hit diagonally to the opponent's service box, which is the square opposite the server. 
		Single Attempt: You only get one attempt to make a valid serve. 
		After the Serve: The ball must bounce once on the receiving side of the court after the serve.
		The Return: The return shot must also bounce on the serving side of the court before it's hit.
		The "Kitchen" or Non-Volley Zone 
		No Volleying: You cannot hit the ball out of the air (volley) while standing on or inside the kitchen line.
		Stay Out of the Kitchen: You must let the ball bounce before you hit it if you are in the kitchen.
		Scoring and Serving Side
		Only the Server Scores: You only score a point when your team is serving. 
		First Serve Exception: When the game starts, only the first server on the serving team gets to serve. 
		Score Calling 
		Call Before Serving: You must call out the score before you serve.
```
