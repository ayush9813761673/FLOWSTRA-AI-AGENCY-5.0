import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enable smooth scrolling for all anchor links
document.addEventListener('click', (e) => {
  const target = (e.target as HTMLElement).closest('a');
  
  if (target && target.hash && target.origin === window.location.origin) {
    const element = document.querySelector(target.hash);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: 'smooth' });
      // Update hash without jumping
      window.history.pushState(null, '', target.hash);
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
