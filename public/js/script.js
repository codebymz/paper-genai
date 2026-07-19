// ============================================================
//  PaperGenAI v2.0 — Single-Page App JavaScript
//  Panels: home | chatbot | quiz | paper | history | settings
// ============================================================

const API_BASE = '/api';

// ── Inline badge-pill style (not in CSS to keep it simple) ──
(function injectStyles() {
  const s = document.createElement('style');
  s.textContent = `
    .badge-pill {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      font-size: 0.7rem;
      font-weight: 500;
      border-radius: 9999px;
      border: 1px solid var(--glass-border);
      background: var(--surface);
      color: var(--text-muted);
    }
    .font-500 { font-weight: 500; }
  `;
  document.head.appendChild(s);
})();

// ── 1. THEME INITIALIZATION (runs immediately) ──────────────
const state = {
  theme: localStorage.getItem('theme') || 'dark',
  reduceMotion: localStorage.getItem('reduceMotion') === 'true',
  currentPanel: 'home',
  sessionStart: Date.now(),
  // Chat
  chatMessages: [],
  chatLoading: false,
  // Paper
  selectedChapters: [],
  paperCount: 1,
  papers: [],
  generating: false,
  // Quiz
  quizQuestions: [],
  quizAnswers: {},
  quizCurrent: 0,
  quizQty: 10,
  // History
  history: JSON.parse(localStorage.getItem('pgHistory') || '[]'),
};

function applyTheme() {
  const isDark = state.theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('reduce-motion', state.reduceMotion);

  // Smooth crossfade: use a temporary overlay layer
  const bgImg = isDark
    ? "url('/assets/bg-image-night.jpg')"
    : "url('/assets/bg-image-day.jpg')";

  // Create crossfade overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: -2;
    background-image: ${bgImg};
    background-size: cover; background-position: center top;
    background-repeat: no-repeat; background-attachment: fixed;
    opacity: 0;
    transition: opacity 1s ease;
    pointer-events: none;
  `;
  document.body.appendChild(overlay);

  // Set new bg on body (behind overlay)
  document.documentElement.style.cssText = `
    background-image: ${bgImg};
    background-size: cover; background-position: center top;
    background-repeat: no-repeat; background-attachment: fixed;
    min-height: 100vh;
  `;
  document.body.style.backgroundImage = bgImg;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center top';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundAttachment = 'fixed';

  // Force reflow then fade overlay in
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    // Remove overlay after transition completes
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 1000);
    }, 500);
  });
}
applyTheme();

// ── 2. PANEL NAVIGATION ─────────────────────────────────────
function goToPanel(name) {
  // Add smooth transition class
  document.querySelectorAll('.panel').forEach(p => {
    p.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

  // Hide all panels with fade out
  document.querySelectorAll('.panel').forEach(p => {
    if (p.classList.contains('active')) {
      p.style.opacity = '0';
      p.style.transform = 'translateY(-10px)';
    }
  });

  // Small delay for smooth transition
  setTimeout(() => {
    document.querySelectorAll('.panel').forEach(p => {
      p.classList.remove('active');
      p.style.opacity = '';
      p.style.transform = '';
    });

    // Show target with fade in
    const target = document.getElementById(`panel-${name}`);
    if (target) {
      target.classList.add('active');
      target.style.opacity = '0';
      target.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        target.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
        setTimeout(() => {
          target.style.transition = '';
          target.style.opacity = '';
          target.style.transform = '';
        }, 400);
      });
    }

    // Update dock
    document.querySelectorAll('.dock-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.nav === name);
    });
    state.currentPanel = name;

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 150);
}

// Wire dock buttons
document.querySelectorAll('[data-nav]').forEach(el => {
  el.addEventListener('click', () => goToPanel(el.dataset.nav));
  if (el.tagName !== 'BUTTON') {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToPanel(el.dataset.nav); }
    });
  }
});

// ── 3. TOAST NOTIFICATIONS ──────────────────────────────────
function showToast(message, type = 'info', duration = 3500) {
  const stack = document.getElementById('toastStack');
  if (!stack) return;

  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.style.animation = 'none';
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(100%) scale(0.9)';
  toast.innerHTML = `${icons[type] || ''}<span>${message}</span>`;
  stack.appendChild(toast);

  // Trigger reflow
  toast.offsetHeight;

  // Animate in
  requestAnimationFrame(() => {
    toast.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0) scale(1)';
  });

  const remove = () => {
    toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(120%) scale(0.9)';
    setTimeout(() => toast.remove(), 350);
  };
  setTimeout(remove, duration);
  toast.addEventListener('click', remove);
}

const toast = {
  success: msg => showToast(msg, 'success'),
  error: msg => showToast(msg, 'error'),
  info: msg => showToast(msg, 'info'),
};

// ── 4. MODAL SYSTEM ─────────────────────────────────────────
function openModal(id) {
  const overlay = document.getElementById(`modal-${id}`);
  if (!overlay) return;

  // Smooth modal open
  overlay.style.display = 'flex';
  overlay.style.opacity = '0';
  overlay.style.visibility = 'visible';

  const modalBox = overlay.querySelector('.modal-box');
  if (modalBox) {
    modalBox.style.transform = 'scale(0.92) translateY(20px)';
    modalBox.style.opacity = '0';
  }

  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    overlay.style.transition = 'opacity 0.35s ease';
    overlay.style.opacity = '1';

    if (modalBox) {
      modalBox.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease';
      modalBox.style.transform = 'scale(1) translateY(0)';
      modalBox.style.opacity = '1';
    }
  });
}

function closeModal() {
  const overlays = document.querySelectorAll('.overlay.open');
  overlays.forEach(overlay => {
    const modalBox = overlay.querySelector('.modal-box');

    overlay.style.transition = 'opacity 0.3s ease';
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';

    if (modalBox) {
      modalBox.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';
      modalBox.style.transform = 'scale(0.92) translateY(20px)';
      modalBox.style.opacity = '0';
    }

    setTimeout(() => {
      overlay.style.display = '';
      overlay.style.opacity = '';
      overlay.style.visibility = '';
      if (modalBox) {
        modalBox.style.transform = '';
        modalBox.style.opacity = '';
      }
    }, 300);
  });

  document.body.style.overflow = '';

  // Reset contact form when closing
  setTimeout(() => {
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');
    if (contactForm) contactForm.style.display = '';
    if (contactSuccess) contactSuccess.style.display = 'none';
  }, 300);
}

document.querySelectorAll('[data-modal]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); openModal(el.dataset.modal); });
});
document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', closeModal);
});
document.querySelectorAll('.overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// FAQ Accordion
document.addEventListener('click', e => {
  const faqQ = e.target.closest('.faq-q');
  if (faqQ) {
    const item = faqQ.closest('.faq-item');
    if (item) {
      // Close other open items
      item.parentElement.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      // Toggle current
      item.classList.toggle('open');
    }
  }
});

// ── 5. HELPERS ───────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function spinnerHTML() {
  return `<span style="display:inline-block;width:0.875rem;height:0.875rem;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;flex-shrink:0;"></span>`;
}
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
}

// ── 6. HOME PANEL ────────────────────────────────────────────
function initHome() {
  updateStats();
  // Track session time every minute
  setInterval(updateStats, 60000);
}

function updateStats() {
  const papersEl = document.getElementById('statPapers');
  const sessionEl = document.getElementById('statSession');
  if (papersEl) papersEl.textContent = state.history.length;
  if (sessionEl) {
    const mins = Math.floor((Date.now() - state.sessionStart) / 60000);
    sessionEl.textContent = mins > 0 ? `${mins} min` : 'Just started';
  }
}

// ── 7. CHATBOT PANEL ─────────────────────────────────────────
function initChatbot() {
  const chatStartBtn = document.getElementById('chatStartBtn');
  const chatChangeBtn = document.getElementById('chatChangeBtn');
  const chatRefreshBtn = document.getElementById('chatRefreshBtn');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatInput = document.getElementById('chatInput');
  const chatSelectView = document.getElementById('chatSelectView');
  const chatActiveView = document.getElementById('chatActiveView');
  const chatHeaderInfo = document.getElementById('chatHeaderInfo');
  const chatBody = document.getElementById('chatBody');
  const chatWelcome = document.getElementById('chatWelcome');
  const chatPills = document.getElementById('chatPills');

  function showChatActive() {
    const cls = document.getElementById('chatClass').value;
    const sub = document.getElementById('chatSubject').value;
    chatHeaderInfo.textContent = `${cls} • ${sub}`;
    chatSelectView.style.display = 'none';
    chatActiveView.classList.add('visible');
    // Reset messages
    state.chatMessages = [];
    if (chatWelcome) chatWelcome.style.display = '';
    // Remove previous messages (keep welcome)
    Array.from(chatBody.children).forEach(el => {
      if (el !== chatWelcome) el.remove();
    });
  }

  chatStartBtn.addEventListener('click', showChatActive);
  chatChangeBtn.addEventListener('click', () => {
    chatSelectView.style.display = 'flex';
    chatActiveView.classList.remove('visible');
    state.chatMessages = [];
  });
  chatRefreshBtn.addEventListener('click', () => {
    state.chatMessages = [];
    if (chatWelcome) chatWelcome.style.display = '';
    Array.from(chatBody.children).forEach(el => {
      if (el !== chatWelcome) el.remove();
    });
    toast.info('Chat refresh ho gaya');
  });

  // Suggestion pills
  chatPills.querySelectorAll('.chat-pill').forEach(pill => {
    pill.addEventListener('click', () => sendChatMessage(pill.dataset.suggestion));
  });

  // Input with smooth auto-resize
  let resizeTimeout;
  chatInput.addEventListener('input', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      autoResize(chatInput);
      chatSendBtn.disabled = !chatInput.value.trim() || state.chatLoading;
    }, 50);
  });
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage(chatInput.value);
    }
  });
  chatSendBtn.addEventListener('click', () => sendChatMessage(chatInput.value));

  // Smooth button press feedback
  [chatStartBtn, chatChangeBtn, chatRefreshBtn, chatSendBtn].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.95)';
      btn.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
      setTimeout(() => { btn.style.transition = ''; }, 150);
    });
    btn.addEventListener('mouseleave', () => {
      if (btn.style.transform) {
        btn.style.transform = '';
        setTimeout(() => { btn.style.transition = ''; }, 150);
      }
    });
  });

  async function sendChatMessage(text) {
    text = text.trim();
    if (!text || state.chatLoading) return;

    state.chatMessages.push({ role: 'user', content: text });
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatSendBtn.disabled = true;
    state.chatLoading = true;

    if (chatWelcome) chatWelcome.style.display = 'none';
    appendUserBubble(text);
    const typingEl = appendTypingIndicator();

    try {
      const resp = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: state.chatMessages }),
      });

      if (resp.status === 429) { toast.error('Rate limit — thora ruko'); return; }
      if (resp.status === 402) { toast.error('AI credits khatam'); return; }
      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      typingEl.remove();
      const bubble = appendBotBubble('');
      state.chatMessages.push({ role: 'assistant', content: '' });

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '', assistantSoFar = '', done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantSoFar += delta;
              state.chatMessages[state.chatMessages.length - 1].content = assistantSoFar;
              bubble.innerHTML = marked.parse(assistantSoFar || '...');
              chatBody.scrollTop = chatBody.scrollHeight;
            }
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (e) {
      typingEl?.remove();
      toast.error('Chat error: ' + (e.message || 'unknown'));
    } finally {
      state.chatLoading = false;
      chatSendBtn.disabled = !chatInput.value.trim();
    }
  }

  function appendUserBubble(text) {
    const row = document.createElement('div');
    row.className = 'msg-row user animate-fade-in-up';
    row.innerHTML = `<div class="msg-bubble"><p style="white-space:pre-wrap;">${escapeHtml(text)}</p></div>`;
    chatBody.appendChild(row);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendBotBubble(html) {
    const row = document.createElement('div');
    row.className = 'msg-row bot animate-fade-in-up';
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = marked.parse(html || '...');
    row.appendChild(bubble);
    chatBody.appendChild(row);
    chatBody.scrollTop = chatBody.scrollHeight;
    return bubble;
  }

  function appendTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'msg-row bot';
    row.innerHTML = `<div class="typing-indicator animate-fade-in"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
    chatBody.appendChild(row);
    chatBody.scrollTop = chatBody.scrollHeight;
    return row;
  }
}

// ── 8. QUIZ PANEL (MOCK) ─────────────────────────────────────
const MOCK_QUESTIONS = {
  Physics: [
    { q: "Light ki speed kitni hai?", opts: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], ans: 0 },
    { q: "Newton ki second law kya hai?", opts: ["F=mv", "F=ma", "F=m/a", "F=a/m"], ans: 1 },
    { q: "Electric current ki SI unit kya hai?", opts: ["Volt", "Watt", "Ampere", "Ohm"], ans: 2 },
    { q: "Sound waves konsi waves hain?", opts: ["Transverse", "Electromagnetic", "Longitudinal", "Surface"], ans: 2 },
    { q: "Gravitational acceleration (g) ki value kya hai?", opts: ["9.8 m/s²", "8.9 m/s²", "10.8 m/s²", "9.0 m/s²"], ans: 0 },
    { q: "Resistance ki unit kya hai?", opts: ["Ampere", "Volt", "Ohm", "Watt"], ans: 2 },
    { q: "Power ki SI unit kya hai?", opts: ["Joule", "Watt", "Newton", "Pascal"], ans: 1 },
    { q: "Kinetic energy ka formula kya hai?", opts: ["mgh", "½mv²", "mv", "F×d"], ans: 1 },
    { q: "Lens ke center se guzarne wali ray kahan jati hai?", opts: ["Reflect hoti hai", "Seedhi jati hai", "Focus pe milti hai", "Bend hoti hai"], ans: 1 },
    { q: "Pressure ki SI unit kya hai?", opts: ["Newton", "Pascal", "Bar", "Joule"], ans: 1 },
    { q: "Ohm's law kya kehti hai?", opts: ["V=IR", "V=I/R", "V=I²R", "V=R/I"], ans: 0 },
    { q: "Thermal energy ka source kya hai?", opts: ["Motion", "Gravity", "Heat", "Light"], ans: 2 },
    { q: "Magnetic field ki unit kya hai?", opts: ["Tesla", "Gauss", "Weber", "Ampere"], ans: 0 },
    { q: "Wave ki frequency aur wavelength ka product kya hai?", opts: ["Amplitude", "Speed", "Period", "Power"], ans: 1 },
    { q: "Convex lens is type ka hota hai:", opts: ["Diverging", "Converging", "Plane", "None"], ans: 1 },
    { q: "Nucleus mein kya hota hai?", opts: ["Electrons", "Protons + Neutrons", "Photons", "Positrons"], ans: 1 },
    { q: "Simple pendulum ki period kis par depend karti hai?", opts: ["Mass", "Amplitude", "Length", "Color"], ans: 2 },
    { q: "Work done ka formula kya hai?", opts: ["F+d", "F×d×cosθ", "F/d", "F×d²"], ans: 1 },
    { q: "Refraction kab hoti hai?", opts: ["Jab light absorb ho", "Jab light medium change kare", "Jab light reflect ho", "Jab light scatter ho"], ans: 1 },
    { q: "Transformer kya change karta hai?", opts: ["Current frequency", "AC voltage", "DC to AC", "Power"], ans: 1 },
  ],
  Chemistry: [
    { q: "Water ka chemical formula kya hai?", opts: ["H₂O₂", "H₂O", "HO₂", "H₃O"], ans: 1 },
    { q: "Atomic number kya batata hai?", opts: ["Neutrons ki tadad", "Protons ki tadad", "Mass", "Electrons"], ans: 1 },
    { q: "Carbon dioxide ka formula kya hai?", opts: ["CO", "CO₂", "C₂O", "CO₃"], ans: 1 },
    { q: "Acid ka pH range kya hota hai?", opts: ["7 se 14", "0 se 7", "7 se 7", "14 se 14"], ans: 1 },
    { q: "NaCl ka IUPAC name kya hai?", opts: ["Sodium chlorate", "Sodium chloride", "Sodium oxide", "Sodium nitrate"], ans: 1 },
    { q: "Electrons kahan hote hain?", opts: ["Nucleus mein", "Orbital shells mein", "Proton ke saath", "Neutron ke saath"], ans: 1 },
    { q: "Methane ka formula kya hai?", opts: ["CH₄", "C₂H₄", "CH₂", "C₂H₂"], ans: 0 },
    { q: "Ionic bond kaise banta hai?", opts: ["Electrons share hote hain", "Electrons transfer hote hain", "Proton share hote hain", "Neutrons transfer hote hain"], ans: 1 },
    { q: "Oxidation mein kya hota hai?", opts: ["Electrons gain", "Electrons lose", "Proton gain", "Neutron lose"], ans: 1 },
    { q: "Avogadro ka number kya hai?", opts: ["6.022×10²³", "3.14×10²³", "6.022×10²⁶", "6.022×10²⁰"], ans: 0 },
    { q: "Organic chemistry mein kaunsa element main hai?", opts: ["Oxygen", "Carbon", "Hydrogen", "Nitrogen"], ans: 1 },
    { q: "Alkane ki general formula kya hai?", opts: ["CnH2n", "CnH2n+2", "CnH2n-2", "CnHn"], ans: 1 },
    { q: "Electrolysis mein cathode par kya hota hai?", opts: ["Oxidation", "Reduction", "Neutralization", "Ionization"], ans: 1 },
    { q: "Strong acid fully ionize hota hai — misaal:", opts: ["Acetic acid", "Carbonic acid", "Hydrochloric acid", "Citric acid"], ans: 2 },
    { q: "Periodic table mein periods kya hain?", opts: ["Vertical columns", "Horizontal rows", "Diagonal lines", "Circles"], ans: 1 },
    { q: "Mole mein atoms ki tadad?", opts: ["6.022×10²³", "1000", "100", "6.022×10²⁶"], ans: 0 },
    { q: "Exothermic reaction mein:", opts: ["Energy absorb hoti hai", "Energy release hoti hai", "Temperature girti hai", "Bond banta nahi"], ans: 1 },
    { q: "Base ka pH hota hai:", opts: ["0-7", "7-14", "Sirf 7", "0-14"], ans: 1 },
    { q: "Rusting ek misaal hai:", opts: ["Physical change", "Oxidation", "Reduction", "Neutralization"], ans: 1 },
    { q: "Isotopes mein kya same hota hai?", opts: ["Neutrons", "Mass number", "Atomic number", "Weight"], ans: 2 },
  ],
  Biology: [
    { q: "Photosynthesis mein konsi gas release hoti hai?", opts: ["CO₂", "N₂", "O₂", "H₂"], ans: 2 },
    { q: "DNA ki full form kya hai?", opts: ["Deoxyribose Nucleic Acid", "Deoxyribonucleic Acid", "Di-Nucleic Acid", "Dynamic Nucleic Acid"], ans: 1 },
    { q: "Cell ka power house kaunsa hai?", opts: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"], ans: 2 },
    { q: "Blood groups discover karne wale kaun hain?", opts: ["Darwin", "Mendel", "Landsteiner", "Pasteur"], ans: 2 },
    { q: "Human body mein kitni bones hain?", opts: ["206", "216", "196", "186"], ans: 0 },
    { q: "Insulin kaun banata hai?", opts: ["Liver", "Kidney", "Pancreas", "Thyroid"], ans: 2 },
    { q: "Osmosis mein kya move karta hai?", opts: ["Solute", "Water", "Both", "Neither"], ans: 1 },
    { q: "Meiosis se kitne cells bante hain?", opts: ["2", "4", "8", "16"], ans: 1 },
    { q: "Bacteria ka scientific name:", opts: ["Prokaryote", "Eukaryote", "Protista", "Fungi"], ans: 0 },
    { q: "Green color in plants kis se aata hai?", opts: ["Carotene", "Chlorophyll", "Xanthophyll", "Anthocyanin"], ans: 1 },
    { q: "Heart mein kitne chambers hote hain?", opts: ["2", "3", "4", "5"], ans: 2 },
    { q: "Respiration ka equation kya hai?", opts: ["C₆H₁₂O₆ + O₂ → CO₂ + H₂O", "CO₂ + H₂O → C₆H₁₂O₆", "O₂ → CO₂", "H₂O → O₂"], ans: 0 },
    { q: "Neurons kahan hote hain?", opts: ["Muscles", "Nervous system", "Blood", "Bones"], ans: 1 },
    { q: "Chromosomes mein kya hota hai?", opts: ["Proteins only", "DNA + Proteins", "RNA only", "Lipids"], ans: 1 },
    { q: "Virus mein kya nahi hota?", opts: ["DNA", "Protein coat", "Cell wall", "RNA"], ans: 2 },
    { q: "Largest cell in human body:", opts: ["Red blood cell", "Neuron", "Egg cell", "Liver cell"], ans: 2 },
    { q: "Evolution theory kisne di?", opts: ["Mendel", "Darwin", "Lamarck", "Watson"], ans: 1 },
    { q: "Skin ka function kya hai?", opts: ["Digestion", "Protection", "Respiration", "Reproduction"], ans: 1 },
    { q: "Enzyme kya hota hai?", opts: ["Carbohydrate", "Lipid", "Protein catalyst", "Hormone"], ans: 2 },
    { q: "Kidneys ka main function:", opts: ["Digestion", "Filtration of blood", "Hormone production", "Oxygen supply"], ans: 1 },
  ],
};

function getMockQuestions(subject, qty) {
  const pool = MOCK_QUESTIONS[subject] || MOCK_QUESTIONS['Physics'];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(qty, shuffled.length));
}

function initQuiz() {
  const quizSelectView = document.getElementById('quizSelectView');
  const quizLoadingView = document.getElementById('quizLoadingView');
  const quizActiveView = document.getElementById('quizActiveView');
  const quizResultsView = document.getElementById('quizResultsView');
  const quizGenerateBtn = document.getElementById('quizGenerateBtn');
  const quizPrevBtn = document.getElementById('quizPrevBtn');
  const quizNextBtn = document.getElementById('quizNextBtn');
  const quizRestartBtn = document.getElementById('quizRestartBtn');
  const quizProgressLabel = document.getElementById('quizProgressLabel');
  const quizProgressFill = document.getElementById('quizProgressFill');
  const quizQuestionText = document.getElementById('quizQuestionText');
  const quizOptionList = document.getElementById('quizOptionList');
  const quizScoreNum = document.getElementById('quizScoreNum');
  const quizScoreOf = document.getElementById('quizScoreOf');
  const quizResultsMsg = document.getElementById('quizResultsMsg');
  const quizAwardIcon = document.getElementById('quizAwardIcon');
  const quizBreakdown = document.getElementById('quizBreakdown');

  function showView(view) {
    [quizSelectView, quizLoadingView, quizActiveView, quizResultsView].filter(Boolean).forEach(v => v.classList.remove('visible'));
    view.classList.add('visible');
  }

  // Qty buttons
  document.getElementById('quizQtyRow').querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('quizQtyRow').querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.quizQty = parseInt(btn.dataset.qty);
    });
  });

  // Generate
  quizGenerateBtn.addEventListener('click', async () => {
    const subject = document.getElementById('quizSubject').value;

    // Hide all quiz views first
    quizSelectView.classList.remove('visible');
    quizResultsView.classList.remove('visible');

    // Simulate loading without overlay
    await new Promise(r => setTimeout(r, 800));

    state.quizQuestions = getMockQuestions(subject, state.quizQty);
    state.quizAnswers = {};
    state.quizCurrent = 0;
    renderQuizQuestion();

    // Show active quiz view
    showView(quizActiveView);
  });

  function renderQuizQuestion() {
    const idx = state.quizCurrent;
    const q = state.quizQuestions[idx];
    const total = state.quizQuestions.length;

    quizProgressLabel.textContent = `Question ${idx + 1} of ${total}`;
    quizProgressFill.style.width = `${((idx + 1) / total) * 100}%`;
    quizQuestionText.textContent = q.q;
    quizPrevBtn.disabled = idx === 0;

    const answered = state.quizAnswers[idx] !== undefined;
    quizNextBtn.textContent = idx === total - 1 ? 'Natija Dekho' : 'Agla';
    if (idx === total - 1) {
      quizNextBtn.innerHTML = `Natija Dekho <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1rem;height:1rem;"><path d="m9 18 6-6-6-6"/></svg>`;
    } else {
      quizNextBtn.innerHTML = `Agla <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1rem;height:1rem;"><path d="m9 18 6-6-6-6"/></svg>`;
    }

    // Render options
    quizOptionList.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn animate-fade-in-up';
      btn.style.animationDelay = `${i * 60}ms`;
      btn.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;
      if (answered) {
        if (i === q.ans) btn.classList.add('correct');
        else if (i === state.quizAnswers[idx]) btn.classList.add('incorrect');
      } else {
        btn.addEventListener('click', () => selectOption(idx, i));
      }
      quizOptionList.appendChild(btn);
    });
  }

  function selectOption(qIdx, optIdx) {
    state.quizAnswers[qIdx] = optIdx;
    renderQuizQuestion(); // re-render with color feedback

    // Smooth haptic-like feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  quizPrevBtn.addEventListener('click', () => {
    if (state.quizCurrent > 0) {
      state.quizCurrent--;
      renderQuizQuestion();
    }
  });

  quizNextBtn.addEventListener('click', () => {
    if (state.quizCurrent < state.quizQuestions.length - 1) {
      state.quizCurrent++;
      renderQuizQuestion();
    } else {
      showResults();
    }
  });

  function showResults() {
    const total = state.quizQuestions.length;
    const correct = state.quizQuestions.filter((q, i) => state.quizAnswers[i] === q.ans).length;
    const pct = Math.round((correct / total) * 100);

    quizScoreNum.textContent = correct;
    quizScoreOf.textContent = total;

    let msg, icon;
    if (pct >= 90) { msg = 'Zabardast! Topper level performance! 🎉'; icon = '🏆'; }
    else if (pct >= 70) { msg = 'Bahut acha! Thodi aur practice karo! 👍'; icon = '🥈'; }
    else if (pct >= 50) { msg = 'Theek hai, lekin revision zaroori hai! 📚'; icon = '📖'; }
    else { msg = 'Aur mehnat karo — tum kar sakte ho! 💪'; icon = '💪'; }

    quizResultsMsg.textContent = msg;
    quizAwardIcon.textContent = icon;

    // Breakdown
    quizBreakdown.innerHTML = '<h3 style="font-size:0.9375rem;margin-bottom:0.75rem;">Answer Breakdown</h3>';
    state.quizQuestions.forEach((q, i) => {
      const userAns = state.quizAnswers[i];
      const isRight = userAns === q.ans;
      const item = document.createElement('div');
      item.className = `breakdown-item ${isRight ? 'is-correct' : 'is-wrong'}`;
      item.innerHTML = `
        <div style="font-weight:600;margin-bottom:0.25rem;">${i + 1}. ${q.q}</div>
        <div style="color:var(--text-muted);">
          ${isRight ? '✅' : '❌'} Tumhara jawab: <strong>${userAns !== undefined ? q.opts[userAns] : 'Nahi diya'}</strong>
          ${!isRight ? ` | Sahi jawab: <strong>${q.opts[q.ans]}</strong>` : ''}
        </div>`;
      quizBreakdown.appendChild(item);
    });

    showView(quizResultsView);

    // Confetti for good score
    if (pct >= 70 && typeof confetti !== 'undefined') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  }

  quizRestartBtn.addEventListener('click', () => {
    state.quizQuestions = [];
    state.quizAnswers = {};
    state.quizCurrent = 0;
    quizBreakdown.innerHTML = '';
    showView(quizSelectView);
  });
}

// ── 9. PAPER GENERATOR PANEL ─────────────────────────────────
const CHAPTER_COUNTS = {
  "Class 9": { Physics: 9, Chemistry: 8, Biology: 9, Mathematics: 17, "Computer Science": 8, English: 12, Urdu: 10, Islamiat: 7, "Pakistan Studies": 5, "General Science": 8 },
  "Class 10": { Physics: 9, Chemistry: 8, Biology: 9, Mathematics: 13, "Computer Science": 6, English: 13, Urdu: 10, Islamiat: 7, "Pakistan Studies": 5, "General Science": 8 },
  "Class 11 (1st Year)": { Physics: 11, Chemistry: 11, Biology: 14, Mathematics: 14, "Computer Science": 12, English: 15, Urdu: 12, Islamiat: 8, "Pakistan Studies": 7, "General Science": 8 },
  "Class 12 (2nd Year)": { Physics: 10, Chemistry: 11, Biology: 13, Mathematics: 7, "Computer Science": 10, English: 12, Urdu: 10, Islamiat: 8, "Pakistan Studies": 7, "General Science": 8 },
};

function initPaperGenerator() {
  const paperClass = document.getElementById('paperClass');
  const paperSubject = document.getElementById('paperSubject');
  const paperBoard = document.getElementById('paperBoard');
  const paperType = document.getElementById('paperType');
  const paperLang = document.getElementById('paperLanguage');
  const paperMarks = document.getElementById('paperMarks');
  const paperInstr = document.getElementById('paperInstructions');
  const chkTemplate = document.getElementById('paperTemplateCheck');
  const templateLbl = document.getElementById('paperTemplateLabel');
  const chapterHint = document.getElementById('chapterHint');
  const chaptersWrap = document.getElementById('chaptersWrap');
  const paperCountIn = document.getElementById('paperCount');
  const genBtn = document.getElementById('paperGenerateBtn');
  const genBtnTxt = document.getElementById('paperGenerateTxt');
  const previewEmpty = document.getElementById('previewEmpty');
  const previewCont = document.getElementById('previewContent');
  const variantTabs = document.getElementById('variantTabs');
  const a4Page = document.getElementById('a4Page');
  const printBtn = document.getElementById('printBtn');
  const pdfBtn = document.getElementById('pdfBtn');
  const saveHistBtn = document.getElementById('saveHistoryBtn');
  const resetChsBtn = document.getElementById('paperResetChs');

  // Number-of-papers qty buttons
  document.querySelectorAll('[data-papers]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-papers]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.paperCount = parseInt(btn.dataset.papers);
      paperCountIn.value = state.paperCount;
      genBtnTxt.textContent = `Generate ${state.paperCount} Paper${state.paperCount > 1 ? 's' : ''}`;
    });
  });

  // Chapter grid
  function buildChapterGrid() {
    const cls = paperClass.value;
    const sub = paperSubject.value;
    const count = (CHAPTER_COUNTS[cls] || {})[sub] || 10;
    state.selectedChapters = [];
    chaptersWrap.innerHTML = '';
    for (let i = 1; i <= count; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ch-btn animate-fade-in';
      btn.style.animationDelay = `${i * 25}ms`;
      btn.textContent = `Ch ${i}`;
      btn.dataset.ch = i;
      btn.addEventListener('click', () => {
        if (state.selectedChapters.includes(i)) {
          state.selectedChapters = state.selectedChapters.filter(x => x !== i);
          btn.classList.remove('active');
        } else {
          state.selectedChapters.push(i);
          state.selectedChapters.sort((a, b) => a - b);
          btn.classList.add('active');
        }
        updateChapterHint();
      });
      chaptersWrap.appendChild(btn);
    }
    updateChapterHint();
  }

  function updateChapterHint() {
    if (state.selectedChapters.length === 0) {
      chapterHint.textContent = 'Puri book (All Chapters) select ho gayi hai';
    } else {
      chapterHint.textContent = `${state.selectedChapters.length} chapter${state.selectedChapters.length > 1 ? 's' : ''} selected: ${state.selectedChapters.join(', ')}`;
    }
  }

  resetChsBtn.addEventListener('click', () => {
    state.selectedChapters = [];
    chaptersWrap.querySelectorAll('.ch-btn').forEach(b => b.classList.remove('active'));
    updateChapterHint();
  });

  // Board template label
  function updateTemplateLabel() {
    templateLbl.textContent = `Use exact ${paperBoard.value} template`;
  }
  paperBoard.addEventListener('change', updateTemplateLabel);
  paperClass.addEventListener('change', buildChapterGrid);
  paperSubject.addEventListener('change', buildChapterGrid);

  // Generate
  genBtn.addEventListener('click', handleGenerate);

  async function handleGenerate() {
    if (state.generating) return;
    const count = state.paperCount;
    state.generating = true;
    state.papers = [];
    setGeneratingState(true, 0, count);

    try {
      const chapters = state.selectedChapters.length > 0
        ? state.selectedChapters.map(n => `Chapter ${n}`)
        : 'all';

      for (let i = 1; i <= count; i++) {
        setGeneratingState(true, i, count);
        const resp = await fetch(`${API_BASE}/generate-paper`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classLevel: paperClass.value,
            subject: paperSubject.value,
            board: paperBoard.value,
            paperType: paperType.value,
            language: paperLang.value,
            totalMarks: paperMarks.value,
            instructions: paperInstr.value,
            paperVariant: i,
            useBoardTemplate: chkTemplate.checked,
            chapters,
          }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.error || 'Generation failed');
        state.papers.push(data.paper);
        renderPreviews();
      }
      toast.success(`${count} paper${count > 1 ? 's' : ''} ready!`);
    } catch (e) {
      const msg = e.message || 'Paper banane mein error';
      if (msg.includes('Rate limit')) toast.error('Bohat zyada requests — thora ruko');
      else if (msg.includes('credits')) toast.error('AI credits khatam ho gaye');
      else toast.error(msg);
    } finally {
      state.generating = false;
      setGeneratingState(false);
    }
  }

  function setGeneratingState(isGen, current = 0, total = 1) {
    const overlay = document.getElementById('paperLoadingOverlay');
    const loadingText = document.getElementById('paperLoadingText');
    const loadingSub = document.getElementById('paperLoadingSub');

    genBtn.disabled = isGen;
    if (isGen) {
      overlay.style.display = 'flex';
      loadingText.textContent = total > 1 ? `Generating Paper ${current}/${total}...` : 'Paper Generate Ho Raha Hai...';
      loadingSub.textContent = current === 1
        ? 'AI PCTB syllabus se questions bana raha hai...'
        : `${current}/${total} papers — thoda sabar karo...`;
    } else {
      overlay.style.display = 'none';
      const n = state.paperCount;
      genBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1rem;height:1rem;"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg><span id="paperGenerateTxt">Generate ${n} Paper${n > 1 ? 's' : ''}</span>`;
    }
  }

  let activePaperIndex = 0;

  function renderPreviews() {
    if (state.papers.length === 0) {
      previewEmpty.classList.remove('hidden');
      previewCont.classList.add('hidden');
      variantTabs.style.display = 'none';
      return;
    }
    previewEmpty.classList.add('hidden');
    previewCont.classList.remove('hidden');

    // Variant tabs
    if (state.papers.length > 1) {
      variantTabs.style.display = 'inline-flex';
      variantTabs.innerHTML = state.papers.map((_, i) =>
        `<button class="variant-tab ${i === activePaperIndex ? 'active' : ''}" data-variant="${i}">Paper ${i + 1}</button>`
      ).join('');
      variantTabs.querySelectorAll('.variant-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          activePaperIndex = parseInt(tab.dataset.variant);
          variantTabs.querySelectorAll('.variant-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          renderActiveVariant();
        });
      });
    } else {
      variantTabs.style.display = 'none';
    }
    renderActiveVariant();
  }

  function renderActiveVariant() {
    const paper = state.papers[activePaperIndex];
    if (!paper) return;
    const pages = paper.split('---PAGE_BREAK---');
    a4Page.innerHTML = pages.map(page => `
      <div class="a4-page">
        <div class="paper-a4">${typeof marked !== 'undefined' ? marked.parse(page) : page}</div>
      </div>`).join('');
  }

  // Print
  printBtn.addEventListener('click', () => window.print());

  // PDF download
  pdfBtn.addEventListener('click', async () => {
    const pages = a4Page.querySelectorAll('.a4-page');
    if (!pages.length) return;
    toast.info('PDF bana raha hai...');
    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      for (let i = 0; i < pages.length; i++) {
        const wrapper = document.createElement('div');
        Object.assign(wrapper.style, {
          position: 'fixed', left: '-99999px', top: '0',
          width: '210mm', background: '#ffffff', boxSizing: 'border-box', padding: '15mm',
        });
        const clone = pages[i].querySelector('.paper-a4').cloneNode(true);
        Object.assign(clone.style, { width: '100%', color: '#000', fontFamily: "'Times New Roman', Georgia, serif", fontSize: '11pt' });
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);
        const canvas = await html2canvas(wrapper, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
        document.body.removeChild(wrapper);
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
      }
      pdf.save(`${paperSubject.value}-${paperClass.value}-paper-${activePaperIndex + 1}.pdf`);
      toast.success('PDF download ho gaya!');
    } catch (e) {
      toast.error('PDF error: ' + e.message);
    }
  });

  // Save to history
  saveHistBtn.addEventListener('click', () => {
    const paper = state.papers[activePaperIndex];
    if (!paper) { toast.error('Pehle paper generate karo'); return; }
    const entry = {
      id: Date.now(),
      title: `${paperSubject.value} — ${paperClass.value}`,
      board: paperBoard.value,
      date: new Date().toLocaleDateString('en-PK'),
      paper,
    };
    state.history.unshift(entry);
    localStorage.setItem('pgHistory', JSON.stringify(state.history.slice(0, 50)));
    updateStats();
    toast.success('Paper saved to history!');
    renderHistory();
  });

  // Init
  buildChapterGrid();
  updateTemplateLabel();
}

// ── 10. HISTORY PANEL ────────────────────────────────────────
function initHistory() {
  renderHistory();
}

function renderHistory() {
  const emptyEl = document.getElementById('historyEmpty');
  const listEl = document.getElementById('historyList');
  if (!emptyEl || !listEl) return;

  if (state.history.length === 0) {
    emptyEl.classList.remove('hidden');
    listEl.classList.add('hidden');
    return;
  }
  emptyEl.classList.add('hidden');
  listEl.classList.remove('hidden');

  listEl.innerHTML = state.history.map(item => `
    <div class="history-item animate-fade-in-up" data-id="${item.id}">
      <div class="history-item-info">
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.board)} • ${item.date}</p>
      </div>
      <div class="history-item-actions">
        <button class="btn-outline btn-sm" data-action="view" data-id="${item.id}" aria-label="View paper">View</button>
        <button class="btn-primary btn-sm" data-action="download" data-id="${item.id}" aria-label="Download paper PDF" style="padding:0.375rem 0.75rem;font-size:0.75rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:0.75rem;height:0.75rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          PDF
        </button>
        <button class="btn-outline btn-sm" data-action="delete" data-id="${item.id}" aria-label="Delete paper" style="color:var(--red);border-color:var(--red);">Delete</button>
      </div>
    </div>`).join('');

  listEl.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      if (btn.dataset.action === 'view') viewHistoryPaper(id);
      else if (btn.dataset.action === 'download') downloadHistoryPaper(id);
      else if (btn.dataset.action === 'delete') deleteHistoryPaper(id);
    });
  });
}

function viewHistoryPaper(id) {
  const item = state.history.find(h => h.id === id);
  if (!item) return;
  document.getElementById('paperViewTitle').textContent = item.title;
  const content = document.getElementById('paperViewContent');
  const pages = item.paper.split('---PAGE_BREAK---');
  content.innerHTML = pages.map(page => `
    <div class="a4-page">
      <div class="paper-a4">${typeof marked !== 'undefined' ? marked.parse(page) : page}</div>
    </div>`).join('');
  openModal('paper-view');
}

function deleteHistoryPaper(id) {
  state.history = state.history.filter(h => h.id !== id);
  localStorage.setItem('pgHistory', JSON.stringify(state.history));
  updateStats();
  renderHistory();
  toast.info('Paper delete ho gaya');
}

async function downloadHistoryPaper(id) {
  const item = state.history.find(h => h.id === id);
  if (!item) { toast.error('Paper nahi mila'); return; }
  toast.info('PDF bana raha hai...');

  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pages = item.paper.split('---PAGE_BREAK---');

    for (let i = 0; i < pages.length; i++) {
      const wrapper = document.createElement('div');
      Object.assign(wrapper.style, {
        position: 'fixed', left: '-99999px', top: '0',
        width: '210mm', background: '#ffffff', boxSizing: 'border-box', padding: '15mm',
      });
      const content = document.createElement('div');
      content.style.cssText = 'font-family:\'Times New Roman\',Georgia,serif;font-size:11pt;line-height:1.5;color:#000;width:100%;';
      content.innerHTML = typeof marked !== 'undefined' ? marked.parse(pages[i]) : pages[i];
      wrapper.appendChild(content);
      document.body.appendChild(wrapper);
      const canvas = await html2canvas(wrapper, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      document.body.removeChild(wrapper);
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
    }

    const title = item.title.replace(/[^a-zA-Z0-9]/g, '-');
    pdf.save(`${title}-paper.pdf`);
    toast.success('PDF download ho gaya!');
  } catch (e) {
    toast.error('PDF error: ' + e.message);
  }
}

// ── 11. SETTINGS PANEL ───────────────────────────────────────
function initSettings() {
  const themeToggle = document.getElementById('themeToggle');
  const motionToggle = document.getElementById('motionToggle');
  const clearBtn = document.getElementById('clearCacheBtn');
  const themeSub = document.getElementById('themeSub');

  // Apply initial state
  if (state.theme === 'dark') {
    themeToggle.classList.add('on');
    themeToggle.setAttribute('aria-checked', 'true');
    if (themeSub) themeSub.textContent = 'Raat wala dark theme on hai';
  } else {
    themeToggle.classList.remove('on');
    themeToggle.setAttribute('aria-checked', 'false');
    if (themeSub) themeSub.textContent = 'Din wala light theme on hai';
  }

  if (state.reduceMotion) {
    motionToggle.classList.add('on');
    motionToggle.setAttribute('aria-checked', 'true');
  }

  themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', state.theme);
    applyTheme();
    const isDark = state.theme === 'dark';
    themeToggle.classList.toggle('on', isDark);
    themeToggle.setAttribute('aria-checked', isDark ? 'true' : 'false');
    if (themeSub) themeSub.textContent = isDark ? 'Raat wala dark theme on hai' : 'Din wala light theme on hai';
  });

  themeToggle.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); themeToggle.click(); }
  });

  motionToggle.addEventListener('click', () => {
    state.reduceMotion = !state.reduceMotion;
    localStorage.setItem('reduceMotion', state.reduceMotion);
    applyTheme();
    motionToggle.classList.toggle('on', state.reduceMotion);
    motionToggle.setAttribute('aria-checked', state.reduceMotion ? 'true' : 'false');
  });

  motionToggle.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); motionToggle.click(); }
  });

  clearBtn.addEventListener('click', () => {
    if (!confirm('Tamam saved papers aur settings delete ho jayengi. Confirm?')) return;
    localStorage.clear();
    state.history = [];
    state.theme = 'dark';
    state.reduceMotion = false;
    applyTheme();
    themeToggle.classList.add('on');
    themeToggle.setAttribute('aria-checked', 'true');
    if (themeSub) themeSub.textContent = 'Raat wala dark theme on hai';
    motionToggle.classList.remove('on');
    motionToggle.setAttribute('aria-checked', 'false');
    renderHistory();
    updateStats();
    toast.success('Cache clear ho gaya!');
  });
}

// ── 12. CONTACT FORM HANDLER ─────────────────────────────────
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  const btn = document.getElementById('contactSendBtn');
  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');

  if (!name || !email || !message) {
    toast.error('Please fill all fields');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `${spinnerHTML()} Sending...`;

  // Use mailto: as a simple fallback (opens user's email client)
  const mailtoLink = `mailto:zzawar521@gmail.com?subject=PaperGenAI Contact - ${encodeURIComponent(name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;

  // Simulate send delay then show success
  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
    toast.success('Message bhej diya gaya!');

    // Open email client as fallback
    window.open(mailtoLink, '_blank');

    btn.disabled = false;
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1rem;height:1rem;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message`;

    // Reset after closing modal
    setTimeout(() => {
      form.style.display = '';
      success.style.display = 'none';
      document.getElementById('contactName').value = '';
      document.getElementById('contactEmail').value = '';
      document.getElementById('contactMessage').value = '';
    }, 5000);
  }, 1500);
}

// ── 13. BOOTSTRAP ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHome();
  initChatbot();
  initQuiz();
  initPaperGenerator();
  initHistory();
  initSettings();

  // Session timer on visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateStats();
  });
});
