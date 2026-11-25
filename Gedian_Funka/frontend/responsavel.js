listar();

async function listar() {
    montarTabela(await buscarJson('/Responsavel'));
}

function montarTabela(lista) {
    document.getElementById('tabela').innerHTML = lista.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.nome}</td>
            <td>${item.email}</td>
            <td>
                <button onclick = "editar(${item.id})">Editar</button>
                <button onclick = "excluir(${item.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function lerCampos(){
    return{
        nome: document.getElementById('nome').value,
        CPF: document.getElementById('CPF').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value
    };
}

const MENSAGENS = {
    nome: 'Informe o nome',
    CPF:  'Informe o CPF',
    email:  'Informe o seu email',
    telefone: 'Informe o seu telefone.'
};

function camposValidos(dados){
    for(const campo in MENSAGENS){
        if(dados[campo] == ''){
            alert(MENSAGENS[campo]);
            return false;
        }
    }
    return true;
}

async function cadastrar() {
    const dados = lerCampos();
    if(!camposValidos(dados)) return;

    if(await enviar('/Responsavel', 'POST', dados)){
        limparCampos();
        listar();
    }
}

function limparCampos(){
    ['nome', 'cpf', 'email', 'telefone'].forEach(id => document.getElementById(id).value = '');
}

async function pesquisar() {
    const termo = document.getElementById('busca').value;

    if(termo = ''){
        listar();
        return;
    }

    const lista = await buscarJson(`/Responsavel/busca/$(termo)`);
    if(lista.length == 0)
        alert('Nenhum registro encontrado.');
        montarTabela(lista);
}

async function editar(id) {
    const atual = await buscarJson(`/Responsavel/$(id_responsavel)`)

    const nome = prompt('Nome', atual.nome);
    if(nome==null) return;

    const email = prompt('Email', atual.email);
    if(email == null) return;

    const CPF = prompt('CPF', atual.CPF);
    if(CPF == null) return;

    const telefone = prompt('Telefone', atual.telefone)
    if(telefone == null) return;

    await enviar(`/Responsavel/$(id)`, 'PUT', {nome, email, CPF, telefone});
    listar();
}

async function excluir(id) {
        if(!confirm('Deseja excluir este registro?')) return;

        await enviar (`/Responsavel/$(id)`, 'DELETE');
        listar();
}