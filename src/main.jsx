import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './conteiners/home/index'
import InfoMovies from './conteiners/InfoMovies/index'
import './conteiners/home/styles.css'
import './conteiners/InfoMovies/styles.css'
import './components/body.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<InfoMovies />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>

  
)
