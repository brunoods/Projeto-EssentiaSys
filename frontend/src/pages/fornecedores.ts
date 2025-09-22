import { apiFetch } from '../api';

interface Fornecedor { id: number; nome: string; contacto: string; email: string; }

export async function renderFornecedoresPage(element: HTMLElement) {
    try {
        element.innerHTML = `<p>A buscar fornecedores...</p>`;
        const data: Fornecedor[] = await apiFetch('fornecedores');
        let tableRows = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.contacto}</td>
                <td>${item.email}</td>
            </tr>`).join('');

        element.innerHTML = `
            <h1>Fornecedores</h1>
            <table>
                <thead><tr><th>ID</th><th>Nome</th><th>Contacto</th><th>Email</th></tr></thead>
                <tbody>${data.length > 0 ? tableRows : '<tr><td colspan="4">Nenhum fornecedor encontrado.</td></tr>'}</tbody>
            </table>`;
    } catch (error) {
        element.innerHTML = `<p style="color:red">Erro ao carregar fornecedores: ${(error as Error).message}</p>`;
    }
}