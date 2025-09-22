import { getToken, logout } from './auth';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Função genérica para fazer pedidos à nossa API
export async function apiFetch(endpoint: string) {
    const token = getToken();
    if (!token) {
        logout();
        throw new Error('Não autenticado.');
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 401) { // Unauthorized
        logout();
        throw new Error('Sessão expirada.');
    }

    if (!response.ok) {
        throw new Error(`Erro na API ao buscar ${endpoint}: ${response.statusText}`);
    }
    return response.json();
}

// Funções específicas para cada endpoint
export function getMateriasPrimas() {
    return apiFetch('materias-primas');
}

export function getProdutos() {
    return apiFetch('produtos');
}

// Adicionaremos mais funções aqui (getClientes, getVendas, etc.)