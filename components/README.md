# Components

This folder contains reusable Empirica UI components.

Components should handle display and input only. They should not define game rules, call LLM APIs, or compute final payoffs.

## Who Should Use This

Use this folder if you are building participant-facing pages, input forms, feedback views, timers, progress displays, or reusable widgets for Empirica experiments.

## What Should Be Added Later

- Reusable pages such as consent, instructions, decisions, feedback, surveys, lobby, and completion screens
- Reusable widgets such as timers, progress bars, payoff tables, group status, round history, social information boxes, chat boxes, and LLM status badges
- Reusable form inputs such as Likert scales, multiple choice, numeric input, sliders, text response, contribution input, and confidence input
- Component README examples documenting props and minimal usage

## What Not To Put Here

Do not put game payoff logic, treatment assignment, model calls, prompt construction, or data analysis here. Game rules belong in `shared/game_logic/`, prompts belong in `shared/prompts/`, LLM calls belong in engine code, and analysis belongs in `analysis/`.

## Completion Standard

A user should be able to build a new Empirica experiment by reusing pages and widgets while keeping game rules in shared logic.
