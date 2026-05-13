import './style.css';
import { renderHome } from './pages/home.js';
import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderCreatePlan } from './pages/create-plan.js';
import { renderViewPlan } from './pages/view-plan.js';

const app = document.querySelector('#app');

function router() {
  const hash = window.location.hash;

  if (hash === '#login') {
    app.innerHTML = renderLogin();
  } else if (hash === '#cadastro') {
    app.innerHTML = renderRegister();
  } else if (hash === '#dashboard') {
    app.innerHTML = renderDashboard();
  } else if (hash === '#novo-plano') {
    app.innerHTML = renderCreatePlan();
  } else if (hash.startsWith('#ver-plano')) {
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const id = urlParams.get('id');
    app.innerHTML = renderViewPlan(id);
  } else if (hash === '' || hash === '#' || hash.startsWith('#como-funciona') || hash.startsWith('#beneficios')) {
    // Se não for rota específica de página inteira, carrega a home.
    // O navegador se encarrega de rolar para o #id específico se a home já estiver carregada.
    // Mas se viermos direto para a URL com hash de âncora, precisamos renderizar a home.
    if (!app.innerHTML.includes('SmartStudy AI')) {
      app.innerHTML = renderHome();
    }
  } else {
    app.innerHTML = renderHome();
  }
}

// Escuta as mudanças na URL (hash)
window.addEventListener('hashchange', router);

// Renderiza a página correta na primeira vez que carrega
window.addEventListener('load', router);
