## 2024-05-24 - Accessibility for Icon-Only Buttons
**Learning:** Found that multiple icon-only action buttons (save/cancel task, edit/delete task) were missing `aria-label` attributes, making them inaccessible to screen readers.
**Action:** Always ensure any button consisting solely of an icon or generic text has a descriptive `aria-label` for screen readers and ideally a `title` attribute for visual tooltips.
