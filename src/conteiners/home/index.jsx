
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { searchMovies , getPopularMovies ,getTrailers, getReleasemovies ,getGenres, getMovieBygenre} from '../../services/tmdb_API';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation  , EffectCoverflow} from 'swiper/modules';
import { use } from 'react';

function Home() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [releaseMovies , setReleaseMovies] =useState([]);
  const [popularmovies , setPopularMovies] = useState([]);
  const [menuOpen,setMenuOpen] = useState(false);
  const[recommendedMovies, setRecommendedMovies] = useState([]);

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
// Mostra os Lançamentos com os trailers
useEffect(() => {
  async function fetchReleaseWithTrailers() {
    const movies = await getReleasemovies(); // <- pega os filmes em lançamento
    const moviesWithTrailers = await Promise.all(
      movies.slice(0, 20).map(async (movie) => {
        const trailerUrl = await getTrailers(movie.id);
        return { ...movie, trailerUrl };
      })
    );
    setReleaseMovies(moviesWithTrailers); // Reutiliza o mesmo estado
  }

  fetchReleaseWithTrailers();
}, []);

// Mostra top 10 filmes Populares
useEffect(() => {

  async function fetchPopularMovies(){

    const movies = await getPopularMovies(); // pega filmes Populares
    setPopularMovies(movies.slice(0,10));

   
    
  }
  fetchPopularMovies();

}, []);

// Mostra 1 filmes popular por genero
useEffect(()=>{

  async function fetchRecommendedPergenre() {
    
    const genres = await getGenres(); // pega o genero id, name
    const popular = await getPopularMovies();
    const filter = [];


    for (const genre of genres){

      const movie = popular.find((m) => m.genre_ids.includes(genre.id));
      if(movie && !filter.some(f => f.id === movie.id)){

        filter.push({... movie, genreName: genre.name});

      }

      setRecommendedMovies(filter);

    }

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

  {/* Sidebar Lateral */}
  {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)}></div>}

  <div className={`sidebar-menu ${menuOpen ? 'open' : ''}`}>
    
    <a href="#">Início</a>
    <a href="#">Lançamentos</a>
    <a href="#">Populares</a>
    <a >Genero</a>
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
  {releaseMovies
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
      <div className="top_10">
  <h1 className='text_top10'>TOP 10</h1>
  <Swiper 
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
      <SwiperSlide key={movie.id}>
        <div className="top10_card">
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
      <SwiperSlide key={movie.id}>
        <div className="top10_card">
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
        <a  target="_blacnk "href='https://github.com/JMarceloAL?tab=repositories'>
        <h1  className='info_git'>Github</h1>

        </a>
        <a  target="_blacnk "href='https://developer.themoviedb.org/reference/intro/getting-started'>
        <h1 className='credts_API'>TMDB API</h1>

        </a>
        
      </div>
    </div>
  );
}

export default Home;
