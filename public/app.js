
// =====================================
// CADASTROHUB - SISTEMA PRINCIPAL
// =====================================

// Conta administrativa de demonstração
const ADMIN_EMAIL = "admin@cadastrohub.com";
const ADMIN_SENHA = "Admin@123";

// Recuperar usuários salvos
function obterUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// Salvar usuários
function salvarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Recuperar sessão
function obterSessao() {
    return JSON.parse(sessionStorage.getItem("sessao"));
}

// Proteger páginas
function protegerPagina(admin = false) {
    const sessao = obterSessao();

    if (!sessao) {
        window.location.href = "index.html";
        return false;
    }

    if (admin && sessao.tipo !== "admin") {
        alert("Acesso permitido somente ao administrador!");
        window.location.href = "home.html";
        return false;
    }

    return true;
}

// =====================================
// CADASTRO
// =====================================

const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {

    formCadastro.addEventListener("submit", function(event) {
        event.preventDefault();

        const usuario = {
            nome: document.getElementById("nome").value.trim(),
            sobrenome: document.getElementById("sobrenome").value.trim(),
            cpf: document.getElementById("cpf").value.trim(),
            email: document.getElementById("email").value.trim().toLowerCase(),
            senha: document.getElementById("senha").value,
            telefone: document.getElementById("telefone").value.trim(),
            rua: document.getElementById("rua").value.trim(),
            cep: document.getElementById("cep").value.trim(),
            cidade: document.getElementById("cidade").value.trim(),
            estado: document.getElementById("estado").value.trim()
        };

        const usuarios = obterUsuarios();

        const cpfExiste = usuarios.some(
            u => u.cpf === usuario.cpf
        );

        const emailExiste = usuarios.some(
            u => u.email === usuario.email
        );

        if (cpfExiste) {
            alert("Este CPF já está cadastrado!");
            return;
        }

        if (emailExiste || usuario.email === ADMIN_EMAIL) {
            alert("Este e-mail já está cadastrado!");
            return;
        }

        usuarios.push(usuario);
        salvarUsuarios(usuarios);

        alert("Cadastro realizado com sucesso!");

        window.location.href = "index.html";
    });
}

// =====================================
// LOGIN
// =====================================

const formLogin = document.getElementById("formLogin");

if (formLogin) {

    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("emailLogin")
            .value.trim().toLowerCase();

        const senha = document.getElementById("senhaLogin").value;

        // Verificar administrador
        if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {

            sessionStorage.setItem("sessao", JSON.stringify({
                email: email,
                nome: "Administrador",
                tipo: "admin"
            }));

            window.location.href = "admin.html";
            return;
        }

        // Verificar usuário comum
        const usuarios = obterUsuarios();

        const usuario = usuarios.find(
            u => u.email === email && u.senha === senha
        );

        if (!usuario) {
            alert("E-mail ou senha incorretos!");
            return;
        }

        sessionStorage.setItem("sessao", JSON.stringify({
            email: usuario.email,
            nome: usuario.nome,
            tipo: "usuario"
        }));

        window.location.href = "home.html";
    });
}

// =====================================
// BOAS-VINDAS
// =====================================

if (window.location.pathname.endsWith("home.html")) {

    if (protegerPagina()) {

        const sessao = obterSessao();

        document.getElementById("mensagemBoasVindas")
            .textContent = `Bem-vindo ao CadastroHub, ${sessao.nome}!`;

        if (sessao.tipo !== "admin") {
            document.getElementById("linkAdmin").style.display = "none";
            document.getElementById("botaoAdmin").style.display = "none";
        }
    }
}

// =====================================
// ADMINISTRAÇÃO
// =====================================

if (window.location.pathname.endsWith("admin.html")) {

    if (protegerPagina(true)) {
        listarUsuarios();
    }
}

// Criar conteúdo da tabela
function listarUsuarios(filtro = "") {

    const tabela = document.getElementById("listaUsuarios");

    if (!tabela) return;

    const usuarios = obterUsuarios();

    tabela.innerHTML = "";

    const encontrados = usuarios.filter(usuario =>
        usuario.cpf.toLowerCase().includes(filtro.toLowerCase())
    );

    if (encontrados.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="5">Nenhum usuário encontrado.</td>
            </tr>
        `;
        return;
    }

    encontrados.forEach(usuario => {

        const linha = document.createElement("tr");

        const dados = [
            usuario.nome + " " + usuario.sobrenome,
            usuario.cpf,
            usuario.email,
            usuario.telefone
        ];

        dados.forEach(valor => {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.appendChild(celula);
        });

        const acoes = document.createElement("td");

        const editar = document.createElement("button");
        editar.textContent = "Editar";
        editar.className = "btn-editar";
        editar.addEventListener("click", () => editarUsuario(usuario.cpf));

        const excluir = document.createElement("button");
        excluir.textContent = "Apagar";
        excluir.className = "btn-excluir";
        excluir.addEventListener("click", () => apagarUsuario(usuario.cpf));

        acoes.append(editar, excluir);
        linha.appendChild(acoes);

        tabela.appendChild(linha);
    });
}

// Buscar usuário pelo CPF
function buscarUsuario() {

    const cpf = document.getElementById("buscarCPF").value.trim();

    listarUsuarios(cpf);
}

// Limpar busca
function limparBusca() {
    document.getElementById("buscarCPF").value = "";
    listarUsuarios();
}

// Disponibilizar o botão Limpar
function listarTodos() {
    limparBusca();
}

// =====================================
// EDITAR USUÁRIO
// =====================================

function editarUsuario(cpf) {

    const usuarios = obterUsuarios();

    const usuario = usuarios.find(u => u.cpf === cpf);

    if (!usuario) return;

    document.getElementById("editCpfOriginal").value = usuario.cpf;
    document.getElementById("editNome").value = usuario.nome;
    document.getElementById("editSobrenome").value = usuario.sobrenome;
    document.getElementById("editCpf").value = usuario.cpf;
    document.getElementById("editEmail").value = usuario.email;
    document.getElementById("editTelefone").value = usuario.telefone;
    document.getElementById("editRua").value = usuario.rua;
    document.getElementById("editCep").value = usuario.cep;
    document.getElementById("editCidade").value = usuario.cidade;
    document.getElementById("editEstado").value = usuario.estado;
    document.getElementById("editSenha").value = "";

    document.getElementById("formEdicao").scrollIntoView({
        behavior: "smooth"
    });
}

const formEdicao = document.getElementById("formEdicao");

if (formEdicao) {

    formEdicao.addEventListener("submit", function(event) {
        event.preventDefault();

        const cpfOriginal = document.getElementById("editCpfOriginal").value;

        const usuarios = obterUsuarios();

        const indice = usuarios.findIndex(
            u => u.cpf === cpfOriginal
        );

        if (indice === -1) {
            alert("Usuário não encontrado!");
            return;
        }

        const cpfNovo = document.getElementById("editCpf").value.trim();

        const emailNovo = document.getElementById("editEmail")
            .value.trim().toLowerCase();

        const duplicado = usuarios.some((u, i) =>
            i !== indice &&
            (u.cpf === cpfNovo || u.email === emailNovo)
        );

        if (duplicado || emailNovo === ADMIN_EMAIL) {
            alert("CPF ou e-mail já utilizado por outro cadastro!");
            return;
        }

        const senhaNova = document.getElementById("editSenha").value;

        usuarios[indice] = {
            ...usuarios[indice],

            nome: document.getElementById("editNome").value.trim(),
            sobrenome: document.getElementById("editSobrenome").value.trim(),
            cpf: cpfNovo,
            email: emailNovo,
            telefone: document.getElementById("editTelefone").value.trim(),
            rua: document.getElementById("editRua").value.trim(),
            cep: document.getElementById("editCep").value.trim(),
            cidade: document.getElementById("editCidade").value.trim(),
            estado: document.getElementById("editEstado").value.trim(),

            senha: senhaNova || usuarios[indice].senha
        };

        salvarUsuarios(usuarios);

        alert("Dados atualizados com sucesso!");

        formEdicao.reset();

        document.getElementById("editCpfOriginal").value = "";

        listarUsuarios();
    });
}

// =====================================
// APAGAR USUÁRIO
// =====================================

function apagarUsuario(cpf) {

    const confirmar = confirm(
        "Tem certeza que deseja apagar este usuário?"
    );

    if (!confirmar) return;

    let usuarios = obterUsuarios();

    usuarios = usuarios.filter(u => u.cpf !== cpf);

    salvarUsuarios(usuarios);

    alert("Usuário removido com sucesso!");

    listarUsuarios();
}

// =====================================
// SAIR DO SISTEMA
// =====================================

function sair() {

    sessionStorage.removeItem("sessao");

    window.location.href = "index.html";
}
