import { showToast } from '../utils/toast.js';

export function renderCreatePlan() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    window.location.hash = '#login';
    return '';
  }

  const user = JSON.parse(userStr);

  setTimeout(() => {
    const form = document.getElementById('create-plan-form');
    const timeSelect = document.getElementById('time');
    const customTimeContainer = document.getElementById('custom-time-container');
    const customTimeInput = document.getElementById('custom-time');

    if (timeSelect && customTimeContainer) {
      timeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
          customTimeContainer.classList.remove('hidden');
          customTimeInput.setAttribute('required', 'true');
        } else {
          customTimeContainer.classList.add('hidden');
          customTimeInput.removeAttribute('required');
        }
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const topic = document.getElementById('topic').value;
        let time = document.getElementById('time').value;
        
        if (time === 'custom') {
          const days = document.getElementById('custom-time').value;
          time = `${days} dias`;
        }

        const submitBtn = document.getElementById('submit-btn');
        const loadingOverlay = document.getElementById('loading-overlay');
        
        // Desabilitar o formulário e mostrar a tela de carregamento animada
        submitBtn.disabled = true;
        loadingOverlay.classList.remove('hidden');
        loadingOverlay.classList.add('flex');

        try {
          // Chamada para a API (que aguarda 10 segundos simulando a IA ou chama o n8n real)
          const res = await fetch('/api/plans/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, topic, time })
          });
          
          const data = await res.json();
          
          if (!res.ok) {
            throw new Error(data.error || 'Erro ao gerar o plano.');
          }

          // Redirecionar para a tela de visualização do plano
          window.location.hash = `#ver-plano?id=${data.id}`;
          showToast('Plano criado com sucesso!', 'success');
        } catch (error) {
          showToast(error.message, 'error');
          submitBtn.disabled = false;
          loadingOverlay.classList.add('hidden');
          loadingOverlay.classList.remove('flex');
        }
      });
    }
  }, 0);

  return `
    <div class="min-h-screen flex flex-col bg-light font-sans text-dark relative">
      
      <!-- Overlay de Carregamento da IA -->
      <div id="loading-overlay" class="hidden fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex-col items-center justify-center">
        <div class="w-24 h-24 relative mb-8">
          <div class="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Trabalhando duro...</h2>
        <p class="text-lg text-gray-600 font-medium">Nossa IA está criando seu plano personalizado...</p>
        <p class="text-sm text-gray-400 mt-4">Isso pode levar de 10 a 15 segundos.</p>
      </div>

      <header class="w-full py-4 px-8 flex justify-between items-center bg-white shadow-sm border-b border-gray-100">
        <div class="flex items-center gap-2 cursor-pointer" onclick="window.location.hash='#dashboard'">
          <img src="/logo.png" alt="SmartStudy Logo" class="w-10 h-10 object-contain rounded-lg shadow-sm" />
          <span class="text-xl font-extrabold tracking-tight">Smart<span class="text-primary-500">Study</span></span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-gray-600 font-medium hidden sm:inline-block">Olá, ${user.name}</span>
          <button onclick="localStorage.removeItem('user'); window.location.hash='#login'" class="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-md">
            Sair
          </button>
        </div>
      </header>

      <main class="flex-grow flex items-center justify-center p-6">
        <div class="max-w-2xl w-full glass-card p-10 relative z-10">
          <button onclick="window.location.hash='#dashboard'" class="text-gray-500 hover:text-primary-600 font-medium flex items-center gap-2 mb-6 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Voltar ao Dashboard
          </button>

          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Criar novo plano de estudos</h2>
          <p class="text-gray-600 mb-8">Nossa IA construirá um cronograma focado no seu objetivo e disponibilidade.</p>

          <form id="create-plan-form" class="space-y-6">
            <div>
              <label for="topic" class="block text-sm font-bold text-gray-700 mb-2">O que você quer aprender?</label>
              <input type="text" id="topic" required class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-colors" placeholder="Ex: Python para iniciantes, Marketing digital, Fotografia">
            </div>

            <div>
              <label for="time" class="block text-sm font-bold text-gray-700 mb-2">Quanto tempo você tem disponível para o plano?</label>
              <select id="time" required class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-colors bg-white">
                <option value="" disabled selected>Selecione uma opção</option>
                <option value="1 semana">1 semana</option>
                <option value="2 semanas">2 semanas</option>
                <option value="1 mês">1 mês</option>
                <option value="2 meses">2 meses</option>
                <option value="3 meses">3 meses</option>
                <option value="custom">Outro (Personalizado)</option>
              </select>
            </div>

            <div id="custom-time-container" class="hidden">
              <label for="custom-time" class="block text-sm font-bold text-gray-700 mb-2">Quantos dias?</label>
              <div class="relative">
                <input type="number" id="custom-time" min="1" class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-colors pr-16" placeholder="Ex: 45">
                <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 font-medium">
                  dias
                </div>
              </div>
            </div>

            <div class="pt-4">
              <button id="submit-btn" type="submit" class="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                Gerar Plano
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `;
}
