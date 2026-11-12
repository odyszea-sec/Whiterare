(() => {
const $ = s => document.querySelector(s), KEY = 'bocanada-modo';
const body = document.body, btn = $('#btn-modo'), audio = $('#reproductor-core');
const enh = () => body.classList.contains('enhanced');
const hasStorage = f => { try { return f(localStorage) } catch (e) {} };

/* toast */
let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2200); }

/* partículas (luciérnagas con los colores de sus ojos) */
const cv = $('#lienzo'), cx = cv.getContext('2d'), cols = ['113,139,121', '167,158,98', '91,115,118', '182,172,109'];
let ps = [], fug = [], raf = 0;
const size = () => { cv.width = innerWidth; cv.height = innerHeight; };
const mk = () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 2 + .6, vx: (Math.random() - .5) * .25, vy: -Math.random() * .35 - .05, f: Math.random() * 6, c: cols[Math.random() * cols.length | 0] });
function tick() {
  cx.clearRect(0, 0, cv.width, cv.height);
  for (const p of ps) {
    p.x += p.vx + Math.sin(p.f) * .15; p.y += p.vy; p.f += .02;
    if (p.y < -10) { p.y = cv.height + 10; p.x = Math.random() * cv.width; }
    const a = .35 + .35 * Math.sin(p.f * 2), g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
    g.addColorStop(0, `rgba(${p.c},${a})`); g.addColorStop(1, `rgba(${p.c},0)`);
    cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, p.y, p.r * 6, 0, 7); cx.fill();
  }
  if (Math.random() < .006) fug.push({ x: Math.random() * cv.width * .7, y: Math.random() * cv.height * .4, l: 0 });
  fug = fug.filter(s => s.l < 40);
  for (const s of fug) { s.l++; s.x += 9; s.y += 4; cx.strokeStyle = `rgba(230,225,180,${1 - s.l / 40})`; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(s.x, s.y); cx.lineTo(s.x - 60, s.y - 27); cx.stroke(); }
  raf = requestAnimationFrame(tick);
}
const particulas = {
  start() { size(); ps = Array.from({ length: innerWidth < 600 ? 35 : 70 }, mk); cancelAnimationFrame(raf); tick(); },
  stop() { cancelAnimationFrame(raf); }
};
addEventListener('resize', () => enh() && size());

/* modo */
function setModo(m) {
  body.classList.toggle('enhanced', m === 'enhanced');
  btn.textContent = m === 'enhanced' ? '◀ VERSIÓN RETRO' : 'VERSIÓN ENHANCED ✨';
  hasStorage(l => l.setItem(KEY, m));
  m === 'enhanced' ? particulas.start() : particulas.stop();
  const act = document.querySelector('.carta-contenido.activo');
  if (act && act.id === 'seccion-rincon2' && enh()) cartaEnh();
}
btn.onclick = () => {
  const t = $('#transicion'), to = enh() ? 'retro' : 'enhanced', r = btn.getBoundingClientRect();
  if (t.classList.contains('in')) return;
  t.style.setProperty('--x', r.left + r.width / 2 + 'px'); t.style.setProperty('--y', r.top + r.height / 2 + 'px');
  t.className = to; t.firstElementChild.textContent = to === 'enhanced' ? '✦ ENHANCED ✦' : '> RETRO_MODE.exe';
  void t.offsetWidth; t.classList.add('in');
  setTimeout(() => setModo(to), 720); setTimeout(() => t.className = '', 1600);
};

/* paleta clickeable (se arma leyendo tu lista original, así los códigos viven en un solo lugar) */
const pal = document.createElement('div'); pal.id = 'paleta-enh';
document.querySelectorAll('#submenu-colores li').forEach(li => {
  const hex = (li.textContent.match(/#[0-9A-Fa-f]{6}/) || [])[0]; if (!hex) return;
  const d = document.createElement('div'); d.className = 'sw'; d.style.background = hex; d.textContent = hex;
  d.title = li.textContent.split(' - ')[1] || '';
  d.onclick = () => { navigator.clipboard && navigator.clipboard.writeText(hex); toast(`${hex} copiado · ${d.title}`); };
  pal.appendChild(d);
});
$('#submenu-colores').after(pal);
document.querySelector('.btn-rincon-colores').addEventListener('click', () => pal.classList.toggle('abierta'));

/* reproductor: progreso, play/pausa, siguiente automático */
const pp = $('#btn-pp'), bi = $('#barra-i');
audio.addEventListener('timeupdate', () => { if (audio.duration) bi.style.width = audio.currentTime / audio.duration * 100 + '%'; });
audio.addEventListener('play', () => { body.classList.add('sonando'); pp.textContent = '⏸'; });
audio.addEventListener('pause', () => { body.classList.remove('sonando'); pp.textContent = '▶'; });
audio.addEventListener('ended', () => reproducirAleatorio());
pp.onclick = () => audio.paused ? audio.play() : audio.pause();
$('#barra').onclick = e => { const r = e.currentTarget.getBoundingClientRect(); if (audio.duration) audio.currentTime = (e.clientX - r.left) / r.width * audio.duration; };

/* rincón 1: baraja sin repetir + contador */
const origFrase = window.generarFraseRincon; let bolsa = [];
window.generarFraseRincon = function () {
  if (!enh()) return origFrase();
  if (!bolsa.length) bolsa = frasesRincon.map((_, i) => i).sort(() => Math.random() - .5);
  const el = $('#texto-frase-rincon'); if (!el) return;
  el.classList.remove('frase-in'); void el.offsetWidth;
  el.textContent = frasesRincon[bolsa.pop()]; el.classList.add('frase-in');
  let c = $('#cont-frases'); if (!c) { c = document.createElement('div'); c.id = 'cont-frases'; $('#seccion-rincon1 .btn-volver').before(c); }
  c.textContent = `${frasesRincon.length - bolsa.length} / ${frasesRincon.length}`;
};

/* rincón 2: la carta aparece párrafo por párrafo */
function cartaEnh() {
  const sec = $('#seccion-rincon2'), src = sec.querySelector(':scope > p');
  let c = $('#carta-enh'); if (c) c.remove();
  c = document.createElement('div'); c.id = 'carta-enh';
  src.innerHTML.split('<br><br>').forEach((t, i) => { const p = document.createElement('p'); p.className = 'enh-p'; p.style.animationDelay = i * 1.1 + 's'; p.innerHTML = t.trim(); c.appendChild(p); });
  src.after(c);
}
const origSec = window.cambiarSeccion;
window.cambiarSeccion = function (d) { origSec(d); if (enh() && d === 'rincon2') cartaEnh(); };

/* rincón 3: "Abrí cuando…" (EDITÁ LOS TEXTOS ACÁ) */
const SOBRES = [
  ['tengas un mal día', 'Respirá hondo. Todo pasa, y yo estoy orgulloso de vos aunque hoy no lo veas. Poné una canción del reproductor y acordate de que sos más fuerte de lo que pensás.'],
  ['me extrañes', 'Yo también te extraño, siempre. Cerrá los ojos y pensá en el próximo abrazo, ese en el que me buscás el cuello.'],
  ['no puedas dormir', 'Contá estrellas, o contame a mí lo que tengas en la cabeza. Ya vas a dormir, amore.'],
  ['dudes de vos', 'Mirate con mis ojos: inteligente, auténtica, intensa, única. No hay nadie como vos.'],
  ['quieras reírte', 'Acordate de todas las boludeces que nos hacen reír, y mandame un audio riéndote así me río yo también.'],
  ['estemos juntos', 'Acá estamos. Disfrutemos cada segundo, que me lo merezco y vos también. Te amo, Belén.']
];
const sobresEl = $('#sobres'), cartaEl = $('#carta-abierta'); let tw;
SOBRES.forEach(([t, m]) => {
  const b = document.createElement('button'); b.className = 'btn-rincon sobre'; b.textContent = '✉ ' + t;
  b.onclick = () => {
    b.classList.add('abierto'); b.textContent = '💌 ' + t; clearInterval(tw); cartaEl.classList.add('on');
    if (!enh()) { cartaEl.textContent = m; return; }
    let i = 0; cartaEl.textContent = '';
    tw = setInterval(() => { cartaEl.textContent = m.slice(0, ++i); if (i >= m.length) clearInterval(tw); }, 28);
  };
  sobresEl.appendChild(b);
});

/* extras de enhanced: subtítulos en los rincones y pantalla de inicio */
['lo que me gusta de vos', 'una carta', 'abrí cuando…'].forEach((t, i) => document.querySelectorAll('.contenedor-botones-rincon .btn-rincon')[i].dataset.sub = t);
$('#pantalla-inicio').insertAdjacentHTML('afterbegin', '<div class="ini-titulo enh-only">Rare Sunset<small>PARA BELÉN</small></div>');

/* detalles: tilt 3D en desktop + easter egg del π */
addEventListener('pointermove', e => {
  document.documentElement.style.setProperty('--mx', e.clientX + 'px'); document.documentElement.style.setProperty('--my', e.clientY + 'px');
  if (!enh() || innerWidth < 900) return;
  const c = $('.interfaz-principal');
  c.style.setProperty('--ry', (e.clientX / innerWidth - .5) * 6 + 'deg');
  c.style.setProperty('--rx', (.5 - e.clientY / innerHeight) * 6 + 'deg');
});
$('#seccion-principal > .parrafo-estetico').onclick = () => enh() && toast('π = 3.14159265358979… no tiene fin. Esto tampoco ♾️');

/* ===== extras RETRO: texto de arranque + bip de terminal en cada botón ===== */
$('#pantalla-inicio').insertAdjacentHTML('afterbegin', '<div class="boot ret-only"><span>BOCANADA OS v2.5 (c) odyszea-dev</span><span>MEMORY CHECK .......... OK</span><span>CARGANDO AUDIO ........ OK</span><span>CARGANDO RECUERDOS .... OK</span><span>ESPERANDO USUARIO_</span></div>');
let ac; function beep(f) { try { ac = ac || new AudioContext(); const o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.value = f; g.gain.value = .03; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + .05); } catch (e) {} }
document.addEventListener('click', e => { const b = e.target.closest('button'); if (b && !enh()) beep(b.id === 'btn-modo' ? 440 : 880); });

setModo(hasStorage(l => l.getItem(KEY)) || 'enhanced');
})();
