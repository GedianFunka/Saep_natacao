const tempo_sessao = 30*60*1000  //30 segundos em milisegundos

async function entrar() {
    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;
    const msg = document.getElementById('mensagem');
    msg.innerHTML = '';

    if(login == '' ||senha == ''){
        msg.innerHTML = 'Preencha login e senha';
        return;
    }

    try {
        const {dados} = await enviarJson('/login', 'POST', {login, senha});

    if(dados.sucesso){
        localStorage.setItem('usuario', JSON.stringify(dados.usuario));
        localStorage.setItem('expira', Date.now() + tempo_sessao);
        window.location.href = 'principal.html';
    }else{
        msg.innerHTML = dados.mensagem;  //Ex.: "Login ou senha inválidos"
        document.getElementById('senha').value = '';
    }
    }catch(erro){
        msg.innerHTML = 'Não foi possivel conectar o servidor.'
    }
}