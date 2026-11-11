(() => {
  const fileName = window.location.pathname.split('/').pop() || 'index.html';
  const isInsideRadioShell = window.top !== window.self;
  const standalonePages = [
    'radio-site.html',
    'home.html',
    'marcas.html',
    'novedades.html',
    'eventos.html',
    'programas.html',
    'encuentros-en-el-bosque-audios.html'
  ];

  // Si alguien entra directamente a una página secundaria, la abrimos dentro
  // del contenedor persistente para que el audio no se interrumpa.
  if (!isInsideRadioShell && standalonePages.includes(fileName)) {
    const destination = `index.html?page=${encodeURIComponent(fileName)}${window.location.hash}`;
    window.location.replace(destination);
    return;
  }
  if (!isInsideRadioShell) return;

  // Las secciones se cargan dentro del marco, sin destruir el audio del shell.
  document.querySelectorAll('a[href]').forEach((link) => {
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (_) {
      return;
    }
    if (url.origin !== window.location.origin || !url.pathname.endsWith('.html')) return;
    if (url.pathname.endsWith('/index.html') || url.pathname.endsWith('index.html')) {
      url.pathname = url.pathname.replace(/index\.html$/, 'home.html');
      link.href = `${url.pathname}${url.search}${url.hash}`;
    }
    link.target = 'radio-content';
  });

  // En las secciones que no tenían reproductor, se muestra en el flujo normal
  // justo debajo del encabezado; nunca queda flotando sobre el contenido.
  if (!document.getElementById('radioPlayerWidget')) {
    if (!document.querySelector('link[href="css/radio-player.css"]')) {
      const playerStyles = document.createElement('link');
      playerStyles.rel = 'stylesheet';
      playerStyles.href = 'css/radio-player.css';
      document.head.appendChild(playerStyles);
    }
    const slot = document.createElement('div');
    slot.className = 'radio-player-slot';
    slot.innerHTML = `
      <div class="radio-player-widget" id="radioPlayerWidget">
        <div class="rp-autoplay-fallback" id="autoplayFallback">
          <button class="rp-fallback-btn" id="fallbackBtn" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
            Escuchar en vivo
          </button>
        </div>
        <div class="rp-status-bar">
          <div class="rp-status-indicator loading" id="statusIndicator"><div class="rp-status-dot"></div><span id="statusText">Cargando...</span></div>
          <div class="rp-volume-control">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>
            <input type="range" min="0" max="1" step="0.1" value="1" class="rp-volume-slider" id="volumeSlider" aria-label="Volumen de la radio">
          </div>
        </div>
        <div class="rp-main-controls">
          <button class="rp-play-btn" id="playPauseBtn" type="button" aria-label="Reproducir">
            <svg id="iconPlay" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            <svg id="iconPause" viewBox="0 0 24 24" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
          </button>
          <div class="rp-info"><div class="rp-station-name">Radio del Bosque</div><div class="rp-stream-label">Streaming en vivo</div></div>
        </div>
        <div class="rp-error-msg" id="errorMsg">La transmisión está fuera de línea por el momento. Se reconectará cuando vuelva la señal.</div>
      </div>`;

    const header = document.querySelector('header');
    const main = document.querySelector('main');
    if (header) header.insertAdjacentElement('afterend', slot);
    else if (main) main.insertAdjacentElement('beforebegin', slot);
    else document.body.insertAdjacentElement('afterbegin', slot);
  }
})();
