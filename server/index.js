import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import db from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

// Rota de Cadastro
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Verifica se o email já existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }

    // Criptografa a senha
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insere no banco
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, hashedPassword);

    const user = { id: result.lastInsertRowid, name, email };
    res.status(201).json({ user, message: 'Conta criada com sucesso!' });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Rota de Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    // Busca o usuário
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    // Compara as senhas
    const isValid = bcrypt.compareSync(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    // Remove a senha antes de retornar
    delete user.password;
    
    res.json({ user, message: 'Login realizado com sucesso!' });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});
// Rota para listar planos
app.get('/api/plans', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'ID do usuário é obrigatório.' });
  }

  try {
    const plans = db.prepare('SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    res.json(plans);
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Rota para buscar um plano específico
app.get('/api/plans/:id', (req, res) => {
  try {
    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plano não encontrado.' });
    res.json(plan);
  } catch (error) {
    console.error('Erro ao buscar plano:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Rota para excluir um plano específico
app.delete('/api/plans/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM plans WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Plano não encontrado.' });
    res.json({ message: 'Plano excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir plano:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Rota para gerar plano via n8n
app.post('/api/plans/generate', async (req, res) => {
  const { userId, topic, time } = req.body;

  if (!userId || !topic || !time) {
    return res.status(400).json({ error: 'Faltam dados obrigatórios.' });
  }

  // Converter tempo em dias
  let days = 30; // Default
  if (time === '1 semana') days = 7;
  else if (time === '2 semanas') days = 14;
  else if (time === '1 mês') days = 30;
  else if (time === '2 meses') days = 60;
  else if (time === '3 meses') days = 90;
  else if (time.includes('dias')) {
    days = parseInt(time) || 30;
  }

  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      throw new Error('URL do webhook do n8n não configurada no .env');
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos de timeout
    
    // Fazendo a requisição real ao n8n
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: topic, time: days }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!n8nResponse.ok) {
      throw new Error(`Serviço de IA indisponível. Detalhes: ${n8nResponse.statusText}`);
    }

    const generatedData = await n8nResponse.json();
    
    // O n8n retorna um array onde o primeiro item tem "output" que contém "subjects"
    let subjects = null;
    if (Array.isArray(generatedData) && generatedData.length > 0 && generatedData[0].output && generatedData[0].output.subjects) {
      subjects = generatedData[0].output.subjects;
    } else if (generatedData && generatedData.output && generatedData.output.subjects) {
      subjects = generatedData.output.subjects;
    } else if (generatedData && generatedData.subjects) {
      subjects = generatedData.subjects;
    }
    
    // Transformar o JSON em Markdown em formato de Cards
    let planContent = '';
    if (subjects && Array.isArray(subjects) && subjects.length > 0) {
      subjects.forEach(sub => {
        // Os "##" criam os títulos e novos cards na nossa interface
        planContent += `## ${sub.topic} (${sub.interval})\n${sub.description}\n*Dica: ${sub.tip}*\n\n`;
      });
    } else {
      // Fallback de segurança se o formato do JSON vier diferente
      planContent = `## ${topic}\nInfelizmente o plano gerado não seguiu o formato padrão.\n\nResposta bruta: ${JSON.stringify(generatedData)}`;
    }

    // Salvar o plano no banco de dados SQLite
    const stmt = db.prepare('INSERT INTO plans (user_id, topic, time_available, plan_content) VALUES (?, ?, ?, ?)');
    const result = stmt.run(userId, topic, time, planContent.trim());

    res.status(201).json({ id: result.lastInsertRowid, message: 'Plano gerado com sucesso!' });
  } catch (error) {
    console.error('Erro ao gerar plano:', error);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'A Inteligência Artificial demorou muito para responder. Tente novamente.' });
    }
    
    res.status(500).json({ error: error.message || 'Erro interno do servidor ao gerar plano.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
