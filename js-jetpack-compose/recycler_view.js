

// ============================================
// AndroidComponents RecyclerView & Enhanced ScrollView
// OPTIMIZED VERSION - with Horizontal Scroll Support + SEARCH + COLLAPSIBLE FUNCTIONALITY
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
  // RecyclerView Styles (Including Collapsible Styles)
  // ==========================================
  const RECYCLERVIEW_STYLES = `
    .md-recyclerview {
      overflow-y: auto; overflow-x: hidden;
      position: relative; width: 100%;
      -webkit-overflow-scrolling: touch;
    }
    .md-recyclerview.horizontal {
      overflow-y: hidden; overflow-x: auto;
      white-space: nowrap;
    }
    .md-recyclerview-container {
      position: relative;
    }
    .md-recyclerview-container.horizontal {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
    }
    .md-recyclerview-item {
      position: relative;
    }
    .md-recyclerview-item.horizontal {
      display: inline-block;
      vertical-align: top;
    }
    .md-recyclerview-item.collapsed-hidden {
      display: none;
    }
    .md-recyclerview-loading {
      display: flex; align-items: center; justify-content: center;
      padding: 24px; color: var(--md-on-surface-variant, #49454F);
    }
    .md-recyclerview-loading-spinner {
      width: 24px; height: 24px; border: 3px solid var(--md-outline-variant, #CAC4D0);
      border-top-color: var(--md-primary, #6750A4);
      border-radius: 50%; animation: md-spin 0.8s linear infinite;
    }
    @keyframes md-spin {
      to { transform: rotate(360deg); }
    }
    .md-recyclerview-empty {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 48px 24px;
      color: var(--md-on-surface-variant, #49454F); text-align: center;
    }
    .md-recyclerview-empty-icon {
      font-size: 4rem; opacity: 0.3; margin-bottom: 16px;
    }
    .md-recyclerview-empty-text {
      font-size: 1rem; font-weight: 500; margin-bottom: 8px;
    }
    .md-recyclerview-empty-subtext {
      font-size: 0.875rem; opacity: 0.7;
    }
    .md-recyclerview-divider {
      background: var(--md-outline-variant, #CAC4D0);
      margin: 0;
    }
    .md-recyclerview-divider.vertical {
      height: 1px;
      width: 100%;
    }
    .md-recyclerview-divider.horizontal {
      width: 1px;
      height: 100%;
      display: inline-block;
      vertical-align: top;
    }
    .md-recyclerview-error {
      display: flex; flex-direction: column; align-items: center;
      padding: 24px; text-align: center;
      color: var(--md-error, #B3261E);
    }
    .md-recyclerview-error-icon {
      font-size: 3rem; margin-bottom: 12px;
    }
    .md-recyclerview-error-text {
      font-size: 0.875rem; margin-bottom: 16px;
    }
    .md-recyclerview-retry-btn {
      padding: 10px 24px; border-radius: 20px; border: none;
      background: var(--md-primary, #6750A4);
      color: var(--md-on-primary, #FFFFFF);
      font-family: inherit; font-size: 0.875rem; font-weight: 500;
      cursor: pointer; transition: box-shadow 0.2s;
    }
    .md-recyclerview-retry-btn:hover {
      box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    
    /* Collapsible Toggle Button Styles */
    .md-recyclerview-toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      margin: 16px auto;
      border: none;
      background: transparent;
      color: var(--md-primary, #6750A4);
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      border-radius: 8px;
      transition: background-color 0.2s, transform 0.2s;
      user-select: none;
    }
    .md-recyclerview-toggle-btn:hover {
      background-color: var(--md-surface-variant, #E7E0EC);
    }
    .md-recyclerview-toggle-btn:active {
      transform: scale(0.98);
    }
    .md-recyclerview-toggle-btn i {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }
    .md-recyclerview-toggle-btn.expanded i {
      transform: rotate(180deg);
    }
  `;

  // ==========================================
  // RecyclerView Component - WITH COLLAPSIBLE SUPPORT
  // ==========================================
  const RecyclerView = (props = {}) => {
    _injectStyles('recyclerview', RECYCLERVIEW_STYLES);

    const state = {
      data: props.data || [],
      originalData: null, // Store original data when searching
      adapter: props.adapter || null,
      orientation: props.orientation || 'vertical', // 'vertical' or 'horizontal'
      layoutManager: props.layoutManager || 'linear',
      gridColumns: props.gridColumns || 2,
      divider: props.divider || false,
      onLoadMore: props.onLoadMore || null,
      loadMoreThreshold: props.loadMoreThreshold || 200,
      hasMore: props.hasMore !== false,
      emptyView: props.emptyView || null,
      emptyText: props.emptyText || 'No items',
      emptySubtext: props.emptySubtext || '',
      emptyIcon: props.emptyIcon || 'bx bx-inbox',
      height: props.height || 'auto',
      padding: props.padding || 0,
      gap: props.gap || 0,
      element: null,
      container: null,
      loadingElement: null,
      isLoading: false,
      hasError: false,
      errorMessage: '',
      itemElements: [],
      emptyViewElement: null,
      isSearchActive: false,
      searchQuery: '',
      searchFields: null,
      
      // Collapsible functionality
      collapsible: props.collapsible || false, // Enable/disable collapsible
      initialItemsCount: props.initialItemsCount || 5, // Number of items to show initially
      isExpanded: props.defaultExpanded || false, // Initial expanded state
      showMoreText: props.showMoreText || 'Show More',
      showLessText: props.showLessText || 'Show Less',
      showMoreIcon: props.showMoreIcon || 'bx bx-chevron-down',
      showLessIcon: props.showLessIcon || 'bx bx-chevron-up',
      toggleButton: null, // Reference to toggle button
      onToggle: props.onToggle || null // Callback when toggle happens
    };

    const createLoadingView = () => {
      const loading = document.createElement('div');
      loading.className = 'md-recyclerview-loading';
      loading.style.display = 'none';
      
      const spinner = document.createElement('div');
      spinner.className = 'md-recyclerview-loading-spinner';
      loading.appendChild(spinner);
      
      return loading;
    };

    const createEmptyView = () => {
      if (state.emptyView) {
        const container = document.createElement('div');
        if (typeof state.emptyView.getElement === 'function') {
          container.appendChild(state.emptyView.getElement());
        } else if (state.emptyView instanceof HTMLElement) {
          container.appendChild(state.emptyView);
        }
        return container;
      }

      const empty = document.createElement('div');
      empty.className = 'md-recyclerview-empty';
      
      if (state.emptyIcon) {
        const icon = document.createElement('div');
        icon.className = 'md-recyclerview-empty-icon';
        icon.innerHTML = `<i class="${state.emptyIcon}"></i>`;
        empty.appendChild(icon);
      }
      
      const text = document.createElement('div');
      text.className = 'md-recyclerview-empty-text';
      text.textContent = state.isSearchActive ? 'No results found' : state.emptyText;
      empty.appendChild(text);
      
      if (state.emptySubtext || state.isSearchActive) {
        const subtext = document.createElement('div');
        subtext.className = 'md-recyclerview-empty-subtext';
        subtext.textContent = state.isSearchActive 
          ? `No items match "${state.searchQuery}"` 
          : state.emptySubtext;
        empty.appendChild(subtext);
      }
      
      return empty;
    };

    const createErrorView = (message) => {
      const error = document.createElement('div');
      error.className = 'md-recyclerview-error';
      
      const icon = document.createElement('div');
      icon.className = 'md-recyclerview-error-icon';
      icon.innerHTML = '<i class="bx bx-error-circle"></i>';
      error.appendChild(icon);
      
      const text = document.createElement('div');
      text.className = 'md-recyclerview-error-text';
      text.textContent = message || 'Failed to load data';
      error.appendChild(text);
      
      const retryBtn = document.createElement('button');
      retryBtn.className = 'md-recyclerview-retry-btn';
      retryBtn.textContent = 'Retry';
      retryBtn.addEventListener('click', () => {
        state.hasError = false;
        instance.loadMore();
      });
      error.appendChild(retryBtn);
      
      return error;
    };

    const createDivider = () => {
      const divider = document.createElement('div');
      divider.className = `md-recyclerview-divider ${state.orientation}`;
      return divider;
    };

    const createToggleButton = () => {
      const button = document.createElement('button');
      button.className = `md-recyclerview-toggle-btn ${state.isExpanded ? 'expanded' : ''}`;
      
      const text = document.createElement('span');
      text.textContent = state.isExpanded ? state.showLessText : state.showMoreText;
      
      const icon = document.createElement('i');
      icon.className = state.isExpanded ? state.showLessIcon : state.showMoreIcon;
      
      button.appendChild(text);
      button.appendChild(icon);
      
      button.addEventListener('click', () => {
        state.isExpanded = !state.isExpanded;
        updateCollapsibleState();
        
        // Update button appearance
        button.className = `md-recyclerview-toggle-btn ${state.isExpanded ? 'expanded' : ''}`;
        text.textContent = state.isExpanded ? state.showLessText : state.showMoreText;
        icon.className = state.isExpanded ? state.showLessIcon : state.showMoreIcon;
        
        // Trigger callback
        if (state.onToggle) {
          state.onToggle(state.isExpanded);
        }
      });
      
      return button;
    };

    const updateCollapsibleState = () => {
      if (!state.collapsible) return;
      
      state.itemElements.forEach((itemEl, index) => {
        if (state.isExpanded || index < state.initialItemsCount) {
          itemEl.classList.remove('collapsed-hidden');
        } else {
          itemEl.classList.add('collapsed-hidden');
        }
      });
      
      // Show/hide toggle button
      if (state.toggleButton) {
        if (state.data.length > state.initialItemsCount) {
          state.toggleButton.style.display = 'flex';
        } else {
          state.toggleButton.style.display = 'none';
        }
      }
    };

    const renderItem = (item, index) => {
      if (!state.adapter) return null;

      const itemWrapper = document.createElement('div');
      itemWrapper.className = `md-recyclerview-item ${state.orientation === 'horizontal' ? 'horizontal' : ''}`;
      itemWrapper.dataset.index = index;
      
      // Apply collapsed state if needed
      if (state.collapsible && !state.isExpanded && index >= state.initialItemsCount) {
        itemWrapper.classList.add('collapsed-hidden');
      }
      
      const content = state.adapter(item, index);
      
      if (typeof content.getElement === 'function') {
        itemWrapper.appendChild(content.getElement());
      } else if (content instanceof HTMLElement) {
        itemWrapper.appendChild(content);
      }
      
      return itemWrapper;
    };

    const render = () => {
      if (!state.container) return;

      state.container.innerHTML = '';
      state.itemElements = [];

      if (state.hasError) {
        state.container.appendChild(createErrorView(state.errorMessage));
        return;
      }

      if (state.data.length === 0) {
        if (state.emptyViewElement) {
          state.container.appendChild(state.emptyViewElement);
        } else {
          state.emptyViewElement = createEmptyView();
          state.container.appendChild(state.emptyViewElement);
        }
        
        // Hide toggle button when empty
        if (state.toggleButton) {
          state.toggleButton.style.display = 'none';
        }
        return;
      }

      state.data.forEach((item, index) => {
        const itemEl = renderItem(item, index);
        if (itemEl) {
          state.itemElements.push(itemEl);
          state.container.appendChild(itemEl);
          
          if (state.divider && index < state.data.length - 1) {
            state.container.appendChild(createDivider());
          }
        }
      });
      
      // Update collapsible state after rendering
      updateCollapsibleState();
    };

    const handleScroll = () => {
      if (state.isLoading || !state.hasMore || !state.onLoadMore) return;

      const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = state.element;
      
      let shouldLoad = false;
      if (state.orientation === 'vertical') {
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
        shouldLoad = distanceFromBottom <= state.loadMoreThreshold;
      } else {
        const distanceFromEnd = scrollWidth - (scrollLeft + clientWidth);
        shouldLoad = distanceFromEnd <= state.loadMoreThreshold;
      }

      if (shouldLoad) {
        instance.loadMore();
      }
    };

    const build = () => {
      state.element = document.createElement('div');
      state.element.className = `md-recyclerview ${state.orientation === 'horizontal' ? 'horizontal' : ''}`;
      
      const heightValue = typeof state.height === 'number' ? `${state.height}px` : state.height;
      state.element.style.height = heightValue;
      
      if (state.padding) {
        const paddingValue = typeof state.padding === 'number' ? `${state.padding}px` : state.padding;
        state.element.style.padding = paddingValue;
      }

      state.container = document.createElement('div');
      state.container.className = `md-recyclerview-container ${state.orientation === 'horizontal' ? 'horizontal' : ''}`;
      
      if (state.gap) {
        const gapValue = typeof state.gap === 'number' ? `${state.gap}px` : state.gap;
        state.container.style.gap = gapValue;
        if (state.orientation === 'vertical') {
          state.container.style.display = 'flex';
          state.container.style.flexDirection = 'column';
        }
      }

      state.element.appendChild(state.container);

      state.loadingElement = createLoadingView();
      state.element.appendChild(state.loadingElement);
      
      // Create toggle button if collapsible
      if (state.collapsible) {
        state.toggleButton = createToggleButton();
        state.element.appendChild(state.toggleButton);
      }

      if (state.onLoadMore) {
        state.element.addEventListener('scroll', handleScroll);
      }

      render();
    };

    const instance = {
      setData(newData) {
        state.data = newData || [];
        // Reset search when setting new data
        if (state.isSearchActive) {
          state.originalData = [...newData];
        }
        render();
        return this;
      },

      addData(items) {
        if (!Array.isArray(items)) items = [items];
        state.data.push(...items);
        if (state.originalData) {
          state.originalData.push(...items);
        }
        render();
        return this;
      },

      removeItem(index) {
        if (index >= 0 && index < state.data.length) {
          state.data.splice(index, 1);
          if (state.originalData) {
            state.originalData.splice(index, 1);
          }
          render();
        }
        return this;
      },

      updateItem(index, newItem) {
        if (index >= 0 && index < state.data.length) {
          state.data[index] = newItem;
          if (state.originalData) {
            state.originalData[index] = newItem;
          }
          render();
        }
        return this;
      },

      clear() {
        state.data = [];
        if (state.originalData) {
          state.originalData = [];
        }
        render();
        return this;
      },

      refresh() {
        render();
        return this;
      },

      getData() {
        return state.data;
      },

      getItemCount() {
        return state.data.length;
      },

      async loadMore() {
        if (state.isLoading || !state.hasMore || !state.onLoadMore) return;

        state.isLoading = true;
        state.loadingElement.style.display = 'flex';

        try {
          const result = await state.onLoadMore();
          
          if (result) {
            if (Array.isArray(result)) {
              this.addData(result);
            } else if (result.data && Array.isArray(result.data)) {
              this.addData(result.data);
              if (result.hasMore !== undefined) {
                state.hasMore = result.hasMore;
              }
            }
          }
        } catch (error) {
          console.error('Load more error:', error);
          state.hasError = true;
          state.errorMessage = error.message || 'Failed to load more items';
          render();
        } finally {
          state.isLoading = false;
          state.loadingElement.style.display = 'none';
        }

        return this;
      },

      setHasMore(hasMore) {
        state.hasMore = hasMore;
        return this;
      },

      scrollToPosition(index) {
        if (index >= 0 && index < state.itemElements.length) {
          const item = state.itemElements[index];
          if (state.orientation === 'horizontal') {
            item.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
          } else {
            item.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        return this;
      },

      scrollToTop() {
        if (state.orientation === 'horizontal') {
          state.element.scrollLeft = 0;
        } else {
          state.element.scrollTop = 0;
        }
        return this;
      },

      scrollToBottom() {
        if (state.orientation === 'horizontal') {
          state.element.scrollLeft = state.element.scrollWidth;
        } else {
          state.element.scrollTop = state.element.scrollHeight;
        }
        return this;
      },

      setAdapter(adapter) {
        state.adapter = adapter;
        render();
        return this;
      },

      setEmptyView(view) {
        state.emptyView = view;
        state.emptyViewElement = null;
        render();
        return this;
      },

      /**
       * Search/filter the RecyclerView data
       * @param {string} query - The search query
       * @param {string|string[]|function} fields - Field name(s) to search in, or custom filter function
       * @returns {RecyclerView} The RecyclerView instance for chaining
       * 
       * @example
       * // Search in a single field
       * recyclerView.search('john', 'name');
       * 
       * @example
       * // Search in multiple fields
       * recyclerView.search('developer', ['title', 'description', 'tags']);
       * 
       * @example
       * // Custom filter function
       * recyclerView.search('senior', (item, query) => {
       *   return item.level === 'senior' && item.title.includes(query);
       * });
       */
      search(query, fields = null) {
        // Save original data if this is the first search
        if (!state.originalData) {
          state.originalData = [...state.data];
        }
        
        state.searchQuery = query;
        state.searchFields = fields;
        state.isSearchActive = true;
        
        if (!query || query.trim() === '') {
          // Empty query, show all original data
          state.data = [...state.originalData];
          this.refresh();
          return this;
        }
        
        const lowerQuery = query.toLowerCase();
        
        // Filter the original data
        state.data = state.originalData.filter(item => {
          // Custom filter function
          if (typeof fields === 'function') {
            return fields(item, query);
          }
          
          // No fields specified, search in all string properties
          if (!fields) {
            return Object.values(item).some(value => {
              if (typeof value === 'string') {
                return value.toLowerCase().includes(lowerQuery);
              }
              if (typeof value === 'number') {
                return value.toString().includes(query);
              }
              return false;
            });
          }
          
          // Single field
          if (typeof fields === 'string') {
            const value = item[fields];
            if (typeof value === 'string') {
              return value.toLowerCase().includes(lowerQuery);
            }
            if (typeof value === 'number') {
              return value.toString().includes(query);
            }
            return false;
          }
          
          // Multiple fields
          if (Array.isArray(fields)) {
            return fields.some(field => {
              const value = item[field];
              if (typeof value === 'string') {
                return value.toLowerCase().includes(lowerQuery);
              }
              if (typeof value === 'number') {
                return value.toString().includes(query);
              }
              return false;
            });
          }
          
          return false;
        });
        
        this.refresh();
        return this;
      },

      /**
       * Stop searching and restore original data
       * @returns {RecyclerView} The RecyclerView instance for chaining
       * 
       * @example
       * recyclerView.stopSearch();
       */
      stopSearch() {
        if (state.originalData) {
          state.data = [...state.originalData];
          state.originalData = null;
        }
        
        state.isSearchActive = false;
        state.searchQuery = '';
        state.searchFields = null;
        
        this.refresh();
        return this;
      },

      /**
       * Check if search is currently active
       * @returns {boolean} True if search is active, false otherwise
       */
      isSearching() {
        return state.isSearchActive;
      },

      /**
       * Get the current search query
       * @returns {string} Current search query or empty string
       */
      getSearchQuery() {
        return state.searchQuery;
      },

      /**
       * Get the original unfiltered data
       * @returns {Array} Original data array or current data if not searching
       */
      getOriginalData() {
        return state.originalData || state.data;
      },

      /**
       * Expand the collapsible RecyclerView to show all items
       * @returns {RecyclerView} The RecyclerView instance for chaining
       */
      expand() {
        if (state.collapsible && !state.isExpanded) {
          state.isExpanded = true;
          updateCollapsibleState();
          
          // Update button appearance
          if (state.toggleButton) {
            const text = state.toggleButton.querySelector('span');
            const icon = state.toggleButton.querySelector('i');
            state.toggleButton.className = 'md-recyclerview-toggle-btn expanded';
            if (text) text.textContent = state.showLessText;
            if (icon) icon.className = state.showLessIcon;
          }
          
          if (state.onToggle) {
            state.onToggle(true);
          }
        }
        return this;
      },

      /**
       * Collapse the collapsible RecyclerView to show only initial items
       * @returns {RecyclerView} The RecyclerView instance for chaining
       */
      collapse() {
        if (state.collapsible && state.isExpanded) {
          state.isExpanded = false;
          updateCollapsibleState();
          
          // Update button appearance
          if (state.toggleButton) {
            const text = state.toggleButton.querySelector('span');
            const icon = state.toggleButton.querySelector('i');
            state.toggleButton.className = 'md-recyclerview-toggle-btn';
            if (text) text.textContent = state.showMoreText;
            if (icon) icon.className = state.showMoreIcon;
          }
          
          if (state.onToggle) {
            state.onToggle(false);
          }
        }
        return this;
      },

      /**
       * Toggle between expanded and collapsed states
       * @returns {RecyclerView} The RecyclerView instance for chaining
       */
      toggle() {
        if (state.isExpanded) {
          this.collapse();
        } else {
          this.expand();
        }
        return this;
      },

      /**
       * Check if the RecyclerView is currently expanded
       * @returns {boolean} True if expanded, false otherwise
       */
      isExpanded() {
        return state.isExpanded;
      },

      /**
       * Set the number of items to show when collapsed
       * @param {number} count - Number of items to show initially
       * @returns {RecyclerView} The RecyclerView instance for chaining
       */
      setInitialItemsCount(count) {
        state.initialItemsCount = count;
        updateCollapsibleState();
        return this;
      },

      /**
       * Enable or disable collapsible functionality
       * @param {boolean} enabled - Whether to enable collapsible
       * @returns {RecyclerView} The RecyclerView instance for chaining
       */
      setCollapsible(enabled) {
        state.collapsible = enabled;
        
        if (enabled && !state.toggleButton) {
          state.toggleButton = createToggleButton();
          state.element.appendChild(state.toggleButton);
        } else if (!enabled && state.toggleButton) {
          state.toggleButton.remove();
          state.toggleButton = null;
          // Show all items when disabling collapsible
          state.itemElements.forEach(itemEl => {
            itemEl.classList.remove('collapsed-hidden');
          });
        }
        
        updateCollapsibleState();
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
  // Enhanced ScrollView with Load More
  // ==========================================
  const EnhancedScrollView = (props = {}) => {
    const {
      orientation = 'vertical',
      padding,
      margin,
      background,
      width = 'match_parent',
      height = 'match_parent',
      id,
      className,
      onLoadMore = null,
      loadMoreThreshold = 200,
      hasMore = true,
      showLoadingIndicator = true
    } = props;

    const state = {
      children: props.children || [],
      isLoading: false,
      hasMore: hasMore,
      onLoadMore: onLoadMore,
      element: null,
      contentContainer: null,
      loadingElement: null
    };

    const createLoadingIndicator = () => {
      const loading = document.createElement('div');
      loading.className = 'md-recyclerview-loading';
      loading.style.display = 'none';
      
      const spinner = document.createElement('div');
      spinner.className = 'md-recyclerview-loading-spinner';
      loading.appendChild(spinner);
      
      return loading;
    };

    const handleScroll = () => {
      if (state.isLoading || !state.hasMore || !state.onLoadMore) return;

      const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = state.element;
      
      let shouldLoad = false;
      if (orientation === 'vertical') {
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
        shouldLoad = distanceFromBottom <= loadMoreThreshold;
      } else {
        const distanceFromEnd = scrollWidth - (scrollLeft + clientWidth);
        shouldLoad = distanceFromEnd <= loadMoreThreshold;
      }

      if (shouldLoad) {
        loadMore();
      }
    };

    const loadMore = async () => {
      if (state.isLoading || !state.hasMore || !state.onLoadMore) return;

      state.isLoading = true;
      if (showLoadingIndicator && state.loadingElement) {
        state.loadingElement.style.display = 'flex';
      }

      try {
        const result = await state.onLoadMore();
        
        if (result) {
          if (result.children && Array.isArray(result.children)) {
            result.children.forEach(child => {
              if (child && typeof child.getElement === 'function') {
                state.contentContainer.appendChild(child.getElement());
              } else if (child instanceof HTMLElement) {
                state.contentContainer.appendChild(child);
              }
            });
          }
          
          if (result.hasMore !== undefined) {
            state.hasMore = result.hasMore;
          }
        }
      } catch (error) {
        console.error('Load more error:', error);
      } finally {
        state.isLoading = false;
        if (state.loadingElement) {
          state.loadingElement.style.display = 'none';
        }
      }
    };

    const build = () => {
      state.element = document.createElement('div');
      const styles = {
        overflowX: orientation === 'horizontal' ? 'auto' : 'hidden',
        overflowY: orientation === 'vertical' ? 'auto' : 'hidden',
        boxSizing: 'border-box',
        position: 'relative'
      };

      if (width === 'match_parent') styles.width = '100%';
      else if (width) styles.width = typeof width === 'number' ? `${width}px` : width;

      if (height === 'match_parent') styles.height = '100%';
      else if (height) styles.height = typeof height === 'number' ? `${height}px` : height;

      if (padding) {
        styles.padding = typeof padding === 'number' ? `${padding}px` : padding;
      }
      if (margin) styles.margin = typeof margin === 'number' ? `${margin}px` : margin;
      if (background) styles.background = background;

      Object.assign(state.element.style, styles);

      if (id) state.element.id = id;
      if (className) state.element.className = className;

      state.contentContainer = document.createElement('div');
      state.children.forEach(child => {
        if (child && typeof child.getElement === 'function') {
          state.contentContainer.appendChild(child.getElement());
        } else if (child instanceof HTMLElement) {
          state.contentContainer.appendChild(child);
        }
      });
      state.element.appendChild(state.contentContainer);

      if (onLoadMore && showLoadingIndicator) {
        state.loadingElement = createLoadingIndicator();
        state.element.appendChild(state.loadingElement);
      }

      if (onLoadMore) {
        state.element.addEventListener('scroll', handleScroll);
      }
    };

    build();

    return {
      getElement: () => state.element,
      scrollTo: (x, y) => state.element.scrollTo(x, y),
      scrollToTop: () => { 
        if (orientation === 'horizontal') {
          state.element.scrollLeft = 0;
        } else {
          state.element.scrollTop = 0;
        }
      },
      scrollToBottom: () => { 
        if (orientation === 'horizontal') {
          state.element.scrollLeft = state.element.scrollWidth;
        } else {
          state.element.scrollTop = state.element.scrollHeight;
        }
      },
      addChild: (child) => {
        const el = child && typeof child.getElement === 'function' ? child.getElement() : child;
        state.contentContainer.appendChild(el);
      },
      setHasMore: (hasMore) => { state.hasMore = hasMore; },
      loadMore: () => loadMore()
    };
  };

  // ==========================================
  // Extend AndroidComponents and AndroidLayouts
  // ==========================================
  if (window.AndroidComponents) {
    window.AndroidComponents.RecyclerView = RecyclerView;
  } else {
    window.AndroidComponents = { RecyclerView };
  }

  if (window.AndroidLayouts) {
    window.AndroidLayouts.EnhancedScrollView = EnhancedScrollView;
  }
})();
