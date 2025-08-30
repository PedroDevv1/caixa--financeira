// 1) "pega" os elementos do HTML
const inputDescricao = document.getElementById('descricao');
const inputValor = document.getElementById('valor');
const selectTipo = document.getElementById('tipo');
const btnAdicionar = document.getElementById('btn-adicionar');
const lista = document.getElementById('lista');
const spanSaldo = document.getElementById('saldo');

// "banco" na memória
const lancamentos = [];
let filtroAtual = 'todos'; // 'todos', 'entrada' ou 'saida'

// 🔹 carregar dados salvos no localStorage ao abrir a página
const dadosSalvos = localStorage.getItem('lancamentos');
if (dadosSalvos) {
  lancamentos.push(...JSON.parse(dadosSalvos));
  renderLista();
  atualizarSaldo();
}

// ------------------- Funções -------------------

// helper de formatação de moeda (R$)
function formatarBRL(numero) {
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// renderiza a lista de lançamentos
function renderLista() {
  lista.innerHTML = '';
  lancamentos.forEach((item, index) => {
    if (filtroAtual !== 'todos' && item.tipo !== filtroAtual) {
      return;
    }

    const li = document.createElement('li');
    li.textContent = `${item.data} — ${item.descricao}: ${formatarBRL(item.valor)} (${item.tipo}) `;

    // botão excluir
    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = '❌';
    btnExcluir.style.marginLeft = '10px';
    btnExcluir.addEventListener('click', () => {
      removerLancamento(index);
    });

    li.appendChild(btnExcluir);
    lista.appendChild(li);
  });
}

// calcula e atualiza o saldo
function atualizarSaldo() {
  let saldo = 0;
  for (const item of lancamentos) {
    if (item.tipo === 'entrada') {
      saldo += item.valor;
    } else {
      saldo -= item.valor;
    }
  }
  spanSaldo.textContent = formatarBRL(saldo);
}

// remove lançamento
function removerLancamento(indice) {
  const confirmacao = confirm("Tem certeza que deseja excluir este lançamento?");
  if (!confirmacao) return; // se clicar em "Cancelar", não faz nada

  // remove do array
  lancamentos.splice(indice, 1);

  // salva de novo no localStorage
  localStorage.setItem('lancamentos', JSON.stringify(lancamentos));

  // atualiza a tela
  renderLista();
  atualizarSaldo();
}


// ------------------- Evento do botão -------------------

btnAdicionar.addEventListener('click', () => {
  const descricao = inputDescricao.value.trim();
  const valorTexto = inputValor.value.trim();
  const tipo = selectTipo.value;

  if (!descricao || !valorTexto) {
    alert('Preencha descrição e valor.');
    return;
  }

  const valor = parseFloat(valorTexto.replace(',', '.'));
  if (isNaN(valor) || valor <= 0) {
    alert('Valor inválido. Use algo como 100 ou 120,50');
    return;
  }

  const lancamento = {
    data: new Date().toLocaleDateString('pt-BR'),
    descricao,
    valor,
    tipo
  };

  lancamentos.push(lancamento);
  localStorage.setItem('lancamentos', JSON.stringify(lancamentos));

  renderLista();
  atualizarSaldo();

  inputDescricao.value = '';
  inputValor.value = '';
  inputDescricao.focus();
});

// ------------------- Botões de filtro -------------------
document.getElementById('btn-todos').addEventListener('click', () => {
  filtroAtual = 'todos';
  renderLista();
});

document.getElementById('btn-entradas').addEventListener('click', () => {
  filtroAtual = 'entrada';
  renderLista();
});

document.getElementById('btn-saidas').addEventListener('click', () => {
  filtroAtual = 'saida';
  renderLista();
});
