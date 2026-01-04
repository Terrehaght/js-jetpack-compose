// ============================================
// AndroidComponents TabLayout & ViewPager
// Requires: components1.js and AndroidLayouts to be loaded first
// ============================================
(function() {
  const { injectStyles, injectedStyles } = window.AndroidComponents?.utils || {};
  
  // Fallback if core utils not available
  const _injectStyles = injectStyles || ((id, css) => {
    if (injectedStyles?.has(id)) return;
    const style = document.createElement('style');
    style.id = `android-components-${id}`;
    style.textContent = css;
    document.head.appendChild(style);
    injectedStyles?.add(id);
  });

  // ==========================================
  // TabLayout Styles
  // ==========================================
  const TAB_STYLES = `
    .md-tablayout {
      display: flex; flex-direction: column;
      background: var(--md-surface, #FFFBFE);
      width: 100%;
    }
    .md-tablayout-tabs {
      display: flex; position: relative;
      background: var(--md-primary, #6750A4);
      overflow-x: auto; overflow-y: hidden;
      scrollbar-width: none;
    }
    .md-tablayout-tabs::-webkit-scrollbar { display: none; }
    .md-tablayout-tabs.md-scrollable {
      justify-content: flex-start;
    }
    .md-tablayout-tabs.md-fixed {
      justify-content: space-around;
    }
    .md-tablayout-tab {
      flex: 1 0 auto; min-width: 90px; max-width: 360px;
      height: 48px; padding: 0 16px;
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 4px;
      background: transparent; border: none;
      color: rgba(255, 255, 255, 0.7);
      font-family: inherit; font-size: 0.875rem; font-weight: 500;
      cursor: pointer; transition: color 0.2s, background-color 0.2s;
      position: relative; white-space: nowrap;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .md-tablayout-tabs.md-fixed .md-tablayout-tab {
      flex: 1 1 0; max-width: none;
    }
    .md-tablayout-tab:hover {
      background: rgba(255, 255, 255, 0.08);
    }
    .md-tablayout-tab.md-active {
      color: rgba(255, 255, 255, 1);
    }
    .md-tablayout-tab-icon {
      font-size: 1.5rem; display: flex; align-items: center;
      justify-content: center;
    }
    .md-tablayout-tab-badge {
      position: absolute; top: 6px; right: 8px;
      background: var(--md-error, #B3261E);
      color: var(--md-on-error, #FFFFFF);
      border-radius: 10px; min-width: 16px; height: 16px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.625rem; font-weight: 500; padding: 0 4px;
    }
    .md-tablayout-indicator {
      position: absolute; bottom: 0; left: 0;
      height: 3px; background: rgba(255, 255, 255, 1);
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
                  width 250ms cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 3px 3px 0 0;
    }
    .md-tablayout-content {
      flex: 1; position: relative; overflow: hidden;
      background: var(--md-surface-container-lowest, #FFFFFF);
    }
    .md-tablayout-page {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      overflow-y: auto; opacity: 0; visibility: hidden;
      transform: translateX(20px);
      transition: opacity 200ms ease-out, visibility 200ms ease-out,
                  transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .md-tablayout-page.md-active {
      opacity: 1; visibility: visible; transform: translateX(0);
      z-index: 1;
    }
    .md-tablayout-page.md-slide-left {
      transform: translateX(-100%);
    }
    .md-tablayout-page.md-slide-right {
      transform: translateX(100%);
    }
    
    /* Vertical TabLayout */
    .md-tablayout.md-vertical {
      flex-direction: row;
    }
    .md-tablayout.md-vertical .md-tablayout-tabs {
      flex-direction: column; width: auto; min-width: 120px;
      overflow-y: auto; overflow-x: hidden;
    }
    .md-tablayout.md-vertical .md-tablayout-tab {
      width: 100%; max-width: none; height: 56px;
      justify-content: center; text-align: left;
      padding: 0 24px; flex-direction: row; gap: 12px;
    }
    .md-tablayout.md-vertical .md-tablayout-tab-icon {
      margin: 0;
    }
    .md-tablayout.md-vertical .md-tablayout-indicator {
      width: 3px; height: 100%; right: 0; left: auto;
      top: 0; bottom: auto;
      border-radius: 0 3px 3px 0;
    }
    .md-tablayout.md-vertical .md-tablayout-content {
      flex: 1;
    }

    /* Secondary Style */
    .md-tablayout.md-secondary .md-tablayout-tabs {
      background: var(--md-surface, #FFFBFE);
      border-bottom: 1px solid var(--md-outline-variant, #CAC4D0);
    }
    .md-tablayout.md-secondary .md-tablayout-tab {
      color: var(--md-on-surface-variant, #49454F);
      text-transform: none;
    }
    .md-tablayout.md-secondary .md-tablayout-tab:hover {
      background: rgba(103, 80, 164, 0.08);
    }
    .md-tablayout.md-secondary .md-tablayout-tab.md-active {
      color: var(--md-primary, #6750A4);
    }
    .md-tablayout.md-secondary .md-tablayout-indicator {
      background: var(--md-primary, #6750A4);
    }

    /* Icon-only tabs */
    .md-tablayout-tab.md-icon-only {
      min-width: 72px;
    }
  `;

  // ==========================================
  // TabLayout Component
  // ==========================================
  const TabLayout = (props = {}) => {
    _injectStyles('tablayout', TAB_STYLES);

    const state = {
      tabs: props.tabs || [],
      pages: props.pages || [],
      mode: props.mode || 'fixed', // 'fixed' | 'scrollable'
      orientation: props.orientation || 'horizontal', // 'horizontal' | 'vertical'
      style: props.style || 'primary', // 'primary' | 'secondary'
      selectedIndex: props.selectedIndex || 0,
      onTabSelected: props.onTabSelected || null,
      swipeable: props.swipeable !== false,
      lazyLoad: props.lazyLoad || false,
      element: null,
      tabsContainer: null,
      contentContainer: null,
      indicator: null,
      tabElements: [],
      pageElements: [],
      loadedPages: new Set(),
      touchStartX: 0,
      touchEndX: 0,
      isSwiping: false
    };

    const updateIndicator = () => {
      if (!state.indicator || state.tabElements.length === 0) return;
      
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

    const selectTab = (index, animate = true) => {
      if (index < 0 || index >= state.tabs.length) return;
      
      const oldIndex = state.selectedIndex;
      state.selectedIndex = index;

      // Update tab active states
      state.tabElements.forEach((tab, i) => {
        tab.classList.toggle('md-active', i === index);
      });

      // Update page visibility with animation
      state.pageElements.forEach((page, i) => {
        page.classList.remove('md-active', 'md-slide-left', 'md-slide-right');
        
        if (i === index) {
          // Load page content if lazy loading
          if (state.lazyLoad && !state.loadedPages.has(i)) {
            loadPage(i);
          }
          
          requestAnimationFrame(() => {
            page.classList.add('md-active');
          });
        } else if (animate) {
          // Add slide animation direction
          if (i < index) {
            page.classList.add('md-slide-left');
          } else {
            page.classList.add('md-slide-right');
          }
        }
      });

      updateIndicator();

      // Scroll active tab into view if scrollable
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

    const loadPage = (index) => {
      if (state.loadedPages.has(index)) return;
      
      const page = state.pages[index];
      const pageElement = state.pageElements[index];
      
      if (page && pageElement) {
        if (typeof page === 'function') {
          // Page is a lazy-loaded function that returns content
          const content = page();
          if (typeof content.getElement === 'function') {
            pageElement.appendChild(content.getElement());
          } else if (content instanceof HTMLElement) {
            pageElement.appendChild(content);
          }
        } else if (typeof page.getElement === 'function') {
          pageElement.appendChild(page.getElement());
        } else if (page instanceof HTMLElement) {
          pageElement.appendChild(page);
        }
        
        state.loadedPages.add(index);
      }
    };

    const handleSwipe = () => {
      if (!state.swipeable || state.orientation === 'vertical') return;
      
      const swipeThreshold = 50;
      const diff = state.touchStartX - state.touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && state.selectedIndex < state.tabs.length - 1) {
          // Swipe left - next tab
          selectTab(state.selectedIndex + 1);
        } else if (diff < 0 && state.selectedIndex > 0) {
          // Swipe right - previous tab
          selectTab(state.selectedIndex - 1);
        }
      }
    };

    const setupSwipeHandlers = () => {
      if (!state.swipeable || state.orientation === 'vertical') return;

      state.contentContainer.addEventListener('touchstart', (e) => {
        state.touchStartX = e.touches[0].clientX;
        state.isSwiping = true;
      }, { passive: true });

      state.contentContainer.addEventListener('touchmove', (e) => {
        if (state.isSwiping) {
          state.touchEndX = e.touches[0].clientX;
        }
      }, { passive: true });

      state.contentContainer.addEventListener('touchend', () => {
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
      
      if (index === state.selectedIndex) {
        pageEl.classList.add('md-active');
      }

      // Load page immediately if not lazy loading or if it's the selected page
      if (!state.lazyLoad || index === state.selectedIndex) {
        loadPage(index);
      }

      return pageEl;
    };

    const build = () => {
      state.element = document.createElement('div');
      state.element.className = 'md-tablayout';
      
      if (state.orientation === 'vertical') {
        state.element.classList.add('md-vertical');
      }
      
      if (state.style === 'secondary') {
        state.element.classList.add('md-secondary');
      }

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

      // Create content container
      state.contentContainer = document.createElement('div');
      state.contentContainer.className = 'md-tablayout-content';

      // Create pages
      state.pages.forEach((page, index) => {
        const pageEl = createPage(page, index);
        state.pageElements.push(pageEl);
        state.contentContainer.appendChild(pageEl);
      });

      state.element.appendChild(state.contentContainer);

      // Setup swipe handlers
      setupSwipeHandlers();

      // Update indicator after render
      requestAnimationFrame(() => {
        updateIndicator();
      });
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

        if (state.tabsContainer && state.contentContainer) {
          const tabEl = createTab(tab, index);
          state.tabElements.push(tabEl);
          state.tabsContainer.insertBefore(tabEl, state.indicator);

          const pageEl = createPage(page, index);
          state.pageElements.push(pageEl);
          state.contentContainer.appendChild(pageEl);

          updateIndicator();
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

        // Adjust selected index if necessary
        if (state.selectedIndex >= state.tabs.length) {
          selectTab(Math.max(0, state.tabs.length - 1));
        } else {
          updateIndicator();
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
      setSwipeable(enabled) {
        state.swipeable = enabled;
        return this;
      },
      getElement() {
        if (!state.element) build();
        return state.element;
      },
      refresh() {
        updateIndicator();
        return this;
      }
    };

    build();
    return instance;
  };

  // ==========================================
  // ViewPager Component (standalone)
  // ==========================================
  const ViewPager = (props = {}) => {
    const state = {
      pages: props.pages || [],
      currentPage: props.currentPage || 0,
      onPageChanged: props.onPageChanged || null,
      swipeable: props.swipeable !== false,
      lazyLoad: props.lazyLoad || false,
      element: null,
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
      
      if (page && pageElement) {
        if (typeof page === 'function') {
          const content = page();
          if (typeof content.getElement === 'function') {
            pageElement.appendChild(content.getElement());
          } else if (content instanceof HTMLElement) {
            pageElement.appendChild(content);
          }
        } else if (typeof page.getElement === 'function') {
          pageElement.appendChild(page.getElement());
        } else if (page instanceof HTMLElement) {
          pageElement.appendChild(page);
        }
        
        state.loadedPages.add(index);
      }
    };

    const setPage = (index, animate = true) => {
      if (index < 0 || index >= state.pages.length) return;
      
      const oldIndex = state.currentPage;
      state.currentPage = index;

      state.pageElements.forEach((page, i) => {
        page.classList.remove('md-active', 'md-slide-left', 'md-slide-right');
        
        if (i === index) {
          if (state.lazyLoad && !state.loadedPages.has(i)) {
            loadPage(i);
          }
          
          requestAnimationFrame(() => {
            page.classList.add('md-active');
          });
        } else if (animate) {
          if (i < index) {
            page.classList.add('md-slide-left');
          } else {
            page.classList.add('md-slide-right');
          }
        }
      });

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
      state.element.className = 'md-tablayout-content';
      state.element.style.position = 'relative';
      state.element.style.flex = '1';
      state.element.style.overflow = 'hidden';

      state.pages.forEach((page, index) => {
        const pageEl = document.createElement('div');
        pageEl.className = 'md-tablayout-page';
        
        if (index === state.currentPage) {
          pageEl.classList.add('md-active');
        }

        if (!state.lazyLoad || index === state.currentPage) {
          loadPage(index);
        }

        state.pageElements.push(pageEl);
        state.element.appendChild(pageEl);
      });

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
        
        if (state.element) {
          const pageEl = document.createElement('div');
          pageEl.className = 'md-tablayout-page';
          
          const index = state.pages.length - 1;
          if (!state.lazyLoad) {
            loadPage(index);
          }
          
          state.pageElements.push(pageEl);
          state.element.appendChild(pageEl);
        }
        
        return this;
      },
      getElement() {
        if (!state.element) build();
        return state.element;
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