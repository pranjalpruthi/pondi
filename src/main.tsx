import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { ConvexProvider } from "convex/react"; // Import ConvexProvider
import convex from "./lib/convex/convexClient"; // Import your Convex client instance
import { router } from './router';

import * as TanstackQuery from './integrations/tanstack-query/provider.tsx';

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ConvexProvider client={convex}> {/* Wrap with ConvexProvider */}
        <TanstackQuery.Provider>
          <RouterProvider router={router} />
        </TanstackQuery.Provider>
      </ConvexProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
