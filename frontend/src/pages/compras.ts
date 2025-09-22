import { apiFetch } from '../api';

interface Compra {
    id: number;
    materia_prima: number; // ID da matéria-prima
    fornecedor: number | null; // ID do fornecedor
    data_compra: string;
    quantidade: string;
    custo_total: string;
}

export async function renderComprasPage(element: HTMLElement) {
    try {
        element.innerHTML = `<p>A buscar compras...</p>`;
        const data: Compra[] = await apiFetch('compras');

        let tableRows = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.data_compra}</td>
                <td>${item.materia_prima}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${item.custo_total}</td>
            </tr>`).join('');

        element.innerHTML = `
            <h1>Histórico de Compras</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data da Compra</th>
                        <th>Matéria-Prima (ID)</th>
                        <th>Quantidade</th>
                        <th>Custo Total</th>
                    </tr>
                </thead>
                <tbody>${data.length > 0 ? tableRows : '<tr><td colspan="5">Nenhuma compra encontrada.</td></tr>'}</tbody>
            </table>
        `;
    } catch (error) {
        element.innerHTML = `<p style="color:red">Erro ao carregar compras: ${(error as Error).message}</p>`;
    }
}