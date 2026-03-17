// ============================================================
// TabLayout — Rearchitected
// Clean prop API + Android WebView Bridge
// ============================================================
//
// PROP API (single source of truth)
// ─────────────────────────────────
//  Content
//    tabs[]          Tab descriptors: { text, icon, badge }
//    pages[]         Page content: HTMLElement | component | () => element
//
//  Layout / Behavior
//    tabMode         'fixed' | 'scrollable'          (was: mode — renamed to avoid clash with heightMode)
//    heightMode      'natural' | 'fixed'             (unchanged)
//    orientation     'horizontal' | 'vertical'
//    animation       'slide' | 'fade' | 'scale'
//    swipeable       true | false
//    lazyLoad        true | false
//    selectedIndex   number (initial)
//
//  Appearance
//    tabStyle        'default' | 'pill' | 'underline' | 'segmented' | 'icon-pill'
//                    (was: two separate props — `style` + `tabStyle`)
//    theme           'light' | 'dark'               (now both apply explicit classes)
//    accentColor     '#rrggbb'                       (indicator, active tab)
//    tabBarBg        '#rrggbb'                       (tab bar background)
//    contentBg       '#rrggbb'                       (pages background)
//    activeTabColor  '#rrggbb'                       (active tab text/icon)
//    inactiveTabColor '#rrggbb'                      (inactive tab text/icon)
//    indicatorColor  '#rrggbb'                       (indicator stripe)
//
//  Callbacks
//    onTabSelected   (index, tabDescriptor) => void
//
//  Android bridge ID
//    bridgeId        string — registers instance on window.TabLayoutBridge.instances[id]
//
// ANDROID BRIDGE
// ──────────────
//  After mounting, Android can call any public method via:
//
//    window.TabLayoutBridge.call(id, method, ...args)
//
//  e.g.  window.TabLayoutBridge.call('main', 'selectTab', 2)
//        window.TabLayoutBridge.call('main', 'setProps', { theme: 'light', accentColor: '#ff5722' })
//        window.TabLayoutBridge.call('main', 'updateTabBadge', 0, '9+')
//
// ============================================================

(function () {
  const { injectStyles, injectedStyles } = window.AndroidComponents?.utils || {};

  const _injectStyles = injectStyles || ((id, css) => {
    if (injectedStyles?.has(id)) return;
    const style = document.createElement('style');
    style.id = `android-components-${id}`;
    style.textContent = css;
    document.head.appendChild(style);
    injectedStyles?.add(id);
  });

  // ─── CSS ────────────────────────────────────────────────────────────────────

  const TAB_STYLES = `
    /* === CSS CUSTOM PROPERTIES === */
    /* All colours are set per-instance via inline style on .md-tablayout.
       These :root defaults are fallbacks only and are not relied on. */
    :root {
      --tab-accent:         #1d9bf0;
      --tab-accent-hover:   #1a8cd8;
      --tab-accent-soft:    rgba(29,155,240,.15);
      --tab-radius-sm:      8px;
      --tab-radius-md:      12px;
      --tab-radius-full:    9999px;
      --tab-shadow-sm:      0 1px 2px rgba(0,0,0,.3);
      --tab-shadow-md:      0 4px 12px rgba(0,0,0,.4);
      /* Pill / segmented / icon-pill active chip background.
         Defaults to --tab-text-primary (white on dark, near-black on light).
         Override with pillActiveBg prop or setProps({ pillActiveBg: '#hex' }). */
      --tab-pill-active-bg: var(--tab-text-primary);
      /* Text color on the active pill chip */
      --tab-pill-active-text: var(--tab-content-bg, #fff);
    }

    /* === THEME TOKENS (applied as classes on .md-tablayout) === */
    .md-tablayout.theme-dark {
      --tab-bar-bg:          #1d9bf0;     /* overridden per-instance */
      --tab-content-bg:      #0f1419;
      --tab-text-active:     #ffffff;
      --tab-text-inactive:   rgba(255,255,255,.7);
      --tab-text-primary:    #e7e9ea;
      --tab-text-secondary:  #8b98a5;
      --tab-border:          #2f3336;
      --tab-elevated:        #2d343d;
      --tab-shadow-sm:       0 1px 2px rgba(0,0,0,.3);
      --tab-shadow-md:       0 4px 12px rgba(0,0,0,.4);
      --tab-hover-overlay:   rgba(255,255,255,.08);
    }

    .md-tablayout.theme-light {
      --tab-bar-bg:          #1d9bf0;
      --tab-content-bg:      #ffffff;
      --tab-text-active:     #ffffff;
      --tab-text-inactive:   rgba(255,255,255,.8);
      --tab-text-primary:    #0f1419;
      --tab-text-secondary:  #536471;
      --tab-border:          #eff3f4;
      --tab-elevated:        #f0f0f0;
      --tab-shadow-sm:       0 1px 2px rgba(0,0,0,.08);
      --tab-shadow-md:       0 4px 12px rgba(0,0,0,.1);
      --tab-hover-overlay:   rgba(0,0,0,.05);
    }

    /* === LAYOUT === */
    .md-tablayout {
      display: flex;
      flex-direction: column;
      width: 100%;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      position: relative;
    }

    /* --- Tab bar --- */
    .md-tablayout-tabs {
      display: flex;
      position: relative;
      background: var(--tab-bar-bg, var(--tab-accent));
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      flex-shrink: 0;
    }
    .md-tablayout-tabs::-webkit-scrollbar { display: none; }
    .md-tablayout-tabs.tabmode-scrollable { justify-content: flex-start; }
    .md-tablayout-tabs.tabmode-fixed      { justify-content: space-around; }

    /* --- Pages wrapper --- */
    .md-tablayout-content {
      position: relative;
      overflow: hidden;
      flex: 1 1 auto;
      width: 100%;
      background: var(--tab-content-bg, transparent);
    }

    /* --- Pages track (slides via transform) --- */
    .md-tablayout-pages-track {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: auto;
      transition: transform 250ms cubic-bezier(0.4,0,0.2,1);
    }

    /* --- Individual page --- */
    .md-tablayout-page {
      flex-shrink: 0;
      width: 100%;
      min-width: 100%;
      box-sizing: border-box;
      background: transparent;
    }

    /* --- Height modes --- */
    .md-tablayout-content.height-natural .md-tablayout-pages-track {
      align-items: flex-start;
    }
    /* height-fixed: JS sets explicit height via inline style */

    /* === ANIMATION VARIANTS === */

    /* Fade */
    .md-tablayout.animation-fade .md-tablayout-page {
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      opacity: 0;
      transition: opacity 200ms ease-out;
      pointer-events: none;
    }
    .md-tablayout.animation-fade .md-tablayout-page.md-active {
      opacity: 1;
      pointer-events: auto;
      position: relative;
    }

    /* Scale */
    .md-tablayout.animation-scale .md-tablayout-page {
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 200ms ease-out, transform 250ms cubic-bezier(0.4,0,0.2,1);
      pointer-events: none;
    }
    .md-tablayout.animation-scale .md-tablayout-page.md-active {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
      position: relative;
    }

    /* === TAB BUTTON === */
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
      background: transparent;          /* single declaration — no duplicate */
      border: none;
      color: var(--tab-text-inactive, rgba(255,255,255,.7));
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
      position: relative;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .md-tablayout-tabs.tabmode-fixed .md-tablayout-tab {
      flex: 1 1 0;
      max-width: none;
    }
    .md-tablayout-tab:hover {
      background: var(--tab-hover-overlay, rgba(255,255,255,.08));
    }
    .md-tablayout-tab.md-active {
      color: var(--tab-text-active, #fff);
    }

    .md-tablayout-tab-icon {
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    .md-tablayout-tab:hover .md-tablayout-tab-icon { transform: scale(1.1); }

    .md-tablayout-tab.md-icon-only { min-width: 72px; }

    /* --- Badge --- */
    .md-tablayout-tab-badge {
      position: absolute;
      top: 6px; right: 8px;
      background: var(--md-error, #B3261E);
      color: var(--md-on-error, #fff);
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

    /* --- Indicator --- */
    .md-tablayout-indicator {
      position: absolute;
      bottom: 0; left: 0;
      height: 3px;
      background: var(--tab-indicator-color, rgba(255,255,255,1));
      transition: transform 250ms cubic-bezier(0.4,0,0.2,1),
                  width   250ms cubic-bezier(0.4,0,0.2,1);
      border-radius: 3px 3px 0 0;
    }

    /* === TAB STYLE VARIANTS === */

    /* -- Pill -- */
    .md-tablayout.tabstyle-pill .md-tablayout-tabs {
      background: var(--tab-bar-bg, var(--tab-elevated));
      border-radius: var(--tab-radius-full);
      padding: 4px;
      gap: 2px;
    }
    .md-tablayout.tabstyle-pill .md-tablayout-tab {
      border-radius: var(--tab-radius-full);
      color: var(--tab-text-inactive, var(--tab-text-secondary));
      min-width: 100px;
      text-transform: none;
    }
    .md-tablayout.tabstyle-pill .md-tablayout-tab:hover:not(.md-active) {
      background: var(--tab-hover-overlay);
      color: var(--tab-text-primary);
    }
    .md-tablayout.tabstyle-pill .md-tablayout-tab.md-active {
      background: var(--tab-pill-active-bg);
      color: var(--tab-pill-active-text);
      box-shadow: var(--tab-shadow-sm);
    }
    .md-tablayout.tabstyle-pill .md-tablayout-indicator { display: none; }

    /* -- Underline -- */
    .md-tablayout.tabstyle-underline .md-tablayout-tabs {
      background: var(--tab-bar-bg, var(--tab-content-bg));
      border-bottom: 1px solid var(--tab-border);
    }
    .md-tablayout.tabstyle-underline .md-tablayout-tab {
      color: var(--tab-text-inactive, var(--tab-text-secondary));
      border-radius: 0;
      text-transform: none;
    }
    .md-tablayout.tabstyle-underline .md-tablayout-tab:hover:not(.md-active) {
      background: rgba(29,155,240,.08);
      color: var(--tab-text-primary);
    }
    .md-tablayout.tabstyle-underline .md-tablayout-tab.md-active {
      color: var(--tab-text-active, var(--tab-accent));
    }
    .md-tablayout.tabstyle-underline .md-tablayout-indicator {
      height: 3px;
      bottom: -1px;
      background: var(--tab-indicator-color, var(--tab-accent));
      border-radius: 3px 3px 0 0;
    }

    /* -- Segmented -- */
    .md-tablayout.tabstyle-segmented .md-tablayout-tabs {
      background: var(--tab-bar-bg, var(--tab-elevated));
      border-radius: var(--tab-radius-md);
      padding: 4px;
    }
    .md-tablayout.tabstyle-segmented .md-tablayout-tab {
      border-radius: var(--tab-radius-sm);
      color: var(--tab-text-inactive, var(--tab-text-secondary));
      text-transform: none;
      font-size: 0.875rem;
    }
    .md-tablayout.tabstyle-segmented .md-tablayout-tab:hover:not(.md-active) {
      color: var(--tab-text-primary);
    }
    .md-tablayout.tabstyle-segmented .md-tablayout-tab.md-active {
      background: var(--tab-pill-active-bg);
      color: var(--tab-pill-active-text);
      box-shadow: var(--tab-shadow-md);
    }
    .md-tablayout.tabstyle-segmented .md-tablayout-indicator { display: none; }

    /* -- Icon-pill -- */
    .md-tablayout.tabstyle-icon-pill .md-tablayout-tabs {
      background: var(--tab-bar-bg, var(--tab-elevated));
      border-radius: var(--tab-radius-full);
      padding: 4px;
      gap: 4px;
    }
    .md-tablayout.tabstyle-icon-pill .md-tablayout-tab {
      width: 44px; height: 44px;
      min-width: 44px;
      padding: 0;
      border-radius: 50%;
      color: var(--tab-text-inactive, var(--tab-text-secondary));
      text-transform: none;
    }
    .md-tablayout.tabstyle-icon-pill .md-tablayout-tab:hover:not(.md-active) {
      background: var(--tab-hover-overlay);
      color: var(--tab-text-primary);
    }
    .md-tablayout.tabstyle-icon-pill .md-tablayout-tab.md-active {
      background: var(--tab-pill-active-bg);
      color: var(--tab-pill-active-text);
      box-shadow: var(--tab-shadow-sm);
    }
    .md-tablayout.tabstyle-icon-pill .md-tablayout-tab-icon { font-size: 1.1rem; }
    .md-tablayout.tabstyle-icon-pill .md-tablayout-indicator { display: none; }

    /* Row layout for non-icon-only styles */
    .md-tablayout.tabstyle-pill .md-tablayout-tab:not(.md-icon-only),
    .md-tablayout.tabstyle-underline .md-tablayout-tab:not(.md-icon-only),
    .md-tablayout.tabstyle-segmented .md-tablayout-tab:not(.md-icon-only) {
      flex-direction: row;
      gap: 8px;
    }

    /* === BOTTOM TAB POSITION === */
    /* When tabs are at the bottom the indicator moves to the top edge */
    .md-tablayout.tabposition-bottom .md-tablayout-indicator {
      bottom: auto;
      top: 0;
      border-radius: 0 0 3px 3px;
    }

    /* === VERTICAL ORIENTATION === */
    .md-tablayout.orientation-vertical {
      flex-direction: row;
    }
    .md-tablayout.orientation-vertical .md-tablayout-tabs {
      flex-direction: column;
      width: auto;
      min-width: 120px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .md-tablayout.orientation-vertical .md-tablayout-tab {
      width: 100%;
      max-width: none;
      height: 56px;
      justify-content: flex-start;
      padding: 0 24px;
      flex-direction: row;
      gap: 12px;
    }
    .md-tablayout.orientation-vertical .md-tablayout-indicator {
      width: 3px; height: 100%;
      right: 0; left: auto;
      top: 0; bottom: auto;
      border-radius: 0 3px 3px 0;
    }
    .md-tablayout.orientation-vertical .md-tablayout-pages-track {
      flex-direction: column;
      height: 100%;
    }
    .md-tablayout.orientation-vertical .md-tablayout-page {
      width: 100%;
      min-width: auto;
      height: 100%;
      min-height: 100%;
    }

    /* === SECONDARY VARIANT (Material You secondary tabs) === */
    .md-tablayout.tabstyle-secondary .md-tablayout-tabs {
      background: var(--tab-bar-bg, var(--tab-content-bg));
      border-bottom: 1px solid var(--tab-border);
    }
    .md-tablayout.tabstyle-secondary .md-tablayout-tab {
      color: var(--tab-text-inactive, var(--tab-text-secondary));
      text-transform: none;
    }
    .md-tablayout.tabstyle-secondary .md-tablayout-tab:hover {
      background: rgba(103,80,164,.08);
    }
    .md-tablayout.tabstyle-secondary .md-tablayout-tab.md-active {
      color: var(--tab-text-active, var(--tab-accent));
    }
    .md-tablayout.tabstyle-secondary .md-tablayout-indicator {
      background: var(--tab-indicator-color, var(--tab-accent));
    }
  `;

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const extractElement = (component) => {
    if (!component) return null;
    if (component instanceof HTMLElement) return component;
    if (typeof component === 'function') return extractElement(component());
    if (typeof component.getElement === 'function') return component.getElement();
    if (component.element instanceof HTMLElement) return component.element;
    console.warn('TabLayout: could not extract element from component', component);
    return null;
  };

  /** Darken/lighten a hex color by percent (-100..100) */
  const adjustColor = (hex, percent) => {
    const n = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const clamp = (v) => Math.min(255, Math.max(0, v));
    const r = clamp((n >> 16) + amt);
    const g = clamp(((n >> 8) & 0xff) + amt);
    const b = clamp((n & 0xff) + amt);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // ─── DEFAULTS ────────────────────────────────────────────────────────────────

  const DEFAULTS = {
    tabs: [],
    pages: [],
    tabMode: 'fixed',           // 'fixed' | 'scrollable'
    heightMode: 'natural',      // 'natural' | 'fixed'
    orientation: 'horizontal',  // 'horizontal' | 'vertical'
    animation: 'slide',         // 'slide' | 'fade' | 'scale'
    tabStyle: 'default',        // 'default' | 'pill' | 'underline' | 'segmented' | 'icon-pill' | 'secondary'
    theme: 'dark',              // 'light' | 'dark'
    accentColor: '#1d9bf0',
    tabBarBg: null,             // null = use accentColor for default style
    contentBg: null,
    activeTabColor: null,
    inactiveTabColor: null,
    indicatorColor: null,
    pillActiveBg: null,      // background of active chip in pill / segmented / icon-pill
    pillActiveText: null,    // text/icon color on the active chip
    swipeable: true,
    lazyLoad: false,
    animatedIndicator: true,
    selectedIndex: 0,
    tabPosition: 'top',          // 'top' | 'bottom'
    onTabSelected: null,
    bridgeId: null,
  };

  // ─── TabLayout ───────────────────────────────────────────────────────────────

  const TabLayout = (userProps = {}) => {
    _injectStyles('tablayout', TAB_STYLES);

    // Merge with defaults — single canonical state object
    const state = Object.assign({}, DEFAULTS, userProps, {
      // Internal DOM refs (never overridden by user props)
      element: null,
      tabsEl: null,
      contentEl: null,
      trackEl: null,
      indicatorEl: null,
      tabEls: [],
      pageEls: [],
      loadedPages: new Set(),
      touchStartX: 0,
      touchEndX: 0,
      isSwiping: false,
    });

    // ── CSS variable application ─────────────────────────────────────────────

    const applyColors = () => {
      const el = state.element;
      if (!el) return;

      const accent = state.accentColor;
      el.style.setProperty('--tab-accent', accent);
      el.style.setProperty('--tab-accent-hover', adjustColor(accent, -10));
      el.style.setProperty('--tab-accent-soft', accent + '26');

      // Tab bar background:
      //   explicit tabBarBg prop  → always honoured for every style
      //   no explicit prop        → use accentColor for default/secondary; let CSS var(--tab-elevated) fallback handle pill/segmented/icon-pill
      const tabBarBg = state.tabBarBg
        ? state.tabBarBg
        : ['default', 'secondary'].includes(state.tabStyle) ? accent : null;
      if (tabBarBg) el.style.setProperty('--tab-bar-bg', tabBarBg);
      else el.style.removeProperty('--tab-bar-bg');

      if (state.contentBg)       el.style.setProperty('--tab-content-bg',  state.contentBg);
      else                       el.style.removeProperty('--tab-content-bg');

      if (state.activeTabColor)  el.style.setProperty('--tab-text-active',   state.activeTabColor);
      else                       el.style.removeProperty('--tab-text-active');

      if (state.inactiveTabColor) el.style.setProperty('--tab-text-inactive', state.inactiveTabColor);
      else                        el.style.removeProperty('--tab-text-inactive');

      if (state.indicatorColor)  el.style.setProperty('--tab-indicator-color', state.indicatorColor);
      else                       el.style.removeProperty('--tab-indicator-color');

      // Pill / segmented / icon-pill active chip colours
      if (state.pillActiveBg)    el.style.setProperty('--tab-pill-active-bg',   state.pillActiveBg);
      else                       el.style.removeProperty('--tab-pill-active-bg');

      if (state.pillActiveText)  el.style.setProperty('--tab-pill-active-text', state.pillActiveText);
      else                       el.style.removeProperty('--tab-pill-active-text');
    };

    // ── Indicator ────────────────────────────────────────────────────────────

    const updateIndicator = () => {
      if (!state.indicatorEl || !state.tabEls.length) return;
      // Styles where the indicator is hidden via CSS
      if (['pill', 'segmented', 'icon-pill'].includes(state.tabStyle)) return;

      const activeTab = state.tabEls[state.selectedIndex];
      if (!activeTab) return;

      if (state.orientation === 'horizontal') {
        state.indicatorEl.style.transform = `translateX(${activeTab.offsetLeft}px)`;
        state.indicatorEl.style.width = `${activeTab.offsetWidth}px`;
        state.indicatorEl.style.height = '';
      } else {
        state.indicatorEl.style.transform = `translateY(${activeTab.offsetTop}px)`;
        state.indicatorEl.style.height = `${activeTab.offsetHeight}px`;
        state.indicatorEl.style.width = '';
      }
    };

    // ── Pages track ──────────────────────────────────────────────────────────

    const updateTrack = () => {
      if (!state.trackEl) return;
      if (state.animation === 'slide') {
        const axis = state.orientation === 'horizontal' ? 'X' : 'Y';
        state.trackEl.style.transform = `translate${axis}(${-state.selectedIndex * 100}%)`;
      }
      if (state.heightMode === 'fixed') syncHeight();
    };

    const syncHeight = () => {
      if (!state.contentEl || state.heightMode !== 'fixed') return;
      const current = state.pageEls[state.selectedIndex];
      if (current) state.contentEl.style.height = `${current.scrollHeight}px`;
    };

    // ── Page loading ─────────────────────────────────────────────────────────

    const loadPage = (index) => {
      if (state.loadedPages.has(index)) return;
      const page = state.pages[index];
      const pageEl = state.pageEls[index];
      if (!page || !pageEl) return;

      const el = extractElement(page);
      if (el) {
        pageEl.innerHTML = '';
        pageEl.appendChild(el);
        state.loadedPages.add(index);
        if (state.heightMode === 'fixed' && index === state.selectedIndex) {
          requestAnimationFrame(syncHeight);
        }
      }
    };

    // ── Tab selection ─────────────────────────────────────────────────────────

    const selectTab = (index) => {
      if (index < 0 || index >= state.tabs.length) return;
      const prev = state.selectedIndex;
      state.selectedIndex = index;

      state.tabEls.forEach((el, i) => {
        el.classList.toggle('md-active', i === index);
        el.setAttribute('aria-selected', String(i === index));
      });

      if (state.animation === 'slide') {
        if (!state.loadedPages.has(index)) loadPage(index);
        updateTrack();
        state.pageEls.forEach((el, i) => el.classList.toggle('md-active', i === index));
      } else {
        state.pageEls.forEach((el, i) => {
          el.classList.remove('md-active');
          if (i === index) {
            if (!state.loadedPages.has(i)) loadPage(i);
            setTimeout(() => el.classList.add('md-active'), 0);
          }
        });
      }

      updateIndicator();

      // Scroll tab into view for scrollable mode
      if (state.tabMode === 'scrollable' && state.tabEls[index]) {
        state.tabEls[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }

      state.onTabSelected?.(index, state.tabs[index]);
    };

    // ── Swipe ─────────────────────────────────────────────────────────────────

    const handleSwipe = () => {
      const diff = state.touchStartX - state.touchEndX;
      if (Math.abs(diff) < 50) return;
      if (diff > 0 && state.selectedIndex < state.tabs.length - 1) selectTab(state.selectedIndex + 1);
      else if (diff < 0 && state.selectedIndex > 0) selectTab(state.selectedIndex - 1);
    };

    const setupSwipe = () => {
      if (!state.swipeable || state.orientation === 'vertical' || !state.contentEl) return;
      state.contentEl.addEventListener('touchstart', e => {
        state.touchStartX = e.touches[0].clientX;
        state.isSwiping = true;
      }, { passive: true });
      state.contentEl.addEventListener('touchmove', e => {
        if (state.isSwiping) state.touchEndX = e.touches[0].clientX;
      }, { passive: true });
      state.contentEl.addEventListener('touchend', () => {
        if (state.isSwiping) { handleSwipe(); state.isSwiping = false; }
      });
    };

    // ── DOM builders ─────────────────────────────────────────────────────────

    const buildTab = (tab, index) => {
      const btn = document.createElement('button');
      btn.className = 'md-tablayout-tab';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(index === state.selectedIndex));
      if (index === state.selectedIndex) btn.classList.add('md-active');
      if (tab.icon && !tab.text) btn.classList.add('md-icon-only');

      if (tab.icon) {
        const icon = document.createElement('span');
        icon.className = 'md-tablayout-tab-icon';
        icon.innerHTML = `<i class="${tab.icon}"></i>`;
        btn.appendChild(icon);
      }
      if (tab.text) {
        const span = document.createElement('span');
        span.textContent = tab.text;
        btn.appendChild(span);
      }
      if (tab.badge) {
        const badge = document.createElement('span');
        badge.className = 'md-tablayout-tab-badge';
        badge.textContent = tab.badge;
        btn.appendChild(badge);
      }

      btn.addEventListener('click', () => selectTab(index));
      return btn;
    };

    const buildPage = (page, index) => {
      const div = document.createElement('div');
      div.className = 'md-tablayout-page';
      div.setAttribute('role', 'tabpanel');
      div.setAttribute('data-page-index', String(index));
      if (index === state.selectedIndex) div.classList.add('md-active');
      if (!state.lazyLoad || index === state.selectedIndex) {
        setTimeout(() => loadPage(index), 0);
      }
      return div;
    };

    const build = () => {
      // Root
      state.element = document.createElement('div');
      state.element.className = [
        'md-tablayout',
        `theme-${state.theme}`,
        state.tabStyle !== 'default' ? `tabstyle-${state.tabStyle}` : '',
        state.orientation === 'vertical' ? 'orientation-vertical' : '',
        state.animation !== 'slide'      ? `animation-${state.animation}` : '',
        state.tabPosition === 'bottom'   ? 'tabposition-bottom' : '',
      ].filter(Boolean).join(' ');

      applyColors();

      // Tab bar
      state.tabsEl = document.createElement('div');
      state.tabsEl.className = `md-tablayout-tabs tabmode-${state.tabMode}`;
      state.tabsEl.setAttribute('role', 'tablist');

      state.tabs.forEach((tab, i) => {
        const el = buildTab(tab, i);
        state.tabEls.push(el);
        state.tabsEl.appendChild(el);
      });

      state.indicatorEl = document.createElement('div');
      state.indicatorEl.className = 'md-tablayout-indicator';
      state.tabsEl.appendChild(state.indicatorEl);
      state.element.appendChild(state.tabsEl);

      // Content
      state.contentEl = document.createElement('div');
      state.contentEl.className = `md-tablayout-content height-${state.heightMode}`;

      state.trackEl = document.createElement('div');
      state.trackEl.className = 'md-tablayout-pages-track';

      state.pages.forEach((page, i) => {
        const el = buildPage(page, i);
        state.pageEls.push(el);
        state.trackEl.appendChild(el);
      });

      state.contentEl.appendChild(state.trackEl);

      // Append tab bar and content in the correct order based on tabPosition
      if (state.tabPosition === 'bottom') {
        state.element.appendChild(state.contentEl);
        state.element.appendChild(state.tabsEl);
      } else {
        state.element.appendChild(state.tabsEl);
        state.element.appendChild(state.contentEl);
      }

      setupSwipe();

      setTimeout(() => {
        updateTrack();
        updateIndicator();
      }, 0);
    };

    // ─── Public API ──────────────────────────────────────────────────────────
    // All methods return `instance` for chaining.
    // setProps() is the primary Android-friendly entry point for bulk changes.

    const instance = {
      // ── Selection ──
      selectTab(index) { selectTab(index); return this; },
      getSelectedIndex() { return state.selectedIndex; },
      getSelectedTab() { return state.tabs[state.selectedIndex]; },
      nextTab() { selectTab(Math.min(state.selectedIndex + 1, state.tabs.length - 1)); return this; },
      prevTab() { selectTab(Math.max(state.selectedIndex - 1, 0)); return this; },

      // ── Content mutation ──
      addTab(tab, page) {
        const index = state.tabs.length;
        state.tabs.push(tab);
        state.pages.push(page);
        if (state.tabsEl && state.trackEl) {
          const tabEl = buildTab(tab, index);
          state.tabEls.push(tabEl);
          state.tabsEl.insertBefore(tabEl, state.indicatorEl);

          const pageEl = buildPage(page, index);
          state.pageEls.push(pageEl);
          state.trackEl.appendChild(pageEl);

          updateIndicator();
          updateTrack();
        }
        return this;
      },
      removeTab(index) {
        if (index < 0 || index >= state.tabs.length) return this;
        state.tabs.splice(index, 1);
        state.pages.splice(index, 1);
        state.tabEls[index]?.remove();
        state.tabEls.splice(index, 1);
        state.pageEls[index]?.remove();
        state.pageEls.splice(index, 1);
        state.loadedPages.delete(index);

        const next = state.selectedIndex >= state.tabs.length
          ? Math.max(0, state.tabs.length - 1)
          : state.selectedIndex;
        selectTab(next);
        return this;
      },

      // ── Badge ──
      updateTabBadge(index, badge) {
        const tabEl = state.tabEls[index];
        if (!tabEl) return this;
        let badgeEl = tabEl.querySelector('.md-tablayout-tab-badge');
        if (badge) {
          if (!badgeEl) {
            badgeEl = document.createElement('span');
            badgeEl.className = 'md-tablayout-tab-badge';
            tabEl.appendChild(badgeEl);
          }
          badgeEl.textContent = badge;
        } else {
          badgeEl?.remove();
        }
        return this;
      },

      // ── Appearance setters (individual) ──
      setTabStyle(style) {
        const old = state.tabStyle;
        state.tabStyle = style;
        if (state.element) {
          if (old !== 'default') state.element.classList.remove(`tabstyle-${old}`);
          if (style !== 'default') state.element.classList.add(`tabstyle-${style}`);
          applyColors(); // tab bar bg depends on style
          updateIndicator();
        }
        return this;
      },
      setTheme(theme) {
        state.theme = theme;
        if (state.element) {
          state.element.classList.remove('theme-light', 'theme-dark');
          state.element.classList.add(`theme-${theme}`);
        }
        return this;
      },
      setAccentColor(color) {
        state.accentColor = color;
        applyColors();
        return this;
      },
      setTabBarBg(color) {
        state.tabBarBg = color;
        applyColors();
        return this;
      },
      setContentBg(color) {
        state.contentBg = color;
        applyColors();
        return this;
      },
      setActiveTabColor(color) {
        state.activeTabColor = color;
        applyColors();
        return this;
      },
      setInactiveTabColor(color) {
        state.inactiveTabColor = color;
        applyColors();
        return this;
      },
      setIndicatorColor(color) {
        state.indicatorColor = color;
        applyColors();
        return this;
      },
      setPillActiveBg(color) {
        state.pillActiveBg = color;
        applyColors();
        return this;
      },
      setPillActiveText(color) {
        state.pillActiveText = color;
        applyColors();
        return this;
      },
      setAnimation(animation) {
        state.animation = animation;
        if (state.element) {
          state.element.classList.remove('animation-fade', 'animation-scale');
          if (animation !== 'slide') state.element.classList.add(`animation-${animation}`);
          updateTrack();
        }
        return this;
      },
      setHeightMode(mode) {
        state.heightMode = mode;
        if (state.contentEl) {
          state.contentEl.classList.remove('height-natural', 'height-fixed');
          state.contentEl.classList.add(`height-${mode}`);
          if (mode === 'fixed') syncHeight();
          else state.contentEl.style.height = '';
        }
        return this;
      },
      setSwipeable(enabled) {
        state.swipeable = enabled;
        return this;
      },
      setTabPosition(position) {
        // Only rebuild if the position actually changes and element exists
        if (state.tabPosition === position || !state.element) {
          state.tabPosition = position;
          return this;
        }
        state.tabPosition = position;
        state.element.classList.toggle('tabposition-bottom', position === 'bottom');
        if (position === 'bottom') {
          state.element.appendChild(state.contentEl); // moves contentEl after tabsEl
          state.element.appendChild(state.tabsEl);    // moves tabsEl to end (bottom)
        } else {
          state.element.appendChild(state.tabsEl);    // moves tabsEl before contentEl
          state.element.appendChild(state.contentEl);
        }
        return this;
      },

      // ── Bulk prop update (primary Android entry point) ──
      //    Call from Android: window.TabLayoutBridge.call('myId', 'setProps', { theme: 'light', accentColor: '#ff5722' })
      setProps(partial = {}) {
        const methods = {
          tabStyle:        'setTabStyle',
          theme:           'setTheme',
          accentColor:     'setAccentColor',
          tabBarBg:        'setTabBarBg',
          contentBg:       'setContentBg',
          activeTabColor:  'setActiveTabColor',
          inactiveTabColor:'setInactiveTabColor',
          indicatorColor:  'setIndicatorColor',
          pillActiveBg:    'setPillActiveBg',
          pillActiveText:  'setPillActiveText',
          animation:       'setAnimation',
          heightMode:      'setHeightMode',
          swipeable:       'setSwipeable',
          tabPosition:     'setTabPosition',
          selectedIndex:   'selectTab',
        };
        Object.entries(partial).forEach(([key, val]) => {
          if (methods[key] && instance[methods[key]]) {
            instance[methods[key]](val);
          }
        });
        return this;
      },

      // ── Page management ──
      reloadPage(index) {
        if (index >= 0 && index < state.pages.length) {
          state.loadedPages.delete(index);
          if (state.pageEls[index]) state.pageEls[index].innerHTML = '';
          if (index === state.selectedIndex) loadPage(index);
        }
        return this;
      },
      reloadAllPages() {
        state.loadedPages.clear();
        state.pageEls.forEach((el, i) => {
          el.innerHTML = '';
          if (i === state.selectedIndex) loadPage(i);
        });
        return this;
      },

      // ── DOM ──
      getElement() {
        if (!state.element) build();
        return state.element;
      },
      refresh() {
        updateTrack();
        updateIndicator();
        if (state.heightMode === 'fixed') syncHeight();
        return this;
      },
      debug() {
        console.table({
          selectedIndex:  state.selectedIndex,
          tabMode:        state.tabMode,
          heightMode:     state.heightMode,
          animation:      state.animation,
          tabStyle:       state.tabStyle,
          tabPosition:    state.tabPosition,
          theme:          state.theme,
          swipeable:      state.swipeable,
          lazyLoad:       state.lazyLoad,
          tabCount:       state.tabs.length,
          loadedPages:    [...state.loadedPages].join(','),
        });
        return this;
      },
    };

    build();

    // Register on Android bridge if bridgeId provided
    if (state.bridgeId) {
      if (!window.TabLayoutBridge) window.TabLayoutBridge = { instances: {}, call: null };
      window.TabLayoutBridge.instances[state.bridgeId] = instance;
    }

    return instance;
  };

  // ─── Android Bridge ──────────────────────────────────────────────────────────
  //
  // Any TabLayout with a bridgeId is auto-registered.
  // You can also register manually:  window.TabLayoutBridge.register('id', instance)
  //
  // Usage from Android WebView:
  //   webView.evaluateJavascript("window.TabLayoutBridge.call('myId', 'selectTab', 2)", null)
  //   webView.evaluateJavascript("window.TabLayoutBridge.call('myId', 'setProps', JSON.stringify({theme:'light'}))", null)
  //
  window.TabLayoutBridge = window.TabLayoutBridge || { instances: {} };
  window.TabLayoutBridge.register = (id, instance) => {
    window.TabLayoutBridge.instances[id] = instance;
  };
  window.TabLayoutBridge.call = (id, method, ...args) => {
    const inst = window.TabLayoutBridge.instances[id];
    if (!inst) { console.warn(`TabLayoutBridge: no instance with id "${id}"`); return; }
    if (typeof inst[method] !== 'function') { console.warn(`TabLayoutBridge: unknown method "${method}"`); return; }
    // Allow Android to pass setProps as a JSON string
    if (method === 'setProps' && typeof args[0] === 'string') {
      try { args[0] = JSON.parse(args[0]); } catch (e) { /* keep as-is */ }
    }
    return inst[method](...args);
  };

  // ─── ViewPager ───────────────────────────────────────────────────────────────
  // Standalone swipeable page container (no tabs).
  // Shares the same page-sliding architecture as TabLayout.

  const ViewPager = (props = {}) => {
    const state = {
      pages:        props.pages       || [],
      currentPage:  props.currentPage || 0,
      animation:    props.animation   || 'slide',
      heightMode:   props.heightMode  || 'natural',
      swipeable:    props.swipeable   !== false,
      lazyLoad:     props.lazyLoad    || false,
      onPageChanged: props.onPageChanged || null,
      element:      null,
      trackEl:      null,
      pageEls:      [],
      loadedPages:  new Set(),
      touchStartX:  0,
      touchEndX:    0,
      isSwiping:    false,
    };

    const loadPage = (index) => {
      if (state.loadedPages.has(index)) return;
      const page = state.pages[index];
      const pageEl = state.pageEls[index];
      if (!page || !pageEl) return;
      const el = extractElement(page);
      if (el) {
        pageEl.innerHTML = '';
        pageEl.appendChild(el);
        state.loadedPages.add(index);
        if (state.heightMode === 'fixed' && index === state.currentPage) {
          requestAnimationFrame(() => syncHeight());
        }
      }
    };

    const syncHeight = () => {
      if (!state.element || state.heightMode !== 'fixed') return;
      const current = state.pageEls[state.currentPage];
      if (current) state.element.style.height = `${current.scrollHeight}px`;
    };

    const updateTrack = () => {
      if (!state.trackEl) return;
      if (state.animation === 'slide') {
        state.trackEl.style.transform = `translateX(${-state.currentPage * 100}%)`;
      }
      if (state.heightMode === 'fixed') syncHeight();
    };

    const setPage = (index) => {
      if (index < 0 || index >= state.pages.length) return;
      const prev = state.currentPage;
      state.currentPage = index;

      if (state.animation === 'slide') {
        if (!state.loadedPages.has(index)) loadPage(index);
        updateTrack();
        state.pageEls.forEach((el, i) => el.classList.toggle('md-active', i === index));
      } else {
        state.pageEls.forEach((el, i) => {
          el.classList.remove('md-active');
          if (i === index) {
            if (!state.loadedPages.has(i)) loadPage(i);
            setTimeout(() => el.classList.add('md-active'), 0);
          }
        });
      }

      state.onPageChanged?.(index, prev);
    };

    const handleSwipe = () => {
      const diff = state.touchStartX - state.touchEndX;
      if (Math.abs(diff) < 50) return;
      if (diff > 0 && state.currentPage < state.pages.length - 1) setPage(state.currentPage + 1);
      else if (diff < 0 && state.currentPage > 0) setPage(state.currentPage - 1);
    };

    const build = () => {
      state.element = document.createElement('div');
      state.element.className = `md-tablayout-content height-${state.heightMode}${
        state.animation !== 'slide' ? ` animation-${state.animation}` : ''
      }`;

      state.trackEl = document.createElement('div');
      state.trackEl.className = 'md-tablayout-pages-track';

      state.pages.forEach((page, i) => {
        const el = document.createElement('div');
        el.className = 'md-tablayout-page';
        if (i === state.currentPage) el.classList.add('md-active');
        if (!state.lazyLoad || i === state.currentPage) setTimeout(() => loadPage(i), 0);
        state.pageEls.push(el);
        state.trackEl.appendChild(el);
      });

      state.element.appendChild(state.trackEl);

      if (state.swipeable) {
        state.element.addEventListener('touchstart', e => {
          state.touchStartX = e.touches[0].clientX;
          state.isSwiping = true;
        }, { passive: true });
        state.element.addEventListener('touchmove', e => {
          if (state.isSwiping) state.touchEndX = e.touches[0].clientX;
        }, { passive: true });
        state.element.addEventListener('touchend', () => {
          if (state.isSwiping) { handleSwipe(); state.isSwiping = false; }
        });
      }

      setTimeout(() => updateTrack(), 0);
    };

    const instance = {
      setPage(i) { setPage(i); return this; },
      getCurrentPage() { return state.currentPage; },
      nextPage() { setPage(Math.min(state.currentPage + 1, state.pages.length - 1)); return this; },
      prevPage() { setPage(Math.max(state.currentPage - 1, 0)); return this; },
      addPage(page) {
        state.pages.push(page);
        if (state.trackEl) {
          const el = document.createElement('div');
          el.className = 'md-tablayout-page';
          const i = state.pages.length - 1;
          if (!state.lazyLoad) setTimeout(() => loadPage(i), 0);
          state.pageEls.push(el);
          state.trackEl.appendChild(el);
        }
        return this;
      },
      setAnimation(animation) {
        state.animation = animation;
        if (state.element) {
          state.element.classList.remove('animation-fade', 'animation-scale');
          if (animation !== 'slide') state.element.classList.add(`animation-${animation}`);
          updateTrack();
        }
        return this;
      },
      setHeightMode(mode) {
        state.heightMode = mode;
        if (state.element) {
          state.element.classList.remove('height-natural', 'height-fixed');
          state.element.classList.add(`height-${mode}`);
          if (mode === 'fixed') syncHeight();
          else state.element.style.height = '';
        }
        return this;
      },
      getElement() { if (!state.element) build(); return state.element; },
      refresh() { updateTrack(); if (state.heightMode === 'fixed') syncHeight(); return this; },
    };

    build();
    return instance;
  };

  // ─── Export ──────────────────────────────────────────────────────────────────

  if (window.AndroidComponents) {
    window.AndroidComponents.TabLayout = TabLayout;
    window.AndroidComponents.ViewPager = ViewPager;
  } else {
    window.AndroidComponents = { TabLayout, ViewPager };
  }
})();
 