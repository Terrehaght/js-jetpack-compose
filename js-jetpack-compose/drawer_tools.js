// ============================================
// AndroidComponents Navigation Components (Drawer & Toolbar)
// Enhanced Version with Search Feature, Subtitle Support & Customizable Close Button
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
// MaterialToolbar Styles (Enhanced with Search)
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
.md-toolbar-title-container {
flex: 1; margin: 0 16px; overflow: hidden;
display: flex; flex-direction: column; justify-content: center;
}
.md-toolbar-title {
font-size: 1.25rem; font-weight: 500;
margin: 0; overflow: hidden; text-overflow: ellipsis;
white-space: nowrap; line-height: 1.4;
}
.md-toolbar-subtitle {
font-size: 0.875rem; font-weight: 400;
margin: 2px 0 0; overflow: hidden; text-overflow: ellipsis;
white-space: nowrap; opacity: 0.9; line-height: 1.3;
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

/* Search Mode Styles */  
.md-toolbar-search-container {  
  flex: 1;  
  display: flex;  
  align-items: center;  
  gap: 8px;  
  margin: 0 8px;  
}  
.md-toolbar-search-input {  
  flex: 1;  
  background: rgba(255, 255, 255, 0.15);  
  border: none;  
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);  
  color: inherit;  
  font-size: 1rem;  
  padding: 8px 12px;  
  outline: none;  
  font-family: inherit;  
  transition: background-color 0.2s, border-color 0.2s;  
}  
.md-toolbar-search-input:focus {  
  background: rgba(255, 255, 255, 0.2);  
  border-bottom-color: rgba(255, 255, 255, 0.9);  
}  
.md-toolbar-search-input::placeholder {  
  color: rgba(255, 255, 255, 0.7);  
}  
/* Custom search color support */  
.md-toolbar-search-input[style*="--search-color"]::placeholder {  
  color: var(--search-color);  
  opacity: 0.7;  
}  
.md-toolbar-search-close {  
  background: transparent;  
  border: none;  
  color: inherit;  
  width: 40px;  
  height: 40px;  
  border-radius: 50%;  
  display: flex;  
  align-items: center;  
  justify-content: center;  
  cursor: pointer;  
  font-size: 1.25rem;  
  transition: background-color 0.2s;  
  margin-right: 4px;  
}  
.md-toolbar-search-close:hover {  
  background: rgba(255, 255, 255, 0.08);  
}  
  
/* Collapsing Toolbar */  
.md-toolbar-collapsing {  
  transition: min-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),  
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);  
}  
.md-toolbar-collapsing.md-collapsed {  
  min-height: 56px;  
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);  
}  
.md-toolbar-collapsing.md-expanded {  
  min-height: 128px;  
}

`;

// ==========================================
// MaterialDrawer Styles (Enhanced Close Button)
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

/* Enhanced Close Button for Full Width Drawer */  
.md-drawer-close-btn {  
  position: absolute;  
  top: 12px;  
  background: var(--md-surface-container-highest, #E6E0E9);  
  color: var(--md-on-surface, #1C1B1F);  
  border: none;  
  width: 40px;  
  height: 40px;  
  border-radius: 50%;  
  display: none;  
  align-items: center;  
  justify-content: center;  
  cursor: pointer;  
  font-size: 1.5rem;  
  z-index: 10;  
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);  
  transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;  
}  
.md-drawer-close-btn:hover {  
  background: var(--md-surface-container-high, #ECE6F0);  
  box-shadow: 0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23);  
}  
.md-drawer-close-btn:active {  
  transform: scale(0.95);  
}  
.md-drawer-container.md-full-width .md-drawer-close-btn {  
  display: flex;  
}  
.md-drawer-close-btn.md-position-start {  
  left: 16px;  
}  
.md-drawer-close-btn.md-position-end {  
  right: 16px;  
}  
  
/* Swipe indicator for swipe-to-dismiss */  
.md-drawer-swipe-indicator {  
  position: absolute;  
  top: 12px;  
  width: 32px;  
  height: 4px;  
  background: var(--md-on-surface-variant, #49454F);  
  opacity: 0.4;  
  border-radius: 2px;  
  display: none;  
}  
.md-drawer-container.md-swipeable .md-drawer-swipe-indicator {  
  display: block;  
}  
.md-drawer-container.md-swipeable.md-position-start .md-drawer-swipe-indicator {  
  left: 12px;  
}  
.md-drawer-container.md-swipeable.md-position-end .md-drawer-swipe-indicator {  
  right: 12px;  
}  
  
.md-drawer-header {  
  padding: 16px; min-height: 64px;  
  background: var(--md-primary-container, #EADDFF);  
  color: var(--md-on-primary-container, #21005E);  
  display: flex; flex-direction: column; justify-content: center;  
  position: relative;  
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
.md-drawer-footer {  
  padding: 16px;  
  border-top: 1px solid var(--md-outline-variant, #CAC4D0);  
}  
.md-drawer-item {  
  display: flex; align-items: center; gap: 12px;  
  padding: 12px 16px; cursor: pointer;  
  color: var(--md-on-surface-variant, #49454F);  
  transition: background-color 0.2s, color 0.2s;  
  font-size: 0.875rem; font-weight: 500;  
  border-radius: 0;  
}  
.md-drawer-item:hover {  
  background: var(--md-state-hover-on-surface, rgba(28, 27, 31, 0.08));  
}  
.md-drawer-item.md-active {  
  background: var(--md-secondary-container, #E8DEF8);  
  color: var(--md-on-secondary-container, #1D192B);  
}  
.md-drawer-item i {  
  font-size: 1.5rem;  
  color: var(--md-on-surface-variant, #49454F);  
}  
.md-drawer-item.md-active i {  
  color: var(--md-on-secondary-container, #1D192B);  
}  
.md-drawer-item-badge {  
  margin-left: auto;  
  background: var(--md-error, #B3261E);  
  color: var(--md-on-error, #FFFFFF);  
  border-radius: 10px;  
  min-width: 20px;  
  height: 20px;  
  display: flex;  
  align-items: center;  
  justify-content: center;  
  font-size: 0.75rem;  
  padding: 0 4px;  
}  
.md-drawer-section-title {  
  padding: 16px 16px 8px;  
  font-size: 0.6875rem;  
  font-weight: 500;  
  text-transform: uppercase;  
  letter-spacing: 0.5px;  
  color: var(--md-on-surface-variant, #49454F);  
}  
.md-drawer-divider {  
  height: 1px;  
  background: var(--md-outline-variant, #CAC4D0);  
  margin: 8px 0;  
}

`;

// Inject styles
_injectStyles('toolbar', TOOLBAR_STYLES);
_injectStyles('drawer', DRAWER_STYLES);

// ==========================================
// MaterialToolbar Component
// ==========================================
const MaterialToolbar = (options = {}) => {
const state = {
title: options.title || '',
subtitle: options.subtitle || null,
navigationIcon: options.navigationIcon || null,
onNavigationClick: options.onNavigationClick || null,
actions: options.actions || [],
overflowItems: options.overflowItems || [],
collapsible: options.collapsible || false,
backgroundColor: options.backgroundColor || null,
textColor: options.textColor || null,

// Search state  
  isSearchMode: false,  
  searchPlaceholder: options.searchPlaceholder || 'Search...',  
  onSearchTextChanged: options.onSearchTextChanged || null,  
  searchColor: options.searchColor || null,  
  previousToolbarState: null,  
  onSearchStopped: options.onSearchStopped || null,
  searchInputElement: null,  
  searchCloseButtonElement: null,  
    
  element: null,  
  navIconElement: null,  
  titleContainerElement: null,  
  actionsContainerElement: null,  
  overflowMenuElement: null,  
  overflowButtonElement: null  
};  

const build = () => {  
  state.element = document.createElement('div');  
  state.element.className = 'md-toolbar';  
    
  if (state.collapsible) {  
    state.element.classList.add('md-toolbar-collapsing', 'md-expanded');  
  }  
    
  if (state.backgroundColor) {  
    state.element.style.background = state.backgroundColor;  
  }  
  if (state.textColor) {  
    state.element.style.color = state.textColor;  
  }  

  renderNormalMode();  
};  

const renderNormalMode = () => {  
  state.element.innerHTML = '';  
    
  // Navigation icon  
  if (state.navigationIcon) {  
    state.navIconElement = document.createElement('button');  
    state.navIconElement.className = 'md-toolbar-nav-icon';  
      
    if (state.navigationIcon.includes('bx-') || state.navigationIcon.includes('class=')) {  
      state.navIconElement.innerHTML = `<i class="${state.navigationIcon}"></i>`;  
    } else {  
      state.navIconElement.innerHTML = state.navigationIcon;  
    }  
      
    if (state.onNavigationClick) {  
      state.navIconElement.addEventListener('click', state.onNavigationClick);  
    }  
      
    state.element.appendChild(state.navIconElement);  
  }  

  // Title container  
  state.titleContainerElement = document.createElement('div');  
  state.titleContainerElement.className = 'md-toolbar-title-container';  
    
  const titleElement = document.createElement('h1');  
  titleElement.className = 'md-toolbar-title';  
  titleElement.textContent = state.title;  
  state.titleContainerElement.appendChild(titleElement);  
    
  if (state.subtitle) {  
    const subtitleElement = document.createElement('p');  
    subtitleElement.className = 'md-toolbar-subtitle';  
    subtitleElement.textContent = state.subtitle;  
    state.titleContainerElement.appendChild(subtitleElement);  
  }  
    
  state.element.appendChild(state.titleContainerElement);  

  // Actions  
  state.actionsContainerElement = document.createElement('div');  
  state.actionsContainerElement.className = 'md-toolbar-actions';  

  state.actions.forEach(action => {  
    const btn = document.createElement('button');  
    btn.className = 'md-toolbar-action-btn';  
      
    if (action.icon) {  
      if (action.icon.includes('bx-') || action.icon.includes('class=')) {  
        btn.innerHTML = `<i class="${action.icon}"></i>`;  
      } else {  
        btn.innerHTML = action.icon;  
      }  
    }  
      
    if (action.badge) {  
      const badge = document.createElement('span');  
      badge.className = 'md-toolbar-action-badge';  
      badge.textContent = action.badge;  
      btn.appendChild(badge);  
    }  
      
    if (action.onClick) {  
      btn.addEventListener('click', action.onClick);  
    }  
      
    state.actionsContainerElement.appendChild(btn);  
  });  

  // Overflow menu  
  if (state.overflowItems.length > 0) {  
    const overflowContainer = document.createElement('div');  
    overflowContainer.className = 'md-toolbar-overflow';  

    state.overflowButtonElement = document.createElement('button');  
    state.overflowButtonElement.className = 'md-toolbar-action-btn';  
    state.overflowButtonElement.innerHTML = '<i class="bx bx-dots-vertical-rounded"></i>';  
      
    state.overflowMenuElement = document.createElement('div');  
    state.overflowMenuElement.className = 'md-toolbar-overflow-menu';  

    state.overflowItems.forEach(item => {  
      const menuItem = document.createElement('button');  
      menuItem.className = 'md-toolbar-overflow-item';  
        
      if (item.icon) {  
        if (item.icon.includes('bx-') || item.icon.includes('class=')) {  
          menuItem.innerHTML = `<i class="${item.icon}"></i><span>${item.label}</span>`;  
        } else {  
          menuItem.innerHTML = `${item.icon}<span>${item.label}</span>`;  
        }  
      } else {  
        menuItem.textContent = item.label;  
      }  
        
      if (item.onClick) {  
        menuItem.addEventListener('click', () => {  
          item.onClick();  
          state.overflowMenuElement.classList.remove('md-visible');  
        });  
      }  
        
      state.overflowMenuElement.appendChild(menuItem);  
    });  

    state.overflowButtonElement.addEventListener('click', (e) => {  
      e.stopPropagation();  
      state.overflowMenuElement.classList.toggle('md-visible');  
    });  

    document.addEventListener('click', () => {  
      state.overflowMenuElement.classList.remove('md-visible');  
    });  

    overflowContainer.appendChild(state.overflowButtonElement);  
    overflowContainer.appendChild(state.overflowMenuElement);  
    state.actionsContainerElement.appendChild(overflowContainer);  
  }  

  state.element.appendChild(state.actionsContainerElement);  
};  

const renderSearchMode = () => {  
  state.element.innerHTML = '';  
    
  // Create search container  
  const searchContainer = document.createElement('div');  
  searchContainer.className = 'md-toolbar-search-container';  
    
  // Create search input  
  state.searchInputElement = document.createElement('input');  
  state.searchInputElement.type = 'text';  
  state.searchInputElement.className = 'md-toolbar-search-input';  
  state.searchInputElement.placeholder = state.searchPlaceholder;  
    
  // Apply custom search color if set  
  if (state.searchColor) {  
    state.searchInputElement.style.color = state.searchColor;  
    state.searchInputElement.style.borderBottomColor = state.searchColor;  
    state.searchInputElement.style.setProperty('--search-color', state.searchColor);  
  }  
    
  // Add input event listener  
  if (state.onSearchTextChanged) {  
    state.searchInputElement.addEventListener('input', (e) => {  
      state.onSearchTextChanged(e.target.value);  
    });  
  }  
    
  searchContainer.appendChild(state.searchInputElement);  
    
  // Create close button  
  state.searchCloseButtonElement = document.createElement('button');  
  state.searchCloseButtonElement.className = 'md-toolbar-search-close';  
  state.searchCloseButtonElement.innerHTML = '×';  
    
  // Apply custom search color to close button if set  
  if (state.searchColor) {  
    state.searchCloseButtonElement.style.color = state.searchColor;  
  }  
    
  state.searchCloseButtonElement.addEventListener('click', () => {  
    instance.stopSearch();  
  });  
    
  searchContainer.appendChild(state.searchCloseButtonElement);  
  state.element.appendChild(searchContainer);  
    
  // Focus the input  
  requestAnimationFrame(() => {  
    state.searchInputElement.focus();  
  });  
};  

const instance = {  
  setTitle(title) {  
    state.title = title;  
    if (state.titleContainerElement && !state.isSearchMode) {  
      const titleElement = state.titleContainerElement.querySelector('.md-toolbar-title');  
      if (titleElement) titleElement.textContent = title;  
    }  
    return this;  
  },  
  setSubtitle(subtitle) {  
    state.subtitle = subtitle;  
    if (state.titleContainerElement && !state.isSearchMode) {  
      let subtitleElement = state.titleContainerElement.querySelector('.md-toolbar-subtitle');  
      if (subtitle) {  
        if (!subtitleElement) {  
          subtitleElement = document.createElement('p');  
          subtitleElement.className = 'md-toolbar-subtitle';  
          state.titleContainerElement.appendChild(subtitleElement);  
        }  
        subtitleElement.textContent = subtitle;  
      } else if (subtitleElement) {  
        subtitleElement.remove();  
      }  
    }  
    return this;  
  },  
  setNavigationIcon(icon, onClick) {  
    state.navigationIcon = icon;  
    if (onClick) state.onNavigationClick = onClick;  
      
    if (state.navIconElement && !state.isSearchMode) {  
      if (icon.includes('bx-') || icon.includes('class=')) {  
        state.navIconElement.innerHTML = `<i class="${icon}"></i>`;  
      } else {  
        state.navIconElement.innerHTML = icon;  
      }  
    }  
    return this;  
  },  
  addAction(action) {  
    state.actions.push(action);  
    if (state.actionsContainerElement && !state.isSearchMode) {  
      renderNormalMode();  
    }  
    return this;  
  },  
  setActions(actions) {  
    state.actions = actions;  
    if (state.actionsContainerElement && !state.isSearchMode) {  
      renderNormalMode();  
    }  
    return this;  
  },  
  collapse() {  
    if (state.collapsible && state.element) {  
      state.element.classList.remove('md-expanded');  
      state.element.classList.add('md-collapsed');  
    }  
    return this;  
  },  
  expand() {  
    if (state.collapsible && state.element) {  
      state.element.classList.remove('md-collapsed');  
      state.element.classList.add('md-expanded');  
    }  
    return this;  
  },  
    
  // ==========================================  
  // NEW: Search Methods  
  // ==========================================  
  startSearch() {  
    if (state.isSearchMode) return this;  
      
    // Save current toolbar state  
    state.previousToolbarState = {  
      title: state.title,  
      subtitle: state.subtitle,  
      navigationIcon: state.navigationIcon,  
      actions: [...state.actions],  
      overflowItems: [...state.overflowItems]  
    };  
      
    state.isSearchMode = true;  
    renderSearchMode();  
    return this;  
  },  
    
  stopSearch() {  
    if (!state.isSearchMode) return this;  
      
    // Restore previous state  
    if (state.previousToolbarState) {  
      state.title = state.previousToolbarState.title;  
      state.subtitle = state.previousToolbarState.subtitle;  
      state.navigationIcon = state.previousToolbarState.navigationIcon;  
      state.actions = state.previousToolbarState.actions;  
      state.overflowItems = state.previousToolbarState.overflowItems;  
    }  
      
    state.isSearchMode = false;  
    state.searchInputElement = null;  
    renderNormalMode();  

    // --- ADD THIS BLOCK ---
    if (state.onSearchStopped) {
      state.onSearchStopped();
    }
    // ----------------------

    return this;  
  },  
    
  isSearchActive() {  
    return state.isSearchMode;  
  },  
    
  getSearchText() {  
    return state.searchInputElement ? state.searchInputElement.value : '';  
  },  
    
  setSearchText(text) {  
    if (state.searchInputElement) {  
      state.searchInputElement.value = text;  
    }  
    return this;  
  },  
    
  setSearchPlaceholder(placeholder) {  
    state.searchPlaceholder = placeholder;  
    if (state.searchInputElement) {  
      state.searchInputElement.placeholder = placeholder;  
    }  
    return this;  
  },  
    
  setOnSearchTextChanged(callback) {  
    state.onSearchTextChanged = callback;  
    return this;  
  },  
    
  setSearchColor(color) {  
    state.searchColor = color;  
    if (state.searchInputElement) {  
      state.searchInputElement.style.color = color;  
      state.searchInputElement.style.borderBottomColor = color;  
      state.searchInputElement.style.setProperty('--search-color', color);  
    }  
    if (state.searchCloseButtonElement) {  
      state.searchCloseButtonElement.style.color = color;  
    }  
    return this;  
  },  
    
  setActionBadge(actionIndex, value) {
    // Update state so badge is preserved on re-render
    if (state.actions[actionIndex] !== undefined) {
      state.actions[actionIndex].badge = value;
    }

    // Patch the DOM directly — no full re-render needed
    if (state.actionsContainerElement && !state.isSearchMode) {
      const buttons = state.actionsContainerElement
        .querySelectorAll('.md-toolbar-action-btn');
      const btn = buttons[actionIndex];
      if (!btn) return this;

      let badge = btn.querySelector('.md-toolbar-action-badge');

      if (value === null || value === undefined || value === '') {
        // Remove badge if value is empty/null
        if (badge) badge.remove();
      } else {
        if (!badge) {
          // Create badge element if it doesn't exist yet
          badge = document.createElement('span');
          badge.className = 'md-toolbar-action-badge';
          btn.appendChild(badge);
        }
        badge.textContent = value;
      }
    }

    return this;
  },

  getElement() {  
    if (!state.element) build();  
    return state.element;  
  }  
};  

return instance;

};

// ==========================================
// MaterialDrawer Component
// ==========================================
const MaterialDrawer = (options = {}) => {
const state = {
header: options.header || null,
items: options.items || [],
footer: options.footer || null,
position: options.position || 'start',
fullWidth: options.fullWidth || false,
closeOnItemClick: options.closeOnItemClick !== false,
activeItemId: options.activeItemId || null,
onOpen: options.onOpen || null,
onClose: options.onClose || null,
swipeToDismiss: options.swipeToDismiss || false,

// Close button options  
  showCloseButton: options.showCloseButton || false,  
  closeButtonPosition: options.closeButtonPosition || 'end',  
  closeButtonIcon: options.closeButtonIcon || '×',  
  closeButtonSize: options.closeButtonSize || 40,  
  closeButtonBackground: options.closeButtonBackground || null,  
  closeButtonColor: options.closeButtonColor || null,  
  closeButtonStyle: options.closeButtonStyle || {},  
    
  scrim: null,  
  container: null,  
  contentElement: null,  
  closeButtonElement: null,  
  isOpen: false,  
    
  // Swipe state  
  swipeStartX: 0,  
  swipeCurrentX: 0,  
  isSwiping: false  
};  

const renderContent = () => {  
  if (!state.contentElement) return;  
  state.contentElement.innerHTML = '';  

  state.items.forEach(item => {  
    if (item.type === 'divider') {  
      const divider = document.createElement('div');  
      divider.className = 'md-drawer-divider';  
      state.contentElement.appendChild(divider);  
    } else if (item.type === 'section') {  
      const section = document.createElement('div');  
      section.className = 'md-drawer-section-title';  
      section.textContent = item.title;  
      state.contentElement.appendChild(section);  
        
      if (item.items) {  
        item.items.forEach(sectionItem => {  
          renderItem(sectionItem);  
        });  
      }  
    } else if (item.type === 'layout') {  
      if (typeof item.layout.getElement === 'function') {  
        state.contentElement.appendChild(item.layout.getElement());  
      } else if (item.layout instanceof HTMLElement) {  
        state.contentElement.appendChild(item.layout);  
      }  
    } else {  
      renderItem(item);  
    }  
  });  
};  

const renderItem = (item) => {  
  const itemElement = document.createElement('button');  
  itemElement.className = 'md-drawer-item';  
    
  if (item.id === state.activeItemId) {  
    itemElement.classList.add('md-active');  
  }  
    
  if (item.icon) {  
    if (item.icon.includes('bx-') || item.icon.includes('class=')) {  
      itemElement.innerHTML = `<i class="${item.icon}"></i>`;  
    } else {  
      itemElement.innerHTML = item.icon;  
    }  
  }  
    
  const label = document.createElement('span');  
  label.textContent = item.label;  
  itemElement.appendChild(label);  
    
  if (item.badge) {  
    const badge = document.createElement('span');  
    badge.className = 'md-drawer-item-badge';  
    badge.textContent = item.badge;  
    itemElement.appendChild(badge);  
  }  
    
  if (item.onClick) {  
    itemElement.addEventListener('click', () => {  
      item.onClick();  
      if (state.closeOnItemClick) {  
        instance.close();  
      }  
    });  
  }  
    
  state.contentElement.appendChild(itemElement);  
};  

const setupSwipeToDismiss = () => {  
  if (!state.swipeToDismiss) return;  
    
  state.container.classList.add('md-swipeable');  
  state.container.classList.add(`md-position-${state.position}`);  
    
  const handleTouchStart = (e) => {  
    state.swipeStartX = e.touches[0].clientX;  
    state.isSwiping = true;  
  };  
    
  const handleTouchMove = (e) => {  
    if (!state.isSwiping) return;  
      
    state.swipeCurrentX = e.touches[0].clientX;  
    const diff = state.swipeCurrentX - state.swipeStartX;  
      
    if (state.position === 'start' && diff < 0) {  
      state.container.style.transform = `translateX(${diff}px)`;  
    } else if (state.position === 'end' && diff > 0) {  
      state.container.style.transform = `translateX(${diff}px)`;  
    }  
  };  
    
  const handleTouchEnd = () => {  
    if (!state.isSwiping) return;  
      
    const diff = state.swipeCurrentX - state.swipeStartX;  
    const threshold = 100;  
      
    if ((state.position === 'start' && diff < -threshold) ||  
        (state.position === 'end' && diff > threshold)) {  
      instance.close();  
    } else {  
      state.container.style.transform = '';  
    }  
      
    state.isSwiping = false;  
  };  
    
  state.container.addEventListener('touchstart', handleTouchStart);  
  state.container.addEventListener('touchmove', handleTouchMove);  
  state.container.addEventListener('touchend', handleTouchEnd);  
};  

const build = () => {  
  // Scrim  
  state.scrim = document.createElement('div');  
  state.scrim.className = 'md-drawer-scrim';  
  state.scrim.addEventListener('click', () => instance.close());  

  // Container  
  state.container = document.createElement('div');  
  state.container.className = 'md-drawer-container';  
    
  if (state.position === 'end') {  
    state.container.classList.add('md-right');  
  }  
    
  if (state.fullWidth) {  
    state.container.classList.add('md-full-width');  
  }  

  // Close button (for full-width drawers)  
  if (state.showCloseButton || state.fullWidth) {  
    state.closeButtonElement = document.createElement('button');  
    state.closeButtonElement.className = 'md-drawer-close-btn';  
    state.closeButtonElement.classList.add(`md-position-${state.closeButtonPosition}`);  
      
    // Apply size  
    state.closeButtonElement.style.width = `${state.closeButtonSize}px`;  
    state.closeButtonElement.style.height = `${state.closeButtonSize}px`;  
      
    // Apply colors  
    if (state.closeButtonBackground) {  
      state.closeButtonElement.style.background = state.closeButtonBackground;  
    }  
    if (state.closeButtonColor) {  
      state.closeButtonElement.style.color = state.closeButtonColor;  
    }  
      
    // Apply additional custom styles  
    Object.assign(state.closeButtonElement.style, state.closeButtonStyle);  
      
    // Set icon  
    if (state.closeButtonIcon.includes('bx-') || state.closeButtonIcon.includes('class=')) {  
      state.closeButtonElement.innerHTML = `<i class="${state.closeButtonIcon}"></i>`;  
    } else {  
      state.closeButtonElement.innerHTML = state.closeButtonIcon;  
    }  
      
    state.closeButtonElement.addEventListener('click', () => instance.close());  
    state.container.appendChild(state.closeButtonElement);  
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

  setupSwipeToDismiss();  

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
    if (state.onOpen) state.onOpen();  
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
    if (state.onClose) state.onClose();  
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
  setCloseButtonIcon(icon) {  
    state.closeButtonIcon = icon;  
    if (state.closeButtonElement) {  
      if (icon.includes('bx-') || icon.includes('class=')) {  
        state.closeButtonElement.innerHTML = `<i class="${icon}"></i>`;  
      } else {  
        state.closeButtonElement.innerHTML = icon;  
      }  
    }  
    return this;  
  },  
  setCloseButtonSize(size) {  
    state.closeButtonSize = size;  
    if (state.closeButtonElement) {  
      state.closeButtonElement.style.width = `${size}px`;  
      state.closeButtonElement.style.height = `${size}px`;  
    }  
    return this;  
  },  
  setCloseButtonColors(background, color) {  
    if (background) {  
      state.closeButtonBackground = background;  
      if (state.closeButtonElement) {  
        state.closeButtonElement.style.background = background;  
      }  
    }  
    if (color) {  
      state.closeButtonColor = color;  
      if (state.closeButtonElement) {  
        state.closeButtonElement.style.color = color;  
      }  
    }  
    return this;  
  },  
  setCloseButtonStyle(styles) {  
    state.closeButtonStyle = { ...state.closeButtonStyle, ...styles };  
    if (state.closeButtonElement) {  
      Object.assign(state.closeButtonElement.style, styles);  
    }  
    return this;  
  },  
  getCloseButtonElement() {  
    return state.closeButtonElement;  
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