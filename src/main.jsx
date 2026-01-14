import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './conteiners/home/index'
import InfoMovies from './conteiners/InfoMovies/index'
import ListMoves from './conteiners/listMovies/index'
import './conteiners/home/styles.css'
import './conteiners/InfoMovies/styles.css'
import './conteiners/listMovies/styles.css'
import './components/body.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<InfoMovies />} />
        <Route path="/list" element={<ListMoves />} /> {/* Lista de filmes populares */}
        <Route path="/list/genre/:genreId" element={<ListMoves />} /> {/* Lista por gênero */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
)