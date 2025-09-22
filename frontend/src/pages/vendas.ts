import { apiFetch } from '../api';

interface Venda {
    id: number;
    produto: number; // ID do produto
    cliente: number | null; // ID do cliente
    data_venda: string;
    quantidade: number;
    desconto: string;
    forma_pagamento: string;
}

export async function renderVendasPage(element: HTMLElement) {
    try {
        element.innerHTML = `<p>A buscar vendas...</p>`;
        const data: Venda[] = await apiFetch('vendas');

        let tableRows = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.data_venda}</td>
                <td>${item.produto}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${item.desconto}</td>
                <td>${item.forma_pagamento}</td>
            </tr>`).join('');

        element.innerHTML = `
            <h1>Histórico de Vendas</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data da Venda</th>
                        <th>Produto (ID)</th>
                        <th>Quantidade</th>
                        <th>Desconto</th>
                        <th>Forma de Pagamento</th>
                    </tr>
                </thead>
                <tbody>${data.length > 0 ? tableRows : '<tr><td colspan="6">Nenhuma venda encontrada.</td></tr>'}</tbody>
            </table>
        `;
    } catch (error) {
        element.innerHTML = `<p style="color:red">Erro ao carregar vendas: ${(error as Error).message}</p>`;
    }
}