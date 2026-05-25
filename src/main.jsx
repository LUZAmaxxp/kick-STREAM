import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import AnalyticsTracker from './components/AnalyticsTracker.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <AnalyticsTracker />
      <App />
    </>
  </StrictMode>,
)
