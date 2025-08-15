import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TemplateProvider } from './context/TemplateContext.jsx'


createRoot(document.getElementById('root')).render(
  <TemplateProvider>
    <App />
  </TemplateProvider>
  
    
 
)
