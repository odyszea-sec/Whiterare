const listaCanciones = [
    { titulo: "Bocanada", artista: "Gustavo Cerati", archivo: "bocanada.mp3", portada: "portada bocanada.jpg" },
{ titulo: "Brooklyn Baby", artista: "Lana Del Rey", archivo: "brooklyn baby.mp3", portada: "portada brooklyn baby.jpg" },
{ titulo: "Cactus", artista: "Gustavo Cerati", archivo: "cactus.mp3", portada: "portada fuerza natural.jpg" },
{ titulo: "Music To Watch Boys To", artista: "Lana Del Rey", archivo: "music to watch boys to.mp3", portada: "portada music to watch boys to.jpg" },
{ titulo: "Salvatore", artista: "Lana Del Rey", archivo: "salvatore.mp3", portada: "portada salvatore.jpg" },
{ titulo: "West Coast", artista: "Lana Del Rey", archivo: "west coast.mp3", portada: "portada west coast.jpg" }
];

let cancionesDisponibles = [...listaCanciones];
const audioCore = document.getElementById('reproductor-core');
const miniTitulo = document.getElementById('mini-titulo');
const miniArtista = document.getElementById('mini-artista');
const miniPortada = document.getElementById('mini-portada');

function reproducirAleatorio() {
    if (cancionesDisponibles.length === 0) cancionesDisponibles = [...listaCanciones];
    const indiceAzar = Math.floor(Math.random() * cancionesDisponibles.length);
    const cancionElegida = cancionesDisponibles[indiceAzar];
    cancionesDisponibles.splice(indiceAzar, 1);

    audioCore.src = cancionElegida.archivo;
    miniTitulo.textContent = cancionElegida.titulo;
    if (miniArtista) miniArtista.textContent = cancionElegida.artista;

    if (miniPortada) {
        miniPortada.src = cancionElegida.portada + "?t=" + new Date().getTime();
    }
    audioCore.play().catch(e => console.log("Auto-play bloqueado"));
}

const frasesRincon = [
    "tu sonrisa", "tus ojos", "tu voz", "tu forma de ser", "tu boca", "tu inteligencia",
"tu risa", "tu personalidad", "tu pelo", "tu manera de caminar", "tu humor",
"tu mirada", "tu intensidad", "tu sinceridad", "tu compañía", "tu independencia",
"tu forma de vestir", "tu estilo", "tu energía", "tu carácter", "tus manos",
"tu manera de pensar", "tus reacciones", "tu locura", "tu honestidad",
"tu paciencia", "tu forma de decir las cosas", "tu intuición", "tu curiosidad",
"tu forma de decidir", "tu autenticidad", "tu voz al reírte",
"tu memoria para las boludeces", "tu ritmo", "tu forma de contestar",
"tu complicidad", "tu presencia", "tu desorden", "tu voz al susurrar",
"tu manera de ver las cosas", "tu forma de disfrutar", "tu manera de ser cuando estamos solos"
];

function generarFraseRincon() {
    const el = document.getElementById('texto-frase-rincon');
    if (el) el.textContent = frasesRincon[Math.floor(Math.random() * frasesRincon.length)];
}

function cambiarSeccion(destino) {
    document.querySelectorAll('.carta-contenido').forEach(c => c.classList.remove('activo'));
    const idDestino = (destino === 'principal') ? 'seccion-principal' : 'seccion-' + destino;
    const elemento = document.getElementById(idDestino);
    if (elemento) {
        elemento.classList.add('activo');
        if (destino === 'rincon1') generarFraseRincon();
    }
}

function toggleColores() {
    const s = document.getElementById('submenu-colores');
    if (s) s.style.display = (s.style.display === 'none' || s.style.display === '') ? 'block' : 'none';
}

function actualizarContador() {
    const fechaInicio = new Date('2025-10-15T00:00:00');
    const ahora = new Date();
    const diff = ahora - fechaInicio;
    const segundosTotales = Math.floor(diff / 1000);
    const minutesTotales = Math.floor(segundosTotales / 60);
    const horasTotales = Math.floor(minutesTotales / 60);
    const diasTotales = Math.floor(horasTotales / 24);

    const elemento = document.getElementById('contador-tiempo');
    if (elemento) {
        elemento.innerHTML = `
        Segundos: <strong>${segundosTotales.toLocaleString()}</strong><br>
        Minutos: <strong>${minutesTotales.toLocaleString()}</strong><br>
        Horas: <strong>${horasTotales.toLocaleString()}</strong><br>
        Días: <strong>${diasTotales}</strong><br><br>
        Amaneceres: <strong>${diasTotales}</strong>, Tardes: <strong>${diasTotales}</strong>, Noches: <strong>${diasTotales}</strong>
        `;
    }
}

function iniciarExperiencia() {
    document.getElementById('pantalla-inicio').style.display = 'none';
    reproducirAleatorio();
    setInterval(actualizarContador, 1000);
    actualizarContador();
}
