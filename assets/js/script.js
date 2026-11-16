// ---- Loading screen ----
(function () {
  let p = 0;
  const pct = document.getElementById('pct'), fill = document.getElementById('barfill'), loader = document.getElementById('loader');
  const t = setInterval(() => {
    p = Math.min(100, p + Math.ceil(Math.random() * 6));
    pct.textContent = p + '%'; fill.style.width = p + '%';
    if (p >= 100) { clearInterval(t); setTimeout(() => { loader.classList.add('done'); typeText(); }, 400); }
  }, 70);
})();

// ---- Bintang + bintang jatuh ----
(function () {
  const c = document.getElementById('stars'), x = c.getContext('2d');
  let w, h, stars = [], shoot = null;
  function size() {
    w = c.width = innerWidth; h = c.height = innerHeight;
    stars = Array.from({ length: 130 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + .3, s: Math.random() * 2 + 1 }));
  }
  addEventListener('resize', size); size();
  (function draw(t) {
    x.clearRect(0, 0, w, h);
    stars.forEach(s => { x.globalAlpha = .45 + .55 * Math.abs(Math.sin(t / 1000 * s.s)); x.fillStyle = '#fff'; x.beginPath(); x.arc(s.x, s.y, s.r, 0, 7); x.fill(); });
    if (!shoot && Math.random() < .004) shoot = { x: Math.random() * w, y: 0, l: 0 };
    if (shoot) {
      x.globalAlpha = 1; x.strokeStyle = '#fff'; x.beginPath(); x.moveTo(shoot.x, shoot.y); x.lineTo(shoot.x - 90, shoot.y - 90); x.stroke();
      shoot.x += 9; shoot.y += 9; if (shoot.y > h) shoot = null;
    }
    requestAnimationFrame(draw);
  })(0);
})();

// ---- Efek mengetik ----
function typeText() {
  const el = document.getElementById('typed'), txt = el.dataset.text; let i = 0;
  (function n() { if (i <= txt.length) { el.textContent = txt.slice(0, i++); setTimeout(n, 70); } })();
}

// ---- Navbar pill + bubble ----
const links = [...document.querySelectorAll('#pill a')], bubble = document.getElementById('bubble');
function moveBubble(a) {
  const pill = document.getElementById('pill');
  bubble.style.left = (a.offsetLeft + a.offsetWidth / 2 - 13) + 'px';
}
function setActive() {
  let cur = links[0];
  links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s.getBoundingClientRect().top < innerHeight * .4) cur = a; });
  links.forEach(a => a.classList.toggle('active', a === cur)); moveBubble(cur);
}
addEventListener('scroll', setActive); addEventListener('resize', setActive); addEventListener('load', setActive);

// ---- Kartu statistik membuka tab portofolio ----
document.querySelectorAll('.stat').forEach(s => s.addEventListener('click', () => {
  const b = document.querySelector(`[data-bs-target="#${s.dataset.tab}"]`); if (b) bootstrap.Tab.getOrCreateInstance(b).show();
}));

// ---- Komentar (disimpan di localStorage) ----
const list = document.getElementById('cList');
const esc = s => s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
function render() {
  const d = JSON.parse(localStorage.getItem('komentar') || '[]');
  list.innerHTML = d.length ? d.map(k => `<div class="cm"><b>${esc(k.n)}</b><small>${esc(k.t)}</small><div>${esc(k.m)}</div></div>`).join('')
    : '<p class="opacity-75">Belum ada komentar. Jadilah yang pertama!</p>';
}
document.getElementById('cSend').addEventListener('click', () => {
  const n = document.getElementById('cName'), m = document.getElementById('cMsg');
  if (!n.value.trim() || !m.value.trim()) return alert('Nama dan komentar wajib diisi.');
  const d = JSON.parse(localStorage.getItem('komentar') || '[]');
  d.unshift({ n: n.value.trim(), m: m.value.trim(), t: new Date().toLocaleDateString('id-ID') });
  localStorage.setItem('komentar', JSON.stringify(d)); n.value = m.value = ''; render();
});
render();
