
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
