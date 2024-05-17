import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NavigationProvider } from './context/navigation.tsx'
import { CoreProvider } from './context/core.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NavigationProvider>
      <CoreProvider>

        <App />

      </CoreProvider>

    </NavigationProvider>
  </React.StrictMode>,
)
