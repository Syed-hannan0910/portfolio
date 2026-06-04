/* ═══════════════════════════════════════════════════════════
   main.js — Portfolio Frontend Logic (v2 — Coffee & Books)
═══════════════════════════════════════════════════════════ */
'use strict';

const API = {
  profile:  '/api/profile',
  projects: '/api/projects',
  skills:   '/api/skills',
  contact:  '/api/contact'
};

/* ── Helpers ──────────────────────────────────────────────── */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

/* ── Toast ────────────────────────────────────────────────── */
function toast(msg, dur = 3500) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

/* ── Custom cursor ────────────────────────────────────────── */
function initCursor() {
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) {
    dot?.remove(); ring?.remove(); return;
  }
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function raf() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(raf);
  }
  raf();
  // Expand ring on interactive elements
  document.querySelectorAll('a,button,[role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '52px'; ring.style.height = '52px';
      ring.style.borderColor = 'rgba(200,151,58,0.8)';
      dot.style.width = '10px'; dot.style.height = '10px';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '32px'; ring.style.height = '32px';
      ring.style.borderColor = 'rgba(200,151,58,0.5)';
      dot.style.width = '6px'; dot.style.height = '6px';
    });
  });
}

/* ── Loader ───────────────────────────────────────────────── */
async function hideLoader() {
  await sleep(1600);
  const loader = $('#loader');
  loader.classList.add('hide');
  await sleep(700);
  loader.remove();
}

/* ── Navigation ───────────────────────────────────────────── */
function initNav() {
  const nav    = $('.nav');
  const toggle = $('.nav-toggle');
  const links  = $('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    highlightNavLink();
  }, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
  }));
}

function highlightNavLink() {
  const scrollY = window.scrollY + 100;
  $$('section[id]').forEach(sec => {
    const inView = scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight;
    $$('.nav-links a').forEach(a => {
      if (a.getAttribute('href') === `#${sec.id}`) a.classList.toggle('active', inView);
    });
  });
}

/* ── Back to top ──────────────────────────────────────────── */
function initBackTop() {
  const btn = $('#back-top');
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Scroll-triggered fade-in ─────────────────────────────── */
function initFadeIns() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        if (e.target.closest('#skills')) triggerSkillBars();
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  $$('.fade-in').forEach(el => obs.observe(el));
}

/* ── Skill bars ───────────────────────────────────────────── */
let barsAnimated = false;
function triggerSkillBars() {
  if (barsAnimated) return;
  barsAnimated = true;
  $$('.skill-fill').forEach(bar => {
    setTimeout(() => { bar.style.width = bar.dataset.level + '%'; }, 120);
  });
}

/* ── Typing effect ────────────────────────────────────────── */
function initTyping() {
  const el = $('#hero-role');
  if (!el) return;
  const roles = ['Full-Stack Developer', 'AI Specialist', 'Node.js Engineer', 'API Architect', 'React Developer'];
  let ri = 0, ci = 0, del = false;
  function tick() {
    const cur = roles[ri];
    if (del) {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
      setTimeout(tick, 55);
    } else {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(tick, 2400); }
      else setTimeout(tick, 85);
    }
  }
  tick();
}

/* ── Stat counters ────────────────────────────────────────── */
function initCounters() {
  $$('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let cur = 0;
      const step = target / 60;
      const iv = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.round(cur) + suffix;
        if (cur >= target) clearInterval(iv);
      }, 20);
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}

/* ── Parallax on hero illustration ───────────────────────── */
function initParallax() {
  const illus = $('.hero-illustration');
  if (!illus || window.matchMedia('(pointer:coarse)').matches) return;
  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;
    illus.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
}

/* ── Icon helpers ─────────────────────────────────────────── */
function catIcon(cat) {
  return { 'Web Tech':'🖥️', 'Backend':'⚙️', 'Databases':'🗄️', 'DevOps & Tools':'☁️' }[cat] || '💡';
}
const githubSVG = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`;
const extSVG   = () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

/* ── Render: Profile ──────────────────────────────────────── */
function renderProfile(p) {
  // Hero
  const heroName = $('#hero-name');
  if (heroName) {
    heroName.innerHTML = `${p.name.split(' ')[0]}<em>${p.name.split(' ')[1]}</em><span class="last-name">${p.name.split(' ').slice(2).join(' ')}</span>`;
  }
  const heroDesc = $('#hero-desc');
  if (heroDesc) heroDesc.textContent = 'Crafting AI-driven platforms and scalable APIs from a corner desk in Bengaluru — one cup of coffee at a time.';

  // Avatar card
  const avatarName   = $('#avatar-name');
  const avatarStatus = $('#avatar-status');
  if (avatarName)   avatarName.textContent   = p.name;
  if (avatarStatus) avatarStatus.textContent = p.available ? 'Open to opportunities' : 'Currently unavailable';

  // About bio
  const aboutBio = $('#about-bio');
  if (aboutBio) aboutBio.textContent = p.bio;

  // Education timeline
  const eduList = $('#edu-list');
  if (eduList && p.education?.length) {
    eduList.innerHTML = p.education.map(e => `
      <div class="edu-entry">
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-inst">${e.institution} · ${e.location}</div>
        <div class="edu-grade">${e.grade}</div>
      </div>
    `).join('');
  }

  // Contact section
  const ce = $('#contact-email');
  const cp = $('#contact-phone');
  const cl = $('#contact-loc');
  if (ce) { ce.textContent = p.email; ce.href = 'mailto:' + p.email; }
  if (cp) cp.textContent = p.phone;
  if (cl) cl.textContent = p.location;

  // GitHub links
  $$('.github-link').forEach(el => el.setAttribute('href', p.github));
}

/* ── Render: Skills ───────────────────────────────────────── */
function renderSkills(skills) {
  const grid = $('#skills-grid');
  if (!grid) return;
  grid.innerHTML = skills.map(s => `
    <div class="skill-card fade-in">
      <div class="skill-card-head">
        <div class="skill-icon">${catIcon(s.category)}</div>
        <div class="skill-cat">${s.category}</div>
      </div>
      ${s.items.map(i => `
        <div class="skill-item">
          <div class="skill-row">
            <span class="skill-name">${i.name}</span>
            <span class="skill-pct">${i.level}%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-fill" data-level="${i.level}"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
  initFadeIns();
}

/* ── Render: Projects ─────────────────────────────────────── */
function renderProjects(projects) {
  const grid = $('#projects-grid');
  if (!grid) return;
  grid.innerHTML = projects.map(p => `
    <div class="project-card fade-in" style="--project-color:${p.color}">
      <div class="project-color-bar"></div>
      ${p.featured ? '<span class="featured-badge">Featured</span>' : ''}
      <div class="project-type">${p.subtitle}</div>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.description}</p>
      <div class="project-tags">${p.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>
      <div class="project-footer">
        ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" class="proj-link">${githubSVG()} GitHub</a>` : ''}
        ${p.live   ? `<a href="${p.live}"   target="_blank" rel="noopener" class="proj-link">${extSVG()} Live Demo</a>` : ''}
      </div>
    </div>
  `).join('');
  initFadeIns();
}

/* ── Contact form ─────────────────────────────────────────── */
function initContactForm() {
  const form   = $('#contact-form');
  const submitBtn = $('#form-submit');
  const msgBox = $('#form-msg');
  if (!form) return;

  const fields = {
    name:    { el: $('#field-name'),    min: 2,  max: 100 },
    email:   { el: $('#field-email'),   isEmail: true },
    subject: { el: $('#field-subject'), max: 200, optional: true },
    message: { el: $('#field-message'), min: 10, max: 2000 }
  };

  function validateField(key) {
    const { el, min, max, isEmail, optional } = fields[key];
    const val   = el.value.trim();
    const errEl = $(`#err-${key}`);
    const fail  = msg => { el.classList.add('error'); if (errEl) errEl.textContent = msg; return false; };
    const pass  = ()   => { el.classList.remove('error'); if (errEl) errEl.textContent = ''; return true; };
    if (!val && optional) return pass();
    if (!val)             return fail('This field is required.');
    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return fail('Enter a valid email address.');
    if (min && val.length < min) return fail(`Minimum ${min} characters required.`);
    if (max && val.length > max) return fail(`Maximum ${max} characters allowed.`);
    return pass();
  }

  Object.keys(fields).forEach(k => {
    fields[k].el?.addEventListener('blur',  () => validateField(k));
    fields[k].el?.addEventListener('input', () => { if (fields[k].el.classList.contains('error')) validateField(k); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const allValid = Object.keys(fields).map(k => validateField(k)).every(Boolean);
    if (!allValid) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending…';
    msgBox.className = 'form-feedback';

    try {
      const res  = await fetch(API.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    fields.name.el.value.trim(),
          email:   fields.email.el.value.trim(),
          subject: fields.subject.el.value.trim(),
          message: fields.message.el.value.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        msgBox.textContent  = '✅ ' + data.message;
        msgBox.className    = 'form-feedback success';
        form.reset();
        toast('Message sent! I\'ll reply soon ☕');
      } else {
        const errs = data.errors?.map(e => e.msg).join(' · ') || data.message;
        msgBox.textContent = '⚠️ ' + errs;
        msgBox.className   = 'form-feedback error';
      }
    } catch {
      msgBox.textContent = '❌ Network error — please try again.';
      msgBox.className   = 'form-feedback error';
    } finally {
      submitBtn.disabled  = false;
      submitBtn.innerHTML = 'Send Message →';
    }
  });
}

/* ── Smooth section reveal on first paint ─────────────────── */
function revealOnScroll() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  $$('.fade-in').forEach(el => obs.observe(el));
}

/* ── Boot ─────────────────────────────────────────────────── */
async function init() {
  initCursor();
  initNav();
  initBackTop();
  initTyping();
  initCounters();
  initParallax();
  initContactForm();
  revealOnScroll();
  hideLoader();

  try {
    const [profRes, skillRes, projRes] = await Promise.all([
      fetchJSON(API.profile),
      fetchJSON(API.skills),
      fetchJSON(API.projects)
    ]);
    if (profRes.success)  renderProfile(profRes.data);
    if (skillRes.success) renderSkills(skillRes.data);
    if (projRes.success)  renderProjects(projRes.data);
  } catch (err) {
    console.error('Data load failed:', err);
    toast('Could not load portfolio data — check server connection.');
  }

  // Second pass for newly rendered .fade-in elements
  setTimeout(revealOnScroll, 200);
}

document.addEventListener('DOMContentLoaded', init);
