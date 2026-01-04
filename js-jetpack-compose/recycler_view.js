// ============================================
// AndroidComponents RecyclerView & Enhanced ScrollView
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
  // RecyclerView Styles
  // ==========================================
  const RECYCLERVIEW_STYLES = `
    .md-recyclerview {
      overflow-y: auto; overflow-x: hidden;
      position: relative; width: 100%;
      -webkit-overflow-scrolling: touch;
    }
    .md-recyclerview-container {
      position: relative;
    }
    .md-recyclerview-item {
      position: relative;
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
      height: 1px; background: var(--md-outline-variant, #CAC4D0);
      margin: 0;
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
  `;

  // ==========================================
  // RecyclerView Component
  // ==========================================
  const RecyclerView = (props = {}) => {
    _injectStyles('recyclerview', RECYCLERVIEW_STYLES);

    const state = {
      data: props.data || [],
      adapter: props.adapter || null, // function(item, index) => returns element or layout
      layoutManager: props.layoutManager || 'linear', // 'linear' | 'grid'
      gridColumns: props.gridColumns || 2,
      divider: props.divider || false,
      onLoadMore: props.onLoadMore || null,
      loadMoreThreshold: props.loadMoreThreshold || 200, // px from bottom
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
      itemElements: []
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
      text.textContent = state.emptyText;
      empty.appendChild(text);
      
      if (state.emptySubtext) {
        const subtext = document.createElement('div');
        subtext.className = 'md-recyclerview-empty-subtext';
        subtext.textContent = state.emptySubtext;
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

    const renderItem = (item, index) => {
      if (!state.adapter) return null;

      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'md-recyclerview-item';
      
      const content = state.adapter(item, index);
      
      if (typeof content.getElement === 'function') {
        itemWrapper.appendChild(content.getElement());
      } else if (content instanceof HTMLElement) {
        itemWrapper.appendChild(content);
      }
      
      return itemWrapper;
    };

    const renderItems = () => {
      state.container.innerHTML = '';
      state.itemElements = [];

      if (state.data.length === 0 && !state.isLoading) {
        state.container.appendChild(createEmptyView());
        return;
      }

      if (state.layoutManager === 'grid') {
        state.container.style.display = 'grid';
        state.container.style.gridTemplateColumns = `repeat(${state.gridColumns}, 1fr)`;
        state.container.style.gap = `${state.gap}px`;
      } else {
        state.container.style.display = 'flex';
        state.container.style.flexDirection = 'column';
        state.container.style.gap = `${state.gap}px`;
      }

      state.data.forEach((item, index) => {
        const itemEl = renderItem(item, index);
        if (itemEl) {
          state.itemElements.push(itemEl);
          state.container.appendChild(itemEl);

          // Add divider if needed (only for linear layout)
          if (state.divider && state.layoutManager === 'linear' && index < state.data.length - 1) {
            const divider = document.createElement('div');
            divider.className = 'md-recyclerview-divider';
            state.container.appendChild(divider);
          }
        }
      });
    };

    const handleScroll = () => {
      if (state.isLoading || !state.hasMore || !state.onLoadMore) return;

      const { scrollTop, scrollHeight, clientHeight } = state.element;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom <= state.loadMoreThreshold) {
        instance.loadMore();
      }
    };

    const build = () => {
      state.element = document.createElement('div');
      state.element.className = 'md-recyclerview';
      
      if (state.height !== 'auto') {
        state.element.style.height = typeof state.height === 'number' ? `${state.height}px` : state.height;
      }
      
      if (state.padding) {
        const p = typeof state.padding === 'number' ? `${state.padding}px` : state.padding;
        state.element.style.padding = p;
      }

      state.container = document.createElement('div');
      state.container.className = 'md-recyclerview-container';
      state.element.appendChild(state.container);

      state.loadingElement = createLoadingView();
      state.element.appendChild(state.loadingElement);

      renderItems();

      // Add scroll listener for infinite scroll
      state.element.addEventListener('scroll', handleScroll);
    };

    const instance = {
      setData(data) {
        state.data = data;
        renderItems();
        return this;
      },
      addData(newData) {
        state.data = state.data.concat(newData);
        renderItems();
        return this;
      },
      addItem(item) {
        state.data.push(item);
        const itemEl = renderItem(item, state.data.length - 1);
        if (itemEl) {
          state.itemElements.push(itemEl);
          state.container.appendChild(itemEl);
        }
        return this;
      },
      removeItem(index) {
        if (index >= 0 && index < state.data.length) {
          state.data.splice(index, 1);
          renderItems();
        }
        return this;
      },
      updateItem(index, newData) {
        if (index >= 0 && index < state.data.length) {
          state.data[index] = newData;
          renderItems();
        }
        return this;
      },
      clear() {
        state.data = [];
        renderItems();
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
          const result = await state.onLoadMore(state.data.length);
          
          if (result) {
            if (result.data && Array.isArray(result.data)) {
              instance.addData(result.data);
            }
            
            if (result.hasMore !== undefined) {
              state.hasMore = result.hasMore;
            }
          }
        } catch (error) {
          console.error('Load more error:', error);
          state.hasError = true;
          state.errorMessage = error.message || 'Failed to load more data';
          state.container.appendChild(createErrorView(state.errorMessage));
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
      isLoading() {
        return state.isLoading;
      },
      scrollToTop() {
        state.element.scrollTop = 0;
        return this;
      },
      scrollToBottom() {
        state.element.scrollTop = state.element.scrollHeight;
        return this;
      },
      scrollToIndex(index) {
        if (index >= 0 && index < state.itemElements.length) {
          const item = state.itemElements[index];
          item.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return this;
      },
      refresh() {
        renderItems();
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

      // Create content container
      state.contentContainer = document.createElement('div');
      state.children.forEach(child => {
        if (child && typeof child.getElement === 'function') {
          state.contentContainer.appendChild(child.getElement());
        } else if (child instanceof HTMLElement) {
          state.contentContainer.appendChild(child);
        }
      });
      state.element.appendChild(state.contentContainer);

      // Add loading indicator if load more is enabled
      if (onLoadMore && showLoadingIndicator) {
        state.loadingElement = createLoadingIndicator();
        state.element.appendChild(state.loadingElement);
      }

      // Add scroll listener
      if (onLoadMore) {
        state.element.addEventListener('scroll', handleScroll);
      }
    };

    build();

    return {
      getElement: () => state.element,
      scrollTo: (x, y) => state.element.scrollTo(x, y),
      scrollToTop: () => { state.element.scrollTop = 0; },
      scrollToBottom: () => { state.element.scrollTop = state.element.scrollHeight; },
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