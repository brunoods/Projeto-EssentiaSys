import './style.css';
import { getToken, login, logout } from './auth';
import { renderMateriasPrimasPage } from './pages/materiasPrimas';
import { renderProdutosPage } from './pages/produtos';

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
    
    // Define a página padrão se o URL for vazio ou inválido
    const path = window.location.hash || '#/materias-primas';

    if (path === '#/materias-primas') {
        await renderMateriasPrimasPage(contentElement);
    } else if (path === '#/produtos') {
        await renderProdutosPage(contentElement);
    } else {
        // Se a rota não for encontrada, redireciona para a página padrão
        await renderMateriasPrimasPage(contentElement);
    }
}

// --- A CORREÇÃO PRINCIPAL ESTÁ AQUI ---
// Espera que todo o HTML da página seja carregado antes de executar o nosso código.
document.addEventListener('DOMContentLoaded', () => {
    // Ouve por mudanças no URL (ex: clique num link)
    window.addEventListener('hashchange', router);
    
    // Executa o router pela primeira vez
    router();
});