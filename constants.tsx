
import React from 'react';
import { FileItem } from './types';

export const INITIAL_FILES: FileItem[] = [
  {
    name: 'debounce.js',
    language: 'javascript',
    isOpen: true,
    content: `/**
 * Implement a debounce function that supports
 * leading and trailing options.
 */
function debounce(func, wait, options = {}) {
  let timeout;
  
  return function(...args) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!options.leading) func.apply(context, args);
    };
    
    const callNow = options.leading && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}`
  },
  {
    name: 'README.md',
    language: 'markdown',
    isOpen: false,
    content: `# Technical Assessment\n\nTask: Refactor the debounce implementation to handle cancellations.`
  }
];

// High quality professional portrait - persistent Unsplash source
export const AVATAR_URL = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400';
// Modern tech landing image - persistent Unsplash source
export const LANDING_HERO_IMAGE = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200';
