import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { router, RouterProvider } from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
