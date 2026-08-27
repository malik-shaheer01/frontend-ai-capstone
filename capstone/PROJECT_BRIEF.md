# Project brief

**Commit Message Composer** solves the small but constant friction of writing a good commit message —
re-reading your own diff, deciding on a Conventional Commits type/scope, and phrasing a clear subject
line — by generating one from a pasted `git diff` via an LLM (Groq). It's built for developers working
in a repo that enforces the Conventional Commits format, like this one. I chose this idea because it's
small enough to build and hardened properly in the time available, it uses AI to produce structured
output rather than as a chatbot gimmick, and it's a problem this repo's own workflow already has.
