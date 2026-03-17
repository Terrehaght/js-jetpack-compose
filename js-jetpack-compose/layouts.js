
const DoodleBackground = (() => {
  const doodleIcons = [
    { path: "M12 3L2 12h3v9h6v-6h2v6h6v-9h3L12 3z", viewBox: "0 0 24 24" },
    { path: "M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z", viewBox: "0 0 24 24" },
    { path: "M11 6H9V4h2v2zm4-2h-2v2h2V4zM9 14H7v-2h2v2zm0 2v2h2v-2H9zm6-2h-2v2h2v-2zm2-2v2h2v-2h-2zm-4 0h-2v2h2v-2zm-4 0H7v2h2v-2zm8-4h-2v2h2V8zm2 0v2h2V8h-2z", viewBox: "0 0 24 24" },
    { path: "M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z", viewBox: "0 0 24 24" },
    { path: "M18 4V3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6h1v4H9v11c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9h8V4h-3z", viewBox: "0 0 24 24" },
    { path: "M16 4h-1V2h-2v2h-1c-.55 0-1 .45-1 1v1H7v2h4v9.74c-1.71.49-3 2.01-3 3.84h12c0-1.83-1.29-3.35-3-3.84V8h4V6h-4V5c0-.55-.45-1-1-1z", viewBox: "0 0 24 24" },
    { path: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z", viewBox: "0 0 24 24" },
    { path: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z", viewBox: "0 0 24 24" },
    { path: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z", viewBox: "0 0 24 24" },
    { path: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z", viewBox: "0 0 24 24" },
    { path: "M12 2C8.43 2 5.23 3.54 3.01 6L12 22l8.99-16C18.78 3.55 15.57 2 12 2zM7 7c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z", viewBox: "0 0 24 24" },
    { path: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z", viewBox: "0 0 24 24" },
    { path: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z", viewBox: "0 0 24 24" },
    { path: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z", viewBox: "0 0 24 24" },
    { path: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z", viewBox: "0 0 24 24" },
    { path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z", viewBox: "0 0 24 24" },
    { path: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z", viewBox: "0 0 24 24" },
    { path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", viewBox: "0 0 24 24" },
    { path: "M9.4 10.5l4.77-8.26C13.47 2.09 12.75 2 12 2c-2.4 0-4.6.85-6.32 2.25l3.66 6.35.06-.1zM21.54 9c-.92-2.92-3.15-5.26-6-6.34L11.88 9h9.66zm.26 1h-7.49l.29.5 4.76 8.25C21 16.97 22 14.61 22 12c0-.69-.07-1.35-.2-2zM8.54 12l-3.9-6.75C3.01 7.03 2 9.39 2 12c0 .69.07 1.35.2 2h7.49l-1.15-2zm-6.08 3c.92 2.92 3.15 5.26 6 6.34L12.12 15H2.46zm11.27 0l-3.9 6.76c.7.15 1.42.24 2.17.24 2.4 0 4.6-.85 6.32-2.25l-3.66-6.35-.93 1.6z", viewBox: "0 0 24 24" },
    { path: "M21 9V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h1v2h2v-2h12v2h2v-2h1c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-2-2v2H5V7h14z", viewBox: "0 0 24 24" },
    { path: "M8 2v20h2V2H8zm6 0v20h2V2h-2zM6 6v2h12V6H6zm0 5v2h12v-2H6zm0 5v2h12v-2H6z", viewBox: "0 0 24 24" },
    { path: "M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 4.12 13.38 3 12 3S9.5 4.12 9.5 5.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zM3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9z", viewBox: "0 0 24 24" },
    { path: "M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z", viewBox: "0 0 24 24" },
    { path: "M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z", viewBox: "0 0 24 24" },
    { path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z", viewBox: "0 0 24 24" },
    { path: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", viewBox: "0 0 24 24" },
    { path: "M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z", viewBox: "0 0 24 24" },
    { path: "M7 5h10v2h2V3c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v4h2V5zm13 7H4v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8zM2 14v-2h20v2H2z", viewBox: "0 0 24 24" },
    { path: "M2 19.63L13.43 8.2l-.71-.7 1.42-1.43 3.54 3.54-1.42 1.41-.71-.7L4.13 21.75c-.59.58-1.53.58-2.11 0-.59-.59-.59-1.53 0-2.12zM16.71 4.04l3.54 3.54c.78.78.78 2.05 0 2.83l-1.41 1.41-4.25-4.24 1.42-1.42-.71-.7.71-.71c.78-.78 2.05-.78 2.83 0l.71.7-.71.72-.71-.71-1.42 1.42.71.7z", viewBox: "0 0 24 24" },
    { path: "M12 3L2 12h3v9h14v-9h3L12 3zm1 15h-2v-2h2v2zm0-4h-2V9h2v5z", viewBox: "0 0 24 24" },
    { path: "M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z", viewBox: "0 0 24 24" }
  ];

  function create(options = {}) {
    const {
      isDark = false,
      iconSize = 28,
      spacing = 65
    } = options;

    const container = document.createElement('div');
    // FIX: Changed z-index from 0 to -1 to ensure it sits behind the app content
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0; background:#f5f5f5;
      width: 100%;
      height: 100%;
      z-index: -1; 
      pointer-events: none;
      overflow: hidden;
    `;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'doodle-canvas');
    svg.style.cssText = 'width: 100%; height: 100%;';

    container.appendChild(svg);

    function generatePattern() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.innerHTML = '';

      const patternColor = isDark ? '#1a2a40' : '#c8ced8';
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const icon = doodleIcons[Math.floor(Math.random() * doodleIcons.length)];
          const x = col * spacing + (Math.random() - 0.5) * 25;
          const y = row * spacing + (Math.random() - 0.5) * 25;
          const rotation = Math.floor(Math.random() * 360);
          const opacity = 0.3 + Math.random() * 0.4;

          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('transform', `translate(${x}, ${y}) rotate(${rotation}, ${iconSize/2}, ${iconSize/2})`);

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', icon.path);
          path.setAttribute('fill', patternColor);
          path.setAttribute('opacity', opacity);
          path.setAttribute('transform', `scale(${iconSize / 24})`);

          g.appendChild(path);
          svg.appendChild(g);
        }
      }
    }

    generatePattern();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(generatePattern, 250);
    });

    container.regenerate = generatePattern;
    return container;
  }

  function createWrapper(options = {}) {
    const element = create(options);
    return {
      element,
      getElement() { return this.element; },
      regenerate() { if (this.element.regenerate) this.element.regenerate(); return this; },
      setDarkMode(isDark) {
        const parent = this.element.parentNode;
        const newElement = create({ ...options, isDark });
        if (parent) {
          parent.replaceChild(newElement, this.element);
          this.element = newElement;
        }
        return this;
      }
    };
  }

  return { create, createWrapper };
})();

window.DoodleBackground = DoodleBackground;




const AndroidLayouts = (() => {
  // Utility: Convert dp to pixels
  const dp = (value) => {
  if (typeof value === 'number') return `${value}px`;
  if (typeof value === 'string') {
    // Already a valid CSS unit — pass through untouched
    if (/(%|px|em|rem|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|auto|fit-content|max-content|min-content)$/.test(value)) {
      return value;
    }
    // Bare number string like '16' → treat as dp
    if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`;
  }
  return String(value);
}; 

  // Utility: Apply styles to an element
  const applyStyles = (element, styles) => {
    Object.assign(element.style, styles);
  };

  // Utility: Apply common properties
  const applyCommonProps = (element, props) => {
    const {
      padding, margin, background, border, borderRadius,
      width, height, minWidth, minHeight, maxWidth, maxHeight,
      opacity, cursor, overflow, boxShadow, id, className,
      onClick, onMouseEnter, onMouseLeave, style
    } = props;

    const styles = {};

    // Dimensions
    if (width === 'match_parent') styles.width = '100%';
    else if (width === 'wrap_content') styles.width = 'fit-content';
    else if (width) styles.width = dp(width);

    if (height === 'match_parent') styles.height = '100%';
    else if (height === 'wrap_content') styles.height = 'fit-content';
    else if (height) styles.height = dp(height);

    if (minWidth) styles.minWidth = dp(minWidth);
    if (minHeight) styles.minHeight = dp(minHeight);
    if (maxWidth) styles.maxWidth = dp(maxWidth);
    if (maxHeight) styles.maxHeight = dp(maxHeight);

    // Spacing
    if (padding) {
      if (typeof padding === 'object') {
        const { top, right, bottom, left, horizontal, vertical, all } = padding;
        if (all !== undefined) styles.padding = dp(all);
        if (vertical !== undefined) {
          styles.paddingTop = dp(vertical);
          styles.paddingBottom = dp(vertical);
        }
        if (horizontal !== undefined) {
          styles.paddingLeft = dp(horizontal);
          styles.paddingRight = dp(horizontal);
        }
        if (top !== undefined) styles.paddingTop = dp(top);
        if (right !== undefined) styles.paddingRight = dp(right);
        if (bottom !== undefined) styles.paddingBottom = dp(bottom);
        if (left !== undefined) styles.paddingLeft = dp(left);
      } else {
        styles.padding = dp(padding);
      }
    }

    if (margin) {
      if (typeof margin === 'object') {
        const { top, right, bottom, left, horizontal, vertical, all } = margin;
        if (all !== undefined) styles.margin = dp(all);
        if (vertical !== undefined) {
          styles.marginTop = dp(vertical);
          styles.marginBottom = dp(vertical);
        }
        if (horizontal !== undefined) {
          styles.marginLeft = dp(horizontal);
          styles.marginRight = dp(horizontal);
        }
        if (top !== undefined) styles.marginTop = dp(top);
        if (right !== undefined) styles.marginRight = dp(right);
        if (bottom !== undefined) styles.marginBottom = dp(bottom);
        if (left !== undefined) styles.marginLeft = dp(left);
      } else {
        styles.margin = dp(margin);
      }
    }

    // Visual
    if (background) styles.background = background;
    if (border) styles.border = border;
    if (borderRadius) styles.borderRadius = dp(borderRadius);
    if (opacity !== undefined) styles.opacity = opacity;
    if (cursor) styles.cursor = cursor;
    if (overflow) styles.overflow = overflow;
    if (boxShadow) styles.boxShadow = boxShadow;

    // Custom styles
    if (style) Object.assign(styles, style);

    applyStyles(element, styles);

    // Attributes
    if (id) element.id = id;
    if (className) element.className = className;

    // Events
    if (onClick) element.addEventListener('click', onClick);
    if (onMouseEnter) element.addEventListener('mouseenter', onMouseEnter);
    if (onMouseLeave) element.addEventListener('mouseleave', onMouseLeave);
  };

  // Utility: Visibility methods for any component
  const createVisibilityMethods = (wrapper) => {
    wrapper.setVisibility = function(visibility) {
      const visibilityMap = {
        'visible': { display: '', visibility: 'visible' },
        'invisible': { display: '', visibility: 'hidden' },
        'gone': { display: 'none', visibility: '' }
      };
      const styles = visibilityMap[visibility] || visibilityMap.visible;
      Object.assign(this.element.style, styles);
      return this;
    };
    
    wrapper.show = function() { 
      return this.setVisibility('visible'); 
    };
    
    wrapper.hide = function() { 
      return this.setVisibility('gone'); 
    };
    
    wrapper.invisible = function() { 
      return this.setVisibility('invisible'); 
    };
    
    wrapper.isVisible = function() {
      return this.element.style.display !== 'none' && 
             this.element.style.visibility !== 'hidden';
    };
  };

  // Create wrapper with Android-style methods (NO PROXY)
  const createWrapper = (element, orientation = null) => {
    const childViews = [];
    
    const wrapper = {
      element,
      childViews, // Expose for debugging if needed
      layoutParams: null,
      gridParams: null,
      frameLayoutPosition: null,
      constraints: null,
      
      // Helper to get raw element
      getElement() {
        return this.element;
      },
      
      // Android-style methods
      addView(child, layoutParams = null) {
  const el = child && typeof child.getElement === 'function' ? child.getElement() : child;
  
  // Store the view wrapper or element
  childViews.push(child);
  
  // Apply layout params if provided
  if (layoutParams) {
    if (orientation) {
      processLayoutParams(el, layoutParams, orientation);
    } else if (child && typeof child.getElement === 'function') {
      child.layoutParams = layoutParams;
    }
  } else if (child && child.layoutParams) {
    if (orientation) {
      processLayoutParams(el, child.layoutParams, orientation);
    }
  }
  
  // Set z-index and background before appending
//  el.style.zIndex = '1';
//  el.style.backgroundColor = 'red';
  
  this.element.appendChild(el);
  return this;
},      removeView(child) {
        const el = child && typeof child.getElement === 'function' ? child.getElement() : child;
        const index = childViews.indexOf(child);
        if (index > -1) {
          childViews.splice(index, 1);
        }
        if (el && el.parentNode === this.element) {
          this.element.removeChild(el);
        }
        return this;
      },
      
      removeViewAt(index) {
        if (index >= 0 && index < childViews.length) {
          const child = childViews[index];
          childViews.splice(index, 1);
          const el = child && typeof child.getElement === 'function' ? child.getElement() : child;
          if (el && el.parentNode === this.element) {
            this.element.removeChild(el);
          }
        }
        return this;
      },
      
      getChildAt(index) {
        return childViews[index] || null;
      },
      
      getChildCount() {
        return childViews.length;
      },
      
      indexOfChild(child) {
        return childViews.indexOf(child);
      },
      
      removeAllViews() {
        childViews.length = 0;
        this.element.innerHTML = '';
        return this;
      },
      
      // Alias for removeAllViews - clear all children
      clear() {
        return this.removeAllViews();
      },
      
      findViewById(id) {
        const el = this.element.querySelector(`#${id}`);
        return el ? (el._wrapper || el) : null;
      },
      
      findViewByClassName(className) {
        const el = this.element.querySelector(`.${className}`);
        return el ? (el._wrapper || el) : null;
      },
      
      setBackgroundColor(color) {
        this.element.style.backgroundColor = color;
        return this;
      },
      
      setPadding(left, top, right, bottom) {
        this.element.style.padding = `${dp(top)} ${dp(right)} ${dp(bottom)} ${dp(left)}`;
        return this;
      },
      
      setMargin(left, top, right, bottom) {
        this.element.style.margin = `${dp(top)} ${dp(right)} ${dp(bottom)} ${dp(left)}`;
        return this;
      },
      
      setOnClickListener(callback) {
        this.element.addEventListener('click', (e) => {
          callback(e, this);
        });
        return this;
      }
    };

    // Add visibility methods
    createVisibilityMethods(wrapper);
    
    // Link the DOM element back to wrapper for findViewById
    element._wrapper = wrapper;

    return wrapper;
  };

  // Process layout params for children
  const processLayoutParams = (element, layoutParams, parentOrientation = 'vertical') => {
    if (!layoutParams) return;

    const { weight, gravity, margin, zIndex } = layoutParams;

    if (weight !== undefined) {
      element.style.flex = weight;
    }

    if (gravity) {
      const gravityMap = {
        center: { alignSelf: 'center' },
        start: { alignSelf: 'flex-start' },
        end: { alignSelf: 'flex-end' },
        stretch: { alignSelf: 'stretch' },
      };
      Object.assign(element.style, gravityMap[gravity] || {});
    }

    if (margin) {
      if (typeof margin === 'object') {
        const { top, right, bottom, left, horizontal, vertical, all } = margin;
        if (all !== undefined) element.style.margin = dp(all);
        if (vertical !== undefined) {
          element.style.marginTop = dp(vertical);
          element.style.marginBottom = dp(vertical);
        }
        if (horizontal !== undefined) {
          element.style.marginLeft = dp(horizontal);
          element.style.marginRight = dp(horizontal);
        }
        if (top !== undefined) element.style.marginTop = dp(top);
        if (right !== undefined) element.style.marginRight = dp(right);
        if (bottom !== undefined) element.style.marginBottom = dp(bottom);
        if (left !== undefined) element.style.marginLeft = dp(left);
      } else {
        element.style.margin = dp(margin);
      }
    }

    if (zIndex !== undefined) {
      element.style.zIndex = zIndex;
    }
  };

  // LinearLayout (Column/Row)
  const LinearLayout = (props = {}, children = []) => {
    const { 
      orientation = 'vertical', 
      gravity,
      gap = 0,
      wrap = false, background,
      weightSum
    } = props;
    
    const container = document.createElement('div');
    const styles = {
      display: 'flex',background: 'transparent',
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      boxSizing: 'border-box',
      gap: dp(gap)
    };

    if (wrap) styles.flexWrap = 'wrap';

    if (gravity) {
      const gravityMap = {
        center: { justifyContent: 'center', alignItems: 'center' },
        start: { justifyContent: 'flex-start', alignItems: 'flex-start' },
        end: { justifyContent: 'flex-end', alignItems: 'flex-end' },
        'center_horizontal': { alignItems: 'center' },
        'center_vertical': { justifyContent: 'center' },
        'space_between': { justifyContent: 'space-between' },
        'space_around': { justifyContent: 'space-around' },
        'space_evenly': { justifyContent: 'space-evenly' },
      };
      Object.assign(styles, gravityMap[gravity] || {});
    }

    applyStyles(container, styles);
    applyCommonProps(container, props);

    const wrapper = createWrapper(container, orientation);
    
    // Add initial children
    children.forEach(child => {
      wrapper.addView(child);
    });

    return wrapper;
  };

  // Shorthand for vertical LinearLayout
  const Column = (props, children) => LinearLayout({ ...props, orientation: 'vertical' }, children);

  // Shorthand for horizontal LinearLayout
  const Row = (props, children) => LinearLayout({ ...props, orientation: 'horizontal' }, children);

  // GridLayout
  const GridLayout = (props = {}, children = []) => {
    const {
      columns = 2,
      rows,
      gap = 0,
      columnGap,
      rowGap,
      autoFlow = 'row'
    } = props;

    const container = document.createElement('div');
    const styles = {
      display: 'grid',
      boxSizing: 'border-box',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: dp(gap),
      gridAutoFlow: autoFlow
    };

    if (columnGap !== undefined) styles.columnGap = dp(columnGap);
    if (rowGap !== undefined) styles.rowGap = dp(rowGap);
    if (rows) styles.gridTemplateRows = `repeat(${rows}, 1fr)`;

    applyStyles(container, styles);
    applyCommonProps(container, props);

    const wrapper = createWrapper(container);
    
    // Override addView for grid-specific behavior
    const originalAddView = wrapper.addView.bind(wrapper);
    wrapper.addView = function(child, gridParams = null) {
      const el = child && typeof child.getElement === 'function' ? child.getElement() : child;
      
      const params = gridParams || child.gridParams;
      if (params) {
        const { columnSpan, rowSpan, column, row } = params;
        if (columnSpan) el.style.gridColumn = `span ${columnSpan}`;
        if (rowSpan) el.style.gridRow = `span ${rowSpan}`;
        if (column) el.style.gridColumnStart = column;
        if (row) el.style.gridRowStart = row;
      }
      
      return originalAddView(child);
    };
    
    // Add initial children
    children.forEach(child => {
      wrapper.addView(child);
    });

    return wrapper;
  };

  // ConstraintLayout
  const ConstraintLayout = (props = {}, children = []) => {
    const container = document.createElement('div');
    const styles = {
      position: 'relative',
      boxSizing: 'border-box',
    };

    applyStyles(container, styles);
    applyCommonProps(container, props);

    const wrapper = createWrapper(container);
    
    // Override addView for constraint-specific behavior
    const originalAddView = wrapper.addView.bind(wrapper);
    wrapper.addView = function(child, constraints = null) {
      const childEl = child && typeof child.getElement === 'function' ? child.getElement() : child;
      childEl.style.position = 'absolute';

      const cons = constraints || child.constraints;
      if (cons) {
        const {
          top, right, bottom, left,
          topToTop, topToBottom,
          bottomToTop, bottomToBottom,
          leftToLeft, leftToRight,
          rightToLeft, rightToRight,
          centerHorizontally, centerVertically,
          width, height,
          horizontalBias, verticalBias
        } = cons;

        if (top !== undefined) childEl.style.top = dp(top);
        if (right !== undefined) childEl.style.right = dp(right);
        if (bottom !== undefined) childEl.style.bottom = dp(bottom);
        if (left !== undefined) childEl.style.left = dp(left);

        if (topToTop !== undefined) childEl.style.top = dp(topToTop);
        if (bottomToBottom !== undefined) childEl.style.bottom = dp(bottomToBottom);
        if (leftToLeft !== undefined) childEl.style.left = dp(leftToLeft);
        if (rightToRight !== undefined) childEl.style.right = dp(rightToRight);

        if (centerHorizontally) {
          childEl.style.left = '50%';
          childEl.style.transform = 'translateX(-50%)';
        }
        if (centerVertically) {
          childEl.style.top = '50%';
          childEl.style.transform = 'translateY(-50%)';
        }
        if (centerHorizontally && centerVertically) {
          childEl.style.transform = 'translate(-50%, -50%)';
        }

        if (width === 'match_parent') childEl.style.width = '100%';
        else if (width) childEl.style.width = dp(width);

        if (height === 'match_parent') childEl.style.height = '100%';
        else if (height) childEl.style.height = dp(height);
      }
      
      return originalAddView(child);
    };
    
    children.forEach(child => {
      wrapper.addView(child);
    });

    return wrapper;
  };

  // ScrollView
  const ScrollView = (props = {}, children = []) => {
    const {orientation = 'vertical' } = props;

    const container = document.createElement('div');
    const styles = {
      overflowX: orientation === 'horizontal' ? 'auto' : 'hidden',
      overflowY: orientation === 'vertical' ? 'auto' : 'hidden',
      boxSizing: 'border-box'
    };

    applyStyles(container, styles);
    applyCommonProps(container, props);

    const wrapper = createWrapper(container);
    
    wrapper.scrollTo = function(x, y) {
      this.element.scrollTo(x, y);
      return this;
    };
    
    wrapper.scrollToTop = function() {
      this.element.scrollTop = 0;
      return this;
    };
    
    wrapper.scrollToBottom = function() {
      this.element.scrollTop = this.element.scrollHeight;
      return this;
    };
    
    children.forEach(child => {
      wrapper.addView(child);
    });

    return wrapper;
  };

  // FrameLayout (overlapping children)
  const FrameLayout = (props = {}, children = []) => {
    const container = document.createElement('div');
    const styles = {
      position: 'relative',
      boxSizing: 'border-box',
    };

    applyStyles(container, styles);
    applyCommonProps(container, props);

    const wrapper = createWrapper(container);
    
    // Override addView for frame-specific behavior
    const originalAddView = wrapper.addView.bind(wrapper);
    wrapper.addView = function(child, framePosition = null) {
      const childEl = child && typeof child.getElement === 'function' ? child.getElement() : child;
      
      const childStyles = {
        position: 'absolute',
      };

      const pos = framePosition || child.frameLayoutPosition;
      if (pos) {
        const { top, right, bottom, left, gravity, zIndex } = pos;
        
        if (top !== undefined) childStyles.top = dp(top);
        if (right !== undefined) childStyles.right = dp(right);
        if (bottom !== undefined) childStyles.bottom = dp(bottom);
        if (left !== undefined) childStyles.left = dp(left);
        if (zIndex !== undefined) childStyles.zIndex = zIndex;

        if (gravity) {
          const gravityMap = {
            center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
            top: { top: '0', left: '50%', transform: 'translateX(-50%)' },
            bottom: { bottom: '0', left: '50%', transform: 'translateX(-50%)' },
            left: { left: '0', top: '50%', transform: 'translateY(-50%)' },
            right: { right: '0', top: '50%', transform: 'translateY(-50%)' },
            top_left: { top: '0', left: '0' },
            top_right: { top: '0', right: '0' },
            bottom_left: { bottom: '0', left: '0' },
            bottom_right: { bottom: '0', right: '0' },
          };
          Object.assign(childStyles, gravityMap[gravity] || {});
        }
      }

      applyStyles(childEl, childStyles);
      return originalAddView(child);
    };
    
    children.forEach(child => {
      wrapper.addView(child);
    });

    return wrapper;
  };

  // Helper for adding layout params to children
  const LayoutParams = (params, child) => {
    const result = child;
    if (typeof child.getElement === 'function') {
      result.layoutParams = params;
    } else if (child instanceof HTMLElement) {
      child.layoutParams = params;
    }
    return result;
  };

  // Helper for grid positioning
  const GridParams = (params, child) => {
    const result = child;
    if (typeof child.getElement === 'function') {
      result.gridParams = params;
    } else if (child instanceof HTMLElement) {
      child.gridParams = params;
    }
    return result;
  };

  // Helper for FrameLayout positioning
  const Positioned = (positionProps, child) => {
    const result = child;
    if (typeof child.getElement === 'function') {
      result.frameLayoutPosition = positionProps;
    } else if (child instanceof HTMLElement) {
      child.frameLayoutPosition = positionProps;
    }
    return result;
  };

  // Helper for constraint positioning
  const Constrained = (constraints, child) => {
    const result = child;
    if (typeof child.getElement === 'function') {
      result.constraints = constraints;
    } else if (child instanceof HTMLElement) {
      child.constraints = constraints;
    }
    return result;
  };

  // Mount function
  const mount = (component, targetId = 'app') => {
    const target = document.getElementById(targetId);
    if (!target) {
      console.error(`Target element with id "${targetId}" not found`);
      return;
    }
    
    if (component instanceof HTMLElement) {
      target.appendChild(component);
    } else if (component && typeof component.getElement === 'function') {
      target.appendChild(component.getElement());
    } else if (component && component.element) {
      target.appendChild(component.element);
    }
  };

  return {
    LinearLayout,
    Column,
    Row,
    GridLayout,
    ConstraintLayout,
    ScrollView,
    FrameLayout,
    LayoutParams,
    GridParams,
    Positioned,
    Constrained,
    mount,
    utils: { dp, applyStyles, createVisibilityMethods, applyCommonProps, createWrapper }
  };
})();


const DoodleColumn = (props = {}, children = []) => {
  const { doodleOptions = {}, ...columnProps } = props;
  
  // Create a FrameLayout to hold both the background and content
  const container = AndroidLayouts.FrameLayout({
    width: columnProps.width,
    height: columnProps.height,
    style: { position: 'relative', ...columnProps.style }
  });
  
  // Add doodle background with default options
  const doodleBg = DoodleBackground.createWrapper({
    isDark: false,
    iconSize: 28,
    spacing: 65,
    ...doodleOptions
  });
  
  // Position the doodle background to fill the container
  container.addView(
    AndroidLayouts.Positioned(
      { 
        top: 0, 
        left: 0, 
        gravity: 'top_left',
        zIndex: -1 
      },
      doodleBg
    )
  );
  
  // Create the Column for actual content with all the spacing props
  const column = AndroidLayouts.Column({ 
    ...columnProps,
    style: { position: 'relative', zIndex: 1, ...columnProps.style }
  }, children);
  
  // Add the column as the main content
  container.addView(
    AndroidLayouts.Positioned(
      { 
        top: 0, 
        left: 0, 
        right: 0,
        bottom: 0
      },
      column
    )
  );
  
  return container;
};

const DoodleRow = (props = {}, children = []) => {
  const { doodleOptions = {}, ...rowProps } = props;
  
  // Create a FrameLayout to hold both the background and content
  const container = AndroidLayouts.FrameLayout({
    width: rowProps.width,
    height: rowProps.height,
    style: { position: 'relative', ...rowProps.style }
  });
  
  // Add doodle background with default options
  const doodleBg = DoodleBackground.createWrapper({
    isDark: false,
    iconSize: 28,
    spacing: 65,
    ...doodleOptions
  });
  
  // Position the doodle background
  container.addView(
    AndroidLayouts.Positioned(
      { 
        top: 0, 
        left: 0, 
        gravity: 'top_left',
        zIndex: -1 
      },
      doodleBg
    )
  );
  
  // Create the Row for actual content with all the spacing props
  const row = AndroidLayouts.Row({ 
    ...rowProps,
    style: { position: 'relative', zIndex: 1, ...rowProps.style }
  }, children);
  
  // Add the row as the main content
  container.addView(
    AndroidLayouts.Positioned(
      { 
        top: 0, 
        left: 0, 
        right: 0,
        bottom: 0
      },
      row
    )
  );
  
  return container;
};

// Add to global scope
window.DoodleColumn = DoodleColumn;
window.DoodleRow = DoodleRow;


// Make available globally
window.AndroidLayouts = AndroidLayouts;


