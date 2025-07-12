const API_KEY = 'sua_chave_api'; // sua_chave_api 
const BASE_URL = 'https://api.themoviedb.org/3';


// Função para Buscar filmes

export const searchMovies = async (query) => {

    if (!query.trim()) return [];

    try {

        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`

        );
        const data = await response.json();
        return data.results || [];

    } catch (error) {

        console.error('erro ao buscar filmes:', error);
        return [];

    }


};
// Buscar Filmes Populares
export const getPopularMovies = async () => {

    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
        const data = await response.json();
        return data.results || [];

    } catch (error) {
        console.error('Erro ao buscar filmes populares', error);
        return [];
    }
};
// Buscar Filmes em Lançamento
export const getReleasemovies = async () => {

    try {
        const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR&region=BR`);
        const data = await response.json();
        return data.results || [];

    } catch (error) {
        console.error('Erro ao buscar filmes populares', error);
        return [];
    }
};

// Busca Detalhes do Filme
export const getMovieDetails = async (movieId) => {

    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`);
        return await response.json();
    } catch (error) {
        console.error("erro ao buscar detalhes : ", error);
        return null;
    }

};

// Filtrar por genero

export const getMovieBygenre = async (genreId) => {

    try {

        const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=pt-BR`);

        const data = await response.json();
        return data.results || [];

    } catch (error) {
        console.error("erro ao buscar genero de filmes", error);
        return [];
    }


};

// Função buscar Generos

export const getGenres = async () => {

    try {

        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`);
        const data = await response.json();
        return data.genres || [];

    } catch (error) {
        console.error("erro ao buscar generos:", error);
        return [];
    }
};


// Buscar trailers de Filmes

export const getTrailers = async (movieId) => {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=pt-BR`);
        const data = await response.json();

        const trailer = data.results.find(
            (video) =>
                video.type === 'Trailer' &&
                video.site === 'YouTube'
        );

        return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;

    } catch (error) {
        console.error("Erro ao procurar trailer:", error);
        return null;
    }
};

// Buscar elenco
export const getCast = async (movieId) => {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
        const data = await response.json();

        // A API de créditos retorna { cast: [...], crew: [...] }
        // Não usa data.results como outras APIs
        console.log('Dados completos da API:', data); // Debug

        return {
            cast: data.cast || [],
            crew: data.crew || []
        };
    } catch (error) {
        console.error("Erro ao buscar elenco:", error);
        return { cast: [], crew: [] };
    }
};

// Recomendados

export const getRecommendations = async (movieId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=pt-BR`
        );
        const data = await response.json();

        return data.results || [];
    } catch (error) {
        console.error("Erro ao buscar recomendações:", error);
        return [];
    }
};










