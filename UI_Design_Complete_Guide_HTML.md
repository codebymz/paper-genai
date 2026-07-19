# 🎨 PaperGenAI — Complete UI/UX Design Guide (HTML/CSS/JS Version)
**Vanilla HTML | CSS | JavaScript | Glassmorphism Design**

> Ye guide us React guide ka HTML/CSS/JS version hai — **UI bilkul same rakhi gayi hai**, sirf implementation vanilla HTML/CSS/JS mein ki gayi hai. Har component ab ek `id="..."` wale element se control hota hai (React state ki jagah).
> Backend abhi is project mein shamil nahi — jahan bhi "MOCK" likha hai, wahan apna real API call lagayen.

---

## 📁 Project Structure (Frontend Files Only)

```
papergenai/
├── index.html   ← Poora markup: saare panels, dock, modals, toasts
├── style.css    ← Poora design system: glass, buttons, animations, print
└── script.js    ← Poori logic: navigation, theme, chat, quiz, paper, history
```

Koi build step, koi bundler, koi npm install zaroori nahi — seedha `index.html` browser mein khol sakte hain (ya kisi bhi static host par upload kar sakte hain).

---

## 🖼️ Background (Pictures Kaise Lagayi Hain)

React version mein `bg-image-day.jpg` / `bg-image-night.jpg` files thin. Is version mein — chunke actual image files upload nahi hui thin — day/night ke liye ek gradient placeholder use kiya gaya hai (`--bg-image` variable). Design bilkul same tareeke se kaam karta hai, bas value gradient hai.

File: `style.css`
```css
:root {
  --bg-image: linear-gradient(180deg, #cfe8ff 0%, #e9f3ff 45%, #fdf6ec 100%); /* Light mode */
}
html.dark {
  --bg-image: linear-gradient(180deg, #05070d 0%, #0c1220 45%, #131321 100%); /* Dark mode */
}
body {
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  transition: background-image 0.5s ease-in-out;
}
```

### ✅ Asli Photo Lagani Ho To
`--bg-image` ki value `url('apni-image.jpg')` se replace kar dein — baaki sab kuch waisa hi rahega.

---

## 🎨 Design System (Rang, Fonts, Shadows) — **Bilkul Same**

### Fonts
File: `index.html` (`<head>`)
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet" />
```
| Font | CSS Class | Kahan use |
|------|-----------|-----------|
| **Inter** | body default | Sab normal text |
| **Outfit** | `.font-display` | Headings, titles |

### Colors — same hex values
```css
--accent: #007AFF;
--accent-glow: rgba(0, 122, 255, 0.45);
--purple: #a855f7;
--emerald: #10b981;
--red: #ef4444;
--amber: #f59e0b;
```

### CSS Variables (Light vs Dark) — same values, `.dark` ki jagah `html.dark`
```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.72);
  --glass-border: rgba(255, 255, 255, 0.5);
  --text-primary: #1d1d1f;
  --text-muted: #6e6e73;
}
html.dark {
  --glass-bg: rgba(30, 30, 35, 0.65);
  --glass-border: rgba(255, 255, 255, 0.08);
  --text-primary: #f5f5f7;
  --text-muted: #98989d;
}
```

---

## 🪟 Glassmorphism Classes — Same Names, Same CSS

`.glass`, `.glass-card`, `.glass-input` — bilkul same properties (`backdrop-filter: blur(20px)`, wahi radius, wahi shadow). File: `style.css`.

---

## 🔘 Buttons — Same Names, Same Styles

`.btn-primary`, `.btn-outline`, `.ch-btn` / `.ch-btn.active` — same gradients, same hover/disabled states. File: `style.css`.

---

## 🗂️ Pages / Panels — ab `<section id="panel-...">` hain

React ke `*Panel.jsx` components ab HTML `<section>` blocks hain jinhein `script.js` ka `goToPanel()` function `active` class laga/hata kar show/hide karta hai.

| React Component | HTML Section ID |
|---|---|
| `HomePanel.jsx` | `#panel-home` |
| `ChatbotPanel.jsx` | `#panel-chatbot` |
| `QuizPanel.jsx` | `#panel-quiz` |
| `PaperGeneratorPanel.jsx` | `#panel-paper` |
| `HistoryPanel.jsx` | `#panel-history` |
| `SettingsPanel.jsx` | `#panel-settings` |

### 1. 🏠 Home (`#panel-home`)
| Element | ID |
|---|---|
| Papers Saved count | `#statPapers` |
| Study Session time | `#statSession` |
| "Study Chatbot" quick-start card | `[data-nav="chatbot"]` |
| "Paper Generator" quick-start card | `[data-nav="paper"]` |

Layout, icons (GraduationCap/Sparkles/BookOpen/TrendingUp/ArrowRight — ab Lucide `<i data-lucide="...">` tags) aur spacing hoobahoo React guide jaisi hai.

### 2. 💬 Chatbot (`#panel-chatbot`)
| Element | ID |
|---|---|
| Selection screen wrapper | `#chatSelectView` |
| Class dropdown | `#chatClass` |
| Subject dropdown | `#chatSubject` |
| Active chat wrapper | `#chatActiveView` |
| Header info text (e.g. "Class 10 • Physics") | `#chatHeaderInfo` |
| Change button | `#chatChangeBtn` |
| Refresh button | `#chatRefreshBtn` |
| Suggestion pills row | `#chatPills` |
| Messages container | `#chatBody` |
| Textarea | `#chatInput` |
| Send button | `#chatSendBtn` |

Bubble classes same: `.msg-bubble`, `.msg-row.user`, `.msg-row.bot`, `.typing-dot`.

### 3. ❓ Quiz (`#panel-quiz`)
| Element | ID |
|---|---|
| Selection screen | `#quizSelectView` |
| Class / Subject dropdowns | `#quizClass`, `#quizSubject` |
| Question-count buttons | `#quizQtyRow` (`.qty-btn`, `.qty-btn.active`) |
| Generate button | `#quizGenerateBtn` |
| Loading screen | `#quizLoadingView` |
| Active quiz screen | `#quizActiveView` |
| Progress label / bar | `#quizProgressLabel`, `#quizProgressFill` |
| Question text | `#quizQuestionText` |
| Options list | `#quizOptionList` (`.option-btn`, `.selected`, `.correct`, `.incorrect`) |
| Prev / Next buttons | `#quizPrevBtn`, `#quizNextBtn` |
| Results screen | `#quizResultsView` |
| Score number / total | `#quizScoreNum`, `#quizScoreOf` |
| Result message | `#quizResultsMsg` |
| Restart button | `#quizRestartBtn` |
| Answer breakdown list | `#quizBreakdown` |

Same 4 screens (Selection → Loading → Active → Results), same classes (`.spin-ring`, `.progress-track`, `.results-card`, `.award-icon`, blur "blob" decorations).

### 4. 📄 Paper Generator (`#panel-paper`)
| Element | ID |
|---|---|
| Settings form fields | `#paperClass`, `#paperSubject`, `#paperBoard`, `#paperType`, `#paperLanguage`, `#paperMarks`, `#paperInstructions` |
| BISE template checkbox | `#paperTemplateCheck` |
| Papers count | `#paperCount` |
| Chapter pills | `#chaptersWrap` (`.ch-btn`) |
| Generate button | `#paperGenerateBtn` |
| Empty preview state | `#previewEmpty` |
| Filled preview state | `#previewContent` |
| Variant tabs | `#variantTabs` |
| Print / PDF / Save buttons | `#printBtn`, `#pdfBtn`, `#saveHistoryBtn` |
| A4 page preview | `#a4Page` |

Same 2-column `lg:grid-cols-2` → `.paper-layout` grid, same `.a4-page` / `.paper-a4` (Times New Roman, 11pt, 15mm padding) CSS.

### 5. 📚 History (`#panel-history`)
| Element | ID |
|---|---|
| Empty state | `#historyEmpty` |
| Saved-papers list | `#historyList` (each row: `.history-item` with View / Download / Delete buttons) |
| Paper viewer modal | `#modal-paper-view` (`#paperViewTitle`, `#paperViewContent`) |

### 6. ⚙️ Settings (`#panel-settings`)
| Element | ID |
|---|---|
| Theme toggle | `#themeToggle` (+ `#themeSub` label text) |
| Reduce Motion toggle | `#motionToggle` |
| Clear cache button | `#clearCacheBtn` |

Toggle switch markup/CSS unchanged: `.toggle`, `.toggle.on`, `.knob`.

---

## 🚢 Dock — Bottom Navigation (`#dock`)

Same layout, same 6 icons, same active-state glow (`.dock-btn.active::before` = `animate-pulse-glow` equivalent).

```html
<nav class="dock glass no-print" id="dock">
  <button class="dock-btn" data-nav="home">...</button>
  <button class="dock-btn" data-nav="chatbot">...</button>
  <button class="dock-btn" data-nav="quiz">...</button>
  <button class="dock-btn" data-nav="paper">...</button>
  <button class="dock-btn" data-nav="history">...</button>
  <button class="dock-btn" data-nav="settings">...</button>
</nav>
```
`data-nav` value hi panel ID (`panel-<value>`) se match karta hai — `goToPanel()` isi se panel switch karta hai.

---

## 🔔 Toast Notifications

Container: `#toastStack` (fixed top-right, same as React version). Function: `showToast(message, type)` jahan `type` = `success` | `error` | `info` — same colors/classes (`.toast.success`, `.toast.error`, `.toast.info`), same 3.5s auto-dismiss, same `animate-fade-in-up`.

---

## 🪟 Modals (Footer + Paper Viewer)

Same overlay/box structure, IDs added for open/close control:

| Modal | ID |
|---|---|
| About | `#modal-about` |
| Blog | `#modal-blog` |
| Contact | `#modal-contact` |
| Privacy | `#modal-privacy` |
| Terms | `#modal-terms` |
| Paper viewer (History) | `#modal-paper-view` |

Open trigger: `[data-modal="about|blog|contact|privacy|terms"]`. Close: `[data-close-modal]` button or click on overlay background. Same `.overlay`, `.modal-box`, `animate-fade-in` / `animate-fade-in-up`.

---

## 🎞️ Animations — Same Names, Same Timings

`.animate-fade-in`, `.animate-fade-in-up`, dock `pulseGlow`, quiz `.spin-ring` spin, `.award-icon` bounce, `.typing-dot` bounce — sab same keyframes/durations, sirf Tailwind class ki jagah plain CSS `@keyframes`.

**Reduce Motion** — same selector logic:
```css
html.reduce-motion *,
html.reduce-motion *::before,
html.reduce-motion *::after {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

---

## 🌙 Dark/Light Mode System

Control ab `script.js` ke `state.theme` + `localStorage.getItem('theme')` mein hai (SettingsContext ka equivalent):
```js
state.theme = localStorage.getItem('theme') || 'dark'; // default: dark
document.documentElement.classList.toggle('dark', state.theme === 'dark');
```
- Dark mode: `<html class="dark">` → `html.dark` CSS rules apply hoti hain
- Light mode: `dark` class remove ho jati hai
- `#themeToggle` click karne par state.theme flip hota hai aur `localStorage` update hota hai

---

## 📦 CDN Libraries (npm packages ki jagah)

Is version mein npm install ki zarurat nahi — sab kuch CDN se load hota hai (`index.html` ke end mein):

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>          <!-- lucide-react ki jagah -->
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
<script src="script.js"></script>
```

---

## 🖨️ Print Styling — Unchanged

```css
@media print {
  .no-print { display: none !important; }  /* Dock, buttons hide ho jate hain */
  .a4-page  { box-shadow: none; margin: 0; page-break-after: always; }
}
```

---

## ✅ Frontend Change Karne Ka Safe Tarika

### Jo safely badal sakte ho:

| Change | File |
|--------|------|
| Background | `style.css` → `--bg-image` |
| Colors (accent, muted) | `style.css` → `:root` / `html.dark` variables |
| Fonts | `index.html` (Google Fonts link) |
| Dock icons/labels | `index.html` → `#dock` section |
| Home page text/layout | `index.html` → `#panel-home` |
| Chat UI design | `index.html` → `#panel-chatbot`, `style.css` chat rules |
| Quiz UI design | `index.html` → `#panel-quiz`, `style.css` quiz rules |
| Paper settings UI | `index.html` → `#panel-paper` |
| History UI | `index.html` → `#panel-history` |
| Settings UI | `index.html` → `#panel-settings` |
| Toast style | `style.css` → `.toast` rules |
| Footer links/text | `index.html` → `.footer-links` |
| Modal content | `index.html` → `.overlay` blocks |
| Global styles | `style.css` |
| Animations | `style.css` → `@keyframes` section |

### Jo abhi mock/placeholder hai (asli backend connect karna hoga):
- `sendChatMessage()` in `script.js` — abhi mock reply deta hai
- `buildMockQuestions()` in `script.js` — abhi sample MCQs deta hai
- `generatePaper()` in `script.js` — abhi sample paper text deta hai
- Har jagah code mein `// MOCK:` comment likha hai jahan real API call lagana hai

---

## 🗒️ Quick Reference — CSS Class Names (Same as React version)

```
glass          → backdrop blur + semi-transparent bg + border
glass-card     → glass + rounded-3xl + p-6
glass-input    → form input styling
btn-primary    → blue gradient button
btn-outline    → transparent border button
ch-btn         → chapter selection pill
ch-btn.active  → selected chapter (blue)
msg-bubble     → chat message bubble
msg-row.user   → user message row (right align)
msg-row.bot    → bot message row (left align)
typing-dot     → animated typing indicator dot
a4-page        → A4 paper white page
paper-a4       → A4 paper Times New Roman content
no-print       → print mein hide hoga
animate-fade-in     → fade in animation
animate-fade-in-up  → slide up animation
```

---

## 🆔 Quick Reference — Key Element IDs (New — HTML/JS version only)

```
panel-home / panel-chatbot / panel-quiz / panel-paper / panel-history / panel-settings
dock, toastStack

chatClass, chatSubject, chatSelectView, chatActiveView, chatHeaderInfo,
chatChangeBtn, chatRefreshBtn, chatPills, chatBody, chatInput, chatSendBtn

quizClass, quizSubject, quizQtyRow, quizGenerateBtn, quizSelectView,
quizLoadingView, quizActiveView, quizProgressLabel, quizProgressFill,
quizQuestionText, quizOptionList, quizPrevBtn, quizNextBtn,
quizResultsView, quizScoreNum, quizScoreOf, quizResultsMsg,
quizRestartBtn, quizBreakdown

paperClass, paperSubject, paperBoard, paperType, paperLanguage, paperMarks,
paperInstructions, paperTemplateCheck, paperCount, chaptersWrap,
paperGenerateBtn, previewEmpty, previewContent, variantTabs,
printBtn, pdfBtn, saveHistoryBtn, a4Page

historyEmpty, historyList, modal-paper-view, paperViewTitle, paperViewContent

themeToggle, themeSub, motionToggle, clearCacheBtn

modal-about, modal-blog, modal-contact, modal-privacy, modal-terms
```

---

*Documentation prepared for PaperGenAI v2.0 — HTML/CSS/JS Version | UI 1:1 same as original React design.*
