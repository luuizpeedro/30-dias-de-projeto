document.addEventListener("DOMContentLoaded", () => {
  // COLE SUA CHAVE DA API AQUI
  const apiKey = "17a4a1eec894c79250b7b513d5418463";
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  // MAPEAMENTO DE ELEMENTOS
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
    movies.forEach((movie) => {
      if (movie.poster_path) {
        const movieCard = createMovieCard(movie, "search");
        searchResultsContainer.appendChild(movieCard);
      }
    });
  }

  function displayFavoriteMovies() {
    favoriteMoviesContainer.innerHTML = "";
    favoriteMovies.forEach((movie) => {
      const movieCard = createMovieCard(movie, "favorite");
      favoriteMoviesContainer.appendChild(movieCard);
    });
  }

  function createMovieCard(movie, context) {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    const posterUrl = `${imageBaseUrl}${movie.poster_path}`;
    movieCard.innerHTML = `
          <img src="${posterUrl}" alt="${movie.title}">
          <div class="movie-info">
              <h3>${movie.title}</h3>
          </div>
      `;

    if (context === "search") {
      const favoriteButton = document.createElement("button");
      favoriteButton.className = "favorite-button";
      favoriteButton.innerHTML = "&#43;"; // Símbolo de mais
      favoriteButton.onclick = () => addToFavorites(movie);
      movieCard.appendChild(favoriteButton);
    } else if (context === "favorite") {
      const removeButton = document.createElement("button");
      removeButton.className = "remove-button";
      removeButton.innerHTML = "&#215;"; // Símbolo de X
      removeButton.onclick = () => removeFromFavorites(movie.id);
      movieCard.appendChild(removeButton);
    }

    return movieCard;
  }

  function addToFavorites(movie) {
    if (!favoriteMovies.some((favMovie) => favMovie.id === movie.id)) {
      favoriteMovies.push(movie);
      saveFavorites();
      displayFavoriteMovies();
    } else {
      alert("Este filme já está nos seus favoritos!");
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

  // EVENT LISTENERS
  searchButton.addEventListener("click", searchMovies);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchMovies();
    }
  });
});
