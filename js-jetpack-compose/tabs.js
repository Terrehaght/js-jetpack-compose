// ============================================
// TabLayout: Flow-Based Architecture Redesign
// ============================================
(function() {
  const { injectStyles, injectedStyles } = window.AndroidComponents?.utils || {};
  
  const _injectStyles = injectStyles || ((id, css) => {
    if (injectedStyles?.has(id)) return;
    const style = document.createElement('style');
    style.id = `android-components-${id}`;
    style.textContent = css;
    document.head.appendChild(style);
    injectedStyles?.add(id);
  });

const TAB_STYLES = `
    :root {
      --tab-accent: #1d9bf0;
      --tab-accent-hover: #1a8cd8;
      --tab-accent-soft: rgba(29, 155, 240, 0.15);
      --tab-bg-primary: #0f1419;
      --tab-bg-secondary: #1a1f26;
      --tab-bg-elevated: #2d343d;
      --tab-text-primary: #e7e9ea;
      --tab-text-secondary: #8b98a5;
      --tab-border: #2f3336;
      --tab-radius-sm: 8px;
      --tab-radius-md: 12px;
      --tab-radius-full: 9999px;
      --tab-shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
      --tab-shadow-md: 0 4px 12px rgba(0,0,0,0.4);
    }

    @media (prefers-color-scheme: light) {
      :root {
        --tab-bg-primary: #ffffff;
        --tab-bg-secondary: #f7f9f9;
        --tab-bg-elevated: #ffffff;
        --tab-text-primary: #0f1419;
        --tab-text-secondary: #536471;
        --tab-border: #eff3f4;
        --tab-shadow-sm: 0 1px 2px rgba(0,0,0,0.08);
        --tab-shadow-md: 0 4px 12px rgba(0,0,0,0.1);
      }
    }

    .md-tablayout.light-theme {
      --tab-bg-primary: #ffffff;
      --tab-bg-secondary: #f7f9f9;
      --tab-bg-elevated: #ffffff;
      --tab-text-primary: #0f1419;
      --tab-text-secondary: #536471;
      --tab-border: #eff3f4;
      --tab-shadow-sm: 0 1px 2px rgba(0,0,0,0.08);
      --tab-shadow-md: 0 4px 12px rgba(0,0,0,0.1);
    }

    .md-tablayout.dark-theme {
      --tab-bg-primary: #0f1419;
      --tab-bg-secondary: #1a1f26;
      --tab-bg-elevated: #2d343d;
      --tab-text-primary: #e7e9ea;
      --tab-text-secondary: #8b98a5;
      --tab-border: #2f3336;
      --tab-shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
      --tab-shadow-md: 0 4px 12px rgba(0,0,0,0.4);
    }

    /* ============================================
       CRITICAL FIX: Flow-Based Layout Architecture
       ============================================
       Why this fixes zero-height problem:
       - Pages are in normal document flow (not absolutely positioned)
       - PagesWrapper measures the tallest page naturally
       - PagesTrack uses transform for animation (doesn't affect layout)
       - Container height derives from content, not viewport units
       
       This mirrors Android's measure/layout/draw phases:
       1. Measure: Pages calculate their own dimensions
       2. Layout: PagesWrapper sizes to largest child
       3. Draw: Transform slides PagesTrack without relayout
    ============================================ */

    .md-tablayout {
      display: flex;
      flex-direction: column;
      background: var(--tab-bg-primary);
      width: 100%;
      /* REMOVED: min-height: 100vh - no viewport hacks */
      /* REMOVED: height: 100% - allows natural sizing */
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      position: relative;
    }

    .md-tablayout-tabs {
      display: flex;
      position: relative;
      background: var(--md-primary, var(--tab-accent));
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      flex-shrink: 0; /* Don't compress tabs */
    }

    .md-tablayout-tabs::-webkit-scrollbar { display: none; }
    .md-tablayout-tabs.md-scrollable { justify-content: flex-start; }
    .md-tablayout-tabs.md-fixed { justify-content: space-around; }

    /* ============================================
       PAGES ARCHITECTURE: Normal Flow + Transform Animation
       ============================================ */

    /* PagesWrapper: Establishes clipping boundary and measures content height
       - overflow: hidden clips the sliding track
       - flex: 1 allows it to grow if parent is flex
       - height: auto means "measure my children"
       - No absolute positioning = contributes to parent height
    */
    .md-tablayout-content {
      position: relative;
      overflow: hidden; /* Clips horizontal sliding */
      flex: 1 1 auto; /* Grow to fill available space */
      width: 100%;
      background: var(--tab-bg-primary);
      /* CRITICAL: No fixed height, no vh units */
      /* Height is determined by tallest page in PagesTrack */
    }

    /* PagesTrack: Horizontal flex container that slides
       - display: flex keeps all pages in a row
       - transform: translateX() slides the entire row left/right
       - transition animates the transform
       - Pages inside are in normal flow (they set the height)
    */
    .md-tablayout-pages-track {
      display: flex;
      flex-direction: row;
      width: 100%; /* Will be multiplied by page count */
      height: auto; /* Intrinsic height from tallest child */
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
      /* transform: translateX(-100% * selectedIndex) set via JS */
    }

    /* Page: Normal flow element, contributes to parent height
       - flex-shrink: 0 prevents compression
       - width: 100% of viewport (not track)
       - min-width ensures proper sizing
       - No absolute positioning = measurable height
    */
    .md-tablayout-page {
      flex-shrink: 0;
      width: 100%;
      min-width: 100%; /* Ensure each page takes full viewport width */
      box-sizing: border-box;
      /* Pages are visible by default, no opacity tricks */
      /* Visibility is controlled by transform on parent track */
    }

    /* ============================================
       HEIGHT SYNCHRONIZATION (Optional)
       When pages have different heights, choose strategy:
       1. Natural (default): wrapper height = tallest page
       2. Fixed: wrapper height = current page only
    ============================================ */

    /* Strategy 1: Natural (default) - tallest page sets height
       - All pages contribute to height measurement
       - Wrapper naturally sizes to tallest child
       - Smooth for similar-height pages
    */
    .md-tablayout-content.height-natural .md-tablayout-pages-track {
      align-items: flex-start; /* Don't stretch pages */
    }

    /* Strategy 2: Fixed height to current page
       - JS must explicitly set wrapper height
       - Prevents jumping when switching between very different heights
       - Requires additional JS logic
    */
    .md-tablayout-content.height-fixed {
      /* Height will be set via inline style by JS */
    }

    /* ============================================
       ANIMATION VARIANTS
    ============================================ */

    /* Slide animation (default): uses transform on track
       - Already handled by PagesTrack transform
       - No per-page animation needed
    */

    /* Fade animation: crossfade between pages
       - Requires absolute positioning fallback
       - Less ideal but supported for compatibility
    */
    .md-tablayout.animation-fade .md-tablayout-pages-track {
      /* Switch to overlay mode for fade */
      position: relative;
    }

    .md-tablayout.animation-fade .md-tablayout-page {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      opacity: 0;
      transition: opacity 200ms ease-out;
      pointer-events: none;
    }

    .md-tablayout.animation-fade .md-tablayout-page.md-active {
      opacity: 1;
      pointer-events: auto;
      position: relative; /* Active page in flow for height */
    }

    /* Scale animation: similar to fade but with scale transform
       - Also requires absolute positioning fallback
    */
    .md-tablayout.animation-scale .md-tablayout-pages-track {
      position: relative;
    }

    .md-tablayout.animation-scale .md-tablayout-page {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 200ms ease-out, transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }

    .md-tablayout.animation-scale .md-tablayout-page.md-active {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
      position: relative; /* Active page in flow for height */
    }

    /* ============================================
       TAB STYLES (unchanged from original)
    ============================================ */

    .md-tablayout-tab {
      flex: 1 0 auto;
      min-width: 90px;
      max-width: 360px;
      height: 48px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: 600;
      
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .md-tablayout-tabs.md-fixed .md-tablayout-tab {
      flex: 1 1 0;
      max-width: none;
    }

    .md-tablayout-tab:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .md-tablayout-tab.md-active {
      color: rgba(255, 255, 255, 1);
    }

    .md-tablayout-tab-icon {
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }

    .md-tablayout-tab:hover .md-tablayout-tab-icon {
      transform: scale(1.1);
    }

    .md-tablayout-tab-badge {
      position: absolute;
      top: 6px;
      right: 8px;
      background: var(--md-error, #B3261E);
      color: var(--md-on-error, #FFFFFF);
      border-radius: 10px;
      min-width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.625rem;
      font-weight: 500;
      padding: 0 4px;
    }

    .md-tablayout-indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: rgba(255, 255, 255, 1);
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
                  width 250ms cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 3px 3px 0 0;
    }

    /* ============================================
       TAB STYLE VARIANTS (Pill, Underline, etc.)
    ============================================ */

    .md-tablayout.style-pill .md-tablayout-tabs {
      background: var(--tab-bg-elevated);
      border-radius: var(--tab-radius-full);
      padding: 4px;
      gap: 2px;
    }

    .md-tablayout.style-pill .md-tablayout-tab {
      border-radius: var(--tab-radius-full);
      background: transparent;
      color: var(--tab-text-secondary);
      min-width: 100px;
      text-transform: none;
    }

    .md-tablayout.style-pill .md-tablayout-tab:hover:not(.md-active) {
      background: rgba(255, 255, 255, 0.05);
      color: var(--tab-text-primary);
    }

    .md-tablayout.style-pill .md-tablayout-tab.md-active {
      background: var(--tab-text-primary);
      color: var(--tab-bg-primary);
      box-shadow: var(--tab-shadow-sm);
    }

    .md-tablayout.style-pill .md-tablayout-indicator {
      display: none;
    }

    .md-tablayout.style-underline .md-tablayout-tabs {
      background: var(--tab-bg-primary);
      border-bottom: 1px solid var(--tab-border);
      padding: 0;
    }

    .md-tablayout.style-underline .md-tablayout-tab {
      color: var(--tab-text-secondary);
      background: transparent;
      border-radius: 0;
      text-transform: none;
    }

    .md-tablayout.style-underline .md-tablayout-tab:hover:not(.md-active) {
      background: var(--tab-accent-soft);
      color: var(--tab-text-primary);
    }

    .md-tablayout.style-underline .md-tablayout-tab.md-active {
      color: var(--tab-accent);
      font-weight: 600;
      background: transparent;
    }

    .md-tablayout.style-underline .md-tablayout-indicator {
      height: 3px;
      bottom: -1px;
      background: var(--tab-accent);
      border-radius: 3px 3px 0 0;
    }

    .md-tablayout.style-segmented .md-tablayout-tabs {
      background: var(--tab-bg-elevated);
      border-radius: var(--tab-radius-md);
      padding: 4px;
      gap: 0;
    }

    .md-tablayout.style-segmented .md-tablayout-tab {
      border-radius: var(--tab-radius-sm);
      background: transparent;
      color: var(--tab-text-secondary);
      text-transform: none;
      font-size: 0.875rem;
    }

    .md-tablayout.style-segmented .md-tablayout-tab:hover:not(.md-active) {
      color: var(--tab-text-primary);
    }

    .md-tablayout.style-segmented .md-tablayout-tab.md-active {
      background: var(--tab-bg-primary);
      color: var(--tab-text-primary);
      box-shadow: var(--tab-shadow-md);
    }

    .md-tablayout.style-segmented .md-tablayout-indicator {
      display: none;
    }

    .md-tablayout.style-icon-pill .md-tablayout-tabs {
      background: var(--tab-bg-elevated);
      border-radius: var(--tab-radius-full);
      padding: 4px;
      gap: 4px;
    }

    .md-tablayout.style-icon-pill .md-tablayout-tab {
      width: 44px;
      height: 44px;
      min-width: 44px;
      padding: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--tab-text-secondary);
      text-transform: none;
    }

    .md-tablayout.style-icon-pill .md-tablayout-tab:hover:not(.md-active) {
      background: rgba(255, 255, 255, 0.08);
      color: var(--tab-text-primary);
    }

    .md-tablayout.style-icon-pill .md-tablayout-tab.md-active {
      background: var(--tab-text-primary);
      color: var(--tab-bg-primary);
      box-shadow: var(--tab-shadow-sm);
    }

    .md-tablayout.style-icon-pill .md-tablayout-tab-icon {
      font-size: 1.1rem;
    }

    .md-tablayout.style-icon-pill .md-tablayout-indicator {
      display: none;
    }

    .md-tablayout.style-pill .md-tablayout-tab:not(.md-icon-only),
    .md-tablayout.style-underline .md-tablayout-tab:not(.md-icon-only),
    .md-tablayout.style-segmented .md-tablayout-tab:not(.md-icon-only) {
      flex-direction: row;
      gap: 8px;
    }

    .md-tablayout-tab.md-icon-only {
      min-width: 72px;
    }

    /* ============================================
       VERTICAL ORIENTATION
    ============================================ */

    .md-tablayout.md-vertical {
      flex-direction: row;
    }

    .md-tablayout.md-vertical .md-tablayout-tabs {
      flex-direction: column;
      width: auto;
      min-width: 120px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .md-tablayout.md-vertical .md-tablayout-tab {
      width: 100%;
      max-width: none;
      height: 56px;
      justify-content: center;
      text-align: left;
      padding: 0 24px;
      flex-direction: row;
      gap: 12px;
    }

    .md-tablayout.md-vertical .md-tablayout-indicator {
      width: 3px;
      height: 100%;
      right: 0;
      left: auto;
      top: 0;
      bottom: auto;
      border-radius: 0 3px 3px 0;
    }

    /* For vertical orientation, pages stack vertically instead */
    .md-tablayout.md-vertical .md-tablayout-pages-track {
      flex-direction: column;
      height: 100%;
      width: auto;
    }

    .md-tablayout.md-vertical .md-tablayout-page {
      width: 100%;
      min-width: auto;
      height: 100%;
      min-height: 100%;
    }

    .md-tablayout.md-secondary .md-tablayout-tabs {
      background: var(--md-surface, var(--tab-bg-primary));
      border-bottom: 1px solid var(--md-outline-variant, var(--tab-border));
    }

    .md-tablayout.md-secondary .md-tablayout-tab {
      color: var(--md-on-surface-variant, var(--tab-text-secondary));
      text-transform: none;
    }

    .md-tablayout.md-secondary .md-tablayout-tab:hover {
      background: rgba(103, 80, 164, 0.08);
    }

    .md-tablayout.md-secondary .md-tablayout-tab.md-active {
      color: var(--md-primary, var(--tab-accent));
    }

    .md-tablayout.md-secondary .md-tablayout-indicator {
      background: var(--md-primary, var(--tab-accent));
    }
  `;

  // ==========================================
  // Helper: Extract DOM element from component
  // ==========================================
  const extractElement = (component) => {
    if (!component) return null;
    if (component instanceof HTMLElement) return component;
    if (typeof component === 'function') {
      const result = component();
      return extractElement(result);
    }
    if (typeof component.getElement === 'function') {
      return component.getElement();
    }
    if (component.element instanceof HTMLElement) {
      return component.element;
    }
    console.warn('Could not extract element from component:', component);
    return null;
  };

  // ==========================================
  // TabLayout Component - Flow-Based Architecture
  // ==========================================
  const TabLayout = (props = {}) => {
    _injectStyles('tablayout', TAB_STYLES);

    const state = {
      tabs: props.tabs || [],
      pages: props.pages || [],
      mode: props.mode || 'fixed',
      orientation: props.orientation || 'horizontal',
      style: props.style || 'primary',
      tabStyle: props.tabStyle || 'default',
      animatedIndicator: props.animatedIndicator !== false,
      animation: props.animation || 'slide',
      theme: props.theme || 'dark',
      accentColor: props.accentColor || '#1d9bf0',
      selectedIndex: props.selectedIndex || 0,
      heightMode: props.heightMode || 'natural', // 'natural' or 'fixed'
      onTabSelected: props.onTabSelected || null,
      swipeable: props.swipeable !== false,
      lazyLoad: props.lazyLoad || false,
      element: null,
      tabsContainer: null,
      contentWrapper: null, // The overflow:hidden container
      pagesTrack: null, // The sliding track element
      indicator: null,
      tabElements: [],
      pageElements: [],
      loadedPages: new Set(),
      touchStartX: 0,
      touchEndX: 0,
      isSwiping: false
    };

    const applyCustomColors = () => {
      if (!state.element) return;
      state.element.style.setProperty('--tab-accent', state.accentColor);
      const hoverColor = adjustColorBrightness(state.accentColor, -10);
      state.element.style.setProperty('--tab-accent-hover', hoverColor);
      const softColor = state.accentColor + '26';
      state.element.style.setProperty('--tab-accent-soft', softColor);
    };

    const adjustColorBrightness = (color, percent) => {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      ).toString(16).slice(1);
    };

    const updateIndicator = () => {
      if (!state.indicator || state.tabElements.length === 0) return;
      
      if (['pill', 'segmented', 'icon-pill'].includes(state.tabStyle) && 
          !(state.tabStyle === 'pill' && state.animatedIndicator)) {
        return;
      }
      
      const activeTab = state.tabElements[state.selectedIndex];
      if (!activeTab) return;

      if (state.orientation === 'horizontal') {
        const { offsetLeft, offsetWidth } = activeTab;
        state.indicator.style.transform = `translateX(${offsetLeft}px)`;
        state.indicator.style.width = `${offsetWidth}px`;
      } else {
        const { offsetTop, offsetHeight } = activeTab;
        state.indicator.style.transform = `translateY(${offsetTop}px)`;
        state.indicator.style.height = `${offsetHeight}px`;
      }
    };

    /* ============================================
       CRITICAL: Page Sliding Logic
       ============================================
       Instead of showing/hiding individual pages with absolute positioning,
       we slide the entire PagesTrack container using transform.
       
       This is analogous to ViewPager2 in Android:
       - Track width = viewport width × page count
       - Each page takes exactly viewport width
       - Transform shifts track to show current page
       
       Formula: translateX(-100% × selectedIndex)
       Example: 3 pages, index 1 → translateX(-100%)
    ============================================ */
    const updatePagesPosition = () => {
      if (!state.pagesTrack) return;

      if (state.animation === 'slide') {
        if (state.orientation === 'horizontal') {
          // Slide horizontally: move track left by (index * 100%)
          const offset = -state.selectedIndex * 100;
          state.pagesTrack.style.transform = `translateX(${offset}%)`;
        } else {
          // Slide vertically: move track up by (index * 100%)
          const offset = -state.selectedIndex * 100;
          state.pagesTrack.style.transform = `translateY(${offset}%)`;
        }
      }

      // Update height if in fixed mode
      if (state.heightMode === 'fixed') {
        updateWrapperHeight();
      }
    };

    /* ============================================
       HEIGHT SYNCHRONIZATION
       ============================================
       Strategy 1 (natural): Wrapper auto-sizes to tallest page
       - No JS needed, CSS handles it
       - Best for similar-height pages
       
       Strategy 2 (fixed): Wrapper matches current page height
       - Prevents jarring jumps between very different heights
       - Requires measuring current page and setting wrapper height
    ============================================ */
    const updateWrapperHeight = () => {
      if (!state.contentWrapper || state.heightMode !== 'fixed') return;

      const currentPage = state.pageElements[state.selectedIndex];
      if (currentPage) {
        // Measure the current page's content height
        const pageHeight = currentPage.scrollHeight;
        state.contentWrapper.style.height = `${pageHeight}px`;
      }
    };

    const loadPage = (index) => {
      if (state.loadedPages.has(index)) return;
      
      const page = state.pages[index];
      const pageElement = state.pageElements[index];
      
      if (!page || !pageElement) {
        console.warn(`Cannot load page at index ${index}: missing page or pageElement`);
        return;
      }

      const element = extractElement(page);
      
      if (element) {
        pageElement.innerHTML = '';
        pageElement.appendChild(element);
        state.loadedPages.add(index);
        
        // After loading, update height if needed
        if (state.heightMode === 'fixed' && index === state.selectedIndex) {
          // Use requestAnimationFrame to ensure DOM is updated
          requestAnimationFrame(() => updateWrapperHeight());
        }
        
        console.log(`Page ${index} loaded successfully`);
      } else {
        console.error(`Failed to extract element from page at index ${index}`, page);
      }
    };

    const selectTab = (index, animate = true) => {
      if (index < 0 || index >= state.tabs.length) return;
      
      const oldIndex = state.selectedIndex;
      state.selectedIndex = index;

      // Update tab active states
      state.tabElements.forEach((tab, i) => {
        tab.classList.toggle('md-active', i === index);
        tab.setAttribute('aria-selected', i === index);
      });

      // For slide animation (default): just update track position
      if (state.animation === 'slide') {
        // Load page if lazy loading
        if (!state.loadedPages.has(index)) {
          loadPage(index);
        }

        // Slide the track
        updatePagesPosition();

        // Update active class for accessibility
        state.pageElements.forEach((page, i) => {
          page.classList.toggle('md-active', i === index);
        });
      } else {
        // For fade/scale animations: use absolute positioning fallback
        state.pageElements.forEach((page, i) => {
          page.classList.remove('md-active');
          
          if (i === index) {
            if (!state.loadedPages.has(i)) {
              loadPage(i);
            }
            
            setTimeout(() => {
              page.classList.add('md-active');
            }, 0);
          }
        });
      }

      updateIndicator();

      // Scroll tab into view if needed
      if (state.mode === 'scrollable' && state.tabElements[index]) {
        const tab = state.tabElements[index];
        const container = state.tabsContainer;
        const tabRect = tab.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (state.orientation === 'horizontal') {
          if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
            tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        } else {
          if (tabRect.top < containerRect.top || tabRect.bottom > containerRect.bottom) {
            tab.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          }
        }
      }

      if (state.onTabSelected) {
        state.onTabSelected(index, state.tabs[index]);
      }
    };

    const handleSwipe = () => {
      if (!state.swipeable || state.orientation === 'vertical') return;
      
      const swipeThreshold = 50;
      const diff = state.touchStartX - state.touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && state.selectedIndex < state.tabs.length - 1) {
          selectTab(state.selectedIndex + 1);
        } else if (diff < 0 && state.selectedIndex > 0) {
          selectTab(state.selectedIndex - 1);
        }
      }
    };

    const setupSwipeHandlers = () => {
      if (!state.swipeable || state.orientation === 'vertical') return;

      state.contentWrapper.addEventListener('touchstart', (e) => {
        state.touchStartX = e.touches[0].clientX;
        state.isSwiping = true;
      }, { passive: true });

      state.contentWrapper.addEventListener('touchmove', (e) => {
        if (state.isSwiping) {
          state.touchEndX = e.touches[0].clientX;
        }
      }, { passive: true });

      state.contentWrapper.addEventListener('touchend', () => {
        if (state.isSwiping) {
          handleSwipe();
          state.isSwiping = false;
        }
      });
    };

    const createTab = (tab, index) => {
      const tabEl = document.createElement('button');
      tabEl.className = 'md-tablayout-tab';
      tabEl.setAttribute('role', 'tab');
      tabEl.setAttribute('aria-selected', index === state.selectedIndex);
      
      if (index === state.selectedIndex) {
        tabEl.classList.add('md-active');
      }

      if (tab.icon && !tab.text) {
        tabEl.classList.add('md-icon-only');
      }

      if (tab.icon) {
        const icon = document.createElement('span');
        icon.className = 'md-tablayout-tab-icon';
        icon.innerHTML = `<i class="${tab.icon}"></i>`;
        tabEl.appendChild(icon);
      }

      if (tab.text) {
        const text = document.createElement('span');
        text.textContent = tab.text;
        tabEl.appendChild(text);
      }

      if (tab.badge) {
        const badge = document.createElement('span');
        badge.className = 'md-tablayout-tab-badge';
        badge.textContent = tab.badge;
        tabEl.appendChild(badge);
      }

      tabEl.addEventListener('click', () => selectTab(index));

      return tabEl;
    };

    const createPage = (page, index) => {
      const pageEl = document.createElement('div');
      pageEl.className = 'md-tablayout-page';
      pageEl.setAttribute('role', 'tabpanel');
      pageEl.setAttribute('data-page-index', index);
      
      if (index === state.selectedIndex) {
        pageEl.classList.add('md-active');
      }

      // Load immediately if it's the selected page or not lazy loading
      if (!state.lazyLoad || index === state.selectedIndex) {
        setTimeout(() => loadPage(index), 0);
      }

      return pageEl;
    };

    const build = () => {
      // Root container
      state.element = document.createElement('div');
      state.element.className = 'md-tablayout';
      
      if (state.tabStyle !== 'default') {
        state.element.classList.add(`style-${state.tabStyle}`);
      }
      
      if (state.tabStyle === 'pill' && state.animatedIndicator) {
        state.element.classList.add('animated-indicator');
      }
      
      if (state.orientation === 'vertical') {
        state.element.classList.add('md-vertical');
      }
      
      if (state.style === 'secondary') {
        state.element.classList.add('md-secondary');
      }
      
      if (state.animation !== 'slide') {
        state.element.classList.add(`animation-${state.animation}`);
      }
      
      if (state.theme === 'light') {
        state.element.classList.add('light-theme');
      }

      applyCustomColors();

      // Create tabs container
      state.tabsContainer = document.createElement('div');
      state.tabsContainer.className = `md-tablayout-tabs md-${state.mode}`;
      state.tabsContainer.setAttribute('role', 'tablist');

      // Create tabs
      state.tabs.forEach((tab, index) => {
        const tabEl = createTab(tab, index);
        state.tabElements.push(tabEl);
        state.tabsContainer.appendChild(tabEl);
      });

      // Create indicator
      state.indicator = document.createElement('div');
      state.indicator.className = 'md-tablayout-indicator';
      state.tabsContainer.appendChild(state.indicator);

      state.element.appendChild(state.tabsContainer);

      /* ============================================
         BUILD PAGES STRUCTURE
         ============================================
         Structure:
         contentWrapper (overflow:hidden, measures height)
         └── pagesTrack (flex row, slides via transform)
             └── pages (normal flow, contribute to height)
      ============================================ */

      // Content wrapper - clips overflow, measures height
      state.contentWrapper = document.createElement('div');
      state.contentWrapper.className = `md-tablayout-content height-${state.heightMode}`;

      // Pages track - slides horizontally
      state.pagesTrack = document.createElement('div');
      state.pagesTrack.className = 'md-tablayout-pages-track';

      // Create pages
      state.pages.forEach((page, index) => {
        const pageEl = createPage(page, index);
        state.pageElements.push(pageEl);
        state.pagesTrack.appendChild(pageEl);
      });

      state.contentWrapper.appendChild(state.pagesTrack);
      state.element.appendChild(state.contentWrapper);

      setupSwipeHandlers();

      // Initialize position and indicator
      setTimeout(() => {
        updatePagesPosition();
        updateIndicator();
      }, 0);
    };

    const instance = {
      selectTab(index) {
        selectTab(index);
        return this;
      },
      getSelectedIndex() {
        return state.selectedIndex;
      },
      getSelectedTab() {
        return state.tabs[state.selectedIndex];
      },
      addTab(tab, page) {
        const index = state.tabs.length;
        state.tabs.push(tab);
        state.pages.push(page);

        if (state.tabsContainer && state.pagesTrack) {
          const tabEl = createTab(tab, index);
          state.tabElements.push(tabEl);
          state.tabsContainer.insertBefore(tabEl, state.indicator);

          const pageEl = createPage(page, index);
          state.pageElements.push(pageEl);
          state.pagesTrack.appendChild(pageEl);

          updateIndicator();
          updatePagesPosition();
        }

        return this;
      },
      removeTab(index) {
        if (index < 0 || index >= state.tabs.length) return this;

        state.tabs.splice(index, 1);
        state.pages.splice(index, 1);

        if (state.tabElements[index]) {
          state.tabElements[index].remove();
          state.tabElements.splice(index, 1);
        }

        if (state.pageElements[index]) {
          state.pageElements[index].remove();
          state.pageElements.splice(index, 1);
        }

        state.loadedPages.delete(index);

        if (state.selectedIndex >= state.tabs.length) {
          selectTab(Math.max(0, state.tabs.length - 1));
        } else {
          updateIndicator();
          updatePagesPosition();
        }

        return this;
      },
      updateTabBadge(index, badge) {
        if (index < 0 || index >= state.tabElements.length) return this;

        const tabEl = state.tabElements[index];
        let badgeEl = tabEl.querySelector('.md-tablayout-tab-badge');

        if (badge) {
          if (!badgeEl) {
            badgeEl = document.createElement('span');
            badgeEl.className = 'md-tablayout-tab-badge';
            tabEl.appendChild(badgeEl);
          }
          badgeEl.textContent = badge;
        } else if (badgeEl) {
          badgeEl.remove();
        }

        return this;
      },
      setTabStyle(style) {
        const oldStyle = state.tabStyle;
        state.tabStyle = style;
        
        if (state.element) {
          if (oldStyle !== 'default') {
            state.element.classList.remove(`style-${oldStyle}`);
          }
          if (style !== 'default') {
            state.element.classList.add(`style-${style}`);
          }
          
          if (style === 'pill' && state.animatedIndicator) {
            state.element.classList.add('animated-indicator');
          } else {
            state.element.classList.remove('animated-indicator');
          }
          
          updateIndicator();
        }
        
        return this;
      },
      setAccentColor(color) {
        state.accentColor = color;
        applyCustomColors();
        return this;
      },
      setTheme(theme) {
        state.theme = theme;
        
        if (state.element) {
          if (theme === 'light') {
            state.element.classList.add('light-theme');
          } else {
            state.element.classList.remove('light-theme');
          }
        }
        
        return this;
      },
      setAnimation(animation) {
        state.animation = animation;
        
        if (state.element) {
          state.element.classList.remove('animation-fade', 'animation-scale');
          if (animation !== 'slide') {
            state.element.classList.add(`animation-${animation}`);
          }
          
          // Rebuild might be needed for animation type changes
          updatePagesPosition();
        }
        
        return this;
      },
      setHeightMode(mode) {
        state.heightMode = mode;
        
        if (state.contentWrapper) {
          state.contentWrapper.classList.remove('height-natural', 'height-fixed');
          state.contentWrapper.classList.add(`height-${mode}`);
          
          if (mode === 'fixed') {
            updateWrapperHeight();
          } else {
            state.contentWrapper.style.height = '';
          }
        }
        
        return this;
      },
      setSwipeable(enabled) {
        state.swipeable = enabled;
        return this;
      },
      reloadPage(index) {
        if (index >= 0 && index < state.pages.length) {
          state.loadedPages.delete(index);
          if (state.pageElements[index]) {
            state.pageElements[index].innerHTML = '';
          }
          if (index === state.selectedIndex) {
            loadPage(index);
          }
        }
        return this;
      },
      reloadAllPages() {
        state.loadedPages.clear();
        state.pageElements.forEach((pageEl, i) => {
          pageEl.innerHTML = '';
          if (i === state.selectedIndex) {
            loadPage(i);
          }
        });
        return this;
      },
      getElement() {
        if (!state.element) build();
        return state.element;
      },
      refresh() {
        updateIndicator();
        updatePagesPosition();
        if (state.heightMode === 'fixed') {
          updateWrapperHeight();
        }
        return this;
      },
      debug() {
        console.log('TabLayout Debug Info:', {
          selectedIndex: state.selectedIndex,
          loadedPages: Array.from(state.loadedPages),
          tabCount: state.tabs.length,
          pageCount: state.pages.length,
          pageElementCount: state.pageElements.length,
          heightMode: state.heightMode,
          animation: state.animation,
          wrapperHeight: state.contentWrapper?.offsetHeight,
          trackTransform: state.pagesTrack?.style.transform,
          pages: state.pages.map((p, i) => ({
            index: i,
            type: typeof p,
            isElement: p instanceof HTMLElement,
            hasGetElement: typeof p?.getElement === 'function',
            loaded: state.loadedPages.has(i),
            height: state.pageElements[i]?.scrollHeight
          }))
        });
        return this;
      }
    };

    build();
    return instance;
  };

  // ==========================================
  // ViewPager Component - Flow-Based Architecture
  // ==========================================
  const ViewPager = (props = {}) => {
    const state = {
      pages: props.pages || [],
      currentPage: props.currentPage || 0,
      onPageChanged: props.onPageChanged || null,
      swipeable: props.swipeable !== false,
      lazyLoad: props.lazyLoad || false,
      animation: props.animation || 'slide',
      heightMode: props.heightMode || 'natural',
      element: null,
      pagesTrack: null,
      pageElements: [],
      loadedPages: new Set(),
      touchStartX: 0,
      touchEndX: 0,
      isSwiping: false
    };

    const loadPage = (index) => {
      if (state.loadedPages.has(index)) return;
      
      const page = state.pages[index];
      const pageElement = state.pageElements[index];
      
      if (!page || !pageElement) return;

      const element = extractElement(page);
      
      if (element) {
        pageElement.innerHTML = '';
        pageElement.appendChild(element);
        state.loadedPages.add(index);
        
        if (state.heightMode === 'fixed' && index === state.currentPage) {
          requestAnimationFrame(() => updateWrapperHeight());
        }
      }
    };

    const updatePagesPosition = () => {
      if (!state.pagesTrack) return;

      if (state.animation === 'slide') {
        const offset = -state.currentPage * 100;
        state.pagesTrack.style.transform = `translateX(${offset}%)`;
      }

      if (state.heightMode === 'fixed') {
        updateWrapperHeight();
      }
    };

    const updateWrapperHeight = () => {
      if (!state.element || state.heightMode !== 'fixed') return;

      const currentPage = state.pageElements[state.currentPage];
      if (currentPage) {
        const pageHeight = currentPage.scrollHeight;
        state.element.style.height = `${pageHeight}px`;
      }
    };

    const setPage = (index, animate = true) => {
      if (index < 0 || index >= state.pages.length) return;
      
      const oldIndex = state.currentPage;
      state.currentPage = index;

      if (state.animation === 'slide') {
        if (!state.loadedPages.has(index)) {
          loadPage(index);
        }

        updatePagesPosition();

        state.pageElements.forEach((page, i) => {
          page.classList.toggle('md-active', i === index);
        });
      } else {
        state.pageElements.forEach((page, i) => {
          page.classList.remove('md-active');
          
          if (i === index) {
            if (!state.loadedPages.has(i)) {
              loadPage(i);
            }
            
            setTimeout(() => {
              page.classList.add('md-active');
            }, 0);
          }
        });
      }

      if (state.onPageChanged) {
        state.onPageChanged(index, oldIndex);
      }
    };

    const handleSwipe = () => {
      if (!state.swipeable) return;
      
      const swipeThreshold = 50;
      const diff = state.touchStartX - state.touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && state.currentPage < state.pages.length - 1) {
          setPage(state.currentPage + 1);
        } else if (diff < 0 && state.currentPage > 0) {
          setPage(state.currentPage - 1);
        }
      }
    };

    const build = () => {
      state.element = document.createElement('div');
      state.element.className = `md-tablayout-content height-${state.heightMode}`;
      
      if (state.animation !== 'slide') {
        state.element.classList.add(`animation-${state.animation}`);
      }

      state.pagesTrack = document.createElement('div');
      state.pagesTrack.className = 'md-tablayout-pages-track';

      state.pages.forEach((page, index) => {
        const pageEl = document.createElement('div');
        pageEl.className = 'md-tablayout-page';
        
        if (index === state.currentPage) {
          pageEl.classList.add('md-active');
        }

        if (!state.lazyLoad || index === state.currentPage) {
          setTimeout(() => loadPage(index), 0);
        }

        state.pageElements.push(pageEl);
        state.pagesTrack.appendChild(pageEl);
      });

      state.element.appendChild(state.pagesTrack);

      if (state.swipeable) {
        state.element.addEventListener('touchstart', (e) => {
          state.touchStartX = e.touches[0].clientX;
          state.isSwiping = true;
        }, { passive: true });

        state.element.addEventListener('touchmove', (e) => {
          if (state.isSwiping) {
            state.touchEndX = e.touches[0].clientX;
          }
        }, { passive: true });

        state.element.addEventListener('touchend', () => {
          if (state.isSwiping) {
            handleSwipe();
            state.isSwiping = false;
          }
        });
      }

      setTimeout(() => updatePagesPosition(), 0);
    };

    const instance = {
      setPage(index) {
        setPage(index);
        return this;
      },
      getCurrentPage() {
        return state.currentPage;
      },
      nextPage() {
        if (state.currentPage < state.pages.length - 1) {
          setPage(state.currentPage + 1);
        }
        return this;
      },
      previousPage() {
        if (state.currentPage > 0) {
          setPage(state.currentPage - 1);
        }
        return this;
      },
      addPage(page) {
        state.pages.push(page);
        
        if (state.pagesTrack) {
          const pageEl = document.createElement('div');
          pageEl.className = 'md-tablayout-page';
          
          const index = state.pages.length - 1;
          if (!state.lazyLoad) {
            setTimeout(() => loadPage(index), 0);
          }
          
          state.pageElements.push(pageEl);
          state.pagesTrack.appendChild(pageEl);
        }
        
        return this;
      },
      setAnimation(animation) {
        state.animation = animation;
        
        if (state.element) {
          state.element.classList.remove('animation-fade', 'animation-scale');
          if (animation !== 'slide') {
            state.element.classList.add(`animation-${animation}`);
          }
          
          updatePagesPosition();
        }
        
        return this;
      },
      setHeightMode(mode) {
        state.heightMode = mode;
        
        if (state.element) {
          state.element.classList.remove('height-natural', 'height-fixed');
          state.element.classList.add(`height-${mode}`);
          
          if (mode === 'fixed') {
            updateWrapperHeight();
          } else {
            state.element.style.height = '';
          }
        }
        
        return this;
      },
      getElement() {
        if (!state.element) build();
        return state.element;
      },
      refresh() {
        updatePagesPosition();
        if (state.heightMode === 'fixed') {
          updateWrapperHeight();
        }
        return this;
      }
    };

    build();
    return instance;
  };

  // ==========================================
  // Extend AndroidComponents
  // ==========================================
  if (window.AndroidComponents) {
    window.AndroidComponents.TabLayout = TabLayout;
    window.AndroidComponents.ViewPager = ViewPager;
  } else {
    window.AndroidComponents = { TabLayout, ViewPager };
  }
})();
