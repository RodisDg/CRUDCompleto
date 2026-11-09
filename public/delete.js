function deletarDados() {
    var cpf = document.getElementById('identificadorCPF').value

    fetch('http://localhost:3000/pessoas')
        .then(response => response.json())
        .then(data => {
            
            const pessoa = data.find(pessoa => pessoa.cpf === cpf)

            if (pessoa) {
                
                fetch(`http://localhost:3000/pessoas/${pessoa.id}`, {
                    method: 'DELETE'
                })
                .then(() => alert('Pessoa deletada com sucesso!'))
            } else {
                alert('CPF não encontrado.')
            }
        })
}
