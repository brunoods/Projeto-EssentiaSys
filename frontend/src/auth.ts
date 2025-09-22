const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Guarda o token de acesso no armazenamento local do navegador
export function saveToken(token: string) {
    localStorage.setItem('accessToken', token);
}

// Pega o token de acesso guardado
export function getToken(): string | null {
    return localStorage.getItem('accessToken');
}

// Apaga o token (para o logout)
export function removeToken() {
    localStorage.removeItem('accessToken');
}

// Tenta fazer o login na API e devolve o token se for bem-sucedido
export async function login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
        throw new Error('Credenciais inválidas.');
    }
    const data = await response.json();
    saveToken(data.access);
    return data.access;
}

// Faz o logout
export function logout() {
    removeToken();
    // Recarrega a página para voltar ao ecrã de login
    window.location.reload();
}