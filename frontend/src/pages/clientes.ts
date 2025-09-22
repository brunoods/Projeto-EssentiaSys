import { apiFetch } from '../api';

interface Cliente { id: number; nome: string; contacto: string; email: string; }

export async function renderClientesPage(element: HTMLElement) {
    try {
        element.innerHTML = `<p>A buscar clientes...</p>`;
        const data: Cliente[] = await apiFetch('clientes');
        let tableRows = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.contacto}</td>
                <td>${item.email}</td>
            </tr>`).join('');

        element.innerHTML = `
            <h1>Clientes</h1>
            <table>
                <thead><tr><th>ID</th><th>Nome</th><th>Contacto</th><th>Email</th></tr></thead>
                <tbody>${data.length > 0 ? tableRows : '<tr><td colspan="4">Nenhum cliente encontrado.</td></tr>'}</tbody>
            </table>`;
    } catch (error) {
        element.innerHTML = `<p style="color:red">Erro ao carregar clientes: ${(error as Error).message}</p>`;
    }
}