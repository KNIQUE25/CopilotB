(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- 1. THEME ---------- */
  const themeToggle = $('#themeToggle');
  const syncThemeButton = () => {
    if (!themeToggle) return;
    themeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀' : '☾';
  };
  syncThemeButton();
  themeToggle && themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light'); } catch (e) {}
    syncThemeButton();
  });

  /* ---------- 2. MOBILE NAV ---------- */
  const menuToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  const closeMobileMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle && menuToggle.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(!isHidden));
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMobileMenu));
  window.addEventListener('resize', () => { if (window.innerWidth >= 1024) closeMobileMenu(); });

  /* ---------- 3. SCROLL PROGRESS ---------- */
  const scrollProgress = $('#scrollProgress');
  let scrollScheduled = false;
  const updateProgress = () => {
    if (!scrollProgress) return;
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    scrollProgress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    scrollScheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  /* ---------- 4. REVEAL ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- 5. SKILL FILTERS ---------- */
  const skillFilters = $$('.skill-filter');
  const skillCards   = $$('.skill-card');
  skillFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      skillFilters.forEach(b => {
        b.classList.remove('active', 'bg-violet-600', 'text-white');
        b.classList.add('border', 'border-slate-300', 'dark:border-slate-600');
      });
      btn.classList.add('active', 'bg-violet-600', 'text-white');
      btn.classList.remove('border', 'border-slate-300', 'dark:border-slate-600');
      skillCards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.classList.remove('visible');
          requestAnimationFrame(() => card.classList.add('visible'));
        }
      });
    });
  });

  /* ---------- 6. PROJECT FILTERS ---------- */
  const filterButtons = $$('.filter-btn');
  const projectCards  = $$('.project-card');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(b => {
        b.classList.remove('bg-violet-600', 'text-white');
        b.classList.add('border', 'border-slate-300', 'dark:border-slate-700');
      });
      button.classList.add('bg-violet-600', 'text-white');
      button.classList.remove('border', 'border-slate-300', 'dark:border-slate-700');
      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.status === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });

  /* ---------- 7. CONTACT FORM ---------- */
 const contactForm = $('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const payload = {
      name: data.get('name').toString().trim(),
      email: data.get('email').toString().trim(),
      message: data.get('message').toString().trim(),
    };

    if (!payload.name || !payload.email || !payload.message) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Show the success message
        const success = $('#contactSuccess');
        if (success) {
          success.classList.remove('hidden');
          success.classList.add('flex');
          clearTimeout(success._hideTimer);
          success._hideTimer = setTimeout(() => {
            success.classList.add('hidden');
            success.classList.remove('flex');
          }, 8000);
        }
        contactForm.reset(); // Clear the form
      } else {
        alert('Something went wrong. Please try again or email me directly.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}
  /* ---------- 8. MISC ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Alert only on true placeholder links (href="#")
  $$('[data-placeholder-link]').forEach(link => {
    const href = (link.getAttribute('href') || '').trim();
    if (href === '' || href === '#' || href === 'javascript:void(0)') {
      link.addEventListener('click', e => {
        e.preventDefault();
        alert('This link is a placeholder. Update it with your real URL in the HTML.');
      });
    }
  });

  /* ---------- 9. ACTIVE NAV ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link =>
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id)
      );
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  /* ---------- 10. TYPING ANIMATION ---------- */
  const nameEl = $('#typedName');
  if (nameEl) {
    const fullName = nameEl.textContent.trim() || 'Bridgette Kimotho';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      nameEl.textContent = fullName;
    } else {
      nameEl.textContent = '';
      let i = 0;
      const typeNext = () => {
        if (i >= fullName.length) return;
        nameEl.textContent += fullName.charAt(i);
        i++;
        setTimeout(typeNext, 70 + Math.random() * 60);
      };
      setTimeout(typeNext, 400);
    }
  }

  /* ---------- 11. SPEECH (TTS + STT) ---------- */
  const synth = ('speechSynthesis' in window) ? window.speechSynthesis : null;
  const voiceToggleBtn = $('#voiceToggle');
  const voiceSelectEl  = $('#voiceSelect');
  const voiceRateEl    = $('#voiceRate');
  const voiceRateVal   = $('#voiceRateValue');
  const voiceInputBtn  = $('#voiceInput');
  const voiceStatusEl  = $('#voiceStatus');

  let voiceEnabled = true;
  try { voiceEnabled = localStorage.getItem('portfolio-voice-enabled') !== 'off'; } catch (e) {}
  let voices = [];

  const setVoiceStatus = msg => { if (voiceStatusEl) voiceStatusEl.textContent = msg || ''; };

  function updateVoiceToggleUI() {
    if (!voiceToggleBtn) return;
    voiceToggleBtn.setAttribute('aria-pressed', String(voiceEnabled));
    voiceToggleBtn.textContent = voiceEnabled ? '🔊 Voice answers: On' : '🔇 Voice answers: Off';
  }

  function stopSpeaking() {
    try { if (synth) synth.cancel(); } catch (e) {}
    setVoiceStatus('');
  }

  function populateVoices() {
    if (!synth || !voiceSelectEl) return;
    const all = synth.getVoices();
    if (!all || !all.length) return;
    voices = all;
    voiceSelectEl.innerHTML = '<option value="">Default voice</option>';
    all.slice().sort((a, b) => {
      const aEn = /^en/i.test(a.lang) ? 0 : 1;
      const bEn = /^en/i.test(b.lang) ? 0 : 1;
      return aEn - bEn || a.name.localeCompare(b.name);
    }).forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = v.name + ' — ' + v.lang;
      voiceSelectEl.appendChild(opt);
    });
    try {
      const savedName = localStorage.getItem('portfolio-voice-name');
      if (savedName && voices.some(v => v.name === savedName)) voiceSelectEl.value = savedName;
      const savedRate = localStorage.getItem('portfolio-voice-rate');
      if (savedRate && voiceRateEl) {
        voiceRateEl.value = savedRate;
        if (voiceRateVal) voiceRateVal.textContent = Number(savedRate).toFixed(1) + '×';
      }
    } catch (e) {}
  }

  /* BUG FIX #2: don't speak if chat is closed */
  function speakReply(html) {
    if (!voiceEnabled || !synth || !chatOpen) return;
    synth.cancel();
    const plain = String(html)
      .replace(/<br\s*\/?>/gi, '. ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, ' and ')
      .replace(/&lt;/gi, ' ')
      .replace(/&gt;/gi, ' ')
      .replace(/[•·]/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!plain) return;
    const utter = new SpeechSynthesisUtterance(plain);
    const chosen = voiceSelectEl ? voices.find(v => v.name === voiceSelectEl.value) : null;
    if (chosen) utter.voice = chosen;
    utter.rate = voiceRateEl ? (parseFloat(voiceRateEl.value) || 1) : 1;
    utter.pitch = 1;
    utter.onstart = () => setVoiceStatus('Speaking…');
    utter.onend   = () => setVoiceStatus('');
    utter.onerror = () => setVoiceStatus('');
    try { synth.speak(utter); } catch (e) { setVoiceStatus(''); }
  }

  if (!synth) {
    if (voiceToggleBtn) { voiceToggleBtn.disabled = true; voiceToggleBtn.textContent = '🔇 Voice not supported'; }
    if (voiceSelectEl) voiceSelectEl.disabled = true;
  } else {
    updateVoiceToggleUI();
    populateVoices();
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', populateVoices);
    }
    setTimeout(populateVoices, 400);
  }

  voiceToggleBtn && voiceToggleBtn.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    try { localStorage.setItem('portfolio-voice-enabled', voiceEnabled ? 'on' : 'off'); } catch (e) {}
    updateVoiceToggleUI();
    if (!voiceEnabled) stopSpeaking();
  });

  voiceSelectEl && voiceSelectEl.addEventListener('change', () => {
    try { localStorage.setItem('portfolio-voice-name', voiceSelectEl.value); } catch (e) {}
  });

  voiceRateEl && voiceRateEl.addEventListener('input', () => {
    if (voiceRateVal) voiceRateVal.textContent = Number(voiceRateEl.value).toFixed(1) + '×';
    try { localStorage.setItem('portfolio-voice-rate', voiceRateEl.value); } catch (e) {}
  });

  /* ---------- 12. SPEECH-TO-TEXT ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let listening = false;

  if (SR) {
    recognition = new SR();
    recognition.lang = navigator.language || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      listening = true;
      if (voiceInputBtn) {
        voiceInputBtn.classList.add('listening');
        voiceInputBtn.setAttribute('aria-label', 'Stop voice input');
      }
      setVoiceStatus('Listening… speak now');
    };
    recognition.onresult = e => {
      /* BUG FIX #4: ignore transcripts that arrive after the chat closed */
      if (!chatOpen) return;
      const t = e.results[0][0].transcript;
      if (chatInput) chatInput.value = t;
      setVoiceStatus('Heard: "' + t + '"');
      handleUserMessage(t);
    };
    recognition.onerror = e => {
      const m = {
        'not-allowed': 'Microphone blocked. Allow access in your browser and try again.',
        'service-not-allowed': 'Speech service unavailable in this browser.',
        'no-speech': 'No speech detected. Try again.',
        'audio-capture': 'No microphone found.',
        'network': 'Network error during speech recognition.'
      };
      setVoiceStatus(m[e.error] || ('Voice input error: ' + e.error));
    };
    recognition.onend = () => {
      listening = false;
      if (voiceInputBtn) {
        voiceInputBtn.classList.remove('listening');
        voiceInputBtn.setAttribute('aria-label', 'Start voice input');
      }
      setTimeout(() => setVoiceStatus(''), 2500);
    };
  } else if (voiceInputBtn) {
    voiceInputBtn.disabled = true;
    voiceInputBtn.setAttribute('aria-disabled', 'true');
    voiceInputBtn.title = 'Voice input is not supported in this browser';
  }

  voiceInputBtn && voiceInputBtn.addEventListener('click', () => {
    if (!recognition) return;
    if (listening) { recognition.stop(); return; }
    stopSpeaking();
    try { recognition.start(); } catch (e) {}
  });

  window.addEventListener('beforeunload', () => { try { if (synth) synth.cancel(); } catch (e) {} });

  /* ---------- 13. CHATBOT ---------- */
  const chatToggle      = $('#chatbot-toggle');
  const chatWindow      = $('#chatbot-window');
  const chatClose       = $('#chatbot-close');
  const chatMessages    = $('#chatMessages');
  const chatForm        = $('#chatForm');
  const chatInput       = $('#chatInput');
  const chatIcon        = $('#chatIcon');
  const closeIcon       = $('#closeIcon');
  const chatSuggestions = $('#chatSuggestions');
  const voicePanel      = $('#voicePanel');
  const voiceSettings   = $('#voiceSettingsToggle');

  let chatOpen = false;

  function openChat() {
    chatOpen = true;
    if (!chatWindow) return;
    chatWindow.classList.add('open');
    chatWindow.setAttribute('aria-hidden', 'false');
    if (chatToggle) {
      chatToggle.setAttribute('aria-expanded', 'true');
      chatToggle.classList.add('open');
    }
    if (chatIcon) chatIcon.classList.add('hidden');
    if (closeIcon) closeIcon.classList.remove('hidden');

    /* BUG FIX #5: only show suggestions if chat history is just the greeting */
    if (chatSuggestions) {
      const hasHistory = chatMessages && chatMessages.children.length > 1;
      chatSuggestions.style.display = hasHistory ? 'none' : '';
    }

    if (window.innerWidth < 640) document.body.classList.add('chat-open');
    setTimeout(() => {
      if (window.innerWidth >= 640 && chatInput) chatInput.focus();
    }, 300);
  }

  function closeChat() {
    chatOpen = false;
    if (chatWindow) {
      chatWindow.classList.remove('open');
      chatWindow.setAttribute('aria-hidden', 'true');
    }
    if (chatToggle) {
      chatToggle.setAttribute('aria-expanded', 'false');
      chatToggle.classList.remove('open');
    }
    if (chatIcon) chatIcon.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
    document.body.classList.remove('chat-open');
    stopSpeaking();

    /* BUG FIX #1: stop the microphone so it doesn't keep recording */
    if (recognition && listening) {
      try { recognition.stop(); } catch (e) {}
    }
    setVoiceStatus('');
  }
  window.closeChat = closeChat;

  chatToggle && chatToggle.addEventListener('click', () => (chatOpen ? closeChat() : openChat()));
  chatClose && chatClose.addEventListener('click', closeChat);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && chatOpen) closeChat();
  });

  voiceSettings && voiceSettings.addEventListener('click', () => {
    if (!voicePanel) return;
    const open = voicePanel.hasAttribute('hidden');
    if (open) voicePanel.removeAttribute('hidden');
    else voicePanel.setAttribute('hidden', '');
    voiceSettings.setAttribute('aria-expanded', String(open));
  });

  // Close chat when internal anchors in bubbles are clicked
  chatMessages && chatMessages.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (a && chatWindow && chatWindow.contains(a)) {
      setTimeout(closeChat, 0);
    }
  });

  const escapeHtml = str => String(str).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function addBubble(text, who) {
    if (!chatMessages) return null;
    const div = document.createElement('div');
    div.className = 'chat-bubble ' + (who || 'bot');
    div.innerHTML = (who === 'user') ? escapeHtml(text) : text;
    chatMessages.appendChild(div);
    requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; });
    return div;
  }

  function showTyping() {
    if (!chatMessages) return;
    const div = document.createElement('div');
    div.className = 'chat-bubble bot';
    div.id = 'typingIndicator';
    div.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
    chatMessages.appendChild(div);
    requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; });
  }
  const hideTyping = () => { const t = $('#typingIndicator'); if (t) t.remove(); };

  /* Knowledge base — BUG FIX #3: greeting moved to the END so real questions win */
  const knowledge = [
    {
      patterns: [/\bskills?\b/i, /\btech\b/i, /\bstack\b/i, /\blanguages?\b/i, /\bframeworks?\b/i,
                 /\btools?\b/i, /\btechnolog(y|ies)\b/i, /what can you/i, /what does she know/i],
      reply: `Bridgette works with:<br><br>
<strong>Frontend:</strong> HTML5, CSS3, JavaScript, Tailwind CSS, Bootstrap, Vue.js, React<br>
<strong>Backend:</strong> PHP/Laravel, Node.js/Express, MySQL, MongoDB, REST APIs<br>
<strong>Tools:</strong> Git/GitHub, Vite, Postman, Flutter/Dart (learning)<br><br>
Her strongest areas are Laravel, Vue.js and modern frontend development.`
    },
    {
      patterns: [/\bprojects?\b/i, /\bbuilt\b/i, /\bportfolio\b/i, /techhaven/i, /freelanceflow/i,
                 /\bstudent/i, /what has she (built|made)/i],
      reply: `Here are her main projects:<br><br>
<strong>TechHaven</strong> (Completed) — Electronics e-commerce site built with React, Tailwind &amp; JavaScript.<br><br>
<strong>FreelanceFlow</strong> (Completed) — Freelance management &amp; invoicing app using Laravel + Vue.js.<br><br>
<strong>Student Management System</strong> (In progress) — Laravel app for organizing student &amp; school data.<br><br>
See more in the <a href="#projects">Projects section</a>.`
    },
    {
      patterns: [/\b(available|availability|hire|hiring|job|jobs|internship|intern|role|roles|position|open to work)\b/i],
      reply: `Yes! Bridgette is <strong>open to junior developer roles and internships</strong>. She's based in Nairobi, Kenya and ready to contribute, learn and grow with a team.<br><br>
Feel free to reach out via the <a href="#contact">contact form</a> or email her directly.`
    },
    {
      patterns: [/\bcontact\b/i, /\bemail\b/i, /\breach\b/i, /\bget in touch\b/i, /\bphone\b/i, /\bwhatsapp\b/i],
      reply: `You can contact Bridgette at:<br><br>
✉ <a href="mailto:bridgette.kimotho@gmail.com">bridgette.kimotho@gmail.com</a><br>
⌖ Nairobi, Kenya<br><br>
Or use the <a href="#contact">contact form</a> on this page.`
    },
    {
      patterns: [/\babout\b/i, /\bwho is\b/i, /\bbackground\b/i, /\bstory\b/i, /\bherself\b/i, /\bintroduce\b/i, /tell me about (her|bridgette)/i],
      reply: `Bridgette is a junior full-stack developer who learns by shipping. She enjoys building accessible interfaces, connecting frontend to backend, and writing maintainable code.<br><br>
Her focus areas are Laravel, Vue.js, React and modern frontend craft.`
    },
    {
      patterns: [/\beducation\b/i, /\bstudy\b/i, /\bschool\b/i, /\bcourse\b/i, /\btraining\b/i, /\bdiploma\b/i, /\bcertificate\b/i, /\binstitute\b/i, /where did she (study|learn)/i],
      reply: `Bridgette studies at the <strong>Institute of Software Technology</strong>:<br><br>
📜 <strong>Certificate in Software Development</strong> — completed 2025<br>
🎓 <strong>Diploma in Software Development</strong> — in progress, 2025–2026<br><br>
Her coursework covers frontend frameworks, backend development, databases, REST APIs and mobile fundamentals.`
    },
    {
      patterns: [/\blocation\b/i, /\bwhere\b/i, /\bnairobi\b/i, /\bkenya\b/i, /\bbased\b/i, /\blive\b/i],
      reply: `Bridgette is based in <strong>Nairobi, Kenya</strong>. She's open to remote opportunities as well as roles in the region.`
    },
    {
      patterns: [/\bcv\b/i, /\bresume\b/i, /\bdownload\b/i],
      reply: `You can download Bridgette's CV here: <a href="Bridgette_Kimotho_CV.pdf" target="_blank" rel="noopener">Download CV ↓</a>`
    },
    {
      patterns: [/\b(thanks?|thank you|appreciate|cool|great|awesome|nice)\b/i],
      reply: `You're welcome! If you have any other questions about Bridgette's work or want to connect, just ask. 😊`
    },
    {
      /* Greeting is LAST — real questions take priority */
      patterns: [/\b(hello|hi|hey|yo|good morning|good afternoon|good evening)\b/i],
      reply: `Hey there! 👋 How can I help you learn more about Bridgette? You can ask about her skills, projects, availability or how to get in touch.`
    }
  ];

  const fallback = `I'm not sure I understood that. Try asking about:<br>
• Skills &amp; tech stack<br>
• Projects she's built<br>
• Availability for roles<br>
• How to contact her<br>
• Her education or background`;

  function getReply(msg) {
    const text = String(msg || '').trim();
    if (!text) return fallback;
    for (const item of knowledge) {
      if (item.patterns.some(p => p.test(text))) return item.reply;
    }
    return fallback;
  }

  function handleUserMessage(text) {
    if (!text || !text.trim()) return;
    stopSpeaking();
    addBubble(text.trim(), 'user');
    if (chatInput) chatInput.value = '';
    if (chatSuggestions) chatSuggestions.style.display = 'none';

    showTyping();
    const delay = 500 + Math.random() * 600;
    setTimeout(() => {
      hideTyping();
      const reply = getReply(text);
      addBubble(reply, 'bot');
      speakReply(reply);
    }, delay);
  }

  chatForm && chatForm.addEventListener('submit', e => {
    e.preventDefault();
    handleUserMessage(chatInput ? chatInput.value : '');
  });

  $$('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => handleUserMessage(chip.dataset.q));
  });

})();