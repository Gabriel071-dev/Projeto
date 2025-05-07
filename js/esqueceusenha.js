document.addEventListener('DOMContentLoaded', function() {
    
    const passos = {
        1: document.getElementById('passo1'),
        2: document.getElementById('passo2'),
        3: document.getElementById('passo3')
    };
    
    const forms = {
        identificacao: document.getElementById('identifyForm'),
        verificacao: document.getElementById('verificationForm'),
        novaSenha: document.getElementById('newPasswordForm')
    };
    
    const cnpjInput = document.getElementById('cnpj');
    const novaSenhaInput = document.getElementById('newPassword');
    const confirmarSenhaInput = document.getElementById('confirmPassword');
    const barrasForca = document.querySelectorAll('.strength-bar');
    const textoForca = document.getElementById('strengthText');
    const contador = document.getElementById('countdown');
    const botaoReenviar = document.getElementById('resendCode');
    
    
    let passoAtual = 1;
    let codigoVerificacao = '';
    let intervaloContador;
    let tempoRestante = 300; 


    iniciar();

    function iniciar() {
        configurarEventListeners();
        irParaPasso(1);
    }

    function configurarEventListeners() {
        
        cnpjInput.addEventListener('input', formatarCNPJ);
        
        
        document.querySelectorAll('.password-toggle').forEach(botao => {
            botao.addEventListener('click', alternarVisibilidadeSenha);
        });
        
        
        novaSenhaInput.addEventListener('input', verificarForcaSenha);
        
        
        forms.identificacao.addEventListener('submit', lidarComIdentificacao);
        forms.verificacao.addEventListener('submit', lidarComVerificacao);
        forms.novaSenha.addEventListener('submit', lidarComNovaSenha);
        
       
        document.getElementById('voltarPasso1').addEventListener('click', () => irParaPasso(1));
        document.getElementById('voltarPasso2').addEventListener('click', () => irParaPasso(2));
        
        
        botaoReenviar.addEventListener('click', reenviarCodigo);
    }

    function formatarCNPJ(e) {
        let valor = e.target.value.replace(/\D/g, '');
        
        if (valor.length > 2) valor = valor.substring(0,2) + '.' + valor.substring(2);
        if (valor.length > 6) valor = valor.substring(0,6) + '.' + valor.substring(6);
        if (valor.length > 10) valor = valor.substring(0,10) + '/' + valor.substring(10);
        if (valor.length > 15) valor = valor.substring(0,15) + '-' + valor.substring(15);
        
        e.target.value = valor.substring(0, 18);
    }

    function alternarVisibilidadeSenha(e) {
        const input = e.target.parentElement.querySelector('input');
        const tipo = input.type === 'password' ? 'text' : 'password';
        input.type = tipo;
        e.target.innerHTML = tipo === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    }

    function verificarForcaSenha() {
        const senha = novaSenhaInput.value;
        let forca = 0;
        
       
        if (senha.length >= 6) forca += 1;
        if (senha.length >= 8) forca += 1;
        
       
        if (/[A-Z]/.test(senha)) forca += 1;
        if (/\d/.test(senha)) forca += 1;
        if (/[^A-Za-z0-9]/.test(senha)) forca += 1;
        
       
        atualizarIndicadorForca(forca);
    }

    function atualizarIndicadorForca(forca) {
        const cores = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#27ae60'];
        const mensagens = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
        
        barrasForca.forEach((barra, indice) => {
            barra.style.background = indice < forca ? cores[forca-1] : '#eee';
        });
        
        textoForca.textContent = mensagens[forca-1] || '';
        textoForca.style.color = cores[forca-1] || '#666';
    }

    function lidarComIdentificacao(e) {
        e.preventDefault();
        
        const cnpj = cnpjInput.value.replace(/\D/g, '');
        
        if (cnpj.length !== 14) {
            alert('Por favor, insira um CNPJ válido com 14 dígitos');
            return;
        }
        
        
        codigoVerificacao = gerarCodigoAleatorio();
        console.log('Código de verificação (simulação):', codigoVerificacao);
        
        iniciarContador();
        irParaPasso(2);
    }

    function lidarComVerificacao(e) {
        e.preventDefault();
        
        const codigoInserido = document.getElementById('code').value;
        
        if (codigoInserido !== codigoVerificacao) {
            alert('Código de verificação incorreto!');
            return;
        }
        
        limparContador();
        irParaPasso(3);
    }

    function lidarComNovaSenha(e) {
        e.preventDefault();
        
        const novaSenha = novaSenhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;
        
        if (novaSenha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }
        
        if (novaSenha.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres');
            return;
        }
        
        
        console.log('Senha atualizada com sucesso!');
        alert('Senha redefinida com sucesso! Você será redirecionado para o login.');
        
        
        setTimeout(() => {
            window.location.href = '../login/index.html';
        }, 2000);
    }

    function gerarCodigoAleatorio() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function iniciarContador() {
        limparContador();
        tempoRestante = 300;
        atualizarContador();
        
        intervaloContador = setInterval(() => {
            tempoRestante--;
            atualizarContador();
            
            if (tempoRestante <= 0) {
                limparContador();
                contador.textContent = 'Expirado';
                contador.style.color = '#e74c3c';
            }
        }, 1000);
    }

    function atualizarContador() {
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        contador.textContent = 
            `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    function limparContador() {
        clearInterval(intervaloContador);
    }

    function reenviarCodigo(e) {
        e.preventDefault();
        
        codigoVerificacao = gerarCodigoAleatorio();
        console.log('Novo código (simulação):', codigoVerificacao);
        
        tempoRestante = 300;
        iniciarContador();
        alert('Um novo código foi enviado para seu e-mail.');
    }

    function irParaPasso(numeroPasso) {
        passoAtual = numeroPasso;
        
        
        Object.values(passos).forEach(passo => {
            passo.classList.remove('active');
        });
        
        
        passos[numeroPasso].classList.add('active');
    }
});