import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './refined.css';
import './hero.css';

const root = document.getElementById('root')!;
if (root.hasChildNodes()) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
