const API_URL = 'http://localhost:3000'; // Ajuste se a porta for diferente

// Elementos da UI
const loginForm = document.getElementById('loginForm');
const tokenText = document.getElementById('tokenText');
const responseBody = document.getElementById('responseBody');
const fetchProtectedBtn = document.getElementById('fetchProtected');
const clearTokenBtn = document.getElementById('clearToken');
const copyTokenBtn = document.getElementById('copyToken');
const tokenStatus = document.getElementById('tokenStatus');
const statusLabel = document.getElementById('statusLabel');

// Overlay de Explicação
const explanationOverlay = document.getElementById('explanationOverlay');
const expTitle = document.getElementById('expTitle');
const expContent = document.getElementById('expContent');
const closeExpBtn = document.getElementById('closeExp');

let currentToken = localStorage.getItem('jwt_token') || '';

// Inicialização
if (currentToken) {
    updateTokenUI(currentToken);
}

// 1. Login e Geração de Token
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        if (response.ok) {
            const token = await response.text();
            currentToken = token;
            localStorage.setItem('jwt_token', token);
            updateTokenUI(token);
            
            showExplanation(
                "Token Gerado com Sucesso!",
                `<p>O servidor validou suas credenciais e criou um <strong>JSON Web Token (JWT)</strong>.</p>
                <ul>
                    <li>O token contém informações (payload) sobre o usuário.</li>
                    <li>Ele foi assinado digitalmente no servidor usando uma chave secreta.</li>
                    <li><strong>Expiração:</strong> Definimos 1 hora de validade. Após isso, o servidor rejeitará este token automaticamente.</li>
                </ul>`
            );
        } else {
            const error = await response.text();
            showResponse({ erro: error });
        }
    } catch (err) {
        showResponse({ erro: "Não foi possível conectar ao servidor. Verifique se a API está rodando." });
    }
});

// 2. Acessar Rota Protegida
fetchProtectedBtn.addEventListener('click', async () => {
    if (!currentToken) {
        showExplanation(
            "Ops! Sem Token",
            "<p>Você está tentando acessar uma rota protegida sem enviar um token. O servidor vai te barrar com um erro <strong>401 Unauthorized</strong>.</p>"
        );
        return;
    }

    try {
        const response = await fetch(`${API_URL}/perfil`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${currentToken}` 
            }
        });

        const data = await response.json();
        showResponse(data);

        if (response.ok) {
            showExplanation(
                "Acesso Concedido!",
                `<p>O servidor recebeu sua requisição e realizou os seguintes passos:</p>
                <ul>
                    <li>Extraiu o token do Header <strong>Authorization</strong>.</li>
                    <li>Verificou a assinatura (garantindo que o token não foi alterado).</li>
                    <li>Checou a data de expiração.</li>
                    <li>Como tudo estava OK, ele permitiu o acesso aos dados do perfil.</li>
                </ul>`
            );
        } else {
            showExplanation(
                "Acesso Negado!",
                `<p>O servidor recusou seu token. Isso pode acontecer por:</p>
                <ul>
                    <li>O token expirou (passou de 1 hora).</li>
                    <li>O token foi alterado manualmente.</li>
                    <li>O segredo do servidor mudou.</li>
                </ul>`
            );
        }
    } catch (err) {
        showResponse({ erro: "Erro na requisição." });
    }
});

// Funções Auxiliares
function updateTokenUI(token) {
    tokenText.innerText = token;
    tokenStatus.classList.add('status-active');
    statusLabel.innerText = "Conectado (Token Ativo)";
}

function showResponse(data) {
    responseBody.innerText = JSON.stringify(data, null, 2);
}

function showExplanation(title, content) {
    expTitle.innerText = title;
    expContent.innerHTML = content;
    explanationOverlay.classList.remove('hidden');
}

closeExpBtn.addEventListener('click', () => {
    explanationOverlay.classList.add('hidden');
});

clearTokenBtn.addEventListener('click', () => {
    currentToken = '';
    localStorage.removeItem('jwt_token');
    tokenText.innerText = 'Nenhum token gerado ainda...';
    tokenStatus.classList.remove('status-active');
    statusLabel.innerText = "Desconectado";
    showResponse({ info: "Token removido localmente." });
    
    showExplanation(
        "Token Removido",
        "<p>O token foi apagado do seu <strong>LocalStorage</strong>. Como o JWT é stateless (sem estado no servidor), o servidor não sabe que você 'saiu' até que o token expire ou você pare de enviá-lo.</p>"
    );
});

copyTokenBtn.addEventListener('click', () => {
    if (currentToken) {
        navigator.clipboard.writeText(currentToken);
        const originalText = copyTokenBtn.innerText;
        copyTokenBtn.innerText = "✅";
        setTimeout(() => copyTokenBtn.innerText = originalText, 1500);
    }
});
