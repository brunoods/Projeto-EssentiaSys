import { getMateriasPrimas } from '../api';

interface MateriaPrima {
  id: number;
  nome: string;
  unidade_medida: string;
  estoque_atual: string;
}

export async function renderMateriasPrimasPage(element: HTMLElement) {
    try {
        element.innerHTML = `<p>A buscar matérias-primas...</p>`;
        const data: MateriaPrima[] = await getMateriasPrimas();

        if (data.length === 0) {
            element.innerHTML = '<h1>Matérias-Primas</h1><p>Nenhuma matéria-prima encontrada.</p>';
            return;
        }

        let tableRows = '';
        data.forEach(item => {
            tableRows += `
              <tr>
                <td>${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.estoque_atual}</td>
                <td>${item.unidade_medida}</td>
              </tr>
            `;
        });

        element.innerHTML = `
            <h1>Matérias-Primas</h1>
            <table>
              <thead><tr><th>ID</th><th>Nome</th><th>Estoque</th><th>Unidade</th></tr></thead>
              <tbody>${tableRows}</tbody>
            </table>
        `;
    } catch (error) {
        element.innerHTML = `<p style="color:red">Erro ao carregar matérias-primas: ${(error as Error).message}</p>`;
    }
}