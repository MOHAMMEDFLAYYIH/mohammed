/* Mohammed Ihsan Portfolio - script.js */
let lang = 'ar';

/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  const nav = document.getElementById('navbar');
  setTimeout(() => {
    pre.classList.add('gone');
    nav.classList.add('show');
    // Animate hero elements
    document.querySelectorAll('.hero .h-anim').forEach((el, i) => {
      setTimeout(() => el.classList.add('vis'), i * 200 + 100);
    });
    // Float pills
    document.querySelectorAll('.float-pill').forEach((p, i) => {
      setTimeout(() => p.classList.add('vis'), i * 150 + 600);
    });
  }, 1400);
});

/* ===== NAVBAR SCROLL ===== */
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (window.scrollY > 60) {
    nb.style.background = 'rgba(10,10,10,0.92)';
    nb.style.borderColor = 'rgba(255,255,255,0.06)';
    nb.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
  } else {
    nb.style.background = 'rgba(255,255,255,0.08)';
    nb.style.borderColor = 'rgba(255,255,255,0.1)';
    nb.style.boxShadow = 'none';
  }
}, { passive: true });

/* ===== HAMBURGER ===== */
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mob.classList.toggle('open');
  document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link, .mobile-cta').forEach(l => {
  l.addEventListener('click', () => {
    ham.classList.remove('open');
    mob.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== LANGUAGE TOGGLE ===== */
const langBtn = document.getElementById('langToggle');
function setLang(l) {
  lang = l;
  const isAr = l === 'ar';
  document.documentElement.lang = l;
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  document.body.classList.toggle('en', !isAr);
  document.body.style.direction = isAr ? 'rtl' : 'ltr';
  langBtn.textContent = isAr ? '🇬🇧 EN' : '🇸🇦 AR';
  // Update all translatable
  document.querySelectorAll('[data-ar][data-en]').forEach(el => {
    const val = isAr ? el.dataset.ar : el.dataset.en;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else if (el.childElementCount === 0) {
      el.textContent = val;
    }
  });
  localStorage.setItem('lang', l);
}
langBtn.addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar'));
// Load saved
const saved = localStorage.getItem('lang');
if (saved) setLang(saved);

/* ===== SCROLL REVEAL ===== */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      // Stagger children
      const items = e.target.querySelectorAll('.service-card, .service-card-shell-ar, .project-card-big, .proj-card-ar, .timeline-item, .contact-card, .about-stat, .hiw-step-ar');
      if (items.length) {
        items.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(24px)';
          item.style.transition = `opacity .6s ease ${i * .1}s, transform .6s ease ${i * .1}s`;
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        });
      }
      e.target.classList.add('vis');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section-header, .projects-list, .timeline, .contact-grid, .about-center, .about-stats, .hiw-steps, .services-deck-inner').forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

/* ===== ACTIVE NAV ===== */
const sects = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let cur = '';
  sects.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) cur = s.id;
  });
  navLinks.forEach(l => {
    const active = l.getAttribute('href') === '#' + cur;
    l.classList.toggle('active', active);
  });
}, { passive: true });

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const h = a.getAttribute('href');
    if (h === '#') return;
    const t = document.querySelector(h);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ===== HERO GLOW FOLLOW ===== */
document.addEventListener('mousemove', e => {
  const g = document.querySelector('.hero-bg-glow');
  if (!g) return;
  const h = document.querySelector('.hero');
  if (!h) return;
  const r = h.getBoundingClientRect();
  if (e.clientY > r.bottom) return;
  const x = ((e.clientX - r.left) / r.width) * 100;
  const y = ((e.clientY - r.top) / r.height) * 100;
  g.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(79,255,176,0.12) 0%, transparent 60%)`;
});

/* ===== CONTACT FORM ===== */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>✅ ' + (lang === 'ar' ? 'تم الإرسال بنجاح!' : 'Message Sent!') + '</span>';
    btn.style.background = '#22C55E';
    btn.style.boxShadow = '5px 5px 0 #166534';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.boxShadow = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

/* ===== SERVICES STICKY DECK ANIMATION ===== */
function initServicesDeck() {
  const container = document.querySelector('.services-deck-container');
  const shells = document.querySelectorAll('.service-card-shell-ar');
  if (!container || !shells.length) return;

  function updateDeck() {
    if (window.innerWidth <= 768) {
      shells.forEach((shell) => {
        const card = shell.querySelector('.service-card-inner');
        if (card) {
          card.style.transform = '';
          card.style.opacity = '';
        }
      });
      return;
    }

    const rect = container.getBoundingClientRect();
    const totalHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const scrollable = totalHeight - viewportHeight;

    // If section is not visible in viewport, exit
    if (rect.top > viewportHeight || rect.bottom < 0) return;

    // Progress goes from 0 (start of section) to 1 (end of section)
    const progress = Math.max(0, Math.min(1, -rect.top / (scrollable || 1)));

    const numCards = shells.length;
    // Each segment represents card transition
    const segment = 1 / (numCards - 1);

    shells.forEach((shell, index) => {
      const card = shell.querySelector('.service-card-inner');
      if (!card) return;

      const start = (index - 1) * segment;
      const end = index * segment;

      let cardProgress = 0;
      if (index === 0) {
        cardProgress = 1; // first card is fully visible at start
      } else {
        cardProgress = Math.max(0, Math.min(1, (progress - start) / segment));
      }

      let scale = 1;
      let opacity = 1;
      let translateY = 0;

      // Card is scroll-past (behind subsequent cards)
      if (progress > end && index < numCards - 1) {
        scale = 1;       // Do not scale
        opacity = 1;     // Do not fade
        translateY = 0;  // Stay completely still
      }
      // Card is not yet visible (below viewport)
      else if (index > 0 && progress < start) {
        translateY = window.innerHeight; // Start completely off screen
        opacity = 1; // Must be 1 so it doesn't look transparent when sliding in
        scale = 1;
      }
      // Card is transitioning in
      else if (index > 0) {
        const t = (1 - cardProgress);
        translateY = t * window.innerHeight; // Slide in from bottom
        opacity = 1; // Full opacity to cover the card below cleanly
        scale = 1;
      }

      card.style.transform = `translateY(${translateY}px) scale(${scale})`;
      card.style.opacity = opacity;
    });
  }

  window.addEventListener('scroll', updateDeck, { passive: true });
  window.addEventListener('resize', updateDeck, { passive: true });
  updateDeck(); // Init on load
}

// Call on load
initServicesDeck();

/* ===== TIMELINE DYNAMIC SCROLL ===== */
function initTimelineScroll() {
  const container = document.querySelector('.hiw-steps');
  const progressLine = document.querySelector('.hiw-line-progress');
  if (!container || !progressLine) return;

  function updateTimeline() {
    try {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // How far the viewport center has scrolled past the top of the timeline container
      const trigger = viewportHeight / 2;
      const progressVal = (trigger - rect.top) / (rect.height || 1);
      
      const scale = Math.max(0, Math.min(1, progressVal));
      progressLine.style.transform = `scaleY(${scale})`;
    } catch (err) {
      console.error("Timeline scroll error:", err);
    }
  }

  window.addEventListener('scroll', updateTimeline, { passive: true });
  window.addEventListener('resize', updateTimeline, { passive: true });
  updateTimeline(); // run once on load
}

initTimelineScroll();

/* ===== INTERACTIVE CHATBOT ("اسأل محمد") ===== */
const botReplies = {
  ar: {
    services: "أقدم خدمات متكاملة لتطوير تطبيقات الجوال باستخدام Flutter، بما في ذلك:\n- تطوير تطبيقات iOS & Android بكود موحد.\n- تحويل تصاميم Figma بدقة بكسل-بيكسل.\n- إدارة الحالة باستخدام BLoC و GetX.\n- ربط خوادم REST APIs و Firebase/Supabase.\n- فحص وتحسين أداء التطبيقات وتقليص حجمها.\n- نشر التطبيقات على App Store و Google Play.",
    projects: "لقد قمت ببناء العديد من التطبيقات المميزة:\n1. **Malej (ملج)**: تطبيق إدارة مشاريع البناء (Supabase، معمارية Clean Architecture).\n2. **NewsLingo**: تطبيق لتعلم اللغة الإنجليزية لمتحدثي العربية (Offline-First، باستخدام Hive DB و BLoC/Cubit).\n3. **SplitEase**: تطبيق تقسيم الفواتير مع واجهة Bento Grid (Hive DB، عملات متعددة).\n4. **Meney**: تطبيق إدارة التمويل الشخصي (Supabase ومزامنة فورية).",
    available: "نعم! أنا متاح للعمل حالياً كـ Freelancer أو للتعاقد والمشاريع بدوام كامل أو جزئي. لنتحدث عن فكرتك ونحولها لتطبيق حقيقي!",
    contact: "يمكنك التواصل معي مباشرة عبر:\n- ✉️ البريد الإلكتروني: mohammedihsanflayyih@gmail.com\n- 💬 واتساب: بالنقر على الزر العائم أسفل اليسار.\n- 📝 أو املأ نموذج الاتصال في أسفل الصفحة وسأرد عليك فوراً!"
  },
  en: {
    services: "I provide end-to-end mobile development services using Flutter, including:\n- Cross-Platform iOS & Android development.\n- Figma to Flutter UI conversion (pixel-perfect).\n- State management with BLoC & GetX.\n- REST APIs & Firebase/Supabase integration.\n- Performance profiling & size optimization.\n- Publishing to App Store & Google Play Store.",
    projects: "I have built several professional apps:\n1. **Malej (ملج)**: Construction Project Management App (Supabase, Clean Architecture).\n2. **NewsLingo**: English-Learning App for Arabic speakers (Offline-First, Hive, BLoC/Cubit).\n3. **SplitEase**: Bento Grid Bill-Splitting App (Hive DB, multi-currency).\n4. **Meney**: Personal Finance Management App (Supabase, real-time sync).",
    available: "Yes! I am currently available for freelance work, contract roles, or full/part-time opportunities. Let's discuss your project!",
    contact: "You can reach me directly via:\n- ✉️ Email: mohammedihsanflayyih@gmail.com\n- 💬 WhatsApp: Click the floating button in the bottom-left.\n- 📝 Or fill out the contact form below and I'll reply instantly!"
  }
};

const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatWindow = document.getElementById('chatWindow');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');

if (chatToggleBtn && chatWindow) {
  const chatTooltip = document.getElementById('chatTooltip');
  if (chatTooltip) {
    // Show tooltip with a slight delay after preloader
    setTimeout(() => {
      chatTooltip.classList.add('show');
    }, 1900);
    
    // Auto-hide tooltip after 10 seconds
    setTimeout(() => {
      chatTooltip.classList.remove('show');
    }, 11900);
  }

  // Initially disable send button
  if (chatSendBtn) {
    chatSendBtn.disabled = true;
  }

  // Toggle Chat window
  chatToggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    chatToggleBtn.classList.toggle('open');
    if (chatTooltip) {
      chatTooltip.classList.remove('show');
    }
    if (chatWindow.classList.contains('open') && chatInput) {
      chatInput.focus();
    }
  });

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
      chatWindow.classList.remove('open');
      chatToggleBtn.classList.remove('open');
    });
  }

  // Function to add chat bubbles
  function addChatMessage(textAr, textEn, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    msg.dataset.ar = textAr;
    msg.dataset.en = textEn;

    // Replace newlines with <br> for neat formatting
    const formattedAr = textAr.replace(/\n/g, '<br>');
    const formattedEn = textEn.replace(/\n/g, '<br>');

    msg.innerHTML = lang === 'ar' ? formattedAr : formattedEn;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to show/hide typing indicator
  function showChatTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chat-msg bot typing';
    indicator.id = 'chatTypingIndicator';
    indicator.innerHTML = `
      <div class="chat-typing-dots">
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
        <span class="chat-typing-dot"></span>
      </div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeChatTypingIndicator() {
    const indicator = document.getElementById('chatTypingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Handle suggestion prompts
  const sugKeys = ['services', 'projects', 'available', 'contact'];
  document.querySelectorAll('.chat-sug-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const promptAr = btn.dataset.ar;
      const promptEn = btn.dataset.en;
      const key = sugKeys[index];

      // Add user prompt bubble
      addChatMessage(promptAr, promptEn, 'user');

      // Show typing indicator
      showChatTypingIndicator();

      // Answer after delay
      setTimeout(() => {
        removeChatTypingIndicator();
        addChatMessage(botReplies.ar[key], botReplies.en[key], 'bot');
      }, 1000);
    });
  });

  // Handle text area change and sending
  if (chatInput && chatSendBtn) {
    chatInput.addEventListener('input', () => {
      const hasText = chatInput.value.trim().length > 0;
      chatSendBtn.classList.toggle('active', hasText);
      chatSendBtn.disabled = !hasText;
    });

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatSendBtn.click();
      }
    });

    chatSendBtn.addEventListener('click', () => {
      const text = chatInput.value.trim();
      if (!text) return;

      chatInput.value = '';
      chatSendBtn.classList.remove('active');
      chatSendBtn.disabled = true;

      // Add user message
      addChatMessage(text, text, 'user');

      // Show typing indicator
      showChatTypingIndicator();

      setTimeout(() => {
        removeChatTypingIndicator();

        let matchedKey = '';
        const textLower = text.toLowerCase();

        if (textLower.includes('خدم') || textLower.includes('service') || textLower.includes('تطور') || textLower.includes('برمج') || textLower.includes('فلتر') || textLower.includes('flutter')) {
          matchedKey = 'services';
        } else if (textLower.includes('مشروع') || textLower.includes('عمل') || textLower.includes('project') || textLower.includes('work') || textLower.includes('app') || textLower.includes('تطبيق')) {
          matchedKey = 'projects';
        } else if (textLower.includes('متاح') || textLower.includes('توظيف') || textLower.includes('شغل') || textLower.includes('hire') || textLower.includes('avail') || textLower.includes('job') || textLower.includes('فرصة')) {
          matchedKey = 'available';
        } else if (textLower.includes('تواصل') || textLower.includes('رقم') || textLower.includes('ايميل') || textLower.includes('contact') || textLower.includes('email') || textLower.includes('phone') || textLower.includes('whatsapp') || textLower.includes('واتس')) {
          matchedKey = 'contact';
        }

        let replyAr, replyEn;
        if (matchedKey) {
          replyAr = botReplies.ar[matchedKey];
          replyEn = botReplies.en[matchedKey];
        } else {
          replyAr = "شكراً لرسالتك! لم أفهم هذا السؤال تماماً، ولكن يمكنك التواصل معي مباشرة لمناقشة أي تفاصيل عبر البريد الإلكتروني: mohammedihsanflayyih@gmail.com أو واتساب: +9647755332607.";
          replyEn = "Thanks for your message! I didn't quite get that, but you can contact me directly to discuss details via email: mohammedihsanflayyih@gmail.com or WhatsApp: +9647755332607.";
        }

        addChatMessage(replyAr, replyEn, 'bot');
      }, 1000);
    });
  }
}
