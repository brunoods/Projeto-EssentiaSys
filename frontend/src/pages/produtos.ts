import { apiFetch } from '../api';

interface ProdutoAcabado {
  id: number;
  nome: string;
  categoria: string;
  estoque_atual: number;
  preco_venda: string;
}

export async function renderProdutosPage(element: HTMLElement) {
    try {
        element.innerHTML = `<p>A buscar produtos...</p>`;
        const data: ProdutoAcabado[] = await apiFetch('produtos');

        if (data.length === 0) {
            element.innerHTML = '<h1>Produtos Acabados</h1><p>Nenhum produto encontrado.</p>';
            return;
        }

        let tableRows = '';
        data.forEach(item => {
            tableRows += `
              <tr>
                <td>${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.categoria}</td>
                <td>${item.estoque_atual}</td>
                <td>R$ ${item.preco_venda}</td>
              </tr>
            `;
        });

        element.innerHTML = `
            <h1>Produtos Acabados</h1>
            <table>
              <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Estoque</th>
                    <th>Preço de Venda</th>
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
        `;
    } catch (error) {
        element.innerHTML = `<p style="color:red">Erro ao carregar produtos: ${(error as Error).message}</p>`;
    }
}