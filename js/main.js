/* =========================================================
   Radio del Bosque LP - Script principal
   Compartido por index.html y páginas de galería
   ========================================================= */

/* ---------- Header scroll ---------- */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 50);
  });
}

/* ---------- Menú móvil ---------- */
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('header__nav--open');
  });
  document.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('header__nav--open'));
  });
}

/* ---------- Reproductor de audio ---------- */
const audioPlayer = document.getElementById('audioPlayer');
if (audioPlayer) {
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const playerStatus = document.getElementById('playerStatus');
  const volumeSlider = document.getElementById('volumeSlider');
  const equalizer = document.getElementById('equalizer');
  let isPlaying = false;
  const streamUrl = 'https://uk5freenew.listen2myradio.com/live.mp3?typeportmount=s1_13354_stream_641358950';

  if (equalizer) {
    for (let i = 0; i < 24; i++) {
      const bar = document.createElement('div');
      bar.className = 'player-card__bar';
      bar.style.animationDelay = `${i * 0.08}s`;
      equalizer.appendChild(bar);
    }
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audioPlayer.volume = parseFloat(e.target.value);
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
        playBtn.classList.remove('player-card__play-btn--playing');
        playerStatus.textContent = 'Listo para escuchar';
        document.querySelectorAll('.player-card__bar').forEach(b => b.classList.remove('player-card__bar--active'));
      } else {
        audioPlayer.src = streamUrl;
        audioPlayer.play().then(() => {
          isPlaying = true;
          playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
          playBtn.classList.add('player-card__play-btn--playing');
          playerStatus.textContent = 'Transmitiendo ahora';
          document.querySelectorAll('.player-card__bar').forEach(b => b.classList.add('player-card__bar--active'));
        }).catch(err => console.error('Error al reproducir:', err));
      }
    });
  }
}

/* ---------- Programación ---------- */
const programmingGrid = document.getElementById('programmingGrid');
if (programmingGrid) {
  const programs = [
    { id: 1, title: 'Por Siempre Clásicos', time: '05:00 - 09:00', days: 'Todos los días', host: 'Música de los 70, 80, 90 y 2000', category: 'Música', icon: '', image: 'images/Por Siempre Clásicos.png' },
    { id: 2, title: 'Desayuno con Fakundo DN', time: '09:00 - 11:00', days: 'Lunes a Viernes', host: 'Fakundo DN', category: 'Magazine', icon: '🎙️', image: 'images/Desayuno con Fakundo DN.png' },
    { id: 3, title: 'Mediodía en el Bosque', time: '12:00 - 14:00', days: 'Lunes a Viernes', host: 'Equipo Radio del Bosque', category: 'Variedades', icon: '☀️', image: 'images/Mediodia en el Bosque.png' },
    { id: 4, title: 'Resumen de Noticias - Mañana', time: '12:00 HS', days: 'Lunes a Viernes', host: 'Resumen de la mañana', category: 'Noticias', icon: '📰', image: 'images/Resumen de Noticias - Mañana.jpg' },
    { id: 5, title: 'La Tarde del Bosque', time: '16:00 - 19:00', days: 'Lunes a Viernes', host: 'Equipo Radio del Bosque', category: 'Musical', icon: '🌳', image: 'images/La Tarde del Bosque.png' },
    { id: 6, title: 'Resumen de Noticias - Tarde', time: '19:00 HS', days: 'Lunes a Viernes', host: 'Resumen de la tarde', category: 'Noticias', icon: '📰', image: 'images/Resumen de Noticias - Tarde.png' },
    { id: 7, title: 'Noche en el Bosque', time: '21:00 - 00:00', days: 'Lunes a Viernes', host: 'Equipo Radio del Bosque', category: 'Nocturno', icon: '', image: 'images/Noche en el Bosque.png' },
    { id: 8, title: 'El Bosque del Fin de Semana', time: '10:00 - 14:00', days: 'Sábados y Domingos', host: 'Equipo Radio del Bosque', category: 'Fin de Semana', icon: '', image: 'images/Fin de Semana.png' },
    { id: 9, title: 'Pasajeros del Espacio', time: '10:00 - 13:00', days: 'Sábados', host: 'Marisa Waters, Fakundo DN y Rocío Escalante', category: 'Especial', icon: '🚀', image: 'images/Pasajeros del Espacio.png' },
  ];

  programmingGrid.innerHTML = programs.map(p => `
    <div class="program-card">
      <div class="program-card__image">
        <img src="${p.image}" alt="${p.title}" loading="lazy" />
        <div class="program-card__image-overlay"></div>
        <span class="program-card__icon-badge">${p.icon}</span>
      </div>
      <div class="program-card__content">
        <span class="program-card__category">${p.category}</span>
        <h3 class="program-card__title">${p.title}</h3>
        <div class="program-card__meta">
          <span class="program-card__time">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            ${p.time} · ${p.days}
          </span>
        </div>
        <p class="program-card__host">${p.host}</p>
      </div>
    </div>
  `).join('');
}

/* ---------- Galería (páginas internas) ---------- */
const galleryImages = {
  bichos: [
    { src: 'images/Conductor con auriculares en cabina.jpg', alt: 'Conductor con auriculares en cabina' },
    { src: 'images/Dos locutoras al aire.jpg', alt: 'Dos locutoras al aire' },
    { src: 'images/Equipo completo en cabina.jpg', alt: 'Equipo completo en cabina' },
    { src: 'images/Locutores con auriculares.jpg', alt: 'Locutores con auriculares' },
    { src: 'images/Transmisión nocturna.jpg', alt: 'Transmisión nocturna' },
  ],
  carrusel: [
    { src: 'images/Equipo en cabina.jpg', alt: 'Equipo en cabina' },
    { src: 'images/Equipo leyendo guiones.jpg', alt: 'Equipo leyendo guiones' },
    { src: 'images/Locutores trabajando.jpg', alt: 'Locutores trabajando' },
    { src: 'images/Plena transmisión.jpg', alt: 'Plena transmisión' },
    { src: 'images/Equipo con árbol de Navidad.jpg', alt: 'Equipo con árbol de Navidad' },
  ],
  encuentros: [
    { src: 'images/Marta Navarro en el estudio.jpg', alt: 'Marta Navarro en el estudio' },
    { src: 'images/Locutora al aire.jpg', alt: 'Locutora al aire' },
    { src: 'images/Tres mujeres en cabina.jpg', alt: 'Tres mujeres en cabina' },
    { src: 'images/Marta Navarro junto al árbol.jpg', alt: 'Marta Navarro junto al árbol' },
    { src: 'images/Foto artística en cabina.jpg', alt: 'Foto artística en cabina' },
  ],
};

const galleryGrid = document.getElementById('galleryGrid');
if (galleryGrid) {
  const category = galleryGrid.dataset.category;
  const imgs = galleryImages[category] || [];

  galleryGrid.innerHTML = imgs.map((img, idx) => `
    <div class="gallery-item" data-idx="${idx}" tabindex="0" role="button" aria-label="Ver imagen: ${img.alt}">
      <img src="${img.src}" alt="${img.alt}" loading="lazy" />
      <div class="gallery-item__overlay" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/></svg>
      </div>
    </div>
  `).join('');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  const openLightbox = (idx) => {
    const img = imgs[parseInt(idx)];
    if (!img || !lightbox) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add('active');
  };

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item.dataset.idx));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item.dataset.idx);
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', () => lightbox.classList.remove('active'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.classList.remove('active');
    });
  }
}