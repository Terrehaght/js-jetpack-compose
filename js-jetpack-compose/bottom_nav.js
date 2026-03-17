// ============================================
// AndroidComponents Bottom Navigation - FIXED TO MATCH OLD
// Requires: components1.js to be loaded first
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
  // Bottom Navigation Styles - MATCHING OLD DIMENSIONS
  // ==========================================
  const BOTTOM_NAV_STYLES = `
    .md-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
      background: var(--md-surface-container, #FEF7FF);
      border-top: 1px solid var(--md-outline-variant, #CAC4D0);
      height: 65px;
      width: 100%;
      display: flex;
      align-items: stretch;
      justify-content: space-around;
      padding: 0;
      box-shadow: none;
    }

    .md-bottom-nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      
      position: relative;
      transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
      -webkit-tap-highlight-color: transparent;
      margin: 7px 0;
      padding: 0;
    }

    .md-bottom-nav-item-icon-container {
      width: 55px;
      height: 50%;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border-radius: 16px;
      transition: background 0.2s cubic-bezier(0.2, 0, 0, 1);
    }

    .md-bottom-nav-item.md-selected .md-bottom-nav-item-icon-container {
      background: rgba(138, 121, 36, 0.2);
    }

    .md-bottom-nav-item-icon {
      font-size: 26px;
      color: #000;
      transition: color 0.2s ease;
      margin: 3px 0;
      height: 100%;
      width: 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .md-bottom-nav-item.md-selected .md-bottom-nav-item-icon {
      color: #000;
    }

    .md-bottom-nav-item-label {
      height: 50%;
      width: 100%;
      font-size: 12px;
      font-weight: normal;
      color: #000;
      transition: all 0.2s ease;
      text-align: center;
      padding: 3px 0 0;
      margin: 0;
      line-height: normal;
      white-space: nowrap;
    }

    .md-bottom-nav-item.md-selected .md-bottom-nav-item-label {
      font-weight: bold;
      color: #000;
    }

    .md-bottom-nav-item:active {
      transform: scale(0.95);
    }

    .md-bottom-nav-badge {
      position: absolute;
      top: 4px;
      right: calc(50% - 24px);
      background: var(--md-error, #BA1A1A);
      color: var(--md-on-error, #FFFFFF);
      border-radius: 8px;
      min-width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 500;
      padding: 0 4px;
      z-index: 2;
    }
  `;

  // ==========================================
  // BottomNavigation
  // ==========================================
  const BottomNavigation = (props = {}) => {
    _injectStyles('bottom-nav', BOTTOM_NAV_STYLES);

    const state = {
      items: [],
      selectedId: null,
      container: null,
      element: null,
      onItemSelect: props.onItemSelect || null,
      itemColor: props.itemColor || '#000',
      background: props.background || '#FEF7FF',
      lineColor: props.lineColor || '#CAC4D0'
    };

    const createNavItem = (item) => {
      const navItem = document.createElement('div');
      navItem.className = 'md-bottom-nav-item';
      navItem.setAttribute('data-id', item.id);

      // Icon container (replaces indicator - matches old selected div)
      const iconContainer = document.createElement('div');
      iconContainer.className = 'md-bottom-nav-item-icon-container';
      navItem.appendChild(iconContainer);

      // Icon
      const icon = document.createElement('i');
      icon.className = `md-bottom-nav-item-icon bx ${item.icon}`;
      iconContainer.appendChild(icon);

      // Label
      const label = document.createElement('p');
      label.className = 'md-bottom-nav-item-label';
      label.textContent = item.name;
      navItem.appendChild(label);

      // Badge (if exists)
      if (item.badge) {
        const badge = document.createElement('span');
        badge.className = 'md-bottom-nav-badge';
        badge.textContent = item.badge;
        navItem.appendChild(badge);
      }

      navItem.addEventListener('click', () => {
        instance.selectItem(item.id);
      });

      return navItem;
    };

    const updateIcon = (itemElement, selected) => {
      const icon = itemElement.querySelector('.md-bottom-nav-item-icon');
      const currentClasses = icon.className.split(' ');
      const iconClass = currentClasses.find(cls => cls.startsWith('bx-') || cls.startsWith('bxs-'));
      
      if (iconClass) {
        icon.classList.remove(iconClass);
        if (selected) {
          const solidIcon = iconClass.replace('bx-', 'bxs-');
          icon.classList.add(solidIcon);
        } else {
          const outlineIcon = iconClass.replace('bxs-', 'bx-');
          icon.classList.add(outlineIcon);
        }
      }
    };

    const build = () => {
      state.element = document.createElement('div');
      state.element.className = 'md-bottom-nav';

      if (state.background) {
        state.element.style.background = state.background;
      }

      if (state.lineColor) {
        state.element.style.borderTopColor = state.lineColor;
      }

      state.items.forEach(item => {
        const navItem = createNavItem(item);
        state.element.appendChild(navItem);
      });

      if (state.container) {
        if (typeof state.container === 'string') {
          const containerEl = document.querySelector(state.container);
          if (containerEl) containerEl.appendChild(state.element);
        } else {
          state.container.appendChild(state.element);
        }
      } else {
        document.body.appendChild(state.element);
      }

      // Apply custom item color if specified
      if (state.itemColor && state.itemColor !== '#000') {
        const style = document.createElement('style');
        style.textContent = `
          .md-bottom-nav-item.md-selected .md-bottom-nav-item-icon-container {
            background: ${hexToRgbA(state.itemColor)} !important;
          }
          .md-bottom-nav-item.md-selected .md-bottom-nav-item-icon {
            color: ${state.itemColor} !important;
          }
          .md-bottom-nav-item.md-selected .md-bottom-nav-item-label {
            color: ${state.itemColor} !important;
          }
        `;
        document.head.appendChild(style);
      }

      // Select first item by default if none selected
      if (!state.selectedId && state.items.length > 0) {
        instance.selectItem(state.items[0].id);
      }
    };

    const hexToRgbA = (hex) => {
      let c;
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.2)';
      }
      return 'rgba(138, 121, 36, 0.2)';
    };

    const instance = {
      setContainer(container) {
        state.container = container;
        return this;
      },

      setItems(items) {
        state.items = items.map(item => ({
          id: item.id,
          name: item.name,
          icon: item.icon,
          badge: item.badge || null
        }));
        return this;
      },

      addItem(item) {
        state.items.push({
          id: item.id,
          name: item.name,
          icon: item.icon,
          badge: item.badge || null
        });
        
        if (state.element) {
          const navItem = createNavItem(item);
          state.element.appendChild(navItem);
        }
        
        return this;
      },

      setItemColor(color) {
        state.itemColor = color;
        return this;
      },

      setBackground(color) {
        state.background = color;
        if (state.element) state.element.style.background = color;
        return this;
      },

      setLineColor(color) {
        state.lineColor = color;
        if (state.element) state.element.style.borderTopColor = color;
        return this;
      },

      setOnItemSelect(callback) {
        state.onItemSelect = callback;
        return this;
      },

      selectItem(id) {
        if (!state.element) return this;

        const previousSelected = state.element.querySelector('.md-bottom-nav-item.md-selected');
        if (previousSelected) {
          previousSelected.classList.remove('md-selected');
          updateIcon(previousSelected, false);
        }

        const newSelected = state.element.querySelector(`[data-id="${id}"]`);
        if (newSelected) {
          newSelected.classList.add('md-selected');
          updateIcon(newSelected, true);
          state.selectedId = id;

          if (state.onItemSelect) {
            state.onItemSelect(id);
          }
        }

        return this;
      },

      setBadge(itemId, badge) {
        if (!state.element) return this;

        const item = state.element.querySelector(`[data-id="${itemId}"]`);
        if (!item) return this;

        let badgeEl = item.querySelector('.md-bottom-nav-badge');
        
        if (badge) {
          if (!badgeEl) {
            badgeEl = document.createElement('span');
            badgeEl.className = 'md-bottom-nav-badge';
            item.appendChild(badgeEl);
          }
          badgeEl.textContent = badge;
        } else if (badgeEl) {
          badgeEl.remove();
        }

        return this;
      },

      getSelectedId() {
        return state.selectedId;
      },

      show() {
        if (!state.element) build();
        return this;
      },

      hide() {
        if (state.element) {
          state.element.style.display = 'none';
        }
        return this;
      },

      destroy() {
        if (state.element?.parentNode) {
          state.element.parentNode.removeChild(state.element);
        }
        state.element = null;
      },

      getElement() {
        return state.element;
      }
    };

    return instance;
  };

  // ==========================================
  // Extend AndroidComponents with bottom navigation
  // ==========================================
  if (window.AndroidComponents) {
    window.AndroidComponents.BottomNavigation = BottomNavigation;
  } else {
    window.AndroidComponents = { BottomNavigation };
  }
})();