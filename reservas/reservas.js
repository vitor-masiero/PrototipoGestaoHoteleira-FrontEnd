// Script relacionado ao módulo de reservas

// Array principal armazenado no navegador
if (localStorage.getItem('listaReservas') === null) {
    listaReservas = [];
    localStorage.setItem('listaReservas', JSON.stringify(listaReservas));
} else {
    listaReservas = JSON.parse(localStorage.getItem('listaReservas'));
}

// Aguarda o carregamento do HTML para ser executado
document.addEventListener('DOMContentLoaded', function () {

    // Chamadas
    listarReservas();

    // Salva cadastro e edição
    document.querySelector('#bt-salvar').addEventListener('click', function () {
        // Pega os dados dos campos do formulário
        let idRes = document.querySelector('#campo-idRes').value; // ID do registro
        let dataInicio = document.querySelector('#campo-data-inicio').value;
        let dataFim = document.querySelector('#campo-data-fim').value;
        let acomodacao = document.querySelector('#campo-acomodacao').value;
        let cliente = document.querySelector('#campo-cliente').value;
        let qtdPessoas = document.querySelector('#qtdPessoas').value;
        let valor = document.querySelector('#valor').value;

        // Validações de campos
        if (dataInicio == "") {
            alert("Data inicial é um campo obrigatório!");
            return;
        } else if (dataFim == "") {
            alert("Data final é um campo obrigatório!");
            return;
        } else if (acomodacao == "") {
            alert("Acomodação é um campo obrigatório!");
            return;
        }else if (cliente == "") {
            alert("Cliente é um campo obrigatório!");
            return;
        }else if (qtdPessoas == "") {
            alert("Quantidade de pessoas é um campo obrigatório!");
            return;
        }else if (valor == "") {
            alert("Valor é um campo obrigatório!");
            return;
        }

        // Cria objeto
        let reserva = {
            idRes: (idRes != "") ? idRes : getMaiorIdReservas() + 1,
            dataInicio: formatarDataParaBR(dataInicio),
            dataFim: formatarDataParaBR(dataFim),
            acomodacao: acomodacao,
            cliente: cliente,
            qtdPessoas: qtdPessoas,
            valor: parseFloat(valor).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
        };

        // Altera ou insere uma posição no array principal
        if (idRes != "") {
            let indice = getIndiceReservasPorId(idRes);
            listaReservas[indice] = reserva;
        } else {
            listaReservas.push(reserva);
        }

        // Armazena a lista atualizada no navegador
        localStorage.setItem('listaReservas', JSON.stringify(listaReservas));

        // Reseta o formulário e recarrega a tabela de listagem
        this.blur();
       resetarForm();
       listarReservas();
    });

    // Cancelamento de edição
    document.querySelector('#bt-cancelar').addEventListener('click', function () {
        resetarForm();
    });
});

// Função para listar reservas
function listarReservas() {
    document.querySelector('table tbody').innerHTML = "";
    document.querySelector('#total-registros').textContent = listaReservas.length;
    listaReservas.forEach(function (reserva) {

        // Cria string HTML com os dados da lista
        let htmlAcoes = "";
        htmlAcoes += '<button class="bt-tabela bt-editar" title="Editar"><i class="ph ph-pencil"></i></button>';
        htmlAcoes += '<button class="bt-tabela bt-excluir" title="Excluir"><i class="ph ph-trash"></i></button>';

        let htmlColunas = "";
        htmlColunas += "<td>" + reserva.idRes + "</td>";
        htmlColunas += "<td>" + reserva.dataInicio + "</td>";
        htmlColunas += "<td>" + reserva.dataFim + "</td>";
        htmlColunas += "<td>" + reserva.acomodacao + "</td>";
        htmlColunas += "<td>" + reserva.cliente + "</td>";
        htmlColunas += "<td>" + reserva.qtdPessoas + "</td>";
        htmlColunas += "<td>" + reserva.valor + "</td>";
        htmlColunas += "<td>" + htmlAcoes + "</td>";

        
        // Adiciona a linha ao corpo da tabela
        let htmlLinha = '<tr id="linha-' + reserva.idRes + '">' + htmlColunas + '</tr>';
        document.querySelector('table tbody').innerHTML += htmlLinha;

    
    });

    eventosListagem();
    carregar();
}

// Função para lidar com eventos de listagem
function eventosListagem() {

    // Ação de editar reserva
    document.querySelectorAll('.bt-editar').forEach(function (botao) {
        botao.addEventListener('click', function () {
            let linha = botao.parentNode.parentNode;
            let colunas = linha.getElementsByTagName('td');
            let idRes = colunas[0].textContent;
            let dataInicio = colunas[1].textContent;
            let dataFim = colunas[2].textContent;
            let acomodacao = colunas[3].textContent;
            let cliente = colunas[4].textContent;
            let qtdPessoas = colunas[5].textContent;
            let valor = colunas[6].textContent;

            // Popula os campos do formulário
            document.querySelector('#campo-idRes').value = idRes; 
            document.querySelector('#campo-data-inicio').value = formatarDataParaISO(dataInicio);
            document.querySelector('#campo-data-fim').value = formatarDataParaISO(dataFim);
            document.querySelector('#campo-acomodacao').value = acomodacao;
            document.querySelector('#campo-cliente').value = cliente;
            document.querySelector('#qtdPessoas').value = qtdPessoas;
            document.querySelector('#valor').value = valor;

            // Exibe botão de cancelar edição
            document.querySelector('#bt-cancelar').style.display = 'flex';
        });
    });

    // Ação de excluir reserva
    document.querySelectorAll('.bt-excluir').forEach(function (botao) {
        botao.addEventListener('click', function () {

            //confirmação de exclusão
            if (confirm("Deseja realmente excluir?")) {
                let linha = botao.parentNode.parentNode;
                let id = linha.id.replace('linha-', '');
                let indice = getIndiceReservasPorId(id);
                listaReservas.splice(indice, 1);

                // Armazena a lista atualizada no navegador
                localStorage.setItem('listaReservas', JSON.stringify(listaReservas));
                listarReservas();
            }
        });
    });
}

// Funções auxiliares
function getIndiceReservasPorId(idRes) {
    indiceProcurado = null;
    listaReservas.forEach(function (reserva, indice) {
        if (idRes == reserva.idRes) {
            indiceProcurado = indice;
        }
    });
    return indiceProcurado;
}

function getMaiorIdReservas() {
    return listaReservas.length > 0 ? parseInt(listaReservas[listaReservas.length - 1].idRes) : 0;
}

function resetarForm() {
    document.querySelector('#campo-idRes').value = "";
    document.querySelector('#campo-data-inicio').value = "";
    document.querySelector('#campo-data-fim').value = "";
    document.querySelector('#campo-acomodacao').value = "";
    document.querySelector('#campo-cliente').value = "";
    document.querySelector('#qtdPessoas').value = "";
    document.querySelector('#valor').value = "";
    document.querySelector('#bt-cancelar').style.display = 'none';
}
