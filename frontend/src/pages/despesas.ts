import { apiFetch } from '../api';

interface Despesa {
    id: number;
    data: string;
    descricao: string;
    categoria: string;
    valor: string;
}

export async function renderDespesasPage(element: HTMLElement) {
    try {
        element.innerHTML = `<p>A buscar despesas...</p>`;
        const data: Despesa[] = await apiFetch('despesas');

        let tableRows = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.data}</td>
                <td>${item.descricao}</td>
                <td>${item.categoria}</td>
                <td>R$ ${item.valor}</td>
            </tr>`).join('');

        element.innerHTML = `
            <h1>Histórico de Despesas</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>${data.length > 0 ? tableRows : '<tr><td colspan="5">Nenhuma despesa encontrada.</td></tr>'}</tbody>
            </table>
        `;
    } catch (error) {
        element.innerHTML = `<p style="color:red">Erro ao carregar despesas: ${(error as Error).message}</p>`;
    }
}