const form = document.getElementById("form-habito");
const input = document.getElementById("input-habito");
const lista = document.getElementById("lista-habitos");
const historicoDiv = document.getElementById("historico");

let habitos = JSON.parse(localStorage.getItem("habitos")) || [];
let progresso = JSON.parse(localStorage.getItem("progresso")) || {};

// pega a data de hoje
let hoje = new Date().toLocaleDateString();

// se não existir progresso para hoje, cria um
if (!progresso[hoje]) {
  progresso[hoje] = {};
}

renderizarLista();

function adicionarHabito(event) {
  event.preventDefault();
  let habito = { texto: input.value, concluido: false };
  habitos.push(habito);
  salvar();
  renderizarLista();
  input.value = "";
}

function concluido(index) {
  habitos[index].concluido = !habitos[index].concluido;

  // salvar no histórico do dia
  progresso[hoje][habitos[index].texto] = habitos[index].concluido;

  salvar();
  renderizarLista();
}

function remove(index) {
  habitos.splice(index, 1);
  salvar();
  renderizarLista();
}

function renderizarLista() {
  lista.innerHTML = "";
  habitos.forEach((habito, index) => {
    let li = document.createElement("li");
    li.textContent = habito.texto;
    if (habito.concluido) li.classList.add("concluido");

    let botaoConcluir = document.createElement("button");
    botaoConcluir.textContent = "✅";
    botaoConcluir.onclick = () => concluido(index);

    let botaoRemover = document.createElement("button");
    botaoRemover.textContent = "🗑️";
    botaoRemover.onclick = () => remove(index);

    li.appendChild(botaoConcluir);
    li.appendChild(botaoRemover);
    lista.appendChild(li);
  });
}

function salvar() {
  localStorage.setItem("habitos", JSON.stringify(habitos));
  localStorage.setItem("progresso", JSON.stringify(progresso));
}

// Mostrar histórico de ontem
document.getElementById("mostrar-historico").addEventListener("click", () => {
  historicoDiv.innerHTML = "<h3>Histórico de ontem:</h3>";

  let ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  ontem = ontem.toLocaleDateString();

  if (progresso[ontem]) {
    for (let habito in progresso[ontem]) {
      if (progresso[ontem][habito]) {
        historicoDiv.innerHTML += `<p>✅ ${habito}</p>`;
      } else {
        historicoDiv.innerHTML += `<p>❌ ${habito}</p>`;
      }
    }
  } else {
    historicoDiv.innerHTML += "<p>Nenhum hábito registrado ontem.</p>";
  }
});
