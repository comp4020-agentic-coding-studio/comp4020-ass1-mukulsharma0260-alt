# Assignment 1 Reflection

This assignment changed how I think about "working" software. At first, I was focused on whether the slider moved and whether the numbers changed. The more important work was making sure the explanation was mathematically honest, visually understandable, and robust in the exact conditions where it would be marked.

The strongest lesson was to use the coding agent as something I supervise rather than something I simply trust. Several generated edits looked reasonable in summaries but contained duplicated or malformed code when inspected directly. Moving risky work into temporary files, validating it with tests and linters, and only then copying it into the repository made the process slower for individual edits but much faster overall because I stopped creating new repair work.

I also learned that visual quality needs its own verification loop. The final café image technically loaded, but the mobile crop initially hid the part of the scene that supported the queue story. Testing 15%, 25%, and 35% positions at 390×844 turned a subjective design decision into a comparison I could justify. The final result is intentionally simple: one slider, one model, and one idea. That constraint made the explainer clearer and helped me focus on the relationship between demand, spare capacity, and rapidly increasing wait.
