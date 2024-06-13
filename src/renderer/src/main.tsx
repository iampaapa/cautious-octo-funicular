import React from 'react'
import ReactDOM from 'react-dom/client'
import '@renderer/index.css'
import { router } from '@renderer/router'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
