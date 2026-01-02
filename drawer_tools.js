// ============================================
// AndroidComponents Navigation Components (Drawer & Toolbar)
// Requires: components1.js and AndroidLayouts to be loaded first
// ============================================
(function() {
  const { injectStyles, injectedStyles } = window.AndroidComponents?.utils || {};
  const { Column } = window.AndroidLayouts || {};
  
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
  // MaterialToolbar Styles
  // ==========================================
  const TOOLBAR_STYLES = `
    .md-toolbar {
      display: flex; align-items: center; padding: 0 4px;
      background: var(--md-primary, #6750A4);
      color: var(--md-on-primary, #FFFFFF);
      min-height: 56px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: relative; z-index: 1000;
    }
    .md-toolbar-nav-icon {
      background: transparent; border: none; color: inherit;
      width: 48px; height: 48px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background-color 0.2s;
      font-size: 1.5rem; margin: 0 4px;
    }
    .md-toolbar-nav-icon:hover { background: rgba(255, 255, 255, 0.08); }
    .md-toolbar-title {
      flex: 1; font-size: 1.25rem; font-weight: 500;
      margin: 0 16px; overflow: hidden; text-overflow: ellipsis;
      white-space: nowrap;
    }
    .md-toolbar-actions {
      display: flex; align-items: center; gap: 4px;
      margin-right: 8px;
    }
    .md-toolbar-action-btn {
      background: transparent; border: none; color: inherit;
      width: 48px; height: 48px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: background-color 0.2s;
      font-size: 1.5rem; position: relative;
    }
    .md-toolbar-action-btn:hover { background: rgba(255, 255, 255, 0.08); }
    .md-toolbar-action-badge {
      position: absolute; top: 8px; right: 8px;
      background: var(--md-error, #B3261E);
      color: var(--md-on-error, #FFFFFF);
      border-radius: 10px; min-width: 20px; height: 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 500; padding: 0 4px;
    }
    .md-toolbar-overflow {
      position: relative;
    }
    .md-toolbar-overflow-menu {
      position: absolute; top: 100%; right: 0;
      background: var(--md-surface-container, #F3EDF7);
      border-radius: 4px; min-width: 180px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.15);
      opacity: 0; visibility: hidden; transform: scale(0.9) translateY(-8px);
      transform-origin: top right;
      transition: opacity 150ms ease-out, visibility 150ms ease-out, transform 200ms cubic-bezier(0.2, 0, 0, 1);
      z-index: 1001; margin-top: 8px;
    }
    .md-toolbar-overflow-menu.md-visible {
      opacity: 1; visibility: visible; transform: scale(1) translateY(0);
    }
    .md-toolbar-overflow-item {
      padding: 12px 16px; cursor: pointer;
      color: var(--md-on-surface, #1C1B1F);
      font-size: 0.875rem; display: flex; align-items: center;
      gap: 12px; transition: background-color 0.2s;
      border: none; background: transparent; width: 100%;
      text-align: left; font-family: inherit;
    }
    .md-toolbar-overflow-item:hover { background: rgba(103, 80, 164, 0.08); }
    .md-toolbar-overflow-item i { font-size: 1.25rem; color: var(--md-on-surface-variant); }
  `;

  // ==========================================
  // MaterialDrawer Styles
  // ==========================================
  const DRAWER_STYLES = `
    .md-drawer-scrim {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.32); z-index: 1100;
      opacity: 0; visibility: hidden;
      transition: opacity 200ms ease-out, visibility 200ms ease-out;
    }
    .md-drawer-scrim.md-visible { opacity: 1; visibility: visible; }
    .md-drawer-container {
      position: fixed; top: 0; bottom: 0; left: 0;
      background: var(--md-surface-container-low, #F7F2FA);
      width: 280px; max-width: 80vw; z-index: 1101;
      display: flex; flex-direction: column;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.14);
      transform: translateX(-100%);
      transition: transform 250ms cubic-bezier(0.2, 0, 0, 1);
    }
    .md-drawer-container.md-visible { transform: translateX(0); }
    .md-drawer-container.md-full-width {
      width: 100%; max-width: 100%;
    }
    .md-drawer-container.md-right {
      left: auto; right: 0; transform: translateX(100%);
    }
    .md-drawer-container.md-right.md-visible { transform: translateX(0); }
    .md-drawer-header {
      padding: 16px; min-height: 64px;
      background: var(--md-primary-container, #EADDFF);
      color: var(--md-on-primary-container, #21005E);
      display: flex; flex-direction: column; justify-content: center;
    }
    .md-drawer-header-title {
      font-size: 1.25rem; font-weight: 500; margin: 0;
    }
    .md-drawer-header-subtitle {
      font-size: 0.875rem; opacity: 0.7; margin: 4px 0 0;
    }
    .md-drawer-content {
      flex: 1; overflow-y: auto; overflow-x: hidden;
    }
    .md-drawer-section {
      padding: 8px 0;
    }
    .md-drawer-section-title {
      padding: 12px 28px 8px;
      font-size: 0.6875rem; font-weight: 500;
      color: var(--md-on-surface-variant, #49454F);
      letter-spacing: 0.5px; text-transform: uppercase;
    }
    .md-drawer-divider {
      height: 1px; background: var(--md-outline-variant, #CAC4D0);
      margin: 8px 28px;
    }
    .md-drawer-item {
      display: flex; align-items: center; padding: 12px 16px 12px 28px;
      cursor: pointer; transition: background-color 0.2s;
      color: var(--md-on-surface-variant, #49454F);
      text-decoration: none; position: relative;
      border: none; background: transparent;
      width: 100%; text-align: left; font-family: inherit;
      font-size: 0.875rem; gap: 12px;
    }
    .md-drawer-item:hover { background: rgba(103, 80, 164, 0.08); }
    .md-drawer-item.md-active {
      background: var(--md-secondary-container, #E8DEF8);
      color: var(--md-on-secondary-container, #1D192B);
    }
    .md-drawer-item.md-active::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0;
      width: 3px; background: var(--md-primary, #6750A4);
    }
    .md-drawer-item-icon {
      font-size: 1.5rem; display: flex; align-items: center;
      justify-content: center; min-width: 24px;
    }
    .md-drawer-item.md-active .md-drawer-item-icon {
      color: var(--md-on-secondary-container, #1D192B);
    }
    .md-drawer-item-text {
      flex: 1; font-weight: 500;
    }
    .md-drawer-item-badge {
      background: var(--md-error, #B3261E);
      color: var(--md-on-error, #FFFFFF);
      border-radius: 10px; min-width: 20px; height: 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 500; padding: 0 6px;
    }
    .md-drawer-custom-layout {
      padding: 0;
    }
    .md-drawer-footer {
      padding: 16px; border-top: 1px solid var(--md-outline-variant, #CAC4D0);
      background: var(--md-surface, #FFFBFE);
    }
  `;

  // ==========================================
  // MaterialToolbar
  // ==========================================
  const MaterialToolbar = (props = {}) => {
    _injectStyles('toolbar', TOOLBAR_STYLES);

    const state = {
      title: props.title || '',
      navigationIcon: props.navigationIcon || null,
      onNavigationClick: props.onNavigationClick || null,
      actions: props.actions || [],
      overflowMenu: props.overflowMenu || [],
      background: props.background || null,
      color: props.color || null,
      elevation: props.elevation !== false,
      element: null,
      overflowMenuElement: null,
      overflowVisible: false
    };

    const createActionButton = (action) => {
      const btn = document.createElement('button');
      btn.className = 'md-toolbar-action-btn';
      btn.setAttribute('aria-label', action.label || action.text);
      
      if (action.icon) {
        btn.innerHTML = `<i class="${action.icon}"></i>`;
      } else if (action.text) {
        btn.textContent = action.text;
      }

      if (action.badge) {
        const badge = document.createElement('span');
        badge.className = 'md-toolbar-action-badge';
        badge.textContent = action.badge;
        btn.appendChild(badge);
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (action.onClick) action.onClick();
      });

      return btn;
    };

    const createOverflowMenu = () => {
      if (state.overflowMenu.length === 0) return null;

      const container = document.createElement('div');
      container.className = 'md-toolbar-overflow';

      const btn = document.createElement('button');
      btn.className = 'md-toolbar-action-btn';
      btn.setAttribute('aria-label', 'More options');
      btn.innerHTML = '<i class="bx bx-dots-vertical-rounded"></i>';

      const menu = document.createElement('div');
      menu.className = 'md-toolbar-overflow-menu';

      state.overflowMenu.forEach(item => {
        const menuItem = document.createElement('button');
        menuItem.className = 'md-toolbar-overflow-item';
        
        if (item.icon) {
          menuItem.innerHTML = `<i class="${item.icon}"></i>`;
        }
        
        const text = document.createElement('span');
        text.textContent = item.text;
        menuItem.appendChild(text);

        menuItem.addEventListener('click', (e) => {
          e.stopPropagation();
          instance.hideOverflowMenu();
          if (item.onClick) item.onClick();
        });

        menu.appendChild(menuItem);
      });

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        instance.toggleOverflowMenu();
      });

      container.appendChild(btn);
      container.appendChild(menu);
      state.overflowMenuElement = menu;

      // Close menu when clicking outside
      document.addEventListener('click', () => {
        if (state.overflowVisible) instance.hideOverflowMenu();
      });

      return container;
    };

    const build = () => {
      state.element = document.createElement('div');
      state.element.className = 'md-toolbar';
      state.element.setAttribute('role', 'banner');

      if (state.background) state.element.style.background = state.background;
      if (state.color) state.element.style.color = state.color;
      if (!state.elevation) state.element.style.boxShadow = 'none';

      // Navigation icon
      if (state.navigationIcon) {
        const navBtn = document.createElement('button');
        navBtn.className = 'md-toolbar-nav-icon';
        navBtn.setAttribute('aria-label', 'Navigation');
        navBtn.innerHTML = `<i class="${state.navigationIcon}"></i>`;
        navBtn.addEventListener('click', () => {
          if (state.onNavigationClick) state.onNavigationClick();
        });
        state.element.appendChild(navBtn);
      }

      // Title
      const titleEl = document.createElement('h1');
      titleEl.className = 'md-toolbar-title';
      titleEl.textContent = state.title;
      state.element.appendChild(titleEl);

      // Actions
      if (state.actions.length > 0 || state.overflowMenu.length > 0) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'md-toolbar-actions';

        state.actions.forEach(action => {
          actionsContainer.appendChild(createActionButton(action));
        });

        const overflow = createOverflowMenu();
        if (overflow) actionsContainer.appendChild(overflow);

        state.element.appendChild(actionsContainer);
      }
    };

    const instance = {
      setTitle(title) {
        state.title = title;
        if (state.element) {
          const titleEl = state.element.querySelector('.md-toolbar-title');
          if (titleEl) titleEl.textContent = title;
        }
        return this;
      },
      addAction(action) {
        state.actions.push(action);
        if (state.element) {
          const actionsContainer = state.element.querySelector('.md-toolbar-actions');
          if (actionsContainer) {
            const overflow = actionsContainer.querySelector('.md-toolbar-overflow');
            const btn = createActionButton(action);
            if (overflow) {
              actionsContainer.insertBefore(btn, overflow);
            } else {
              actionsContainer.appendChild(btn);
            }
          }
        }
        return this;
      },
      toggleOverflowMenu() {
        if (!state.overflowMenuElement) return;
        state.overflowVisible = !state.overflowVisible;
        state.overflowMenuElement.classList.toggle('md-visible', state.overflowVisible);
      },
      hideOverflowMenu() {
        if (!state.overflowMenuElement) return;
        state.overflowVisible = false;
        state.overflowMenuElement.classList.remove('md-visible');
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
  // MaterialDrawer
  // ==========================================
  const MaterialDrawer = (props = {}) => {
    _injectStyles('drawer', DRAWER_STYLES);

    const state = {
      position: props.position || 'left',
      fullWidth: props.fullWidth || false,
      header: props.header || null,
      footer: props.footer || null,
      items: props.items || [],
      onItemClick: props.onItemClick || null,
      dismissOnItemClick: props.dismissOnItemClick !== false,
      dismissOnScrim: props.dismissOnScrim !== false,
      scrim: null,
      container: null,
      contentElement: null,
      isOpen: false,
      activeItemId: null
    };

    const createMenuItem = (item) => {
      const itemEl = document.createElement('button');
      itemEl.className = 'md-drawer-item';
      itemEl.setAttribute('role', 'menuitem');
      
      if (item.id === state.activeItemId) {
        itemEl.classList.add('md-active');
      }

      if (item.icon) {
        const icon = document.createElement('span');
        icon.className = 'md-drawer-item-icon';
        icon.innerHTML = `<i class="${item.icon}"></i>`;
        itemEl.appendChild(icon);
      }

      const text = document.createElement('span');
      text.className = 'md-drawer-item-text';
      text.textContent = item.text;
      itemEl.appendChild(text);

      if (item.badge) {
        const badge = document.createElement('span');
        badge.className = 'md-drawer-item-badge';
        badge.textContent = item.badge;
        itemEl.appendChild(badge);
      }

      itemEl.addEventListener('click', () => {
        if (item.onClick) item.onClick(item.id);
        if (state.onItemClick) state.onItemClick(item.id);
        instance.setActiveItem(item.id);
        if (state.dismissOnItemClick) instance.close();
      });

      return itemEl;
    };

    const renderContent = () => {
      state.contentElement.innerHTML = '';

      state.items.forEach(item => {
        if (item.type === 'divider') {
          const divider = document.createElement('div');
          divider.className = 'md-drawer-divider';
          state.contentElement.appendChild(divider);
        } else if (item.type === 'section') {
          const section = document.createElement('div');
          section.className = 'md-drawer-section';
          
          if (item.title) {
            const title = document.createElement('div');
            title.className = 'md-drawer-section-title';
            title.textContent = item.title;
            section.appendChild(title);
          }

          if (item.items) {
            item.items.forEach(subItem => {
              if (subItem.type === 'layout' && subItem.layout) {
                const layoutContainer = document.createElement('div');
                layoutContainer.className = 'md-drawer-custom-layout';
                
                if (typeof subItem.layout.getElement === 'function') {
                  layoutContainer.appendChild(subItem.layout.getElement());
                } else if (subItem.layout instanceof HTMLElement) {
                  layoutContainer.appendChild(subItem.layout);
                }
                
                section.appendChild(layoutContainer);
              } else {
                section.appendChild(createMenuItem(subItem));
              }
            });
          }

          state.contentElement.appendChild(section);
        } else if (item.type === 'layout') {
          const layoutContainer = document.createElement('div');
          layoutContainer.className = 'md-drawer-custom-layout';
          
          if (typeof item.layout.getElement === 'function') {
            layoutContainer.appendChild(item.layout.getElement());
          } else if (item.layout instanceof HTMLElement) {
            layoutContainer.appendChild(item.layout);
          }
          
          state.contentElement.appendChild(layoutContainer);
        } else {
          state.contentElement.appendChild(createMenuItem(item));
        }
      });
    };

    const build = () => {
      // Scrim
      state.scrim = document.createElement('div');
      state.scrim.className = 'md-drawer-scrim';
      
      if (state.dismissOnScrim) {
        state.scrim.addEventListener('click', () => instance.close());
      }

      // Container
      state.container = document.createElement('div');
      state.container.className = 'md-drawer-container';
      state.container.setAttribute('role', 'navigation');
      
      if (state.position === 'right') {
        state.container.classList.add('md-right');
      }
      
      if (state.fullWidth) {
        state.container.classList.add('md-full-width');
      }

      // Header
      if (state.header) {
        const header = document.createElement('div');
        header.className = 'md-drawer-header';
        
        if (typeof state.header === 'string') {
          const title = document.createElement('h2');
          title.className = 'md-drawer-header-title';
          title.textContent = state.header;
          header.appendChild(title);
        } else if (state.header.title || state.header.subtitle) {
          if (state.header.title) {
            const title = document.createElement('h2');
            title.className = 'md-drawer-header-title';
            title.textContent = state.header.title;
            header.appendChild(title);
          }
          if (state.header.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = 'md-drawer-header-subtitle';
            subtitle.textContent = state.header.subtitle;
            header.appendChild(subtitle);
          }
        } else if (typeof state.header.getElement === 'function') {
          header.appendChild(state.header.getElement());
        } else if (state.header instanceof HTMLElement) {
          header.appendChild(state.header);
        }
        
        state.container.appendChild(header);
      }

      // Content
      state.contentElement = document.createElement('div');
      state.contentElement.className = 'md-drawer-content';
      renderContent();
      state.container.appendChild(state.contentElement);

      // Footer
      if (state.footer) {
        const footer = document.createElement('div');
        footer.className = 'md-drawer-footer';
        
        if (typeof state.footer.getElement === 'function') {
          footer.appendChild(state.footer.getElement());
        } else if (state.footer instanceof HTMLElement) {
          footer.appendChild(state.footer);
        }
        
        state.container.appendChild(footer);
      }

      document.body.appendChild(state.scrim);
      document.body.appendChild(state.container);
    };

    const instance = {
      open() {
        if (state.isOpen) return this;
        if (!state.scrim) build();
        
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          state.scrim.classList.add('md-visible');
          state.container.classList.add('md-visible');
        });
        
        state.isOpen = true;
        return this;
      },
      close() {
        if (!state.isOpen) return this;
        
        state.scrim.classList.remove('md-visible');
        state.container.classList.remove('md-visible');
        
        setTimeout(() => {
          document.body.style.overflow = '';
        }, 250);
        
        state.isOpen = false;
        return this;
      },
      toggle() {
        return state.isOpen ? this.close() : this.open();
      },
      addItem(item) {
        state.items.push(item);
        if (state.contentElement) renderContent();
        return this;
      },
      setItems(items) {
        state.items = items;
        if (state.contentElement) renderContent();
        return this;
      },
      addSection(title, items) {
        state.items.push({ type: 'section', title, items });
        if (state.contentElement) renderContent();
        return this;
      },
      addDivider() {
        state.items.push({ type: 'divider' });
        if (state.contentElement) renderContent();
        return this;
      },
      addLayout(layout) {
        state.items.push({ type: 'layout', layout });
        if (state.contentElement) renderContent();
        return this;
      },
      setActiveItem(itemId) {
        state.activeItemId = itemId;
        if (state.contentElement) {
          state.contentElement.querySelectorAll('.md-drawer-item').forEach(el => {
            el.classList.remove('md-active');
          });
          renderContent();
        }
        return this;
      },
      getActiveItem() {
        return state.activeItemId;
      },
      isShowing() {
        return state.isOpen;
      },
      destroy() {
        if (state.scrim?.parentNode) state.scrim.parentNode.removeChild(state.scrim);
        if (state.container?.parentNode) state.container.parentNode.removeChild(state.container);
        document.body.style.overflow = '';
      }
    };

    return instance;
  };

  // ==========================================
  // Extend AndroidComponents
  // ==========================================
  if (window.AndroidComponents) {
    window.AndroidComponents.MaterialToolbar = MaterialToolbar;
    window.AndroidComponents.MaterialDrawer = MaterialDrawer;
  } else {
    window.AndroidComponents = { MaterialToolbar, MaterialDrawer };
  }
})();