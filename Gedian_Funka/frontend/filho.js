carregarResponsaveis();

async function carregarResponsaveis(params) {
    const responsaveis = await buscarJson('/Responsavel');
    const select =  document.getElementById('id_responsavel');

    responsaveis.forEach(c => {
        select.innerHTML += `<option value="${c.id_responsavel}">${c.nome}</option>`;
    });
}

function lerCampos() {
    return {
        id_responsavel: document.getElementById('id_responsavel').value,
        nome: document.getElementById('nome').value,
        data_nascimento: document.getElementById('data_nascimento').value,
        nivel_natacao: document.getElementById('nivel_natacao').value
    };
}

const MENSAGENS = {
    id_responsavel: 'Selecione o responsável.',
    nome: 'Informe o nome do filho.',
    data_nascimento: 'Informe a data de nascimento.',
    nivel_natacao: 'Selecione o nível de natação.'
};

function camposValidos(dados) {
    for (const campo in MENSAGENS) {
        if (dados[campo] == '') {
            alert(MENSAGENS[campo]);
            return false;
        }
    }
    return true;
}

async function cadastrar() {
    const dados = lerCampos();
    if (!camposValidos(dados)) return;

    if (await enviar('/Filho', 'POST', dados)) {
        limparCampos();
    }
}

function limparCampos() {
    ['id_responsavel', 'nome', 'data_nascimento', 'nivel_natacao'].forEach(id => document.getElementById(id).value = '');
}