
(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- 1. THEME ---------- */
  const themeToggle = $('#themeToggle');
  const syncThemeButton = () => {
    themeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀' : '☾';
  };
  syncThemeButton();
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light'); } catch (e) {}
    syncThemeButton();
  });

  /* ---------- 2. MOBILE NAV ---------- */
  const menuToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  const closeMobileMenu = () => {
    mobileMenu.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(!isHidden));
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMobileMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeMobileMenu();
  });

  /* ---------- 3. SCROLL PROGRESS ---------- */
  const scrollProgress = $('#scrollProgress');
  let scrollScheduled = false;
  const updateProgress = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    scrollProgress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    scrollScheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(updateProgress);
    }
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

  /* ---------- 7. CONTACT ---------- */
  const contactForm = $('#contactForm');
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const subject = encodeURIComponent('Portfolio enquiry from ' + data.get('name'));
    const body = encodeURIComponent(
      'Name: ' + data.get('name') + '\nEmail: ' + data.get('email') + '\n\n' + data.get('message')
    );
    window.location.href = 'mailto:bridgette.kimotho@gmail.com?subject=' + subject + '&body=' + body;
  });

  /* ---------- 8. MISC ---------- */
  $('#year').textContent = new Date().getFullYear();
  $$('[data-placeholder-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      alert('Replace this link with your real project, GitHub or social URL.');
    });
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

  /* ---------- 10. TYPING ANIMATION ON NAME ---------- */
  const nameEl = $('#typedName');
  if (nameEl) {
    const fullName = nameEl.textContent.trim() || 'Bridgette Kimotho';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      nameEl.textContent = fullName;
    } else {
      nameEl.textContent = '';
      let i = 0;

      function typeNext() {
        if (i >= fullName.length) return;
        nameEl.textContent += fullName.charAt(i);
        i++;
        setTimeout(typeNext, 70 + Math.random() * 60);
      }

      setTimeout(typeNext, 400);
    }
  }

  /* ---------- 11. CHATBOT ---------- */
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
    chatWindow.classList.add('open');
    chatWindow.setAttribute('aria-hidden', 'false');
    chatToggle.setAttribute('aria-expanded', 'true');
    chatToggle.classList.add('open');
    chatIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    if (window.innerWidth < 640) document.body.classList.add('chat-open');
    setTimeout(() => {
      if (window.innerWidth >= 640) chatInput.focus();
    }, 300);
  }
  function closeChat() {
    chatOpen = false;
    chatWindow.classList.remove('open');
    chatWindow.setAttribute('aria-hidden', 'true');
    chatToggle.setAttribute('aria-expanded', 'false');
    chatToggle.classList.remove('open');
    chatIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    document.body.classList.remove('chat-open');
    stopSpeaking();
  }
  window.closeChat = closeChat;

  chatToggle.addEventListener('click', () => (chatOpen ? closeChat() : openChat()));
  chatClose.addEventListener('click', closeChat);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && chatOpen) closeChat();
  });

  voiceSettings.addEventListener('click', () => {
    const open = voicePanel.hasAttribute('hidden');
    if (open) voicePanel.removeAttribute('hidden');
    else voicePanel.setAttribute('hidden', '');
    voiceSettings.setAttribute('aria-expanded', String(open));
  });

  /* ---------- Bubble helpers ---------- */
  const escapeHtml = str => String(str).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function addBubble(text, who) {
    const div = document.createElement('div');
    div.className = 'chat-bubble ' + (who || 'bot');
    div.innerHTML = (who === 'user') ? escapeHtml(text) : text;
    chatMessages.appendChild(div);
    requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; });
    return div;
  }
  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-bubble bot';
    div.id = 'typingIndicator';
    div.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
    chatMessages.appendChild(div);
    requestAnimationFrame(() => { chatMessages.scrollTop = chatMessages.scrollHeight; });
  }
  const hideTyping = () => { const t = $('#typingIndicator'); if (t) t.remove(); };

  /* ---------- Knowledge base ---------- */
  const knowledge = [
    { keys: ['skill', 'tech', 'stack', 'language', 'framework', 'tool', 'what can you', 'technologies'],
      reply: `Bridgette works with:<br><br>
<strong>Frontend:</strong> HTML5, CSS3, JavaScript, Tailwind CSS, Bootstrap, Vue.js, React<br>
<strong>Backend:</strong> PHP/Laravel, Node.js/Express, MySQL, MongoDB, REST APIs<br>
<strong>Tools:</strong> Git/GitHub, Vite, Postman, Flutter/Dart (learning)<br><br>
Her strongest areas are Laravel, Vue.js and modern frontend development.` },
    { keys: ['project', 'built', 'portfolio', 'techhaven', 'freelanceflow', 'student'],
      reply: `Here are her main projects:<br><br>
<strong>TechHaven</strong> (Completed) — Electronics e-commerce site built with React, Tailwind &amp; JavaScript.<br><br>
<strong>FreelanceFlow</strong> (Completed) — Freelance management &amp; invoicing app using Laravel + Vue.js.<br><br>
<strong>Student Management System</strong> (In progress) — Laravel app for organizing student &amp; school data.<br><br>
See more in the <a href="#projects" class="underline text-violet-600" onclick="closeChat()">Projects section</a>.` },
    { keys: ['available', 'hire', 'job', 'internship', 'role', 'open to', 'looking for'],
      reply: `Yes! Bridgette is <strong>open to junior developer roles and internships</strong>. She's based in Nairobi, Kenya and ready to contribute, learn and grow with a team.<br><br>
Feel free to reach out via the contact form or email her directly.` },
    { keys: ['contact', 'email', 'reach', 'talk', 'get in touch', 'phone'],
      reply: `You can contact Bridgette at:<br><br>
✉ <a href="mailto:bridgette.kimotho@gmail.com" class="underline text-violet-600">bridgette.kimotho@gmail.com</a><br>
⌖ Nairobi, Kenya<br><br>
Or use the <a href="#contact" class="underline text-violet-600" onclick="closeChat()">contact form</a> on this page.` },
    { keys: ['about', 'who', 'background', 'story', 'yourself', 'introduce'],
      reply: `Bridgette is a junior full-stack developer who learns by shipping. She enjoys building accessible interfaces, connecting frontend to backend, and writing maintainable code.<br><br>
Her focus areas are Laravel, Vue.js, React and modern frontend craft.` },
    { keys: ['education', 'study', 'school', 'learn', 'course', 'training', 'diploma', 'certificate', 'institute'],
      reply: `Bridgette studies at the <strong>Institute of Software Technology</strong>:<br><br>
📜 <strong>Certificate in Software Development</strong> — completed 2025<br>
🎓 <strong>Diploma in Software Development</strong> — in progress, 2025–2026<br><br>
Her coursework covers frontend frameworks, backend development, databases, REST APIs and mobile fundamentals.` },
    { keys: ['location', 'where', 'nairobi', 'kenya', 'based', 'live'],
      reply: `Bridgette is based in <strong>Nairobi, Kenya</strong>. She's open to remote opportunities as well as roles in the region.` },
    { keys: ['hello', 'hi ', 'hey', 'good morning', 'good afternoon', 'good evening'],
      reply: `Hey there! 👋 How can I help you learn more about Bridgette? You can ask about her skills, projects, availability or how to get in touch.` },
    { keys: ['thank', 'cool', 'great', 'awesome', 'nice'],
      reply: `You're welcome! If you have any other questions about Bridgette's work or want to connect, just ask. 😊` },
    { keys: ['cv', 'resume', 'download'],
      reply: `You can download Bridgette's CV here: <a href="Bridgette_Kimotho_CV.pdf" class="underline text-violet-600" target="_blank" rel="noopener">Download CV ↓</a>` }
  ];

  const fallback = `I'm not sure I understood that. Try asking about:<br>
• Skills &amp; tech stack<br>
• Projects she's built<br>
• Availability for roles<br>
• How to contact her<br>
• Her education or background`;

  function getReply(msg) {
    const lower = ' ' + msg.toLowerCase() + ' ';
    for (const item of knowledge) {
      if (item.keys.some(k => lower.includes(k))) return item.reply;
    }
    return fallback;
  }

  function handleUserMessage(text) {
    if (!text || !text.trim()) return;
    stopSpeaking();
    addBubble(text.trim(), 'user');
    chatInput.value = '';
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

  chatForm.addEventListener('submit', e => {
    e.preventDefault();
    handleUserMessage(chatInput.value);
  });

  $$('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => handleUserMessage(chip.dataset.q));
  });

  /* ---------- 12. TEXT TO SPEECH ---------- */
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
    voiceToggleBtn.setAttribute('aria-pressed', String(voiceEnabled));
    voiceToggleBtn.textContent = voiceEnabled ? '🔊 Voice answers: On' : '🔇 Voice answers: Off';
  }
  function stopSpeaking() {
    if (synth) synth.cancel();
    setVoiceStatus('');
  }
  function populateVoices() {
    if (!synth) return;
    const all = synth.getVoices();
    if (!all.length) return;
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
      if (savedRate) {
        voiceRateEl.value = savedRate;
        voiceRateVal.textContent = Number(savedRate).toFixed(1) + '×';
      }
    } catch (e) {}
  }
  function speakReply(html) {
    if (!voiceEnabled || !synth) return;
    synth.cancel();
    const plain = String(html)
      .replace(/<br\s*\/?>/gi, '. ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, ' and ')
      .replace(/&lt;/gi, ' ')
      .replace(/&gt;/gi, ' ')
      .replace(/[•·]/g, ', ')
      .replace(/[↗↓✉⌖👋😊📜🎓🔊🔇]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!plain) return;
    const utter = new SpeechSynthesisUtterance(plain);
    const chosen = voices.find(v => v.name === voiceSelectEl.value);
    if (chosen) utter.voice = chosen;
    utter.rate = parseFloat(voiceRateEl.value) || 1;
    utter.pitch = 1;
    utter.onstart = () => setVoiceStatus('Speaking…');
    utter.onend   = () => setVoiceStatus('');
    utter.onerror = () => setVoiceStatus('');
    synth.speak(utter);
  }

  if (!synth) {
    voiceToggleBtn.disabled = true;
    voiceToggleBtn.textContent = '🔇 Voice not supported';
    voiceSelectEl.disabled = true;
  } else {
    updateVoiceToggleUI();
    populateVoices();
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', populateVoices);
    }
    setTimeout(populateVoices, 400);
  }
  voiceToggleBtn.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    try { localStorage.setItem('portfolio-voice-enabled', voiceEnabled ? 'on' : 'off'); } catch (e) {}
    updateVoiceToggleUI();
    if (!voiceEnabled) stopSpeaking();
  });
  voiceSelectEl.addEventListener('change', () => {
    try { localStorage.setItem('portfolio-voice-name', voiceSelectEl.value); } catch (e) {}
  });
  voiceRateEl.addEventListener('input', () => {
    voiceRateVal.textContent = Number(voiceRateEl.value).toFixed(1) + '×';
    try { localStorage.setItem('portfolio-voice-rate', voiceRateEl.value); } catch (e) {}
  });

  /* ---------- 13. SPEECH TO TEXT ---------- */
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
      voiceInputBtn.classList.add('listening');
      voiceInputBtn.setAttribute('aria-label', 'Stop voice input');
      setVoiceStatus('Listening… speak now');
    };
    recognition.onresult = e => {
      const t = e.results[0][0].transcript;
      chatInput.value = t;
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
      voiceInputBtn.classList.remove('listening');
      voiceInputBtn.setAttribute('aria-label', 'Start voice input');
      setTimeout(() => setVoiceStatus(''), 2500);
    };
  } else {
    voiceInputBtn.disabled = true;
    voiceInputBtn.setAttribute('aria-disabled', 'true');
    voiceInputBtn.title = 'Voice input is not supported in this browser';
  }
  voiceInputBtn.addEventListener('click', () => {
    if (!recognition) return;
    if (listening) { recognition.stop(); return; }
    stopSpeaking();
    try { recognition.start(); } catch (e) {}
  });

  window.addEventListener('beforeunload', () => { if (synth) synth.cancel(); });

})();
