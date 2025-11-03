// 1) Função para carregar a página inicial com o carrossel e lista de artistas
function carregarHome() {
  const carouselEl = document.getElementById("carousel-destaques");
  const listaEl = document.getElementById("lista-artistas");

  if (!carouselEl || !listaEl) return; // Verifica se os elementos existem no DOM

  // Carregar dados do JSON Server
  fetch('http://localhost:3000/artistas')
    .then(response => response.json())
    .then(artistas => {
      // Filtrar artistas em destaque
      const destaques = artistas.filter(a => a.destaque);  // Filtra artistas com 'destaque' verdadeiro
      const todos = artistas.sort((a, b) => a.nome.localeCompare(b.nome));  // Ordena todos os artistas por nome

      // Carrossel de destaques
      if (destaques.length === 0) {
        carouselEl.innerHTML = `<div class="text-center p-5">Sem artistas em destaque no momento.</div>`;
      } else {
        carouselEl.innerHTML = destaques
          .map((artista, i) => `
            <div class="carousel-item ${i === 0 ? "active" : ""}">
              <img src="${artista.imagem_principal}" class="d-block w-100" alt="${artista.nome}">
              <div class="carousel-caption bg-dark bg-opacity-50 rounded-3 p-3">
                <h5 class="mb-1">${artista.nome}</h5>
                <p class="mb-2">${artista.descricao}</p>
                <a href="detalhes.html?id=${artista.id}" class="btn btn-sm btn-primary">Ver detalhes</a>
              </div>
            </div>
          `).join('');
      }

      // Cards com todos os artistas
      listaEl.innerHTML = todos
        .map(artista => `
          <div class="col-12 col-sm-6 col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
              <img src="${artista.imagem_principal}" class="card-img-top" alt="${artista.nome}">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${artista.nome}</h5>
                <p class="card-text flex-grow-1">${artista.descricao}</p>
                <a href="detalhes.html?id=${artista.id}" class="btn btn-primary mt-2">Ver detalhes</a>
              </div>
            </div>
          </div>
        `).join('');
    })
    .catch(error => {
      console.error('Erro ao carregar os dados dos artistas:', error);
      carouselEl.innerHTML = `<div class="text-center p-5">Erro ao carregar dados. Tente novamente mais tarde.</div>`;
    });
}

// 2) Função para carregar os detalhes do artista
function carregarDetalhes() {
  const container = document.getElementById("conteudo-artista");
  if (!container) return;

  // Obter o id do artista da URL
  const id = getQueryParam("id");
  if (!id) {
    container.innerHTML = `<div class="alert alert-warning">Nenhum artista encontrado. Verifique o link.</div>`;
    return;
  }

  // Carregar dados do JSON Server
  fetch('http://localhost:3000/artistas')
    .then(response => response.json())
    .then(artistas => {
      const artista = artistas.find(a => String(a.id) === String(id));

      if (!artista) {
        container.innerHTML = `<div class="alert alert-warning">Artista não encontrado.</div>`;
        return;
      }

      container.innerHTML = `
        <div class="card mb-4 shadow-sm">
          <img src="${artista.imagem_principal}" class="card-img-top" alt="${artista.nome}">
          <div class="card-body">
            <h2 class="h3">${artista.nome}</h2>
            <p class="mb-1"><strong>País:</strong> ${artista.pais}</p>
            <p class="mb-3">${artista.biografia}</p>
            <a href="index.html" class="btn btn-outline-secondary btn-sm">⬅ Voltar</a>
          </div>
        </div>

        <h3 class="h4 mb-3">Obras de ${artista.nome}</h3>
        <div class="row">
          ${artista.obras && artista.obras.length
            ? artista.obras.map(obra => `
                <div class="col-12 col-sm-6 col-md-4 mb-4">
                  <div class="card h-100">
                    <img src="${obra.imagem}" class="card-img-top" alt="${obra.titulo}">
                    <div class="card-body">
                      <h5 class="card-title">${obra.titulo}</h5>
                      <p class="card-text">${obra.descricao}</p>
                    </div>
                  </div>
                </div>
              `).join('')
            : `<div class="col-12"><div class="alert alert-info">Este artista ainda não possui obras cadastradas.</div></div>`
          }
        </div>
      `;
    })
    .catch(error => {
      console.error('Erro ao carregar os detalhes do artista:', error);
      container.innerHTML = `<div class="alert alert-warning">Erro ao carregar dados do artista. Tente novamente mais tarde.</div>`;
    });
}

// 3) Função para obter o parâmetro da URL (usado para buscar o id do artista)
function getQueryParam(nome) {
  const params = new URLSearchParams(window.location.search);
  return params.get(nome);
}

// 4) Inicialização de acordo com a página
document.addEventListener("DOMContentLoaded", () => {
  const pageId = document.body.id;
  if (pageId === "home") carregarHome();
  if (pageId === "detalhes") carregarDetalhes();
});
