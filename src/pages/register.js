import { showToast } from '../utils/toast.js';

export function renderRegister() {
  setTimeout(() => {
    const form = document.getElementById('register-form');
    const errorBox = document.getElementById('error-message');
    
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.classList.add('hidden');
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email-address').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const submitBtn = document.getElementById('submit-btn');

        if (password !== confirmPassword) {
          showToast('As senhas não coincidem.', 'error');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Cadastrando...';

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          
          const data = await res.json();
          
          if (!res.ok) {
            throw new Error(data.error || 'Erro ao cadastrar.');
          }

          localStorage.setItem('user', JSON.stringify(data.user));
          window.location.hash = '#dashboard';
          showToast('Conta criada com sucesso!', 'success');
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Cadastrar';
        }
      });
    }
  }, 0);

  return `
    <div class="min-h-screen flex items-center justify-center bg-light py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      <div class="max-w-md w-full space-y-8 glass-card p-10 relative z-10">
        <div>
          <img src="/logo.png" alt="SmartStudy Logo" class="mx-auto w-20 h-20 object-contain rounded-2xl shadow-md cursor-pointer hover:scale-105 transition-transform" onclick="window.location.hash='#'" />
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Crie sua conta</h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Já tem uma conta? <a href="#login" class="font-medium text-primary-600 hover:text-primary-500 transition-colors">Faça login</a>
          </p>
        </div>
        
        <div id="error-message" class="hidden bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm font-medium rounded-r-md"></div>

        <form class="mt-4 space-y-6" id="register-form">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="name" class="sr-only">Nome Completo</label>
              <input id="name" type="text" required class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Nome Completo">
            </div>
            <div>
              <label for="email-address" class="sr-only">E-mail</label>
              <input id="email-address" type="email" required class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Seu melhor e-mail">
            </div>
            <div>
              <label for="password" class="sr-only">Senha</label>
              <input id="password" type="password" required minlength="6" class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Crie uma senha forte">
            </div>
            <div>
              <label for="confirm-password" class="sr-only">Confirmar Senha</label>
              <input id="confirm-password" type="password" required minlength="6" class="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Confirme sua senha">
            </div>
          </div>

          <div>
            <button id="submit-btn" type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-secondary-500 hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
