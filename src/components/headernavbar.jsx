import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies, getGenres } from '../services/tmdb_API';

function HeaderNavBar() {
  const navigate = useNavigate();

  // Estados
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [genreMenuOpen, setGenreMenuOpen] = useState(false);
  const [allGenres, setAllGenres] = useState([]);

  const inputRef = useRef();
  const suggestionsRef = useRef();

  // Função para fechar o menu principal (e também o de gênero)
  const closeSidebar = () => {
    setMenuOpen(false);
    setGenreMenuOpen(false);
  };

  // Função para clique no gênero
  const handleGenreClick = (genreId, genreName) => {
    console.log('Id do Genero Selecionado', genreId);
    console.log('Nome do Genero', genreName);
    navigate(`/list/genre/${genreId}`); // Navega para lista filtrada por gênero
    setGenreMenuOpen(false);
    setMenuOpen(false);
  };

  // Função para abrir sidebar de gêneros
  const openGenreMenu = () => {
    setGenreMenuOpen(true);
  };

  // Função para navegar para detalhes do filme
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    window.scrollTo(0, 0);
  };

  const navigateHome = () => {
    navigate(`/`);
  };

  const navigatelist = () => {
    navigate(`/list`); // Navega para lista de filmes populares
  };

  // Carregar todos os gêneros
  useEffect(() => {
    async function fetchAllGenres() {
      try {
        const genres = await getGenres();
        setAllGenres(genres);
      } catch (error) {
        console.error('erro ao carregar todos os generos', error);
      }
    }
    fetchAllGenres();
  }, []);

  // Busca de filmes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        searchMovies(query).then((results) => {
          setMovies(results);
          setShowSuggestions(true);
        });
      } else {
        setMovies([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="header">
      <div className="menu">
        <nav className="navbar navbar-dark ">
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuOpen(true)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </nav>

        {/* Sidebar Principal */}
        {menuOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

        <div className={`sidebar-menu ${menuOpen ? 'open' : ''}`}>
          <a href="#" onClick={() => { closeSidebar(); navigateHome(); }}>Início</a>
          <a href="#" onClick={() => { closeSidebar(); navigatelist(); }}>Lista de filmes</a>
          <a style={{ cursor: 'pointer' }} onClick={openGenreMenu}>Gênero</a>
        </div>

        {/* Sidebar de Gêneros */}
        {genreMenuOpen && (
          <>
            <div className="sidebar-overlay" onClick={() => setGenreMenuOpen(false)}></div>
            <div className="genre-sidebar open">
              <div className="genre-list">
                {allGenres.map((genre) => (
                  <div
                    key={genre.id}
                    className="genre-item"
                    onClick={() => handleGenreClick(genre.id, genre.name)}
                  >
                    <span>{genre.name}</span>
                    <span className="genre-arrow">→</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="inputext search-box" ref={inputRef}>
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar Filmes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div
          className={`suggestions ${showSuggestions && movies.length > 0 ? 'show' : ''}`}
          ref={suggestionsRef}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="suggestion-item" onClick={() => handleMovieClick(movie.id)}>
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                    : 'default-image-url'
                }
                alt={movie.title}
              />
              <div className="movie-info">
                <div className="movie-title">{movie.title}</div>
                <div className="movie-year">
                  {new Date(movie.release_date).getFullYear()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeaderNavBar;