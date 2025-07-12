import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { searchMovies , getPopularMovies ,getTrailers, getReleasemovies ,getGenres, getMovieBygenre} from '../../services/tmdb_API';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation  , EffectCoverflow} from 'swiper/modules';
import { use } from 'react';

function Home() {

  const navigate = useNavigate();

  // Estados
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [releaseMovies , setReleaseMovies] =useState([]);
  const [popularmovies , setPopularMovies] = useState([]);
  const [menuOpen,setMenuOpen] = useState(false);
  const[recommendedMovies, setRecommendedMovies] = useState([]);
  const [genreMenuOpen , setGenreMenuOpen] = useState(false);
  const [allGenres, setAllGenres] = useState([]);

  const inputRef = useRef();
  const suggestionsRef = useRef();

  // Função para fechar o menu principal (e também o de gênero)
  const closeSidebar = () => {
    setMenuOpen(false);
    setGenreMenuOpen(false); // Fecha o sidebar de gênero junto
  };

  // Função para clique no gênero
  const handleGenreClick = (genreId , genreName) =>{
    console.log('Id do Genero Selecionado', genreId);
    console.log('Nome do Genero' , genreName);
    // Aqui você pode adicionar lógica para navegar ou filtrar filmes por gênero
    // navigate(`/genre/${genreId}`);
    setGenreMenuOpen(false);
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

  // Carregar todos os gêneros
  useEffect(() =>{
    async function fetchAllGenres() {
      try {
        const genres = await getGenres();
        setAllGenres(genres);
      } catch (error) {
        console.error('erro ao carregar todos os generos', error)
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

  // Mostra os Lançamentos com os trailers
  useEffect(() => {
    async function fetchReleaseWithTrailers() {
      const movies = await getReleasemovies();
      const moviesWithTrailers = await Promise.all(
        movies.slice(0, 20).map(async (movie) => {
          const trailerUrl = await getTrailers(movie.id);
          return { ...movie, trailerUrl };
        })
      );
      setReleaseMovies(moviesWithTrailers);
    }

    fetchReleaseWithTrailers();
  }, []);

  // Mostra top 10 filmes Populares
  useEffect(() => {
    async function fetchPopularMovies(){
      const movies = await getPopularMovies();
      setPopularMovies(movies.slice(0,10));
    }
    fetchPopularMovies();
  }, []);

  // Mostra 1 filme popular por gênero
  useEffect(()=>{
    async function fetchRecommendedPergenre() {
      const genres = await getGenres();
      const popular = await getPopularMovies();
      const filter = [];

      for (const genre of genres){
        const movie = popular.find((m) => m.genre_ids.includes(genre.id));
        if(movie && !filter.some(f => f.id === movie.id)){
          filter.push({... movie, genreName: genre.name});
        }
      }
      setRecommendedMovies(filter);
    }

    fetchRecommendedPergenre();
  } ,[]);

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

          {/* Sidebar Principal */}
          {menuOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

          <div className={`sidebar-menu ${menuOpen ? 'open' : ''}`}>
            <a href="#" onClick={() => {window.scrollTo(0,0); closeSidebar()}}>Início</a>
            <a href="#" onClick={closeSidebar}>Lançamentos</a>
            <a href="#" onClick={closeSidebar}>Populares</a>
            <a  style={{cursor: 'pointer'}}onClick={openGenreMenu}>Gênero</a>
          </div>

          {/* Sidebar de Gêneros - só aparece quando genreMenuOpen for true */}
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

      <div className="swiper-container-wrapper">
        <div className="high_info">
          <h1 className='title_lançamentos'>LANÇAMENTOS</h1>
          <Swiper 
            className='swiper-lançamentos'
            modules={[Navigation, EffectCoverflow]}
            navigation
            loop={true}
            centeredSlides={true}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth:100,
              modifier: 3,
              slideShadows: false,
            }}
            slidesPerView={1.5}
            breakpoints={{
                768: { slidesPerView: 2.5 },
                1024: { slidesPerView: 3.2 }
            }}
            style={{ padding: '20px 0',  }}
          >
            {releaseMovies
              .filter((movie) => movie.trailerUrl)
              .map((movie) => (
                  <SwiperSlide key={movie.id} className='swiperslide-lançamentos'>
                  <div className="trailer-box" onClick={() => handleMovieClick(movie.id)} style={{ cursor: 'pointer'}}>
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

      <div className="top_10">
        <h1 className='text_top10'>TOP 10</h1>
        <Swiper 
          className='swiper-top10'
          modules={[Navigation]}
          navigation
          loop ={true}
          spaceBetween={10}
          slidesPerView={5}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {popularmovies.map((movie) => (
            <SwiperSlide key={movie.id} className='swiperslide-top10'>
              <div className="top10_card" onClick={() => handleMovieClick(movie.id)} style={{cursor: 'pointer'}}>
                <img 
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : 'default-image-url'
                  }
                  alt={movie.title}
                 />
                <p className="top10_title">{movie.title}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="recommended">
        <h1 className="text_top10">Recomendados por Gênero</h1>
        <Swiper 
          className='swiper-recommended'
          modules={[Navigation]}
          navigation
          loop={true}
          spaceBetween={10}
          slidesPerView={5}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {recommendedMovies.map((movie) => (
            <SwiperSlide key={movie.id} className='swiperslide-recommended'>
              <div className="top10_card" onClick={() => handleMovieClick(movie.id)} style={{cursor : 'pointer'}}>
                <p className="genre-title">{movie.genreName}</p>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : 'default-image-url'
                  }
                  alt={movie.title}
                />
                <p className="top10_title">{movie.title}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="footer">
        <h1 className='info_footer'>Informações</h1>
        <a target="_blank" href='https://github.com/JMarceloAL?tab=repositories'>
          <h1 className='info_git'>Github</h1>
        </a>
        <a target="_blank" href='https://www.themoviedb.org'>
          <h1 className='credts_API'>TMDB API</h1>
        </a>
      </div>
    </div>
  );
}

export default Home;