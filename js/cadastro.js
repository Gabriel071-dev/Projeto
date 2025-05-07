/* Funcionalidades que são usadas para otimizar o sistema. Por exemplo, a API de preencher o endereço através da busca do CEP do usuário, das linhas 14 à 31. */

document.addEventListener('DOMContentLoaded', function() {
    // Máscaras para os campos
    const cpfInput = document.getElementById('cpf');
    const cnpjInput = document.getElementById('cnpj');
    const telefoneInput = document.getElementById('telefone');
    const telefoneEmpresaInput = document.getElementById('telefoneEmpresa');
    const whatsappInput = document.getElementById('whatsapp');
    const cepInput = document.getElementById('cep');
    const buscarCepBtn = document.getElementById('buscarCep');
    const cadastroForm = document.getElementById('cadastroForm');

    // Máscara para CPF
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 3) {
            value = value.substring(0, 3) + '.' + value.substring(3);
        }
        if (value.length > 7) {
            value = value.substring(0, 7) + '.' + value.substring(7);
        }
        if (value.length > 11) {
            value = value.substring(0, 11) + '-' + value.substring(11, 13);
        }
        
        e.target.value = value;
    });

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

    // Máscara para telefones
    function aplicarMascaraTelefone(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
            }
            if (value.length > 10) {
                value = value.substring(0, 10) + '-' + value.substring(10, 15);
            }
            
            e.target.value = value;
        });
    }

    aplicarMascaraTelefone(telefoneInput);
    aplicarMascaraTelefone(telefoneEmpresaInput);
    aplicarMascaraTelefone(whatsappInput);

    // Máscara para CEP
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        
        e.target.value = value;
    });

    // Buscar CEP
    buscarCepBtn.addEventListener('click', buscarCEP);
    cepInput.addEventListener('blur', buscarCEP);

    function buscarCEP() {
        const cep = cepInput.value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            alert('CEP inválido! Deve conter 8 dígitos.');
            return;
        }
        
        buscarCepBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
        buscarCepBtn.disabled = true;
        
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    throw new Error('CEP não encontrado');
                }
                
                document.getElementById('logradouro').value = data.logradouro || '';
                document.getElementById('bairro').value = data.bairro || '';
                document.getElementById('cidade').value = data.localidade || '';
                document.getElementById('uf').value = data.uf || '';
                
                document.getElementById('numero').focus();
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                alert('Erro ao buscar CEP. Verifique o CEP digitado e tente novamente.');
            })
            .finally(() => {
                buscarCepBtn.innerHTML = '<i class="fas fa-search"></i> Buscar';
                buscarCepBtn.disabled = false;
            });
    }

    // Validação de formulário
    cadastroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar senhas
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }
        
        if (senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return;
        }
        
        // Validar CPF (simplificado)
        const cpf = cpfInput.value.replace(/\D/g, '');
        if (cpf.length !== 11) {
            alert('CPF inválido! Deve conter 11 dígitos.');
            return;
        }
        
        // Validar CNPJ (simplificado)
        const cnpj = cnpjInput.value.replace(/\D/g, '');
        if (cnpj.length !== 14) {
            alert('CNPJ inválido! Deve conter 14 dígitos.');
            return;
        }
        
        // Coletar dados do formulário
        const lojista = {
            dadosPessoais: {
                nome: document.getElementById('nome').value,
                cpf: cpf,
                telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
                email: document.getElementById('email').value,
                senha: senha
            },
            empresa: {
                razaoSocial: document.getElementById('razaoSocial').value,
                nomeFantasia: document.getElementById('nomeFantasia').value,
                cnpj: cnpj,
                inscricaoEstadual: document.getElementById('inscricaoEstadual').value
            },
            endereco: {
                cep: cepInput.value,
                logradouro: document.getElementById('logradouro').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                uf: document.getElementById('uf').value
            },
            contatos: {
                telefone: document.getElementById('telefoneEmpresa').value.replace(/\D/g, ''),
                whatsapp: document.getElementById('whatsapp').value.replace(/\D/g, ''),
                site: document.getElementById('site').value
            }
        };
        
        // Simular envio para o servidor
        console.log('Dados do lojista:', lojista);
        
        // Salvar no localStorage (simulação)
        localStorage.setItem('lojistaCadastrado', JSON.stringify(lojista));
        
        // Feedback para o usuário
        alert('Cadastro realizado com sucesso!\n\nSua loja está pronta para ser configurada.');
        
        // Redirecionar (simulação)
        // window.location.href = 'configuracao-inicial.html';
    });
});