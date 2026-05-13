export function renderHome() {
  return `
    <div class="min-h-screen flex flex-col bg-light font-sans text-dark overflow-x-hidden">
      <!-- Header -->
      <header class="w-full py-6 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div class="flex items-center gap-2 cursor-pointer" onclick="window.location.hash='#'">
          <img src="/logo.png" alt="SmartStudy Logo" class="w-12 h-12 object-contain rounded-xl shadow-sm" />
          <span class="text-2xl font-extrabold tracking-tight">Smart<span class="text-primary-500">Study</span></span>
        </div>
        <nav class="hidden md:flex gap-8 items-center">
          <a href="#como-funciona" class="nav-link">Como Funciona</a>
          <a href="#beneficios" class="nav-link">Benefícios</a>
          <a href="#login" class="font-semibold text-primary-600 hover:text-primary-700 transition-colors">Entrar</a>
        </nav>
      </header>

      <!-- Hero Section -->
      <main class="flex-grow flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto px-8 py-16 gap-12 relative">
        <div class="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob z-0"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 z-0"></div>
        
        <div class="flex-1 flex flex-col items-start gap-6 z-10">
          <div class="inline-block px-4 py-1.5 bg-primary-100 text-primary-800 rounded-full text-sm font-bold tracking-wide uppercase mb-2 shadow-sm border border-primary-200">
            Revolucione seu aprendizado
          </div>
          <h1 class="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
            Aprenda <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">qualquer coisa</span> com um plano feito para você
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 font-medium max-w-lg leading-relaxed">
            A inteligência artificial do SmartStudy cria um cronograma de estudos totalmente personalizado e sob medida para a sua rotina.
          </p>
          <div class="mt-4 flex gap-4">
            <a href="#cadastro" class="btn-primary flex items-center gap-2 group">
              Começar Agora 
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        
        <div class="flex-1 w-full relative z-10 flex justify-center">
          <div class="relative w-full max-w-lg">
            <div class="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-2xl blur opacity-30"></div>
            <img src="/study_illustration.png" alt="Ilustração de pessoa estudando" class="relative w-full h-auto object-cover rounded-2xl shadow-2xl glass-card p-2 transform hover:scale-[1.02] transition-transform duration-500" />
          </div>
        </div>
      </main>

      <!-- Como Funciona Section -->
      <section id="como-funciona" class="bg-white py-24 border-y border-gray-100">
        <div class="max-w-7xl mx-auto px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">Como Funciona</h2>
            <p class="text-xl text-gray-500 font-medium">Seu plano de estudos pronto em três passos simples.</p>
          </div>
          <div class="grid md:grid-cols-3 gap-12">
            <div class="flex flex-col items-center text-center group">
              <div class="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                <span class="text-3xl font-black text-primary-500">1</span>
              </div>
              <h3 class="text-2xl font-bold mb-3 text-gray-800">Escolhe o tema</h3>
              <p class="text-gray-600 text-lg">Diga o que você quer aprender, seja um novo idioma, programação ou para um concurso.</p>
            </div>
            <div class="flex flex-col items-center text-center group">
              <div class="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                <span class="text-3xl font-black text-primary-500">2</span>
              </div>
              <h3 class="text-2xl font-bold mb-3 text-gray-800">Define o tempo</h3>
              <p class="text-gray-600 text-lg">Informe quantas horas ou minutos você tem disponíveis por dia ou semana.</p>
            </div>
            <div class="flex flex-col items-center text-center group">
              <div class="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                <span class="text-3xl font-black text-primary-500">3</span>
              </div>
              <h3 class="text-2xl font-bold mb-3 text-gray-800">Recebe o plano</h3>
              <p class="text-gray-600 text-lg">Nossa IA analisa e gera um roteiro completo, otimizado para o seu aprendizado.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefícios Section -->
      <section id="beneficios" class="py-24 bg-light relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-8 relative z-10">
          <div class="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8">Por que escolher o SmartStudy?</h2>
              <div class="space-y-8">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xl font-bold text-gray-800 mb-2">Economize tempo</h4>
                    <p class="text-gray-600">Chega de perder horas procurando o que estudar. Vá direto ao ponto com um roteiro já validado.</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xl font-bold text-gray-800 mb-2">Plano personalizado</h4>
                    <p class="text-gray-600">Cada cronograma é único, adaptado perfeitamente aos seus objetivos e à sua disponibilidade real.</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-xl font-bold text-gray-800 mb-2">Organização automática</h4>
                    <p class="text-gray-600">Tenha uma visão clara de onde começar e onde você vai chegar, mantendo o foco sem distrações.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-primary-400 to-secondary-500 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
              <div class="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
              <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
              <h3 class="text-3xl font-bold mb-4 relative z-10">Pronto para começar?</h3>
              <p class="text-lg mb-8 text-white/90 relative z-10">Junte-se a milhares de estudantes e otimize sua rotina de aprendizado hoje mesmo.</p>
              <a href="#cadastro" class="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-transform duration-300 relative z-10">
                Criar minha conta grátis
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-100 py-10">
        <div class="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2">
            <img src="/logo.png" alt="SmartStudy Logo" class="w-10 h-10 object-contain rounded-lg shadow-sm" />
            <span class="text-xl font-bold text-gray-800">SmartStudy</span>
          </div>
          <p class="text-gray-500 text-sm">© 2026 SmartStudy AI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  `;
}
