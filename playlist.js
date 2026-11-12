const PLAYLIST = [
[
"505",
"Arctic Monkeys",
"cancion que escuchaba cuando no hablabamos y te extrañaba, siempre me jure que volveria. Volvi."
],
[
"Apocalypse",
"Cigarettes After Sex",
"mi playlist para dormir ahora no solo es para dormir, si no tambien para pensar en vos."
],
[
"Blue Hair",
"TV Girl",
"TV Girl me transmite una sensacion rara, unica y hermosa, como tus besos."
],
[
"Brooklyn Baby",
"Lana Del Rey",
"ima broooklyyn babyyyy"
],
[
"Cactus",
"Gustavo Cerati",
"tema que me gusta de ceratti, a vos te gusta ceratti a mi me gustas vos"
],
[
"Cigarettes out the Window",
"TV Girl",
"Tv girl me hace acordar a vos"
],
[
"Crimen",
"Gustavo Cerati",
"otro tema que banco del asesino."
],
[
"Cry",
"Cigarettes After Sex",
"no hace falta explicar"
],
[
"En El Muelle de San Blas",
"Maná",
"ella despidiooo a su amoor, el partio en un barco en el muelle de sanblas"
],
[
"Enamorado tuyo",
"El Cuarteto De Nos",
"me gustas"
],
[
"Entre Caníbales",
"Soda Stereo",
"aaaaaaaaaaaaaaaaaaa come de miii"
],
[
"Frances Limon",
"Los Enanitos Verdes",
"me gustas"
],
[
"Genesis",
"Grimes",
"me hace acordar a vos,cantamelo porfa"
],
[
"i like the way you kiss me",
"Artemas",
"me hace acordar a vos"
],
[
"K.",
"Cigarettes After Sex",
"K"
],
[
"Lejos de Ti",
"The Marías",
"tema que escucho cuando te ekstraño"
],
[
"Lilith",
"Saint Avangeline",
"no hay palabras."
],
[
"Lo mejor del amor",
"Rodrigo",
"FUE LO MEJOR DEL AMOOOOOOOOOOOOOOOOOOOR"
],
[
"Lovers Rock",
"TV Girl",
"Lo mismo que con los anteriores de tv girl"
],
[
"Music To Watch Boys To",
"Lana Del Rey",
"i like you a lot"
],
[
"No One Noticed",
"The Marías",
"te quiero besar con este tema de fondo"
],
[
"Pretty When You Cry",
"Lana Del Rey",
"vos"
],
[
"Puesto",
"Babasonicos",
"que barbariidad haber tenido que esperar."
],
[
"Reflections",
"The Neighbourhood",
"i never knew somebody like u"
],
[
"Sad Girl",
"Lana Del Rey",
"habia que agregar tema de lana del rey a esta playlist."
],
[
"Salvatore",
"Lana Del Rey",
"tus audios cantando me encantan"
],
[
"Sarà perché ti amo",
"Ricchi E Poveri",
"esta en italiano y me hace acordar a vos, lo escuchaba mucho en 2025"
],
[
"Say Yes To Heaven",
"Lana Del Rey",
"if u dance Ill dance"
],
[
"Sienna",
"The Marías",
"nuesta hija."
],
[
"Snowman",
"Sia",
"TEMOOOOOOOOOON"
],
[
"Softcore",
"The Neighbourhood",
"tema que escuchamos muchas veces mientras caminabamos"
],
[
"Sweet",
"Cigarettes After Sex",
"pipipip tengo sueño"
],
[
"Tu Geografía",
"Indios",
"ME INTERESA TUCUERPO TU DIA TU VIDA NENA TU GEOGRAFIAAAAAAA"
],
[
"Ultraviolence",
"Lana Del Rey",
"vos."
],
[
"Verte De Cerca",
"Airbag",
"me gustas"
],
[
"we fell in love in october",
"girl in red",
"nos enamoramos en octubre."
],
[
"West Coast",
"Lana Del Rey",
"lana del rey simplemente"
],
[
"Why'd You Only Call Me When You're High?",
"Arctic Monkeys",
"tema que siento q te gustaria"
],
[
"Young And Beautiful",
"Lana Del Rey",
"tema que tambien siento que te gustaria"
],
[
"Zona de Promesas (with Gustavo Cerati)",
"Mercedes Sosa; Gustavo Cerati",
"mama sabe bieen, perdi una batallaa. amo que me cantes y aamo cantar con vos"
]
];

/* Rincón 3: playlist con el porqué de cada tema (editá los textos en PLAYLIST) */
(() => {
const lista = document.getElementById('lista-temas'); if (!lista) return;
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
document.getElementById('pl-cuenta').textContent = PLAYLIST.length;

function abrir(it, fuerza) {
  const ya = it.classList.contains('abierto');
  lista.querySelectorAll('.item.abierto').forEach(x => { x.classList.remove('abierto'); x.firstElementChild.setAttribute('aria-expanded', 'false'); });
  if (!ya || fuerza) {
    it.classList.add('abierto'); it.firstElementChild.setAttribute('aria-expanded', 'true');
    setTimeout(() => it.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 200);
  }
}
PLAYLIST.forEach(([t, a, por], i) => {
  const it = document.createElement('div'); it.className = 'item'; it.dataset.q = norm(t + ' ' + a);
  it.innerHTML = '<button class="tema-cab" aria-expanded="false"><span class="tema-n"></span><span class="tema-t"><b></b><small></small></span></button><div class="tema-por"><div><p></p></div></div>';
  it.querySelector('.tema-n').textContent = String(i + 1).padStart(2, '0');
  it.querySelector('b').textContent = t; it.querySelector('small').textContent = a; it.querySelector('p').textContent = por;
  it.firstElementChild.onclick = () => abrir(it);
  lista.appendChild(it);
});
const q = document.getElementById('buscar-tema'), vacio = document.getElementById('pl-vacio');
q.oninput = () => { const v = norm(q.value.trim()); let n = 0; lista.querySelectorAll('.item').forEach(it => { const ok = !v || it.dataset.q.includes(v); it.hidden = !ok; n += ok; }); vacio.hidden = n > 0; };
document.getElementById('btn-azar-tema').onclick = () => { const v = [...lista.querySelectorAll('.item:not([hidden])')]; if (v.length) abrir(v[Math.random() * v.length | 0], true); };
})();
