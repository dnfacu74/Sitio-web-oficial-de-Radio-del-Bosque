(() => {
  const fileName = window.location.pathname.split('/').pop() || 'index.html';
  const isInsideRadioShell = window.top !== window.self;
  const standalonePages = [
    'home.html',
    'marcas.html',
    'novedades.html',
    'eventos.html',
    'programas.html',
    'encuentros-en-el-bosque-audios.html'
  ];

  // Si alguien entra directamente a una página secundaria, la abrimos dentro
  // del contenedor persistente para que el reproductor quede activo.
  if (!isInsideRadioShell && standalonePages.includes(fileName)) {
    const destination = `index.html?page=${encodeURIComponent(fileName)}${window.location.hash}`;
    window.location.replace(destination);
    return;
  }

  if (!isInsideRadioShell) return;

  // Todos los enlaces internos se cargan dentro del iframe del shell.
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
})();
