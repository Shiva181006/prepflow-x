import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { DSAProvider } from './context/DSAContext'
import { LibraryProvider } from './context/LibraryContext'
import { SQLProvider } from './context/SQLContext'
import { PlacementProvider } from './context/PlacementContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <DSAProvider>
        <LibraryProvider>
          <SQLProvider>
            <PlacementProvider>
              <App />
            </PlacementProvider>
          </SQLProvider>
        </LibraryProvider>
      </DSAProvider>
    </ThemeProvider>
  </StrictMode>,
)
