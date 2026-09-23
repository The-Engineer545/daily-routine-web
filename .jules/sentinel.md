## 2026-09-22 - XSS via innerHTML in Client-side UI Rendering
**Vulnerability:** Found `innerHTML` being used to render unescaped user state (`state.currentStreak` and `state.longestStreak`) in `public/rutina.html`, which creates a potential XSS vulnerability if this state is manipulated in `localStorage`.
**Learning:** Even internal numbers stored in `localStorage` should be considered untrusted input if they bypass sanitization. The previous developer concatenated raw state variables directly into `innerHTML`.
**Prevention:** Always use safe DOM APIs like `.textContent` and `createElement` + `appendChild` rather than `.innerHTML` when dynamically assembling DOM elements, even for seemingly numeric values.
