/* =========================================================
Radio del Bosque LP - Script Principal Optimizado
Manejo profesional de Streaming, Reconexión y UI
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURACIÓN GLOBAL ---
    const STREAM_URL = 'https://uk5freenew.listen2myradio.com/live.mp3?typeportmount=s1_13354_stream_641358950';
    const RECONNECT_DELAY = 5000; // 5 segundos entre intentos
    const MAX_RECONNECT_ATTEMPTS = 10; // Límite de intentos para no colgar el navegador infinitamente
    
    // --- ELEMENTOS DOM ---
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const programmingGrid = document.getElementById('programmingGrid');
    const donateModal = document.getElementById('donateModal');
    const btnColaborar = document.getElementById('btnColaborar');
    const donateClose = document.getElementById('donateClose');
    const btnOpenPlayer = document.getElementById('btnOpenPlayer');
    
    // Elementos del Reproductor
    const stickyPlayer = document.getElementById('stickyPlayer');
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const playerStatus = document.getElementById('playerStatus');
    const volumeSlider = document.getElementById('volumeSlider');
    const equalizer = document.getElementById('equalizer');

    // --- ESTADO DEL REPRODUCTOR ---
    let isPlaying = false;
    let reconnectTimer = null;
    let reconnectAttempts = 0;
    let userInteracted = false;

    // --- INICIALIZACIÓN UI ---
    
    // 1. Header Scroll
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('header--scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // 2. Menú Móvil
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('header__nav--open');
        });
        document.querySelectorAll('.header__link').forEach(link => {
            link.addEventListener('click', () => nav.classList.remove('header__nav--open'));
        });
    }

    // 3. Modal Donación
    if (btnColaborar && donateModal) {
        btnColaborar.addEventListener('click', () => {
            donateModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        const closeModal = () => {
            donateModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        donateClose.addEventListener('click', closeModal);
        donateModal.addEventListener('click', (e) => {
            if (e.target === donateModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && donateModal.classList.contains('active')) closeModal();
        });
    }

    // 4. Generar Ecualizador Visual
    if (equalizer) {
        equalizer.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const bar = document.createElement('div');
            bar.className = 'player-bar';
            // Animación aleatoria para parecer más natural
            bar.style.animationDuration = `${0.4 + Math.random() * 0.4}s`;
            bar.style.animationDelay = `${i * 0.1}s`;
            equalizer.appendChild(bar);
        }
    }

    // --- LÓGICA DEL REPRODUCTOR DE AUDIO PROFESIONAL ---

    function updatePlayButton(playing) {
        if (playing) {
            playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; // Pause icon
            playBtn.classList.add('player-card__play-btn--playing');
            document.querySelectorAll('.player-bar').forEach(b => b.classList.add('active'));
        } else {
            playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
            playBtn.classList.remove('player-card__play-btn--playing');
            document.querySelectorAll('.player-bar').forEach(b => b.classList.remove('active'));
        }
    }

    function setPlayerStatus(text, isError = false) {
        if (playerStatus) {
            playerStatus.textContent = text;
            playerStatus.style.color = isError ? 'var(--red-live)' : 'var(--green-accent)';
        }
    }

    function connectStream() {
        if (!audioPlayer) return;
        
        // Evitar múltiples cargas simultáneas
        if (audioPlayer.src && audioPlayer.readyState >= 2) return;

        setPlayerStatus('Conectando...', false);
        
        // Añadir timestamp para evitar caché agresiva del navegador
        const uniqueUrl = `${STREAM_URL}&t=${Date.now()}`;
        
        // Solo cambiar src si es diferente o si fue reseteado
        if (audioPlayer.src !== uniqueUrl) {
            audioPlayer.src = uniqueUrl;
        }
        
        audioPlayer.load();
        
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                reconnectAttempts = 0; // Resetear intentos al conectar exitosamente
                updatePlayButton(true);
                setPlayerStatus('Transmitiendo en Vivo', false);
                stickyPlayer.classList.add('visible');
            }).catch(error => {
                console.warn('Autoplay prevenido o error de conexión:', error);
                // No mostramos error crítico aquí, esperamos a que el usuario interactúe
                setPlayerStatus('Click Play para iniciar', false);
                isPlaying = false;
                updatePlayButton(false);
            });
        }
    }

    function disconnectStream() {
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.src = '';
            isPlaying = false;
            updatePlayButton(false);
            setPlayerStatus('Pausado', false);
            
            // Limpiar timer de reconexión si existe
            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
                reconnectTimer = null;
            }
        }
    }

    function attemptReconnect() {
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            setPlayerStatus('Error de conexión. Intenta más tarde.', true);
            return;
        }
        
        reconnectAttempts++;
        setPlayerStatus(`Reconectando... (${reconnectAttempts})`, false);
        
        reconnectTimer = setTimeout(() => {
            connectStream();
        }, RECONNECT_DELAY);
    }

    // Event Listeners del Audio
    if (audioPlayer) {
        audioPlayer.volume = 0.8; // Volumen inicial
        
        audioPlayer.addEventListener('playing', () => {
            isPlaying = true;
            updatePlayButton(true);
            setPlayerStatus('Transmitiendo en Vivo', false);
            reconnectAttempts = 0;
        });

        audioPlayer.addEventListener('pause', () => {
            // Si no es por error, actualizamos UI
            if (!audioPlayer.error) {
                isPlaying = false;
                updatePlayButton(false);
                setPlayerStatus('Pausado', false);
            }
        });

        audioPlayer.addEventListener('error', (e) => {
            console.error('Error de audio:', audioPlayer.error);
            isPlaying = false;
            updatePlayButton(false);
            setPlayerStatus('Error de señal. Reconectando...', true);
            attemptReconnect();
        });

        audioPlayer.addEventListener('stalled', () => {
            setPlayerStatus('Buffering...', false);
        });

        audioPlayer.addEventListener('waiting', () => {
            setPlayerStatus('Cargando señal...', false);
        });
    }

    // Control Manual Play/Pause
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            userInteracted = true;
            stickyPlayer.classList.add('visible');
            
            if (isPlaying) {
                disconnectStream();
            } else {
                connectStream();
            }
        });
    }

    // Botón "Escuchar" del Hero (Scroll al player y activa)
    if (btnOpenPlayer) {
        btnOpenPlayer.addEventListener('click', () => {
            stickyPlayer.classList.add('visible');
            if (!isPlaying) {
                connectStream();
            }
            // Scroll suave hacia abajo para mostrar el player si está muy arriba
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });
    }

    // Control de Volumen
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            if (audioPlayer) {
                audioPlayer.volume = parseFloat(e.target.value);
            }
        });
    }

    // --- GENERACIÓN DE PROGRAMACIÓN ---
    if (programmingGrid) {
        const programs = [
            { id: 1, title: 'Por Siempre Clásicos', time: '05:00 - 09:00', days: 'Todos los días', host: 'Música de los 70, 80, 90 y 2000', category: 'Música', icon: '🎵', image: 'images/Por Siempre Clásicos.png' },
            { id: 2, title: 'Desayuno con Fakundo DN', time: '09:00 - 11:00', days: 'Lunes a Viernes', host: 'Fakundo DN', category: 'Magazine', icon: '🎙️', image: 'images/Desayuno con Fakundo DN.png' },
            { id: 3, title: 'La Tarde de Radio del Bosque', time: '12:00 - 16:00', days: 'Lunes a Viernes', host: 'Vivi', category: 'Radiofórmula', icon: '', image: 'images/vivi.png' },
            { id: 4, title: 'Mediodía en el Bosque', time: '12:00 - 14:00', days: 'Lunes a Viernes', host: 'Equipo Radio del Bosque', category: 'Variedades', icon: '☀️', image: 'images/Mediodia en el Bosque.png' },
            { id: 5, title: 'Resumen de Noticias - Mañana', time: '12:00 HS', days: 'Lunes a Viernes', host: 'Resumen de la mañana', category: 'Noticias', icon: '📰', image: 'images/Resumen de Noticias - Mañana.jpg' },
            { id: 6, title: 'La Tarde del Bosque', time: '16:00 - 19:00', days: 'Lunes a Viernes', host: 'Equipo Radio del Bosque', category: 'Musical', icon: '', image: 'images/La Tarde del Bosque.png' },
            { id: 9, title: 'El Bosque del Fin de Semana', time: '10:00 - 14:00', days: 'Sábados y Domingos', host: 'Equipo Radio del Bosque', category: 'Fin de Semana', icon: '🎶', image: 'images/Fin de Semana.png' },
            { id: 10, title: 'Pasajeros del Espacio', time: '10:00 - 13:00', days: 'Sábados', host: 'Marisa Waters, Fakundo DN y Rocío Escalante', category: 'Especial', icon: '🚀', image: 'images/Pasajeros del Espacio.png' },
        ];

        // Insertar tarjeta de "Espacios Disponibles" primero
        const promoCardHTML = `
        <div class="program-card" style="grid-column: 1 / -1; background: transparent; border: none; box-shadow: none;">
            <div style="background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary)); border-radius: var(--radius-md); overflow: hidden; border: 1px solid rgba(95, 191, 138, 0.15);">
                <div class="program-card__image" style="aspect-ratio: 21/9;">
                    <img src="images/programas_espacios.jpg" alt="Espacios para nuevos programas" loading="lazy" />
                    <div class="program-card__image-overlay"></div>
                </div>
                <div class="program-card__content" style="padding: 40px; text-align: left;">
                    <h2 class="program-card__title" style="font-size: 2rem; margin-bottom: 24px; color: var(--gold);">¿Siempre soñaste con tener tu propio programa de radio?</h2>
                    <p class="about-text" style="margin-bottom: 16px;">Este puede ser el momento de hacerlo realidad.</p>
                    <p class="about-text" style="margin-bottom: 16px;">En Radio del Bosque abrimos nuestra programación a nuevas propuestas y buscamos personas con ganas de comunicar, crear y compartir sus ideas.</p>
                    <p class="about-text" style="margin-bottom: 16px;"><strong>Recibimos propuestas de:</strong></p>
                    <ul style="list-style: disc; margin-left: 20px; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.8;">
                        <li>Programas en vivo.</li>
                        <li>Programas grabados (enlatados).</li>
                        <li>Contenidos culturales, musicales, periodísticos, deportivos, educativos, de entretenimiento y temáticos.</li>
                    </ul>
                    <p class="about-text" style="margin-bottom: 16px;">Todos los programas cuentan con repetición durante el fin de semana para llegar a una mayor audiencia.</p>
                    <p class="about-text" style="margin-bottom: 32px; font-weight: 600; color: var(--green-accent);">Consultá por los horarios disponibles.</p>
                    <h3 class="program-card__title" style="font-size: 1.5rem; margin-bottom: 16px; color: var(--text-primary);">Un espacio abierto para nuevas voces</h3>
                    <p class="about-text" style="margin-bottom: 16px;">En Radio del Bosque no cobramos espacio de aire. Creemos que la comunicación debe generar oportunidades y no barreras.</p>
                    <p class="about-text" style="margin-bottom: 16px;">Únicamente solicitamos una <strong>colaboración voluntaria</strong>, cuyo monto queda a criterio de cada conductor o equipo de trabajo.</p>
                    <p class="about-text" style="margin-bottom: 16px;">Además, cada programa puede contar con <strong>sus propios auspiciantes</strong>, cuyos anuncios serán exclusivos dentro del espacio que realicen.</p>
                    <p class="about-text" style="margin-bottom: 32px;">No importa si es tu primera experiencia o si ya tenés recorrido en los medios. Lo más importante es tener una idea, una voz y las ganas de compartirla.</p>
                    <blockquote style="border-left: 4px solid var(--gold); padding-left: 20px; margin: 32px 0; font-style: italic; color: var(--text-primary); font-size: 1.1rem;">
                        "Las mejores historias empiezan cuando alguien se anima a encender un micrófono. Tu programa puede ser la próxima."
                    </blockquote>
                    <div style="margin-top: 32px;">
                        <a href="https://wa.me/5492216023878?text=Hola!%20Quiero%20información%20sobre%20cómo%20tener%20mi%20propio%20programa" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                            Quiero tener mi programa
                        </a>
                    </div>
                </div>
            </div>
        </div>`;

        const cardsHTML = programs.map(p => `
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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                            ${p.time} · ${p.days}
                        </span>
                    </div>
                    <p class="program-card__host">${p.host}</p>
                </div>
            </div>
        `).join('');

        programmingGrid.innerHTML = promoCardHTML + cardsHTML;
    }
});