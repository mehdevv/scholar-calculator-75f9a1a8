
import JSZip from 'jszip';

// Files content to include in the download
const projectFiles = {
  "src/main.tsx": `
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { removeLovableBadge } from './utils/removeBadge'

// Remove Lovable badge elements
removeLovableBadge();

createRoot(document.getElementById("root")!).render(<App />);
`,

  "index.html": `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>scholar-calculator</title>
    <meta name="description" content="GPA Calculator for Students" />
    <meta name="author" content="Mehdi" />
    <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
  </head>

  <body>
    <div id="root"></div>
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,

  "src/utils/removeBadge.ts": `
/**
 * Removes Lovable watermark elements from the DOM
 */
export const removeLovableBadge = () => {
  // Function to check and remove Lovable elements
  const removeElements = () => {
    // Look for common selectors used by Lovable watermarks
    const possibleSelectors = [
      'div[class*="lovable"]',
      'div[id*="lovable"]',
      'a[href*="lovable.app"]',
      'a[href*="lovable.dev"]',
      'a[class*="lovable"]',
      'div[class*="watermark"]',
      'div[class*="badge"]',
      'iframe[src*="lovable"]'
    ];

    // Try to find and remove elements matching any of these selectors
    possibleSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.remove();
        console.log('Removed potential Lovable element:', element);
      });
    });
  };

  // Run immediately
  removeElements();

  // Also run after a slight delay to catch elements added after initial load
  setTimeout(removeElements, 500);
  
  // Also run when DOM content is loaded
  document.addEventListener('DOMContentLoaded', removeElements);
  
  // Set up a mutation observer to catch dynamically added elements
  const observer = new MutationObserver((mutations) => {
    removeElements();
  });
  
  // Start observing the document body for added nodes
  observer.observe(document.body, { 
    childList: true,
    subtree: true 
  });

  return true;
};
`,

  "package.json": `{
  "name": "gpa-calculator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react-swc": "^3.0.0",
    "typescript": "^5.0.2",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}`
};

/**
 * Creates a zip file with project files and triggers download
 */
export const downloadProjectFiles = async () => {
  try {
    const zip = new JSZip();

    // Add files to the zip
    Object.entries(projectFiles).forEach(([filePath, content]) => {
      zip.file(filePath, content.trim());
    });

    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gpa-calculator-project.zip';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 100);

    return true;
  } catch (error) {
    console.error('Error creating zip file:', error);
    return false;
  }
};
