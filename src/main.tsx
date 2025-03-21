
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { removeLovableBadge } from './utils/removeBadge'

// Remove Lovable badge elements
removeLovableBadge();

createRoot(document.getElementById("root")!).render(<App />);
