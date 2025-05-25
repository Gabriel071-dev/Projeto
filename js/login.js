document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const loginForm = document.getElementById('loginForm');
    const cnpjInput = document.getElementById('cnpj');
    const senhaInput = document.getElementById('senha');
    const togglePassword = document.getElementById('togglePassword');
    const rememberMe = document.getElementById('rememberMe');

    // Máscara para CNPJ
    cnpjInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            value = value.substring(0, 2) + '.' + value.substring(2);
        }
        if (value.length > 6) {
            value = value.substring(0, 6) + '.' + value.substring(6);
        }
        if (value.length > 10) {
            value = value.substring(0, 10) + '/' + value.substring(10);
        }
        if (value.length > 15) {
            value = value.substring(0, 15) + '-' + value.substring(15, 17);
        }
        
        e.target.value = value;
    });

    // Mostrar/ocultar senha
    togglePassword.addEventListener('click', function() {
        const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
        senhaInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Carregar credenciais salvas (se "Lembrar de mim" estava marcado)
    if (localStorage.getItem('rememberLojista') === 'true') {
        const savedCredentials = JSON.parse(localStorage.getItem('lojistaCredentials'));
        if (savedCredentials) {
            cnpjInput.value = savedCredentials.cnpj;
            senhaInput.value = savedCredentials.senha;
            rememberMe.checked = true;
        }
    }

    // Processar login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores dos campos
        const cnpj = cnpjInput.value.replace(/\D/g, '');
        const senha = senhaInput.value;
        
        // Validação básica
        if (cnpj.length !== 14) {
            alert('CNPJ inválido! Deve conter 14 dígitos.');
            return;
        }
        
        if (senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return;
        }
        
        // Simular verificação de credenciais
        const lojistasCadastrados = JSON.parse(localStorage.getItem('lojistas')) || [];
        const lojista = lojistasCadastrados.find(l => l.empresa.cnpj === cnpj && l.dadosPessoais.senha === senha);
        
        if (lojista) {
            // Salvar sessão
            sessionStorage.setItem('lojistaLogado', JSON.stringify(lojista));
            
            // Salvar credenciais se "Lembrar de mim" estiver marcado
            if (rememberMe.checked) {
                localStorage.setItem('rememberLojista', 'true');
                localStorage.setItem('lojistaCredentials', JSON.stringify({ cnpj: cnpjInput.value, senha }));
            } else {
                localStorage.removeItem('rememberLojista');
                localStorage.removeItem('lojistaCredentials');
            }
            
            // Redirecionar para dashboard (simulação)
            alert('Login realizado com sucesso! Redirecionando...');
            // window.location.href = 'dashboard.html';
        } else {
            alert('CNPJ ou senha incorretos!');
        }
    });

    // Simular dados de teste (apenas para desenvolvimento)
    if (!localStorage.getItem('lojistas')) {
        const lojistaTeste = {
            dadosPessoais: {
                nome: "João da Silva",
                cpf: "12345678901",
                telefone: "11987654321",
                email: "joao@construfacil.com",
                senha: "123456"
            },
            empresa: {
                razaoSocial: "ConstruFácil Materiais de Construção Ltda",
                nomeFantasia: "ConstruFácil",
                cnpj: "12345678000190",
                inscricaoEstadual: "123.456.789.012"
            },
            endereco: {
                cep: "01001000",
                logradouro: "Praça da Sé",
                numero: "100",
                complemento: "Loja 5",
                bairro: "Sé",
                cidade: "São Paulo",
                uf: "SP"
            },
            contatos: {
                telefone: "1133334444",
                whatsapp: "11999998888",
                site: "https://construfacil.com.br"
            }
        };
        localStorage.setItem('lojistas', JSON.stringify([lojistaTeste]));
    }
});