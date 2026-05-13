import { showToast } from '../utils/toast.js';

export function renderLogin() {
  setTimeout(() => {
    const form = document.getElementById('login-form');
    const errorBox = document.getElementById('error-message');
    
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.classList.add('hidden');
        
        const email = document.getElementById('email-address').value;
        const password = document.getElementById('password').value;
        const submitBtn = document.getElementById('submit-btn');

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Entrando...';

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          
          const data = await res.json();
          
          if (!res.ok) {
            throw new Error(data.error || 'Erro ao fazer login.');
          }

          localStorage.setItem('user', JSON.stringify(data.user));
          window.location.hash = '#dashboard';
          showToast('Login realizado com sucesso!', 'success');
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Entrar';
        }
      });
    }
  }, 0);

  return `
    <div class="min-h-screen flex items-center justify-center bg-light py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      <div class="max-w-md w-full space-y-8 glass-card p-10 relative z-10">
        <div>
          <img src="/logo.png" alt="SmartStudy Logo" class="mx-auto w-20 h-20 object-contain rounded-2xl shadow-md cursor-pointer hover:scale-105 transition-transform" onclick="window.location.hash='#'" />
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Acesse sua conta</h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ou <a href="#cadastro" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">crie uma conta gratuita</a>
          </p>
        </div>

        <div id="error-message" class="hidden bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm font-medium rounded-r-md"></div>

        <form class="mt-4 space-y-6" id="login-form">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email-address" class="sr-only">E-mail</label>
              <input id="email-address" type="email" required class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Seu e-mail">
            </div>
            <div>
              <label for="password" class="sr-only">Senha</label>
              <input id="password" type="password" required class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Sua senha">
            </div>
          </div>

          <div>
            <button id="submit-btn" type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
