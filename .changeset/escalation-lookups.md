---
"@ian-pascoe/skills": patch
---

`escalating-to-user` no longer escalates facts it can look up, public ones included (library APIs, vendor limits, specs): it finds them and decides. It escalates a fact only when you alone know it.
