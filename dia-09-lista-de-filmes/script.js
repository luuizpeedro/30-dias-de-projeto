document.addEventListener("DOMContentLoaded", () => {
  // COLE SUA CHAVE DA API AQUI
  const apiKey = "17a4a1eec894c79250b7b513d5418463";
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const searchResultsContainer = document.getElementById("search-results");
  const favoriteMoviesContainer = document.getElementById("favorite-movies");

  let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  displayFavoriteMovies();

  async function searchMovies() {
    const query = searchInput.value;
    if (!query) return;

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=pt-BR`
    );
    const data = await response.json();
    displaySearchResults(data.results);
  }

  function displaySearchResults(movies) {
    searchResultsContainer.innerHTML = "";
    if (movies.length === 0) {
      searchResultsContainer.innerHTML =
        '<p class="no-results">Nenhum filme encontrado.</p>';
      return;
    }
    movies.forEach((movie) => {
      if (movie.poster_path) {
        const movieCard = createMovieCard(movie, "search");
        searchResultsContainer.appendChild(movieCard);
      }
    });
  }

  function displayFavoriteMovies() {
    favoriteMoviesContainer.innerHTML = "";
    if (favoriteMovies.length === 0) {
      favoriteMoviesContainer.innerHTML =
        '<p class="no-results">Sua lista está vazia.</p>';
      return;
    }
    favoriteMovies.forEach((movie) => {
      const movieCard = createMovieCard(movie, "favorite");
      favoriteMoviesContainer.appendChild(movieCard);
    });
  }

  // --- FUNÇÃO ATUALIZADA ---
  function createMovieCard(movie, context) {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    const posterUrl = `${imageBaseUrl}${movie.poster_path}`;
    movieCard.innerHTML = `
          <img src="${posterUrl}" alt="${movie.title}">
          <div class="movie-details">
              <h3>${movie.title}</h3>
              <button class="action-button"></button>
          </div>
      `;

    const actionButton = movieCard.querySelector(".action-button");

    if (context === "search") {
      actionButton.innerHTML = "&#43;"; // Símbolo de mais
      actionButton.title = "Adicionar aos favoritos";
      actionButton.onclick = (e) => {
        e.stopPropagation(); // Impede que o clique afete o card
        addToFavorites(movie);
      };
    } else if (context === "favorite") {
      actionButton.innerHTML = "&#215;"; // Símbolo de X
      actionButton.title = "Remover dos favoritos";
      actionButton.onclick = (e) => {
        e.stopPropagation();
        removeFromFavorites(movie.id);
      };
    }

    return movieCard;
  }

  // O resto das funções (addToFavorites, removeFromFavorites, saveFavorites) permanece IGUAL
  function addToFavorites(movie) {
    if (!favoriteMovies.some((favMovie) => favMovie.id === movie.id)) {
      favoriteMovies.push(movie);
      saveFavorites();
      displayFavoriteMovies();
    } else {
      alert("Este filme já está na sua lista!");
    }
  }

  function removeFromFavorites(movieId) {
    favoriteMovies = favoriteMovies.filter((movie) => movie.id !== movieId);
    saveFavorites();
    displayFavoriteMovies();
  }

  function saveFavorites() {
    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
  }

  searchButton.addEventListener("click", searchMovies);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchMovies();
    }
  });
});
