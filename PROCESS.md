# Assignment 1 Process

## Overview

I built **Almost Full Is Already Broken**, an interactive explainer showing why a service system can feel broken before it is technically at full capacity. The final interaction uses one demand slider and a simplified M/M/1 queue model. My main process focus was not adding features, but making the model, interaction, and presentation trustworthy across the exact marking viewports.

## Moment 1 — Correcting the queue model before building the interface

My first model used the M/M/1 total time in system, `1 / (μ − λ)`, while I was describing the result as queue wait. That created a conceptual mismatch and also made my planned "95% is more than 10× worse than 50%" claim false: with that formula the ratio was exactly 10×. Instead of changing the wording to fit the implementation, I corrected the harness and tests first. I switched to queue-only waiting time, `Wq = λ / [μ(μ − λ)]`, and rewrote the tests around known checkpoints: 50% → 1×, 80% → 4×, 90% → 9×, 95% → 19×, 99% → 99×. I knew the correction was right because the model tests passed against those values and the terminology in the code now matched what the interface claimed. This model-and-harness checkpoint is captured in commit [`33ffb19`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mukulsharma0260-alt/commit/33ffb19).

## Moment 2 — Letting the tests fail before implementing the interaction

I deliberately wrote the Assignment 1 model and DOM tests before the final interface existed. The obvious shortcut would have been to build the slider first and then write tests that matched whatever I had already made. Instead, I used failing tests as the contract: exactly one native range input, one live queue-status region, and model outputs derived from the queue function rather than hard-coded display values. Once the minimal explainer was implemented, the Assignment 1 tests passed 6/6 and the full project suite passed 27/27. That gave me evidence that the interaction satisfied the brief before I spent time polishing the visuals. The working interactive checkpoint is commit [`d598560`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mukulsharma0260-alt/commit/d598560).

## Moment 3 — Changing my workflow after repeated bad agent edits

During the cinematic redesign, several proposed agent writes contained duplicated markup, old and new IDs together, incomplete functions, or malformed CSS. The obvious response would have been to keep accepting edits and repair the repo afterward. Instead, I stopped writing directly into the project and moved risky changes into `/tmp` files. I inspected them with targeted `grep` checks, stylelint, brace/selector checks, and only copied them into `src/` after the temporary versions were clean. I also rejected a deprecated `clip` rule and replaced it with `clip-path: inset(50%)` before copying the CSS. After the verified files were copied, `git diff --check`, Astro check, build, lint, and all 27 tests passed. The resulting cinematic implementation is commit [`99a06ee`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mukulsharma0260-alt/commit/99a06ee).

## Moment 4 — Testing the real deployment conditions, not just localhost appearance

The final visual pass exposed two problems that normal code checks did not catch. First, the café image path became `...-altimages/...` because `BASE_URL` did not include a trailing slash. I traced Astro's actual base-path behaviour and normalized the path before adding the asset. Second, the original mobile `right center` crop hid the service counter. I compared 15%, 25%, and 35% crops at the exact 390×844 marking viewport and chose 25% because it kept the counter visible while preserving headline readability. I then verified 390×844 and 1920×1080, zero horizontal overflow, image HTTP 200, 95% → 19×, and 99% → 99× without clipping. The final image/crop checkpoint is commit [`159ba2d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mukulsharma0260-alt/commit/159ba2d).
