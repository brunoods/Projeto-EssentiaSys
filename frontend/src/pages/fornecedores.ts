import { apiFetch } from '../api';

// A interface define a estrutura dos dados que esperamos da API.
interface Fornecedor { 
    id: number; 
    nome: string; 
    contacto: string; 
    email: string; 
}

/**
 * Renderiza a página de Fornecedores, buscando os dados da API.
 * @param element O elemento HTML onde a página será renderizada.
 */
export async function renderFornecedoresPage(element: HTMLElement) {
    try {
        // Exibe uma mensagem de carregamento enquanto aguarda a resposta da API
        element.innerHTML = `<p>A buscar fornecedores...</p>`;
        
        // Faz o pedido GET para o endpoint 'fornecedores'
        const data: Fornecedor[] = await apiFetch('fornecedores');
        
        // Cria as linhas da tabela a partir dos dados recebidos
        let tableRows = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.contacto}</td>
                <td>${item.email}</td>
            </tr>`).join('');

        // Monta o HTML final da página
        element.innerHTML = `
            <h1>Fornecedores</h1>
            <table>
                <thead><tr><th>ID</th><th>Nome</th><th>Contacto</th><th>Email</th></tr></thead>
                <tbody>${data.length > 0 ? tableRows : '<tr><td colspan="4">Nenhum fornecedor encontrado.</td></tr>'}</tbody>
            </table>`;
    } catch (error) {
        // Em caso de erro, exibe uma mensagem para o utilizador
        element.innerHTML = `<p style="color:red">Erro ao carregar fornecedores: ${(error as Error).message}</p>`;
    }
}