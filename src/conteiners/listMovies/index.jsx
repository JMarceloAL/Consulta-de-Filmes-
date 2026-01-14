import HeaderNavBar from '../../components/headernavbar';
import Footerbar from '../../components/footerbar';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPopularMoviesPages, getMovieBygenrePages, getGenres } from '../../services/tmdb_API';

function ListMovies() {
  const navigate = useNavigate();
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreName, setGenreName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200';

  // Buscar Filmes (populares ou por gênero)
  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      
      if (genreId) {
        // Se tem genreId, busca filmes por gênero
        const data = await getMovieBygenrePages(genreId, currentPage);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        
        // Busca o nome do gênero
        const genres = await getGenres();
        const genre = genres.find(g => g.id === parseInt(genreId));
        setGenreName(genre ? genre.name : 'Gênero');
      } else {
        // Se não tem genreId, busca filmes populares
        const data = await getPopularMoviesPages(currentPage);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setGenreName('Filmes Populares');
      }
      
      setLoading(false);
      window.scrollTo(0, 0); // Scroll para o topo ao mudar de página
    }
    fetchMovies();
  }, [genreId, currentPage]); // Recarrega quando mudar gênero ou página

  // Ir para detalhes do filme
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    window.scrollTo(0, 0);
  };

  // Funções de paginação
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Gerar números das páginas para exibir
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Reset página ao mudar de gênero
  useEffect(() => {
    setCurrentPage(1);
  }, [genreId]);

  return (
    <div className='body_Listmovies'>
      <HeaderNavBar />

      <div className='ListMovies'>
        
        
        {loading ? (
          <p></p>
        ) : (
          <>
            <div className='Movies'>
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <div
                    key={movie.id}
                    className='movie-card'
                    onClick={() => handleMovieClick(movie.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {movie.poster_path && (
                      <img
                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                      />
                    )}
                  </div>
                ))
              ) : (
                <p></p>
              )}
            </div>

          </>
        )}

        
        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <div className='pagination'>
            

            <div className='page-numbers'>
              {currentPage > 3 && (
                <>
                  <button onClick={() => handlePageClick(1)} className='page-number'>
                    1
                  </button>
                  {currentPage > 4 && <span className='dots'>...</span>}
                </>
              )}

              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              ))}

              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className='dots'>...</span>}
                  <button onClick={() => handlePageClick(totalPages)} className='page-number'>
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            
          </div>
        )}
      </div>

      <Footerbar />
    </div>
  );
}

export default ListMovies;