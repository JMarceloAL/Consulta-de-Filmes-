
import { useState, useEffect, useRef } from 'react';
import { searchMovies , getPopularMovies ,getTrailers, getReleasemovies } from '../../services/tmdb_API';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation  , EffectCoverflow} from 'swiper/modules';

function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularMovies , setPopularMovies] =useState([]);
  const [menuOpen,setMenuOpen] = useState(false);

  const inputRef = useRef();
  const suggestionsRef = useRef();

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

useEffect(() => {
  async function fetchReleaseWithTrailers() {
    const movies = await getReleasemovies(); // <- pega os filmes em lançamento
    const moviesWithTrailers = await Promise.all(
      movies.slice(0, 20).map(async (movie) => {
        const trailerUrl = await getTrailers(movie.id);
        return { ...movie, trailerUrl };
      })
    );
    setPopularMovies(moviesWithTrailers); // Reutiliza o mesmo estado
  }

  fetchReleaseWithTrailers();
}, []);

  return (
    <div>
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

  {/* Sidebar Lateral */}
  {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)}></div>}

  <div className={`sidebar-menu ${menuOpen ? 'open' : ''}`}>
    
    <a href="#">Início</a>
    <a href="#lancamentos">Lançamentos</a>
    <a href="#recomendados">Recomendados</a>
    <a href="#rodape">Contato</a>
  </div>
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
              <div key={movie.id} className="suggestion-item">
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
  <div className="swiper-container-wrapper">


      <div className="high_info">
  <h1 className='title_lançamentos'>LANÇAMENTOS</h1>
  <Swiper 
  modules={[Navigation, EffectCoverflow]}
  navigation
  loop={true}
  centeredSlides={true}          // Slide central em destaque
  effect="coverflow"             // Ativa o efeito visual 3D
  coverflowEffect={{
    rotate: 0,
    stretch: 0,
    depth:100,
    modifier: 3,
    slideShadows: false,
}}
slidesPerView={1.5}            // Mostra pedaços dos slides laterais
breakpoints={{
    768: { slidesPerView: 2.5 },
    1024: { slidesPerView: 3.2 }
}}
  style={{ padding: '20px 0',  }}
>
  {popularMovies
    .filter((movie) => movie.trailerUrl)
    .map((movie) => (
        <SwiperSlide key={movie.id}>
        <div className="trailer-box">
          <iframe className="trailer_card"
            width="100%"
            height="200"
            src={movie.trailerUrl}
            title={`Trailer de ${movie.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            ></iframe>
          <p className="trailer-title">{movie.title}</p>
        </div>
      </SwiperSlide>
    ))}
</Swiper>
    </div>
</div>
      <div className="releases">
        <h1>Em alta</h1>
      </div>
      <div className="recommended">
        <h1>Recomendados</h1>
      </div>
      <div className="footer">
        <h1>Rodapé</h1>
      </div>
    </div>
  );
}

export default Home;
