import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './conteiners/home/index'
import './conteiners/home/styles.css'
import './components/body.css'
import App from'./services/tmdb'
 

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <App></App>
  </StrictMode>,
)
