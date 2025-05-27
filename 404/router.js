// router.js - SPA navigation and 404 fallback

const VALID_ROUTES = ['/', '/404'];
const PAGE_404 = '/404';
const HOME = '/';
const LOADING_TIMEOUT = 15000; // 15 segundos

// Função para navegar para uma rota
function navigateTo(path) {
  if (VALID_ROUTES.includes(path)) {
    window.history.pushState({}, '', path);
    handleRouting();
    return;
  }
  // Se não for rota conhecida, vai para 404
  window.location.href = PAGE_404;
}

// Detecta se a rota é válida ou não
function handleRouting() {
  const path = window.location.pathname;

  // Se for rota válida, carrega normalmente
  if (VALID_ROUTES.includes(path)) {
    return;
  }

  // Se não for rota válida, redireciona para 404
  if (path !== PAGE_404) {
    window.location.href = PAGE_404;
  }
}

// Timeout para carregamento
let loadingTimeout = setTimeout(() => {
  window.location.href = PAGE_404;
}, LOADING_TIMEOUT);

// Limpa o timeout se a página carregar normalmente
window.addEventListener('DOMContentLoaded', () => {
  clearTimeout(loadingTimeout);
  handleRouting();
});

// Exponha funções se quiser usar navegação programática
window.router = {
  navigateTo,
  handleRouting
};

// Chame handleRouting() ao carregar a página e ao navegar
window.addEventListener('DOMContentLoaded', handleRouting);
window.addEventListener('popstate', handleRouting); 