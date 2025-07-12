import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { searchMovies , getPopularMovies ,getTrailers, getReleasemovies ,getGenres, getMovieBygenre ,getMovieDetails ,getCast,getRecommendations} from '../../services/tmdb_API';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation  , EffectCoverflow} from 'swiper/modules';

function InfoMovies() {

  const navigate = useNavigate();
  const { id } = useParams();
  
  // Estados para os dados dos filmes
  const  [ movieDetails, setMovieDetails] = useState(null);
  const [movieTrailer, setMovieTrailer]= useState('');
  const [movieCredits, setMovieCredits]= useState([]);
  const [similarMovies , setSimilarMovies]= useState([]);
  const [loading, setLoading]= useState(true);
  const [ error, setError]= useState(null);
  
  // buscar filmes 
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  
  const inputRef = useRef();
  const suggestionsRef = useRef();

  // ir para outro filme
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    window.scrollTo(0,);
  };
  
  // voltar para o Inicio
  const  navigateHome = () => {
    navigate(`/`);
    window.scrollTo(0,0);
  };
  
  // Buscar dados do filme quando o ID mudar
  useEffect(() => {
    async function fetchMovieData() {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Buscando filme com ID:', id); // Debug
        
        // Buscar detalhes do filme
        const details = await getMovieDetails(id);
        console.log('Detalhes do filme:', details); // Debug
        setMovieDetails(details);
        
        // Buscar trailer
        const trailer = await getTrailers(id);
        setMovieTrailer(trailer);
        
        // Buscar créditos/elenco
        const credits = await getCast(id);
        console.log('Créditos:', credits); // Debug
        setMovieCredits(credits.cast ? credits.cast.slice(0, 12) : []); // Primeiros 12 atores
        
        // Buscar filmes similares
        const similar = await getRecommendations(id);
        setSimilarMovies(similar.slice(0, 10)); // Primeiros 10 filmes similares
        
      } catch (err) {
        console.error('Erro ao buscar dados do filme:', err);
        setError('Erro ao carregar informações do filme');
      } finally {
        setLoading(false);
      }
    }

    fetchMovieData();
  }, [id]);

  // Buscar Filmes
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

  // Mostrar loading
  if (loading) {
    console.log("carregando")
   

    return  (<div> </div>)
  }

  // Mostrar erro
  if (error) {
    console.log("erro :" , error)
  }

  // Mostrar se não encontrou o filme
  if (!movieDetails) {
    return (
      console.log("erro ao carregar filme")
    );
  }

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
            <a  style={{ cursor: 'pointer'}}  onClick={ () =>  navigateHome()}>Início</a>
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
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="infMovies">
        <div className='image_movie_card'>
          <h1 className='tittle_movie_img'>{movieDetails.title}</h1>
          <img 
            src={
              movieDetails.poster_path
                ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                : 'https://via.placeholder.com/500x750?text=Sem+Imagem'
            }
            alt={movieDetails.title}
            className="movie-poster-detail"
          />
          <h1 className='nota'> 🍿{movieDetails.vote_average ? `${movieDetails.vote_average.toFixed(1)}/10 ` : 
  'N/A'}</h1>
        </div>
        
        <div className='movie_info_trailer'>
           
           {movieTrailer ? (

             <iframe src={movieTrailer} className='movietrailerdiv'>
          </iframe>



           ) : (
              <h1 style={{marginLeft: 180, color: "grey"}}>Trailer indisponivel </h1>
           )}

          
          




          
          
        </div>
      </div>
        <div className='movie_info'>

          <p className='sinopse'>{movieDetails.overview}</p>
          <h1 className='tittle_movie'> Produtora : {movieDetails.production_companies?.map(company => company.name).join(', ') || 'Produtoras não disponíveis'}</h1>
          <h1 className='tittle_movie'>Data de Lançamento : {movieDetails.release_date} </h1>
          <h1 className='tittle_movie'> Duração do Filme : {movieDetails.runtime ? `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}min` : 
  'N/A'}</h1>
          <h1 className='tittle_movie'>
  Orçamento: {movieDetails.budget ? 
    `$${movieDetails.budget.toLocaleString('pt-BR')}` : 
    'Orçamento indisponível'
  }
</h1>
        </div>
      
      <div className='cast'>
        
        <Swiper modules={[Navigation]}
          navigation
          className='cast-swiper'
           // Só ativa loop se tiver mais de 5 atores
          spaceBetween={10}
          slidesPerView={5}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            
          }}>
          
          {movieCredits.map((actor) => (
            <SwiperSlide key={actor.id}
            className='swiperslide-cast'>
              <div className='cast-card'>
                <img 
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : 'https://via.placeholder.com/200x300?text=Sem+Foto'
                  }
                  alt={actor.name}
                  className="cast-photo"
                />
                <div className='cast-info'>
                    <h1 className='actor-name'>{actor.name}</h1>
                  
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className='similar_movies'>
        
          <Swiper className='swiper-similar-movies'
    modules={[Navigation]}
    navigation
    loop={true}
    spaceBetween={10}
    slidesPerView={5}
    breakpoints={{
      640: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      1024: { slidesPerView: 5 },
    }}>


            {similarMovies.map((movie) =>(
              
              <SwiperSlide key={movie.id} className='swiperslide-similar-movies'>
              
              <div className="similar-card"  style={{cursor: 'pointer'}}onClick={ () =>   handleMovieClick(movie.id)}>

              <img className='similar-photo' src={

                movie.poster_path  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : 'default-image-url'


              
              }>
              
              
              </img  >


              </div>

              </SwiperSlide>


            ))}
            
            
            
            
            
            
            






          </Swiper>


      </div>

      <div className='footer'>
        <h1 className='info_footer'>Informações</h1>
        <a  target="_blacnk "href='https://github.com/JMarceloAL?tab=repositories'>
        <h1  className='info_git'>Github</h1>

        </a>
        <a  target="_blacnk "href='https://www.themoviedb.org'>
        <h1 className='credts_API'>TMDB API</h1>

        </a>
      </div>
    </div>
  );
}

export default InfoMovies;