import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx' 
import {HeadProvider} from 'react-head'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeadProvider>
      <App />
    </HeadProvider>
  </StrictMode>,
)
