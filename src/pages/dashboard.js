export function renderDashboard() {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    window.location.hash = '#login';
    return '';
  }

  const user = JSON.parse(userStr);

  // Função para buscar planos da API
  setTimeout(async () => {
    try {
      const res = await fetch(`/api/plans?userId=${user.id}`);
      const plans = await res.json();
      
      const plansContainer = document.getElementById('plans-container');
      
      if (plans.length === 0) {
        plansContainer.innerHTML = `
          <div class="glass-card p-12 text-center border-dashed border-2 border-gray-300">
            <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Você ainda não tem nenhum plano</h3>
            <p class="text-gray-500 mb-6">Que tal criar o primeiro agora mesmo e organizar seus estudos?</p>
            <button class="bg-primary-100 text-primary-700 font-bold px-6 py-2 rounded-full hover:bg-primary-200 transition-colors" onclick="window.location.hash='#novo-plano'">
              Criar meu primeiro plano
            </button>
          </div>
        `;
      } else {
        plansContainer.innerHTML = `
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${plans.map(plan => `
              <div class="glass-card p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-xl font-bold text-gray-900 leading-tight">${plan.topic}</h3>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    ${plan.time_available}
                  </span>
                </div>
                <div class="text-sm text-gray-500 mb-6 flex-grow">
                  Criado em: ${new Date(plan.created_at).toLocaleDateString('pt-BR')}
                </div>
                <button class="w-full bg-gray-50 hover:bg-primary-50 text-primary-600 font-semibold py-2 px-4 border border-gray-200 hover:border-primary-200 rounded-lg transition-colors" onclick="window.location.hash='#ver-plano?id=${plan.id}'">
                  Ver plano completo
                </button>
              </div>
            `).join('')}
          </div>
        `;
      }
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      document.getElementById('plans-container').innerHTML = `
        <div class="text-red-500 text-center p-4">Erro ao carregar os planos. Tente novamente mais tarde.</div>
      `;
    }
  }, 0);

  return `
    <div class="min-h-screen flex flex-col bg-light font-sans text-dark">
      <header class="w-full py-4 px-8 flex justify-between items-center bg-white shadow-sm border-b border-gray-100">
        <div class="flex items-center gap-2 cursor-pointer" onclick="window.location.hash='#'">
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

      <main class="flex-grow max-w-6xl mx-auto w-full p-6 md:p-8">
        <div class="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900">Olá, ${user.name.split(' ')[0]}! Pronto para aprender algo novo?</h1>
            <p class="text-gray-500 mt-2 text-lg">Gerencie seus roteiros criados por Inteligência Artificial ou comece um novo.</p>
          </div>
          <button class="btn-primary" onclick="window.location.hash='#novo-plano'">
            + Criar Novo Plano
          </button>
        </div>

        <h2 class="text-xl font-bold text-gray-800 mb-6 px-2">Seus Planos Recentes</h2>
        
        <div id="plans-container">
          <!-- O conteúdo será injetado via JS -->
          <div class="flex justify-center items-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </main>
    </div>
  `;
}
