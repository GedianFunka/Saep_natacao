carregarResponsaveis();

async function carregarResponsaveis(params) {
    const resposaveis = await buscarJson('/Responsavel');
    const select =  document.getElementById('id_responsavel');

    resposavei.forEach(c => {
        select.innerHTML += `<option value = "${c.id_responsavel}"> ${c.nome}</option>`;
    });
}