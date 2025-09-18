# Arcade Prototype Spec (Pong-Derived) — LearnPickle Game Design Pack (v2025.09.18)

> Source: `pong modifications.txt` (normalized on 9-18-25)

## High-Level Concept
Start with a **retro arcade prototype** inspired by Pong to create a low-friction way to teach rally flow and common rule infractions.

## Core Mechanics (from source)
- **Players:** Four paddles (one per quadrant). Player-controlled + **CPU teammates/opponents**.
- **CPU error rate:** approximately **10%** miss/jitter window to simulate human imperfection.
- **Ball feel:** Visual **bounce illusion** — size pulse and/or shockwave on bounce; corresponding SFX.
- **Visual style:** Retro/NES aesthetic; crisp/minimal; high-contrast friendly.

## Teaching Layer (overlayed on arcade)
- After each rally, display **call + explainer** (e.g., “*Side-out: serve was from wrong side*”). 
- If a rule is implicated, highlight the involved area (e.g., **Kitchen**) for 1–2 seconds.
- Update **scoreboard** and announce **three-number score** when appropriate.

## Technical Acceptance Criteria
- Deterministic simulation seed for tests (configurable RNG)
- CPU difficulty is parameterized (error window and reaction delay)
- Bounce feedback uses a component or directive that can be unit-tested
- No external runtime deps added (per Repo Rails); tests in Karma/Jasmine

## Nice-to-Haves (parking lot)
- Simple difficulty levels (Beginner, Intermediate, Advanced)
- Sound on/off setting
- Left-handed control option

---

## Appendix A — Verbatim Source (pong modifications.txt)
```
show 4 players - 1 per quadrant
nontendo "mario"-style graphics
all 3 computer players have a 1-10 chance of making a mistake
(in the future, characters will have faces and backstories)
animation must show ball behave like pickle-ball, including bounces
not sure how to do that with the top-down perspective of pong,  perhaps the ball gets bigger and smaller to give an illusion of depth and a shockwave effect and sound on bounce
```
