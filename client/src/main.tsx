import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TokenProvider } from './api/useSwr.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TokenProvider>
      <App />
    </TokenProvider>
  </React.StrictMode>,
)
