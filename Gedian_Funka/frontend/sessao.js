const { setInterval } = require("timers");

const usuario = JSON.parse(localStorage.getItem('usuario'));
const expira = localStorage.getItem('expira');

if(!usuario){
    window.location.href = 'login.html';   //Ninguem logado
}else if(!expira || Date.now() > Number(expira)){
    alert('Sua sessão expirou! Faça o login novamente');
    logout();
}

setInterval(() => {
    if(Date.now() > Number(localStorage.getItem('expira'))){
        alert('Sua sessão expirou. Faça login novamente!');
        logout;
    }
}, 30000);

function logout(){
    localStorage.removeItem('usuario');
    localStorage.removeItem('senha');
    window.location.href = 'login.html';
}

function voltar(){
    window.location.href = 'principal.html';
}