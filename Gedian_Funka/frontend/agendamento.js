listar();

async function listar() {
    montarTabela(await buscarJson('/Aulas'));
}

function montarTabela(lista) {
    document.getElementById('tabela').innerHTML = lista.map(item => `
        <tr>
            <td>${item.id_aulas}</td>
            <td>${formatarData(item.horario)}</td>
            <td>${formatarHora(item.horario)}</td>
            <td>${item.nome_professor}</td>
            <td>${item.Filho_nome}</td>
            <td>${formatarData(item.data_nascimento)}</td>
            <td>${item.nivel_natacao}</td>
            <td>${item.Responsavel_nome}</td>
            <td>${mascararCpf(item.Responsavel_CPF)}</td>
            <td>${item.Responsavel_email}</td>
            <td>${item.Responsavel_telefone}</td>
            <td><button onclick="editarData(${item.id_aulas})">Alterar data</button></td>
        </tr>
    `).join('');
}

// "2026-11-10 09:30:00" ou "2026-11-10"  →  "10/11/2026"
function formatarData(valor) {
    const [ano, mes, dia] = valor.substring(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
}

// "2026-11-10 09:30:00"  →  "09:30"
function formatarHora(valor) {
    return valor.substring(11, 16);
}

// "111.222.333-44"  →  "***.222.333-**"  (LGPD)
function mascararCpf(cpf) {
    return cpf ? '***' + cpf.substring(3, 11) + '-**' : '';
}

// 8.3b Alterar a data: busca o atual, pergunta o novo, envia o PUT e recarrega
async function editarData(id) {
    const atual = await buscarJson(`/Aulas/${id}`);

    const horario = prompt('Nova data e horário (AAAA-MM-DD HH:MM)', atual.horario.substring(0, 16));
    if (horario == null) return;

    await enviar(`/Aulas/${id}`, 'PUT', { horario });
    listar();   // a lista volta ordenada pelo servidor
}