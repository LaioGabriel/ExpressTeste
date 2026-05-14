import React, { useState, useEffect } from 'react'
import { Trash2, User, Film, ShieldCheck, Lock } from 'lucide-react'

const API_URL = 'http://127.0.0.1:3000';

function App() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('laio@mail.com');
  const [password, setPassword] = useState('senha');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  const [explanation, setExplanation] = useState<{title: string, content: string} | null>(null);

  // Verifica se já existe uma sessão ativa ao carregar a página
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Necessário para cookies
        body: JSON.stringify({ email, senha: password })
      });
      const data = await res.json();
      if (res.ok) {
        setIsLoggedIn(true);
        setResponse(data);
        setExplanation({
          title: "Login realizado!",
          content: "O servidor validou suas credenciais e salvou um Cookie HttpOnly invisível no seu navegador."
        });
      } else {
        setResponse(data);
      }
    } catch (err) {
      setResponse({ erro: "Erro na conexão com o servidor." });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, senha: regPassword })
      });
      const data = await res.json();
      setResponse(data);
      if (res.ok) {
        setExplanation({
          title: "Usuário Cadastrado!",
          content: `O usuário ${regEmail} foi salvo no banco de dados em memória. Agora você pode fazer login.`
        });
        setActiveTab('login');
        setEmail(regEmail);
        setPassword(regPassword);
      }
    } catch (err) {
      setResponse({ erro: "Erro ao cadastrar." });
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/perfil`, {
        credentials: 'include' // Envia o cookie automaticamente
      });
      const data = await res.json();
      setResponse(data);
      if (res.ok) {
        setIsLoggedIn(true);
        setExplanation({
          title: "Perfil Acessado!",
          content: "O navegador enviou o Cookie HttpOnly automaticamente e o servidor validou sua sessão."
        });
      } else {
        setIsLoggedIn(false);
        setExplanation({ title: "Acesso Negado", content: "Sessão inválida ou cookie não encontrado." });
      }
    } catch (err) {
      setResponse({ erro: "Erro na requisição." });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
      setIsLoggedIn(false);
      setResponse(null);
      setExplanation({ title: "Logout Realizado", content: "O cookie de sessão foi removido do navegador pelo servidor." });
    } catch (err) {
      setResponse({ erro: "Erro ao fazer logout." });
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await fetch(`${API_URL}/filmes`);
      const data = await res.json();
      setResponse(data);
      setExplanation({
        title: "Dados Mockados",
        content: "Estes dados são públicos e foram buscados diretamente da lista estática no backend."
      });
    } catch (err) {
      setResponse({ erro: "Erro ao buscar filmes." });
    }
  };



  return (
    <div className="container">
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <header>
        <h1>JWT <span>Masterclass</span></h1>
        <p>Aprenda autenticação com React e Express</p>
      </header>

      <main>
        <section className="card">
          <div className="tabs">
            <button 
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Cadastro
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>E-mail</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Senha</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary">
                <ShieldCheck size={18} /> Gerar Token JWT
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>E-mail</label>
                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="novo@email.com" required />
              </div>
              <div className="input-group">
                <label>Senha</label>
                <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="sua senha" required />
              </div>
              <button type="submit" className="btn-primary">
                <User size={18} /> Criar Conta
              </button>
            </form>
          )}
        </section>

        <section className="card">
          <h2><Lock size={20} /> Status da Autenticação</h2>
          <div className="token-display" style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.8rem', gap: '1rem' }}>
            <code style={{ flex: 1, wordBreak: 'break-all', color: isLoggedIn ? '#4ade80' : '#94a3b8' }}>
              {isLoggedIn ? "Sessão Protegida por Cookie HttpOnly" : "Nenhuma sessão ativa..."}
            </code>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: response && !response.erro ? '#4ade80' : response?.erro ? '#f87171' : '#94a3b8' }}>
            {response?.erro ? "● Servidor Inacessível" : response ? "● Servidor Online" : "● Verificando conexão..."}
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: isLoggedIn ? '#4ade80' : '#94a3b8' }}>
            {isLoggedIn ? "● Conectado com Segurança" : "● Desconectado"}
          </p>
        </section>

        <section className="card">
          <h2><Film size={20} /> Consultar Dados</h2>
          <div className="actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={fetchProfile} className="btn-primary">Ver Perfil</button>
            <button onClick={fetchMovies} className="btn-purple">
              Filmes
            </button>
            <button onClick={handleLogout} className="btn-danger" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.8rem', cursor: 'pointer', padding: '0 1rem' }}>
              <Trash2 size={18} />
            </button>
          </div>
        </section>

        {response && (
          <section className="card">
            <h2>Resposta do Servidor</h2>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </section>
        )}
      </main>

      {explanation && (
        <div className="overlay" onClick={() => setExplanation(null)}>
          <div className="explanation-card" onClick={e => e.stopPropagation()}>
            <h3>{explanation.title}</h3>
            <p className="exp-content">{explanation.content}</p>
            <button onClick={() => setExplanation(null)} className="btn-primary">Entendi!</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
