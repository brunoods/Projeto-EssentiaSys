import './style.css';
import { getToken, login, logout } from './auth';
import { renderMateriasPrimasPage } from './pages/materiasPrimas';
import { renderProdutosPage } from './pages/produtos';
// Futuramente, importaremos as outras páginas aqui

const rootElement = document.getElementById('root');

function renderLayout(contentElement: HTMLElement) {
    if (!rootElement) return;
    rootElement.innerHTML = `
        <div class="layout">
            <nav>
                <h1>EssentiaSys</h1>
                <ul>
                    <li><a href="#/materias-primas">Matérias-Primas</a></li>
                    <li><a href="#/produtos">Produtos</a></li>
                    <li><a href="#/fornecedores">Fornecedores</a></li>
                    <li><a href="#/clientes">Clientes</a></li>
                    <li><a href="#/compras">Compras</a></li>
                    <li><a href="#/vendas">Vendas</a></li>
                    <li><a href="#/despesas">Despesas</a></li>
                </ul>
                <button id="logout-button">Logout</button>
            </nav>
            <main id="app-content"></main>
        </div>
    `;
    const appContent = document.getElementById('app-content');
    if (appContent) {
        appContent.appendChild(contentElement);
    }
    document.getElementById('logout-button')?.addEventListener('click', logout);
}

function renderLogin() {
    if (!rootElement) return;
    rootElement.innerHTML = `
        <div class="login-container">
            <div id="login-form-container">
                <h2>Login EssentiaSys</h2>
                <form id="login-form">
                    <input type="text" id="username" placeholder="Usuário" required />
                    <input type="password" id="password" placeholder="Senha" required />
                    <button type="submit">Entrar</button>
                    <p id="error-message" style="color:red; height: 1.2em;"></p>
                </form>
            </div>
        </div>
    `;
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const errorMessage = document.getElementById('error-message');
        try {
            if (errorMessage) errorMessage.textContent = 'A autenticar...';
            await login(username, password);
            router();
        } catch (error) {
            if (errorMessage) errorMessage.textContent = (error as Error).message;
        }
    });
}

// Router Simples
async function router() {
    if (!getToken()) {
        renderLogin();
        return;
    }

    const contentElement = document.createElement('div');
    renderLayout(contentElement);
    
    const path = window.location.hash || '#/materias-primas';

    switch (path) {
        case '#/materias-primas':
            await renderMateriasPrimasPage(contentElement);
            break;
        case '#/produtos':
            await renderProdutosPage(contentElement);
            break;
        // Adicionaremos os casos para as outras páginas aqui
        default:
            contentElement.innerHTML = `<h1>Página "${path}" em Construção</h1>`;
            break;
    }
}

// --- PONTO DE ENTRADA DA APLICAÇÃO ---
// Garante que o router só é chamado depois da página estar pronta.
document.addEventListener('DOMContentLoaded', router);
// Ouve por mudanças no URL (ex: clique num link) para navegar entre as páginas
window.addEventListener('hashchange', router);