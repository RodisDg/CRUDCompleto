function buscarDados() {
    var cpf = document.getElementById('identificadorCPF').value 

    fetch('http://localhost:3000/pessoas', {
        method: 'GET'
    })
    .then(resposta => resposta.json())
    .then(dados => {
        let pessoaEncontrada = dados.find(pessoa => pessoa.cpf == cpf) 

        if(pessoaEncontrada) {
            document.getElementById('nomeAtualizar').value = pessoaEncontrada.nome
            document.getElementById('idadeAtualizar').value = pessoaEncontrada.idade
            document.getElementById('identificadorCPF').value = pessoaEncontrada.cpf 
            document.getElementById('identificador').value = pessoaEncontrada.id 
        } else {
            alert("Pessoa não encontrada")
        }
    })
}

function atualizarDados() {
    var id = document.getElementById('identificador').value 
    var cpf = document.getElementById('identificadorCPF').value 
    var nome = document.getElementById('nomeAtualizar').value
    var idade = document.getElementById('idadeAtualizar').value

    fetch(`http://localhost:3000/pessoas/${id}`, {
        method: 'PUT', //Metodo POST HTTP
        headers: {
            'Content-Type': 'application/json' //Tipo de conteudo enviado JSON
        },
        body: JSON.stringify({nome: nome, idade: idade, cpf: cpf}) //Dados a serem enviados e convertidos 
    })
    .then(resposta => resposta.JSON) //Converte a resposta para JSON
}
