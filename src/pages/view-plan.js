import { showToast } from '../utils/toast.js';

export function renderViewPlan(planId) {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    window.location.hash = '#login';
    return '';
  }

  const user = JSON.parse(userStr);

  setTimeout(async () => {
    try {
      const res = await fetch(`/api/plans/${planId}`);
      if (!res.ok) throw new Error('Falha ao carregar o plano.');
      
      const plan = await res.json();
      
      document.getElementById('plan-topic').textContent = plan.topic;
      document.getElementById('plan-time').textContent = plan.time_available;
      document.getElementById('plan-date').textContent = new Date(plan.created_at).toLocaleDateString('pt-BR');
      
      // Lógica de exclusão
      const deleteBtn = document.getElementById('delete-btn');
      deleteBtn.addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja excluir este plano de estudos? Esta ação não pode ser desfeita.')) {
          deleteBtn.disabled = true;
          deleteBtn.textContent = 'Excluindo...';
          
          try {
            const delRes = await fetch(`/api/plans/${planId}`, { method: 'DELETE' });
            if (!delRes.ok) throw new Error('Erro ao excluir plano.');
            window.location.hash = '#dashboard';
            showToast('Plano excluído com sucesso!', 'success');
          } catch (error) {
            showToast(error.message, 'error');
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Excluir Plano
            `;
          }
        }
      });

      // Parse do conteúdo do plano para Cards
      const rawContent = plan.plan_content;
      
      // Divide por ## para separar as seções (módulos/semanas)
      const sections = rawContent.split('## ').filter(s => s.trim().length > 0);
      
      let htmlContent = '';
      
      if (sections.length <= 1 && !rawContent.includes('##')) {
         // Formato simples sem módulos
         htmlContent = `<div class="glass-card p-6 md:p-8"><p class="whitespace-pre-line text-gray-700 text-lg leading-relaxed">${rawContent}</p></div>`;
      } else {
        // Ignora a primeira parte se for o título principal (# Plano...) e foca nas seções (##)
        sections.forEach(section => {
           if (section.startsWith('# Plano')) return; // Pula o header que já existe nativo

           const lines = section.split('\n');
           const title = lines[0].trim();
           const bodyLines = lines.slice(1).filter(l => l.trim().length > 0);
           
           let bodyHtml = '';
           bodyLines.forEach(line => {
             if (line.trim().startsWith('-')) {
               let formattedLine = line.trim().substring(1).trim();
               formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
               bodyHtml += `<li class="mb-3 text-gray-700 leading-relaxed flex items-start"><span class="text-primary-500 mr-3 text-xl mt-[-2px]">•</span><span>${formattedLine}</span></li>`;
             } 
             else if (line.trim().startsWith('*') && line.trim().endsWith('*')) {
               let formattedLine = line.trim().replace(/\*(.*?)\*/g, '<em>$1</em>');
               bodyHtml += `<p class="mt-6 text-sm text-gray-600 bg-primary-50 p-4 rounded-xl border border-primary-100 italic">${formattedLine}</p>`;
             }
             else {
               let formattedLine = line.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
               if (!formattedLine.startsWith('**Tempo Dedicado:')) {
                 bodyHtml += `<p class="mb-3 text-gray-700 leading-relaxed">${formattedLine}</p>`;
               }
             }
           });
           
           htmlContent += `
             <div class="glass-card p-6 md:p-8 mb-6 border-l-4 border-l-primary-500 transform transition duration-300 hover:shadow-md relative overflow-hidden">
               <div class="absolute top-0 right-0 w-24 h-24 bg-primary-100 rounded-bl-full opacity-50 z-0"></div>
               <div class="relative z-10">
                 <h3 class="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">${title}</h3>
                 <ul class="space-y-2">
                   ${bodyHtml}
                 </ul>
               </div>
             </div>
           `;
        });
      }

      document.getElementById('plan-content').innerHTML = htmlContent;
    } catch (error) {
      document.getElementById('plan-content').innerHTML = `<div class="glass-card p-8 text-center"><p class="text-red-500 font-bold bg-red-50 p-4 rounded-lg inline-block">Erro ao carregar os detalhes do plano. Tente novamente mais tarde.</p></div>`;
    }
  }, 0);

  return `
    <div class="min-h-screen flex flex-col bg-light font-sans text-dark pb-12">
      <header class="w-full py-4 px-8 flex justify-between items-center bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
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

      <main class="max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 mt-8">
        
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <button onclick="window.location.hash='#dashboard'" class="text-gray-500 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors bg-white py-2 px-4 rounded-lg shadow-sm border border-gray-200 hover:border-primary-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Voltar ao Dashboard
          </button>

          <button id="delete-btn" class="text-red-600 hover:text-white font-bold flex items-center gap-2 transition-colors bg-red-50 hover:bg-red-600 py-2 px-4 rounded-lg border border-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Excluir Plano
          </button>
        </div>

        <!-- Cabeçalho do Plano -->
        <div class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden mb-10 relative">
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/3 -translate-y-1/3"></div>
          
          <div class="p-8 md:p-12 relative z-10">
            <div class="flex flex-wrap gap-3 mb-6">
              <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-primary-100 text-primary-800 border border-primary-200 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span id="plan-time">...</span>
              </span>
              <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-gray-600 border border-gray-200 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Criado em <span id="plan-date" class="ml-1">...</span>
              </span>
            </div>

            <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight" id="plan-topic">
              Carregando plano...
            </h1>
          </div>
        </div>
        
        <!-- Conteúdo do Plano -->
        <div id="plan-content" class="w-full">
          <div class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-500"></div>
          </div>
        </div>

      </main>
    </div>
  `;
}
