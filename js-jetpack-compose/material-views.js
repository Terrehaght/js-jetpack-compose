// ============================================
// AndroidComponents Core & Basic UI Components
// ============================================
const AndroidComponents = (() => {
    const {
        dp,
        applyStyles
    } = window.AndroidLayouts?.utils || {};
    const injectedStyles = new Set();

    // ==========================================
    // Core Utilities
    // ==========================================
    const injectStyles = (id, css) => {
        if (injectedStyles.has(id)) return;
        const style = document.createElement('style');
        style.id = `android-components-${id}`;
        style.textContent = css;
        document.head.appendChild(style);
        injectedStyles.add(id);
    };

    // Inject Material Switch & Button styles once
    injectStyles('material-controls', `
    /* Material Design CSS Variables */
    :root {
      --md-primary: #6750a4;
      --md-primary-hover: #7c5db5;
      --md-primary-container: #eaddff;
      --md-on-primary: #ffffff;
      --md-on-primary-container: #21005d;
      --md-surface: #ffffff;
      --md-surface-variant: #e7e0ec;
      --md-surface-container-low: #f7f2fa;
      --md-surface-container-highest: #e6e0e9;
      --md-on-surface: #1c1b1f;
      --md-on-surface-variant: #49454f;
      --md-outline: #79747e;
      --md-outline-variant: #cac4d0;
      --md-error: #b3261e;
      --md-success: #2e7d32;
      --md-disabled-bg: #1c1b1f1f;
      --md-disabled-text: #1c1b1f61;
      --md-shadow: rgba(0, 0, 0, 0.15);
      --md-ripple: rgba(103, 80, 164, 0.12);
    }

    .dark {
      --md-primary: #d0bcff;
      --md-primary-hover: #e0d0ff;
      --md-primary-container: #4f378b;
      --md-on-primary: #381e72;
      --md-on-primary-container: #eaddff;
      --md-surface: #1c1b1f;
      --md-surface-variant: #49454f;
      --md-surface-container-low: #1c1b1f;
      --md-surface-container-highest: #2a292d;
      --md-on-surface: #e6e1e5;
      --md-on-surface-variant: #cac4d0;
      --md-outline: #938f99;
      --md-outline-variant: #49454f;
      --md-error: #f2b8b5;
      --md-success: #66bb6a;
      --md-disabled-bg: #e6e1e51f;
      --md-disabled-text: #e6e1e561;
      --md-shadow: rgba(0, 0, 0, 0.4);
      --md-ripple: rgba(208, 188, 255, 0.12);
    }

    /* Material Switch Styles */
    .material-switch-container {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      
      user-select: none;
      font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }

    .material-switch-container.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .material-switch-label {
      font-size: 14px;
      color: var(--md-on-surface);
    }

    .material-switch {
      position: relative;
      width: 52px;
      height: 32px;
      flex-shrink: 0;
    }

    .material-switch-input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      
      margin: 0;
      z-index: 1;
    }

    .material-switch-input:disabled {
      cursor: not-allowed;
    }

    .material-switch-track {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--md-surface-variant);
      border: 2px solid var(--md-outline);
      border-radius: 16px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .material-switch-input:checked ~ .material-switch-track {
      background: var(--md-primary);
      border-color: var(--md-primary);
    }

    .material-switch-thumb {
      position: absolute;
      top: 50%;
      left: 6px;
      width: 16px;
      height: 16px;
      background: var(--md-outline);
      border-radius: 50%;
      transform: translateY(-50%);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .material-switch-thumb i {
      font-size: 12px;
      opacity: 0;
      transform: scale(0);
      transition: all 0.15s ease;
      color: var(--md-on-primary);
    }

    .material-switch-input:checked ~ .material-switch-thumb {
      left: calc(100% - 28px);
      width: 24px;
      height: 24px;
      background: var(--md-on-primary);
    }

    .material-switch-input:checked ~ .material-switch-thumb i {
      opacity: 1;
      transform: scale(1);
      color: var(--md-primary);
    }

    .material-switch-thumb::before {
      content: '';
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--md-on-surface);
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    .material-switch-container:hover:not(.disabled) .material-switch-thumb::before {
      opacity: 0.08;
    }

    .material-switch-input:focus-visible ~ .material-switch-thumb::before {
      opacity: 0.12;
    }

    /* Material Button Styles */
    .material-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 24px;
      border: none;
      border-radius: 20px;
      font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.1px;
      
      overflow: hidden;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      -webkit-tap-highlight-color: transparent;
      text-decoration: none;
      white-space: nowrap;
      outline: none;
      box-sizing: border-box;
    }

    .material-btn:focus-visible {
      outline: 2px solid var(--md-primary);
      outline-offset: 2px;
    }

    .material-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      background: currentColor;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .material-btn:hover::after {
      opacity: 0.08;
    }

    .material-btn:active::after {
      opacity: 0.12;
    }

    .material-btn.filled {
      background: var(--md-primary);
      color: var(--md-on-primary);
    }

    .material-btn.outlined {
      background: transparent;
      color: var(--md-primary);
      border: 1px solid var(--md-outline);
    }

    .material-btn.outlined:hover {
      background: var(--md-ripple);
    }

    .material-btn.text {
      background: transparent;
      color: var(--md-primary);
      padding: 10px 16px;
    }

    .material-btn.text:hover {
      background: var(--md-ripple);
    }

    .material-btn.elevated {
      background: var(--md-surface);
      color: var(--md-primary);
      box-shadow: 0 1px 3px var(--md-shadow), 0 1px 2px var(--md-shadow);
    }

    .material-btn.elevated:hover {
      box-shadow: 0 2px 6px var(--md-shadow), 0 2px 4px var(--md-shadow);
    }

    .material-btn.tonal {
      background: var(--md-primary-container);
      color: var(--md-on-primary-container);
    }

    .material-btn.small {
      padding: 6px 16px;
      font-size: 12px;
      border-radius: 16px;
      gap: 6px;
    }

    .material-btn.large {
      padding: 14px 32px;
      font-size: 16px;
      border-radius: 24px;
      gap: 10px;
    }

    .material-btn.icon-only {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 50%;
    }

    .material-btn.icon-only.small {
      width: 32px;
      height: 32px;
    }

    .material-btn.icon-only.large {
      width: 56px;
      height: 56px;
    }

    .material-btn.fullwidth {
      width: 100%;
    }

    .material-btn:disabled,
    .material-btn.disabled {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    .material-btn.filled:disabled {
      background: var(--md-disabled-bg);
      color: var(--md-disabled-text);
    }

    .material-btn i {
      font-size: 18px;
      line-height: 1;
    }

    .material-btn.small i {
      font-size: 16px;
    }

    .material-btn.large i {
      font-size: 22px;
    }

    .material-btn.icon-only i {
      font-size: 20px;
    }

    .material-btn.icon-only.large i {
      font-size: 24px;
    }

    .material-btn.loading {
      pointer-events: none;
    }

    .material-btn-loader {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .material-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: material-spin 0.8s linear infinite;
    }

    .material-btn.small .material-spinner {
      width: 14px;
      height: 14px;
    }

    .material-btn.large .material-spinner {
      width: 22px;
      height: 22px;
    }

    @keyframes material-spin {
      to { transform: rotate(360deg); }
    }

    /* Material Input Styles */
    .material-input-container {
      position: relative;
      width: 100%;
      font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
    }

    .material-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      border: 2px solid var(--md-outline);
      border-radius: 8px;
      background: var(--md-surface);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      cursor: text;
    }

    .material-input-wrapper:hover:not(.material-input-disabled):not(.material-input-focused) {
      border-color: var(--md-outline-variant);
    }

    .material-input-wrapper.material-input-focused {
      border-color: var(--md-primary);
      box-shadow: 0 0 0 3px var(--md-ripple);
    }

    .material-input-wrapper.material-input-error {
      border-color: var(--md-error);
    }

    .material-input-wrapper.material-input-error.material-input-focused {
      box-shadow: 0 0 0 3px rgba(179, 38, 30, 0.12);
    }

    .material-input-wrapper.material-input-success {
      border-color: var(--md-success);
    }

    .material-input-wrapper.material-input-success.material-input-focused {
      box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.12);
    }

    .material-input-wrapper.material-input-disabled {
      background: var(--md-disabled-bg);
      cursor: not-allowed;
      opacity: 0.7;
    }

    .material-input-leading-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 100%;
      color: var(--md-on-surface-variant);
      font-size: 20px;
      flex-shrink: 0;
      pointer-events: none;
    }

    .material-input-focused .material-input-leading-icon {
      color: var(--md-primary);
    }

    .material-input-error .material-input-leading-icon {
      color: var(--md-error);
    }

    .material-input-success .material-input-leading-icon {
      color: var(--md-success);
    }

    .material-input-field {
      flex: 1;
      width: 100%;
      padding: 16px 14px;
      border: none;
      outline: none;
      background: transparent;
      font-size: 16px;
      color: var(--md-on-surface);
      font-family: inherit;
      line-height: 1.5;
    }

    .material-input-has-leading .material-input-field {
      padding-left: 0;
    }

    .material-input-has-trailing .material-input-field {
      padding-right: 0;
    }

    .material-input-field::placeholder {
      color: transparent;
    }

    .material-input-field:disabled {
      color: var(--md-disabled-text);
      cursor: not-allowed;
    }

    textarea.material-input-field {
      min-height: 100px;
      resize: vertical;
    }

    .material-input-label {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      color: var(--md-on-surface-variant);
      pointer-events: none;
      transition: all 0.2s ease;
      background: transparent;
      padding: 0;
      white-space: nowrap;
    }

    .material-input-has-leading .material-input-label {
      left: 48px;
    }

    textarea.material-input-field ~ .material-input-label {
      top: 18px;
      transform: none;
    }

    .material-input-floated .material-input-label,
    .material-input-field:focus ~ .material-input-label {
      top: 0;
      transform: translateY(-50%);
      font-size: 12px;
      background: var(--md-surface);
      padding: 0 6px;
      left: 10px;
      color: var(--md-primary);
    }

    .material-input-has-leading.material-input-floated .material-input-label,
    .material-input-has-leading .material-input-field:focus ~ .material-input-label {
      left: 10px;
    }

    .material-input-error .material-input-label,
    .material-input-error .material-input-field:focus ~ .material-input-label {
      color: var(--md-error);
    }

    .material-input-success .material-input-label,
    .material-input-success .material-input-field:focus ~ .material-input-label {
      color: var(--md-success);
    }

    .material-input-disabled .material-input-label {
      background: var(--md-disabled-bg);
      color: var(--md-disabled-text);
    }

    .material-input-required .material-input-label::after {
      content: ' *';
      color: var(--md-error);
    }

    .material-input-trailing-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 100%;
      color: var(--md-on-surface-variant);
      font-size: 20px;
      flex-shrink: 0;
      
      border-radius: 0 6px 6px 0;
      transition: color 0.2s;
    }

    .material-input-trailing-icon:hover {
      color: var(--md-on-surface);
    }

    .material-input-focused .material-input-trailing-icon {
      color: var(--md-primary);
    }

    .material-input-disabled .material-input-trailing-icon {
      pointer-events: none;
      color: var(--md-disabled-text);
    }

    .material-input-helper {
      display: flex;
      justify-content: space-between;
      padding: 6px 14px 0;
      font-size: 12px;
      color: var(--md-on-surface-variant);
    }

    .material-input-helper-text {
      flex: 1;
    }

    .material-input-error .material-input-helper-text {
      color: var(--md-error);
    }

    .material-input-success .material-input-helper-text {
      color: var(--md-success);
    }

    .material-input-counter {
      flex-shrink: 0;
      margin-left: 12px;
    }

    .material-input-wrapper[data-color] {
      border-color: var(--md-custom-input-color);
    }

    .material-input-wrapper[data-color].material-input-focused {
      border-color: var(--md-custom-input-color);
      box-shadow: 0 0 0 3px var(--md-custom-input-color-light);
    }

    .material-input-wrapper[data-color] .material-input-label,
    .material-input-wrapper[data-color] .material-input-field:focus ~ .material-input-label {
      color: var(--md-custom-input-color);
    }

    .material-input-wrapper[data-color] .material-input-leading-icon,
    .material-input-wrapper[data-color].material-input-focused .material-input-trailing-icon {
      color: var(--md-custom-input-color);
    }
  `);

    // ==========================================
    // Helper Functions
    // ==========================================
    let idCounter = 0;
    const generateId = (prefix) => `${prefix}-${++idCounter}`;

    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const getLuminance = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return 0.299 * r + 0.587 * g + 0.114 * b;
    };

    // ==========================================
    // TextView (Enhanced)
    // ==========================================
    const TextView = (props = {}) => {
        const {
            text = '',
                isHtml = false, // Enhancement: Support HTML content
                textSize = 14,
                textColor,
                textStyle = 'normal',
                gravity, padding, margin, weight, alignSelf, width, height,
                maxLines, ellipsize = false, id, className,
                expandable = false,
                collapsedLines = 3,
                seeMoreText = 'See more',
                seeLessText = 'See less',
                onExpand = null,
                onCollapse = null,
                onClick = null // Enhancement: Click listener on the text itself
        } = props;

        const container = document.createElement('div');
        const textView = document.createElement('div');
        const textId = id ? `${id}_text` : `textview_${Math.random().toString(36).substr(2, 9)}`;

        // Helper for DP
        const safeDp = (val) => typeof dp === 'function' ? dp(val) : (typeof val === 'number' ? `${val}px` : val);

        let isExpanded = false;
        let seeMoreBtn = null;
        let resizeObserver = null;

        // --- Styles ---
        const baseStyles = {
            fontSize: safeDp(textSize),
            color: textColor || 'var(--md-on-surface)',
            fontWeight: textStyle === 'bold' ? 'bold' : 'normal',
            fontStyle: textStyle === 'italic' ? 'italic' : 'normal',
            boxSizing: 'border-box',
            lineHeight: '1.5',
            margin: '0',
            width: '100%',
            wordBreak: 'break-word'
        };

        // --- Container Setup ---
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        // Accessibility: Tell screen readers this is a region
        container.setAttribute('role', 'region');

        if (gravity === 'center') container.style.alignItems = 'center';
        else if (gravity === 'end' || gravity === 'right') container.style.alignItems = 'flex-end';
        else container.style.alignItems = 'flex-start';

        if (padding) container.style.padding = safeDp(padding);
        if (margin) container.style.margin = safeDp(margin);
        if (weight) container.style.flex = weight;
        if (alignSelf) container.style.alignSelf = alignSelf;

        if (width === 'match_parent') container.style.width = '100%';
        else if (width === 'wrap_content') container.style.width = 'fit-content';
        else if (width) container.style.width = safeDp(width);
        if (height === 'match_parent') container.style.height = '100%';
        else if (height) container.style.height = safeDp(height);

        // --- TextView Setup ---
        Object.assign(textView.style, baseStyles);
        textView.id = textId;

        // Enhancement: Handle HTML vs Plain Text
        if (isHtml) textView.innerHTML = text;
        else textView.textContent = text;

        if (gravity === 'center') textView.style.textAlign = 'center';
        else if (gravity === 'end' || gravity === 'right') textView.style.textAlign = 'right';

        // Enhancement: Add click listener to main text
        if (onClick) {
            textView.style.cursor = 'pointer';
            textView.addEventListener('click', onClick);
        }

        const applyCollapsedState = () => {
            textView.style.display = '-webkit-box';
            textView.style.webkitLineClamp = collapsedLines.toString();
            textView.style.webkitBoxOrient = 'vertical';
            textView.style.overflow = 'hidden';
            if (seeMoreBtn) seeMoreBtn.setAttribute('aria-expanded', 'false');
        };

        const applyExpandedState = () => {
            textView.style.display = 'block';
            textView.style.webkitLineClamp = 'unset';
            textView.style.webkitBoxOrient = 'unset';
            textView.style.overflow = 'visible';
            if (seeMoreBtn) seeMoreBtn.setAttribute('aria-expanded', 'true');
        };

        const checkTruncation = () => {
            if (!expandable || !seeMoreBtn) return;
            if (textView.clientHeight === 0) return;

            if (!isExpanded) {
                // Logic: scrollHeight > clientHeight implies overflow
                const hasOverflow = textView.scrollHeight > (textView.clientHeight + 1);
                seeMoreBtn.style.display = hasOverflow ? 'inline-block' : 'none';
            }
        };

        if (expandable) {
            applyCollapsedState();
            container.appendChild(textView);

            seeMoreBtn = document.createElement('button');
            seeMoreBtn.textContent = seeMoreText;

            // Accessibility Enhancements
            seeMoreBtn.setAttribute('aria-controls', textId);
            seeMoreBtn.setAttribute('aria-expanded', 'false');

            seeMoreBtn.style.cssText = `
      background: none;
      border: none;
      color: var(--md-primary, #007bff);
      font-size: ${safeDp(textSize)};
      font-weight: 500;
      padding: 4px 0;
      margin-top: 4px;
      display: none;
      cursor: pointer;
      font-family: inherit;
    `;

            // Hover effects
            seeMoreBtn.addEventListener('mouseenter', () => seeMoreBtn.style.textDecoration = 'underline');
            seeMoreBtn.addEventListener('mouseleave', () => seeMoreBtn.style.textDecoration = 'none');

            seeMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                isExpanded = !isExpanded;

                if (isExpanded) {
                    applyExpandedState();
                    seeMoreBtn.textContent = seeLessText;
                    if (onExpand) onExpand();
                } else {
                    applyCollapsedState();
                    seeMoreBtn.textContent = seeMoreText;
                    if (onCollapse) onCollapse();
                }
            });

            container.appendChild(seeMoreBtn);

            if ('ResizeObserver' in window) {
                resizeObserver = new ResizeObserver(() => {
                    window.requestAnimationFrame(checkTruncation);
                });
                resizeObserver.observe(textView);
                // Observe container too, in case width changes
                resizeObserver.observe(container);
            } else {
                setTimeout(checkTruncation, 200);
            }

        } else {
            // Standard setup
            if (maxLines) {
                textView.style.display = '-webkit-box';
                textView.style.webkitLineClamp = maxLines.toString();
                textView.style.webkitBoxOrient = 'vertical';
                textView.style.overflow = 'hidden';
            }
            if (ellipsize && !maxLines) {
                textView.style.overflow = 'hidden';
                textView.style.textOverflow = 'ellipsis';
                textView.style.whiteSpace = 'nowrap';
                textView.style.display = 'block';
            }
            container.appendChild(textView);
        }

        if (id) container.id = id;
        if (className) container.className = className;

        return {
            getElement: () => container,

            setText: (newText) => {
                if (isHtml) textView.innerHTML = newText;
                else textView.textContent = newText;

                if (expandable) {
                    isExpanded = false;
                    applyCollapsedState();
                    if (seeMoreBtn) {
                        seeMoreBtn.textContent = seeMoreText;
                        requestAnimationFrame(checkTruncation);
                    }
                }
            },

            // Enhancement: Dynamic Styling
            setTextColor: (color) => {
                textView.style.color = color;
            },

            getText: () => textView.textContent,

            expand: () => {
                if (expandable && !isExpanded && seeMoreBtn && seeMoreBtn.style.display !== 'none') {
                    seeMoreBtn.click();
                }
            },

            collapse: () => {
                if (expandable && isExpanded && seeMoreBtn) {
                    seeMoreBtn.click();
                }
            },

            isExpanded: () => isExpanded,

            // Enhancement: Memory Cleanup
            destroy: () => {
                if (resizeObserver) {
                    resizeObserver.disconnect();
                    resizeObserver = null;
                }
                container.remove(); // Removes from DOM
            }
        };
    };


    // ==========================================
    // MaterialImage Component
    // ==========================================

    const MaterialImage = (props = {}) => {
        const {
            src = '',
                alt = '',
                width,
                height,
                aspectRatio, // '16:9', '4:3', '1:1', 'square', etc.
                fit = 'cover', // cover, contain, fill, none, scale-down
                position = 'center', // center, top, bottom, left, right, or CSS position value
                cornerRadius = 0,
                border = null, // Border width in dp/px
                borderColor = 'var(--md-outline)',
                borderStyle = 'solid', // solid, dashed, dotted
                elevation = 0, // Shadow elevation (0-24)
                loading = 'lazy', // lazy, eager
                draggable = false,
                crossOrigin = null, // anonymous, use-credentials
                placeholder, // Placeholder image URL (tiny blur-up image)
                lowQualitySrc, // Low quality version for blur-up effect
                fallback, // Fallback image URL on error
                overlay = false, // Show dark overlay
                overlayOpacity = 0.3,
                blur = 0, // Blur effect in pixels
                grayscale = false,
                opacity = 1,
                rotate = 0, // Rotation in degrees
                flipX = false,
                flipY = false,
                enableBlurUp = true, // Enable blur-up progressive loading
                blurUpIntensity = 20, // Blur intensity for blur-up effect
                enableRetry = true, // Enable retry on network errors
                maxRetries = 3, // Maximum retry attempts
                retryDelay = 2000, // Delay between retries in ms
                onClick,
                onLoad,
                onError,
                onRetry,
                margin,
                padding,
                weight,
                alignSelf,
                id,
                className,
                title,
                ariaLabel
        } = props;

        const imgId = id || generateId('material-image');
        let hasLoaded = false;
        let hasError = false;
        let retryCount = 0;
        let retryTimeout = null;
        let isRetrying = false;

        // Container
        const container = document.createElement('div');
        const containerClasses = ['material-image-container'];
        if (className) containerClasses.push(className);
        container.className = containerClasses.join(' ');

        // Container styles
        const containerStyles = {
            position: 'relative',
            display: 'inline-block',
            overflow: 'hidden',
            borderRadius: dp(cornerRadius),
            boxSizing: 'border-box',
        };

        // Width handling
        if (width === 'match_parent') containerStyles.width = '100%';
        else if (width === 'wrap_content') containerStyles.width = 'auto';
        else if (width) containerStyles.width = dp(width);

        // Height handling
        if (height === 'match_parent') containerStyles.height = '100%';
        else if (height === 'wrap_content') containerStyles.height = 'auto';
        else if (height) containerStyles.height = dp(height);

        // Aspect ratio handling
        if (aspectRatio) {
            const ratios = {
                '16:9': '56.25%',
                '4:3': '75%',
                '3:2': '66.66%',
                '1:1': '100%',
                'square': '100%',
                '9:16': '177.77%',
                '3:4': '133.33%',
                '2:3': '150%'
            };

            if (ratios[aspectRatio]) {
                containerStyles.paddingTop = ratios[aspectRatio];
                containerStyles.height = '0';
            } else if (aspectRatio.includes(':')) {
                const [w, h] = aspectRatio.split(':').map(Number);
                containerStyles.paddingTop = `${(h / w) * 100}%`;
                containerStyles.height = '0';
            }
        }

        // Border
        if (border) {
            containerStyles.border = `${dp(border)} ${borderStyle} ${borderColor}`;
        }

        // Elevation (shadow)
        if (elevation > 0) {
            const shadowIntensity = Math.min(elevation / 24, 1);
            const blur = elevation * 2;
            const spread = elevation * 0.5;
            containerStyles.boxShadow = `0 ${elevation}px ${blur}px rgba(0, 0, 0, ${0.1 + shadowIntensity * 0.2}), 
                                  0 ${spread}px ${spread * 2}px rgba(0, 0, 0, ${0.05 + shadowIntensity * 0.1})`;
        }

        if (margin) containerStyles.margin = dp(margin);
        if (padding) containerStyles.padding = dp(padding);
        if (weight) containerStyles.flex = weight;
        if (alignSelf) containerStyles.alignSelf = alignSelf;
        if (onClick) {
            containerStyles.cursor = 'pointer';
            containerStyles.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        }

        applyStyles(container, containerStyles);

        // Image element
        const img = document.createElement('img');
        img.id = imgId;
        img.className = 'material-image-img';
        if (alt) img.alt = alt;
        if (title) img.title = title;
        if (ariaLabel) img.setAttribute('aria-label', ariaLabel);
        if (loading) img.loading = loading;
        if (crossOrigin) img.crossOrigin = crossOrigin;
        img.draggable = draggable;

        // Image styles
        const imgStyles = {
            width: '100%',
            height: '100%',
            objectFit: fit,
            objectPosition: position,
            display: 'block',
            opacity: opacity,
            transition: 'opacity 0.3s ease, filter 0.6s ease, transform 0.6s ease',
        };

        // Position absolutely if using aspect ratio
        if (aspectRatio) {
            imgStyles.position = 'absolute';
            imgStyles.top = '0';
            imgStyles.left = '0';
        }

        // Transforms
        const transforms = [];
        if (rotate) transforms.push(`rotate(${rotate}deg)`);
        if (flipX) transforms.push('scaleX(-1)');
        if (flipY) transforms.push('scaleY(-1)');
        if (transforms.length > 0) {
            imgStyles.transform = transforms.join(' ');
        }

        // Filters
        const filters = [];
        if (blur > 0) filters.push(`blur(${blur}px)`);
        if (grayscale) filters.push('grayscale(100%)');
        if (filters.length > 0) {
            imgStyles.filter = filters.join(' ');
        }

        applyStyles(img, imgStyles);

        // Blur-up progressive loading setup
        const shouldUseBlurUp = enableBlurUp && (lowQualitySrc || placeholder);
        let isBlurred = shouldUseBlurUp;

        if (shouldUseBlurUp) {
            // Start with blurred low-quality image
            img.classList.add('material-image-loading');
            const currentFilters = filters.slice();
            currentFilters.push(`blur(${blurUpIntensity}px)`);
            img.style.filter = currentFilters.join(' ');
            img.style.transform = `${transforms.join(' ')} scale(1.05)`.trim();
            img.src = lowQualitySrc || placeholder;
        } else if (placeholder) {
            img.src = placeholder;
        } else {
            img.src = src || '';
        }

        // Overlay element
        let overlayEl;
        if (overlay) {
            overlayEl = document.createElement('div');
            overlayEl.className = 'material-image-overlay';
            applyStyles(overlayEl, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: `rgba(0, 0, 0, ${overlayOpacity})`,
                pointerEvents: 'none',
                transition: 'opacity 0.3s ease',
            });
            container.appendChild(overlayEl);
        }

        // Loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'material-image-spinner';
        applyStyles(spinner, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            border: '4px solid var(--md-outline-variant)',
            borderTop: '4px solid var(--md-primary)',
            borderRadius: '50%',
            animation: 'material-spin 0.8s linear infinite',
            opacity: '0',
            transition: 'opacity 0.3s ease',
        });
        container.appendChild(spinner);

        // Add image to container
        container.appendChild(img);

        // Show spinner initially if loading and no low-quality preview
        if (!shouldUseBlurUp && src) {
            spinner.style.opacity = '1';
        }

        // Helper function to load high-quality image with blur-up effect
        const loadHighQualityImage = (imageSrc) => {
            if (!imageSrc) return;

            const fullImage = new Image();
            if (crossOrigin) fullImage.crossOrigin = crossOrigin;

            fullImage.onload = () => {
                // Smoothly transition to sharp image
                img.src = imageSrc;

                if (isBlurred) {
                    // Remove blur-up effect
                    img.classList.remove('material-image-loading');
                    const finalFilters = [];
                    if (blur > 0) finalFilters.push(`blur(${blur}px)`);
                    if (grayscale) finalFilters.push('grayscale(100%)');
                    img.style.filter = finalFilters.join(' ');
                    img.style.transform = transforms.join(' ');
                    isBlurred = false;
                }

                handleLoad();
            };

            fullImage.onerror = (e) => {
                handleError(e);
            };

            fullImage.src = imageSrc;
        };

        // Determine if error is network-related or invalid resource
        const isNetworkError = (error) => {
            // Network errors typically don't have a status or have certain patterns
            if (!error) return true;

            // Check if we can reach the image (this is a heuristic)
            // 404, 403, 400 = invalid resource (don't retry)
            // timeout, connection refused, CORS = network issue (retry)
            return true; // Conservative: assume network error for retry
        };

        // Load event handlers
        const handleLoad = () => {
            hasLoaded = true;
            hasError = false;
            retryCount = 0;
            isRetrying = false;
            spinner.style.opacity = '0';

            // Remove retry button if it exists
            const retryBtn = container.querySelector('.material-image-retry');
            if (retryBtn) retryBtn.remove();

            if (onLoad) onLoad();
        };

        const attemptRetry = () => {
            if (!enableRetry || retryCount >= maxRetries || isRetrying) return;

            retryCount++;
            isRetrying = true;

            if (onRetry) onRetry(retryCount);

            // Update retry button text
            const retryBtn = container.querySelector('.material-image-retry');
            if (retryBtn) {
                const retryText = retryBtn.querySelector('.retry-text');
                if (retryText) {
                    retryText.textContent = `Retrying (${retryCount}/${maxRetries})...`;
                }
                retryBtn.style.pointerEvents = 'none';
                retryBtn.style.opacity = '0.6';
            }

            // Show spinner during retry
            spinner.style.opacity = '1';

            retryTimeout = setTimeout(() => {
                if (shouldUseBlurUp && (lowQualitySrc || placeholder)) {
                    loadHighQualityImage(src);
                } else {
                    img.src = '';
                    img.src = src;
                }
                isRetrying = false;

                // Re-enable retry button
                if (retryBtn) {
                    retryBtn.style.pointerEvents = 'auto';
                    retryBtn.style.opacity = '1';
                }
            }, retryDelay);
        };

        const handleError = (error) => {
            hasError = true;
            spinner.style.opacity = '0';

            const shouldRetry = enableRetry &&
                retryCount < maxRetries &&
                isNetworkError(error) &&
                !isRetrying;

            if (shouldRetry) {
                // Automatic retry for first attempt
                if (retryCount === 0) {
                    attemptRetry();
                    return;
                }
            }

            // Use fallback if provided and we're out of retries or shouldn't retry
            if (fallback && img.src !== fallback && (!shouldRetry || retryCount >= maxRetries)) {
                img.src = fallback;
                hasError = false;
                return;
            }

            // Show error UI - no broken image icon
            img.style.display = 'none';

            const errorEl = document.createElement('div');
            errorEl.className = 'material-image-error';

            const errorContent = document.createElement('div');
            applyStyles(errorContent, {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
            });

            const iconEl = document.createElement('i');
            iconEl.className = shouldRetry ? 'bx bx-wifi-off' : 'bx bx-image-alt';
            iconEl.style.fontSize = '48px';
            iconEl.style.opacity = '0.5';
            errorContent.appendChild(iconEl);

            const messageEl = document.createElement('div');
            messageEl.textContent = shouldRetry ?
                'Connection issue' :
                'Image unavailable';
            messageEl.style.fontSize = '14px';
            messageEl.style.opacity = '0.7';
            errorContent.appendChild(messageEl);

            // Add retry button if retries are available
            if (shouldRetry) {
                const retryBtn = document.createElement('button');
                retryBtn.className = 'material-image-retry';
                retryBtn.style.cssText = `
        margin-top: 8px;
        padding: 8px 16px;
        background: var(--md-primary);
        color: var(--md-on-primary);
        border: none;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        
        transition: all 0.2s ease;
        font-family: inherit;
        display: flex;
        align-items: center;
        gap: 6px;
      `;

                const retryIcon = document.createElement('i');
                retryIcon.className = 'bx bx-refresh';
                retryIcon.style.fontSize = '16px';
                retryBtn.appendChild(retryIcon);

                const retryText = document.createElement('span');
                retryText.className = 'retry-text';
                retryText.textContent = `Retry (${retryCount}/${maxRetries})`;
                retryBtn.appendChild(retryText);

                retryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    attemptRetry();
                });

                retryBtn.addEventListener('mouseenter', () => {
                    retryBtn.style.transform = 'scale(1.05)';
                    retryBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                });

                retryBtn.addEventListener('mouseleave', () => {
                    retryBtn.style.transform = 'scale(1)';
                    retryBtn.style.boxShadow = 'none';
                });

                errorContent.appendChild(retryBtn);
            }

            errorEl.appendChild(errorContent);

            applyStyles(errorEl, {
                position: aspectRatio ? 'absolute' : 'relative',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--md-surface-variant)',
                color: 'var(--md-on-surface-variant)',
            });

            container.appendChild(errorEl);

            if (onError) onError(error, retryCount);
        };

        // Set up image loading with blur-up effect
        if (shouldUseBlurUp && src) {
            // Low quality image is already loaded, now load high quality
            loadHighQualityImage(src);
        } else {
            // Standard loading
            img.addEventListener('load', handleLoad);
            img.addEventListener('error', handleError);
        }

        // Click handler with hover effect
        if (onClick) {
            container.addEventListener('click', onClick);

            container.addEventListener('mouseenter', () => {
                container.style.transform = 'scale(1.02)';
                if (elevation > 0) {
                    const newElevation = elevation + 4;
                    const shadowIntensity = Math.min(newElevation / 24, 1);
                    const blur = newElevation * 2;
                    const spread = newElevation * 0.5;
                    container.style.boxShadow = `0 ${newElevation}px ${blur}px rgba(0, 0, 0, ${0.1 + shadowIntensity * 0.2}), 
                                      0 ${spread}px ${spread * 2}px rgba(0, 0, 0, ${0.05 + shadowIntensity * 0.1})`;
                }
            });

            container.addEventListener('mouseleave', () => {
                container.style.transform = 'scale(1)';
                if (elevation > 0) {
                    const shadowIntensity = Math.min(elevation / 24, 1);
                    const blur = elevation * 2;
                    const spread = elevation * 0.5;
                    container.style.boxShadow = `0 ${elevation}px ${blur}px rgba(0, 0, 0, ${0.1 + shadowIntensity * 0.2}), 
                                      0 ${spread}px ${spread * 2}px rgba(0, 0, 0, ${0.05 + shadowIntensity * 0.1})`;
                }
            });
        }

        return {
            getElement: () => container,
            getImage: () => img,
            getSrc: () => img.src,
            setSrc: (newSrc, newLowQualitySrc = null) => {
                hasLoaded = false;
                hasError = false;
                retryCount = 0;
                isRetrying = false;

                // Clear any retry timeout
                if (retryTimeout) {
                    clearTimeout(retryTimeout);
                    retryTimeout = null;
                }

                spinner.style.opacity = '1';
                img.style.display = 'block';

                // Remove any error placeholder
                const errorEl = container.querySelector('.material-image-error');
                if (errorEl) errorEl.remove();

                // Use blur-up if available
                if (enableBlurUp && newLowQualitySrc) {
                    isBlurred = true;
                    img.classList.add('material-image-loading');
                    const currentFilters = [];
                    if (blur > 0) currentFilters.push(`blur(${blur}px)`);
                    if (grayscale) currentFilters.push('grayscale(100%)');
                    currentFilters.push(`blur(${blurUpIntensity}px)`);
                    img.style.filter = currentFilters.join(' ');
                    img.style.transform = `${transforms.join(' ')} scale(1.05)`.trim();
                    img.src = newLowQualitySrc;
                    loadHighQualityImage(newSrc);
                } else {
                    img.src = newSrc;
                }
            },
            setAlt: (newAlt) => {
                img.alt = newAlt;
            },
            setOpacity: (newOpacity) => {
                img.style.opacity = newOpacity;
            },
            setBlur: (newBlur) => {
                const filters = [];
                if (newBlur > 0) filters.push(`blur(${newBlur}px)`);
                if (grayscale) filters.push('grayscale(100%)');
                img.style.filter = filters.join(' ');
            },
            setGrayscale: (enable) => {
                const filters = [];
                if (blur > 0) filters.push(`blur(${blur}px)`);
                if (enable) filters.push('grayscale(100%)');
                img.style.filter = filters.join(' ');
            },
            setRotation: (degrees) => {
                const transforms = [];
                transforms.push(`rotate(${degrees}deg)`);
                if (flipX) transforms.push('scaleX(-1)');
                if (flipY) transforms.push('scaleY(-1)');
                img.style.transform = transforms.join(' ');
            },
            setOverlay: (show, newOpacity) => {
                if (overlayEl) {
                    overlayEl.style.opacity = show ? (newOpacity || overlayOpacity) : '0';
                }
            },
            setBorder: (width, color, style = 'solid') => {
                container.style.border = width ? `${dp(width)} ${style} ${color}` : 'none';
            },
            setCornerRadius: (radius) => {
                container.style.borderRadius = dp(radius);
            },
            setElevation: (newElevation) => {
                if (newElevation > 0) {
                    const shadowIntensity = Math.min(newElevation / 24, 1);
                    const blur = newElevation * 2;
                    const spread = newElevation * 0.5;
                    container.style.boxShadow = `0 ${newElevation}px ${blur}px rgba(0, 0, 0, ${0.1 + shadowIntensity * 0.2}), 
                                      0 ${spread}px ${spread * 2}px rgba(0, 0, 0, ${0.05 + shadowIntensity * 0.1})`;
                } else {
                    container.style.boxShadow = 'none';
                }
            },
            reload: () => {
                const currentSrc = img.src;
                hasLoaded = false;
                hasError = false;
                retryCount = 0;
                img.src = '';
                img.src = currentSrc;
            },
            retry: () => {
                if (hasError && enableRetry && retryCount < maxRetries) {
                    attemptRetry();
                }
            },
            hasLoaded: () => hasLoaded,
            hasError: () => hasError,
            getRetryCount: () => retryCount,
            hide: () => {
                container.style.display = 'none';
            },
            show: () => {
                container.style.display = 'inline-block';
            },
            destroy: () => {
                if (retryTimeout) {
                    clearTimeout(retryTimeout);
                }
                img.removeEventListener('load', handleLoad);
                img.removeEventListener('error', handleError);
            }
        };
    };




    // ==========================================
    // MaterialInput
    // ==========================================
    const MaterialInput = (props = {}) => {
        const {
            id,
            name = '',
            label = 'Label',
            type = 'text', // text, password, email, number, tel, url, textarea
            value = '',
            placeholder = '',
            helperText = '',
            errorText = '',
            maxLength = null,
            showCounter = false,
            required = false,
            disabled = false,
            leadingIcon = null,
            trailingIcon = null,
            passwordToggle = true,
            color = null,
            autocomplete = 'off',
            pattern = null,
            inputMode = null,
            rows = 3,
            onInput = null,
            onChange = null,
            onFocus = null,
            onBlur = null,
            margin,
            weight,
            alignSelf,
            width,
            className
        } = props;

        const inputId = id || generateId('material-input');
        let isPasswordVisible = false;

        // Container
        const container = document.createElement('div');
        const containerClasses = ['material-input-container'];
        if (required) containerClasses.push('material-input-required');
        if (className) containerClasses.push(className);
        container.className = containerClasses.join(' ');

        // Apply container styles
        const containerStyles = {};
        if (margin) containerStyles.margin = dp(margin);
        if (weight) containerStyles.flex = weight;
        if (alignSelf) containerStyles.alignSelf = alignSelf;
        if (width === 'match_parent') containerStyles.width = '100%';
        else if (width) containerStyles.width = dp(width);
        applyStyles(container, containerStyles);

        // Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'material-input-wrapper';

        if (disabled) {
            wrapper.classList.add('material-input-disabled');
        }

        // Custom color
        if (color) {
            wrapper.dataset.color = color;
            wrapper.style.setProperty('--md-custom-input-color', color);
            wrapper.style.setProperty('--md-custom-input-color-light', hexToRgba(color, 0.15));
        }

        // Leading Icon
        let leadingIconEl;
        if (leadingIcon) {
            wrapper.classList.add('material-input-has-leading');
            leadingIconEl = document.createElement('span');
            leadingIconEl.className = 'material-input-leading-icon';
            leadingIconEl.innerHTML = `<i class="${leadingIcon}"></i>`;
            wrapper.appendChild(leadingIconEl);
        }

        // Input Field
        const isTextarea = type === 'textarea';
        const input = document.createElement(isTextarea ? 'textarea' : 'input');
        input.className = 'material-input-field';
        input.id = inputId;
        if (name) input.name = name;

        if (!isTextarea) {
            input.type = type === 'password' ? 'password' : type;
        } else {
            input.rows = rows;
        }

        input.value = value;
        input.placeholder = placeholder || label;
        input.disabled = disabled;
        input.autocomplete = autocomplete;
        if (maxLength) input.maxLength = maxLength;
        if (pattern) input.pattern = pattern;
        if (inputMode) input.inputMode = inputMode;
        if (required) input.required = true;

        wrapper.appendChild(input);

        // Floating Label
        const labelEl = document.createElement('label');
        labelEl.className = 'material-input-label';
        labelEl.setAttribute('for', inputId);
        labelEl.textContent = label;
        wrapper.appendChild(labelEl);

        // Trailing Icon / Password Toggle
        let trailingIconEl;
        const needsTrailing = trailingIcon || (type === 'password' && passwordToggle);
        if (needsTrailing) {
            wrapper.classList.add('material-input-has-trailing');
            trailingIconEl = document.createElement('span');
            trailingIconEl.className = 'material-input-trailing-icon';

            if (type === 'password' && passwordToggle) {
                trailingIconEl.innerHTML = `<i class="bx bx-hide"></i>`;
                trailingIconEl.setAttribute('role', 'button');
                trailingIconEl.setAttribute('aria-label', 'Toggle password visibility');
            } else if (trailingIcon) {
                trailingIconEl.innerHTML = `<i class="${trailingIcon}"></i>`;
            }

            wrapper.appendChild(trailingIconEl);
        }

        container.appendChild(wrapper);

        // Helper Text Row
        let helperRow, helperTextEl, counterEl;
        if (helperText || errorText || showCounter) {
            helperRow = document.createElement('div');
            helperRow.className = 'material-input-helper';

            helperTextEl = document.createElement('span');
            helperTextEl.className = 'material-input-helper-text';
            helperTextEl.textContent = errorText || helperText;
            helperRow.appendChild(helperTextEl);

            if (showCounter && maxLength) {
                counterEl = document.createElement('span');
                counterEl.className = 'material-input-counter';
                counterEl.textContent = `${value.length}/${maxLength}`;
                helperRow.appendChild(counterEl);
            }

            container.appendChild(helperRow);
        }

        // Initial float state
        if (value) {
            wrapper.classList.add('material-input-floated');
        }

        // Update counter helper
        const updateCounter = () => {
            if (counterEl && maxLength) {
                counterEl.textContent = `${input.value.length}/${maxLength}`;
            }
        };

        // Toggle password visibility
        const togglePassword = () => {
            isPasswordVisible = !isPasswordVisible;
            input.type = isPasswordVisible ? 'text' : 'password';
            const icon = trailingIconEl.querySelector('i');
            icon.className = isPasswordVisible ? 'bx bx-show' : 'bx bx-hide';
        };

        // Event Listeners
        input.addEventListener('focus', () => {
            wrapper.classList.add('material-input-focused', 'material-input-floated');
            if (onFocus) onFocus(input.value);
        });

        input.addEventListener('blur', () => {
            wrapper.classList.remove('material-input-focused');
            if (!input.value) {
                wrapper.classList.remove('material-input-floated');
            }
            if (onBlur) onBlur(input.value);
        });

        input.addEventListener('input', () => {
            updateCounter();
            if (onInput) onInput(input.value);
        });

        input.addEventListener('change', () => {
            if (onChange) onChange(input.value);
        });

        wrapper.addEventListener('click', (e) => {
            if (!disabled && e.target !== input) {
                input.focus();
            }
        });

        if (trailingIconEl && type === 'password' && passwordToggle) {
            trailingIconEl.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePassword();
            });
        }

        return {
            getElement: () => container,
            getInput: () => input,
            getValue: () => input.value,
            setValue: (newValue) => {
                input.value = newValue;
                if (newValue) {
                    wrapper.classList.add('material-input-floated');
                } else {
                    wrapper.classList.remove('material-input-floated');
                }
                updateCounter();
            },
            setError: (message) => {
                wrapper.classList.remove('material-input-success');
                wrapper.classList.add('material-input-error');
                if (helperTextEl) {
                    helperTextEl.textContent = message || errorText || 'Error';
                }
            },
            setSuccess: (message) => {
                wrapper.classList.remove('material-input-error');
                wrapper.classList.add('material-input-success');
                if (helperTextEl) {
                    helperTextEl.textContent = message || 'Success';
                }
            },
            clearState: () => {
                wrapper.classList.remove('material-input-error', 'material-input-success');
                if (helperTextEl) {
                    helperTextEl.textContent = helperText || '';
                }
            },
            setDisabled: (newDisabled) => {
                input.disabled = newDisabled;
                wrapper.classList.toggle('material-input-disabled', newDisabled);
            },
            focus: () => input.focus(),
            blur: () => input.blur(),
            reset: () => {
                input.value = '';
                wrapper.classList.remove('material-input-floated', 'material-input-error', 'material-input-success');
                if (helperTextEl) {
                    helperTextEl.textContent = helperText || '';
                }
                updateCounter();
            },
            validate: () => {
                const valid = input.checkValidity();
                if (!valid) {
                    wrapper.classList.add('material-input-error');
                    if (helperTextEl) {
                        helperTextEl.textContent = input.validationMessage;
                    }
                } else {
                    wrapper.classList.remove('material-input-error');
                }
                return valid;
            }
        };
    };






    // Add to the injectStyles section (after the material-input styles):

    injectStyles('material-spinner', `
  /* Material Spinner/Dropdown Styles */
  .material-spinner-container {
    position: relative;
    width: 100%;
    font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
  }

  .material-spinner-field {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 56px;
    padding: 8px 12px 8px 16px;
    border: 1px solid var(--md-outline);
    border-radius: 4px;
    background: var(--md-surface);
    
    transition: all 0.2s ease;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .material-spinner-field:hover:not(.material-spinner-disabled) {
    border-color: var(--md-on-surface);
    background: var(--md-surface-container-highest);
  }

  .material-spinner-field.material-spinner-focused {
    border-color: var(--md-primary);
    border-width: 2px;
    padding: 7px 11px 7px 15px;
    box-shadow: 0 0 0 3px var(--md-ripple);
  }

  .material-spinner-field.material-spinner-error {
    border-color: var(--md-error);
  }

  .material-spinner-field.material-spinner-disabled {
    background: var(--md-disabled-bg);
    cursor: not-allowed;
    opacity: 0.7;
  }

  .material-spinner-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .material-spinner-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: var(--md-on-surface-variant);
    flex-shrink: 0;
  }

  .material-spinner-focused .material-spinner-icon {
    color: var(--md-primary);
  }

  .material-spinner-text-wrapper {
    flex: 1;
    min-width: 0;
  }

  .material-spinner-label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    color: var(--md-on-surface-variant);
    pointer-events: none;
    transition: all 0.2s ease;
    background: transparent;
    padding: 0;
    white-space: nowrap;
  }

  .material-spinner-has-icon .material-spinner-label {
    left: 52px;
  }

  .material-spinner-floated .material-spinner-label {
    top: 0;
    transform: translateY(-50%);
    font-size: 12px;
    background: var(--md-surface);
    padding: 0 4px;
    left: 12px;
    color: var(--md-primary);
  }

  .material-spinner-has-icon.material-spinner-floated .material-spinner-label {
    left: 12px;
  }

  .material-spinner-error .material-spinner-label {
    color: var(--md-error);
  }

  .material-spinner-disabled .material-spinner-label {
    color: var(--md-disabled-text);
    background: var(--md-disabled-bg);
  }

  .material-spinner-selected-text {
    font-size: 16px;
    color: var(--md-on-surface);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .material-spinner-placeholder {
    font-size: 16px;
    color: var(--md-on-surface-variant);
    opacity: 0;
  }

  .material-spinner-floated .material-spinner-placeholder {
    opacity: 1;
  }

  .material-spinner-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--md-on-surface-variant);
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .material-spinner-arrow i {
    font-size: 24px;
  }

  .material-spinner-focused .material-spinner-arrow {
    color: var(--md-primary);
    transform: rotate(180deg);
  }

  .material-spinner-error .material-spinner-arrow {
    color: var(--md-error);
  }

  .material-spinner-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    max-height: 280px;
    background: var(--md-surface-container);
    border-radius: 4px;
    box-shadow: 0 4px 12px var(--md-shadow), 0 0 1px var(--md-outline);
    overflow: hidden;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-8px);
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .material-spinner-dropdown.material-spinner-open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .material-spinner-search-wrapper {
    padding: 8px;
    border-bottom: 1px solid var(--md-outline-variant);
    background: var(--md-surface);
  }

  .material-spinner-search {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--md-outline);
    border-radius: 4px;
    background: var(--md-surface);
    color: var(--md-on-surface);
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
  }

  .material-spinner-search:focus {
    border-color: var(--md-primary);
  }

  .material-spinner-search::placeholder {
    color: var(--md-on-surface-variant);
  }

  .material-spinner-options {
    max-height: 224px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .material-spinner-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    
    transition: background 0.15s ease;
    color: var(--md-on-surface);
    font-size: 14px;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .material-spinner-option:hover {
    background: var(--md-surface-container-highest);
  }

  .material-spinner-option.material-spinner-selected {
    background: var(--md-primary-container);
    color: var(--md-on-primary-container);
  }

  .material-spinner-option.material-spinner-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .material-spinner-option-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    color: var(--md-on-surface-variant);
  }

  .material-spinner-selected .material-spinner-option-icon {
    color: var(--md-on-primary-container);
  }

  .material-spinner-option-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .material-spinner-option-check {
    display: none;
    font-size: 18px;
    color: var(--md-primary);
    flex-shrink: 0;
  }

  .material-spinner-selected .material-spinner-option-check {
    display: flex;
  }

  .material-spinner-empty {
    padding: 24px 16px;
    text-align: center;
    color: var(--md-on-surface-variant);
    font-size: 14px;
  }

  .material-spinner-loading {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--md-on-surface-variant);
    font-size: 14px;
  }

  .material-spinner-loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--md-outline);
    border-top-color: var(--md-primary);
    border-radius: 50%;
    animation: material-spin 0.8s linear infinite;
  }

  .material-spinner-helper {
    display: flex;
    justify-content: space-between;
    padding: 6px 16px 0;
    font-size: 12px;
    color: var(--md-on-surface-variant);
  }

  .material-spinner-helper-text {
    flex: 1;
  }

  .material-spinner-error .material-spinner-helper-text {
    color: var(--md-error);
  }

  .material-spinner-required .material-spinner-label::after {
    content: ' *';
    color: var(--md-error);
  }

  /* Custom scrollbar for dropdown */
  .material-spinner-options::-webkit-scrollbar {
    width: 8px;
  }

  .material-spinner-options::-webkit-scrollbar-track {
    background: var(--md-surface-variant);
  }

  .material-spinner-options::-webkit-scrollbar-thumb {
    background: var(--md-outline);
    border-radius: 4px;
  }

  .material-spinner-options::-webkit-scrollbar-thumb:hover {
    background: var(--md-on-surface-variant);
  }

  /* Custom color support */
  .material-spinner-field[data-color].material-spinner-focused {
    border-color: var(--md-custom-spinner-color);
    box-shadow: 0 0 0 3px var(--md-custom-spinner-color-light);
  }

  .material-spinner-field[data-color] .material-spinner-floated .material-spinner-label {
    color: var(--md-custom-spinner-color);
  }

  .material-spinner-field[data-color] .material-spinner-focused .material-spinner-arrow,
  .material-spinner-field[data-color] .material-spinner-focused .material-spinner-icon {
    color: var(--md-custom-spinner-color);
  }
`);




    // ==========================================
    // MaterialSpinner
    // ==========================================

    const MaterialSpinner = (props = {}) => {
        const {
            id,
            name = '',
            label = 'Select',
            options = [],
            value = null,
            placeholder = '',
            helperText = '',
            errorText = '',
            required = false,
            disabled = false,
            searchable = false,
            searchPlaceholder = 'Search...',
            leadingIcon = null,
            color = null,
            emptyText = 'No options available',
            loadingText = 'Loading...',
            showCheckmark = true,
            lazyLoad = false,
            onLoadMore = null,
            onSearch = null,
            onChange = null,
            onOpen = null,
            onClose = null,
            margin,
            weight,
            alignSelf,
            width,
            className
        } = props;

        const spinnerId = id || generateId('material-spinner');
        let isOpen = false;
        let selectedValue = value;
        let filteredOptions = [...options];
        let isLoading = false;
        let searchTimeout = null;

        // Container
        const container = document.createElement('div');
        const containerClasses = ['material-spinner-container'];
        if (required) containerClasses.push('material-spinner-required');
        if (className) containerClasses.push(className);
        container.className = containerClasses.join(' ');

        // Apply container styles
        const containerStyles = {};
        if (margin) containerStyles.margin = dp(margin);
        if (weight) containerStyles.flex = weight;
        if (alignSelf) containerStyles.alignSelf = alignSelf;
        if (width === 'match_parent') containerStyles.width = '100%';
        else if (width) containerStyles.width = dp(width);
        applyStyles(container, containerStyles);

        // Hidden native select for form compatibility
        const hiddenSelect = document.createElement('select');
        hiddenSelect.style.display = 'none';
        hiddenSelect.id = spinnerId;
        if (name) hiddenSelect.name = name;
        if (required) hiddenSelect.required = true;
        if (disabled) hiddenSelect.disabled = true;
        container.appendChild(hiddenSelect);

        // Spinner Field
        const field = document.createElement('div');
        const fieldClasses = ['material-spinner-field'];
        if (disabled) fieldClasses.push('material-spinner-disabled');
        if (leadingIcon) fieldClasses.push('material-spinner-has-icon');
        field.className = fieldClasses.join(' ');

        // Custom color
        if (color) {
            field.dataset.color = color;
            field.style.setProperty('--md-custom-spinner-color', color);
            field.style.setProperty('--md-custom-spinner-color-light', hexToRgba(color, 0.15));
        }

        // Content wrapper
        const content = document.createElement('div');
        content.className = 'material-spinner-content';

        // Leading Icon
        let leadingIconEl;
        if (leadingIcon) {
            leadingIconEl = document.createElement('span');
            leadingIconEl.className = 'material-spinner-icon';
            leadingIconEl.innerHTML = `<i class="${leadingIcon}"></i>`;
            content.appendChild(leadingIconEl);
        }

        // Text wrapper
        const textWrapper = document.createElement('div');
        textWrapper.className = 'material-spinner-text-wrapper';

        const selectedText = document.createElement('div');
        selectedText.className = 'material-spinner-selected-text';

        const placeholderText = document.createElement('div');
        placeholderText.className = 'material-spinner-placeholder';
        placeholderText.textContent = placeholder || label;

        textWrapper.appendChild(selectedText);
        textWrapper.appendChild(placeholderText);
        content.appendChild(textWrapper);

        field.appendChild(content);

        // Label
        const labelEl = document.createElement('label');
        labelEl.className = 'material-spinner-label';
        labelEl.textContent = label;
        field.appendChild(labelEl);

        // Arrow
        const arrow = document.createElement('div');
        arrow.className = 'material-spinner-arrow';
        arrow.innerHTML = '<i class="bx bx-chevron-down"></i>';
        field.appendChild(arrow);

        container.appendChild(field);

        // Dropdown - NOW WITH PROPER Z-INDEX AND POSITIONING
        const dropdown = document.createElement('div');
        dropdown.style.background = 'white';
        dropdown.className = 'material-spinner-dropdown';
        dropdown.style.position = 'fixed'; // Changed from absolute to fixed for better positioning
        dropdown.style.zIndex = '999999'; // High z-index to appear above other elements

        // Search input
        let searchInput;
        if (searchable) {
            const searchWrapper = document.createElement('div');
            searchWrapper.className = 'material-spinner-search-wrapper';

            searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'material-spinner-search';
            searchInput.placeholder = searchPlaceholder;

            searchWrapper.appendChild(searchInput);
            dropdown.appendChild(searchWrapper);
        }

        // Options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'material-spinner-options';
        dropdown.appendChild(optionsContainer);

        container.appendChild(dropdown);

        // Helper text
        let helperRow, helperTextEl;
        if (helperText || errorText) {
            helperRow = document.createElement('div');
            helperRow.className = 'material-spinner-helper';

            helperTextEl = document.createElement('span');
            helperTextEl.className = 'material-spinner-helper-text';
            helperTextEl.textContent = errorText || helperText;
            helperRow.appendChild(helperTextEl);

            container.appendChild(helperRow);
        }

        // SMART POSITIONING FUNCTION
        const positionDropdown = () => {
            const fieldRect = field.getBoundingClientRect();
            const dropdownHeight = dropdown.offsetHeight || 300; // Default max height
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            // Calculate available space above and below
            const spaceBelow = viewportHeight - fieldRect.bottom;
            const spaceAbove = fieldRect.top;

            // Determine if dropdown should open upward or downward
            const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

            // Position dropdown
            let top, left;

            if (shouldOpenUpward) {
                // Open upward
                top = fieldRect.top - dropdownHeight;
                dropdown.classList.add('material-spinner-dropdown-upward');
                dropdown.classList.remove('material-spinner-dropdown-downward');
            } else {
                // Open downward (default)
                top = fieldRect.bottom;
                dropdown.classList.add('material-spinner-dropdown-downward');
                dropdown.classList.remove('material-spinner-dropdown-upward');
            }

            // Horizontal positioning
            left = fieldRect.left;
            const dropdownWidth = fieldRect.width;

            // Ensure dropdown stays within viewport horizontally
            if (left + dropdownWidth > viewportWidth) {
                left = viewportWidth - dropdownWidth - 16; // 16px padding from edge
            }
            if (left < 16) {
                left = 16;
            }

            // Ensure dropdown stays within viewport vertically
            if (top < 16) {
                top = 16;
            }
            if (top + dropdownHeight > viewportHeight) {
                top = viewportHeight - dropdownHeight - 16;
            }

            // Apply positioning
            dropdown.style.top = `${top}px`;
            dropdown.style.left = `${left}px`;
            dropdown.style.width = `${dropdownWidth}px`;
            dropdown.style.maxHeight = `${Math.min(dropdownHeight, viewportHeight - top - 16)}px`;
        };

        // THEME DETECTION AND APPLICATION
        const applyTheme = () => {
            const isDark = document.documentElement.classList.contains('dark') ||
                window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (isDark) {
                container.classList.add('material-spinner-dark-theme');
                container.classList.remove('material-spinner-light-theme');
            } else {
                container.classList.add('material-spinner-light-theme');
                container.classList.remove('material-spinner-dark-theme');
            }
        };

        // Watch for theme changes
        const themeObserver = new MutationObserver(() => applyTheme());
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Watch for system theme changes
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeMediaQuery.addEventListener('change', applyTheme);

        // Helper functions
        const getSelectedOption = () => {
            return options.find(opt => opt.value === selectedValue);
        };

        const updateSelectedDisplay = () => {
            const selected = getSelectedOption();

            if (selected) {
                field.classList.add('material-spinner-floated');

                if (leadingIconEl && selected.icon) {
                    leadingIconEl.innerHTML = `<i class="${selected.icon}"></i>`;
                }

                selectedText.textContent = selected.label;
                selectedText.style.display = 'block';
                placeholderText.style.display = 'none';

                hiddenSelect.value = selected.value;
            } else {
                field.classList.remove('material-spinner-floated');

                if (leadingIconEl && leadingIcon) {
                    leadingIconEl.innerHTML = `<i class="${leadingIcon}"></i>`;
                }

                selectedText.style.display = 'none';
                placeholderText.style.display = 'block';

                hiddenSelect.value = '';
            }
        };

        const renderOptions = (opts = filteredOptions) => {
            optionsContainer.innerHTML = '';

            if (isLoading) {
                const loadingEl = document.createElement('div');
                loadingEl.className = 'material-spinner-loading';
                loadingEl.innerHTML = `
        <div class="material-spinner-loading-spinner"></div>
        <span>${loadingText}</span>
      `;
                optionsContainer.appendChild(loadingEl);
                return;
            }

            if (opts.length === 0) {
                const emptyEl = document.createElement('div');
                emptyEl.className = 'material-spinner-empty';
                emptyEl.textContent = emptyText;
                optionsContainer.appendChild(emptyEl);
                return;
            }

            opts.forEach(option => {
                const optionEl = document.createElement('div');
                const optionClasses = ['material-spinner-option'];
                if (option.value === selectedValue) optionClasses.push('material-spinner-selected');
                if (option.disabled) optionClasses.push('material-spinner-disabled');
                optionEl.className = optionClasses.join(' ');
                optionEl.dataset.value = option.value;

                if (option.icon) {
                    const iconEl = document.createElement('span');
                    iconEl.className = 'material-spinner-option-icon';
                    iconEl.innerHTML = `<i class="${option.icon}"></i>`;
                    optionEl.appendChild(iconEl);
                }

                const textEl = document.createElement('span');
                textEl.className = 'material-spinner-option-text';
                textEl.textContent = option.label;
                optionEl.appendChild(textEl);

                if (showCheckmark) {
                    const checkEl = document.createElement('span');
                    checkEl.className = 'material-spinner-option-check';
                    checkEl.innerHTML = '<i class="bx bx-check"></i>';
                    optionEl.appendChild(checkEl);
                }

                if (!option.disabled) {
                    optionEl.addEventListener('click', () => selectOption(option.value));
                }

                optionsContainer.appendChild(optionEl);
            });

            if (lazyLoad && onLoadMore) {
                optionsContainer.addEventListener('scroll', handleScroll);
            }
        };

        const handleScroll = () => {
            if (isLoading) return;

            const {
                scrollTop,
                scrollHeight,
                clientHeight
            } = optionsContainer;
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                if (onLoadMore) {
                    setLoading(true);
                    onLoadMore(() => setLoading(false));
                }
            }
        };

        const selectOption = (val) => {
            selectedValue = val;
            updateSelectedDisplay();
            closeDropdown();

            if (onChange) {
                const selected = getSelectedOption();
                onChange(val, selected);
            }
        };

        const openDropdown = () => {
            if (disabled || isOpen) return;

            isOpen = true;
            field.classList.add('material-spinner-focused');
            dropdown.classList.add('material-spinner-open');

            // Position dropdown after it's visible
            setTimeout(() => {
                positionDropdown();
            }, 10);

            if (searchable && searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }

            if (onOpen) onOpen();
        };

        const closeDropdown = () => {
            if (!isOpen) return;

            isOpen = false;
            field.classList.remove('material-spinner-focused');
            dropdown.classList.remove('material-spinner-open');

            if (searchable && searchInput) {
                searchInput.value = '';
                filteredOptions = [...options];
                renderOptions();
            }

            if (onClose) onClose();
        };

        const toggleDropdown = () => {
            if (isOpen) closeDropdown();
            else openDropdown();
        };

        const setLoading = (loading) => {
            isLoading = loading;
            renderOptions();
        };

        const handleSearch = (query) => {
            if (onSearch) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    setLoading(true);
                    onSearch(query, (results) => {
                        filteredOptions = results;
                        setLoading(false);
                        renderOptions(results);
                    });
                }, 300);
            } else {
                const lowerQuery = query.toLowerCase();
                filteredOptions = options.filter(opt =>
                    opt.label.toLowerCase().includes(lowerQuery)
                );
                renderOptions();
            }
        };

        // Event Listeners
        field.addEventListener('click', toggleDropdown);

        if (searchInput) {
            searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
            searchInput.addEventListener('click', (e) => e.stopPropagation());
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && isOpen) {
                closeDropdown();
            }
        });

        // Reposition on scroll/resize
        window.addEventListener('scroll', () => {
            if (isOpen) positionDropdown();
        }, true);

        window.addEventListener('resize', () => {
            if (isOpen) positionDropdown();
        });

        // Keyboard navigation
        field.addEventListener('keydown', (e) => {
            if (disabled) return;

            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
            } else if (e.key === 'Escape' && isOpen) {
                closeDropdown();
            }
        });

        // Initialize
        applyTheme();
        updateSelectedDisplay();
        renderOptions();

        // Populate hidden select with options
        options.forEach(opt => {
            const optionEl = document.createElement('option');
            optionEl.value = opt.value;
            optionEl.textContent = opt.label;
            if (opt.disabled) optionEl.disabled = true;
            hiddenSelect.appendChild(optionEl);
        });

        // Cleanup function
        const cleanup = () => {
            themeObserver.disconnect();
            darkModeMediaQuery.removeEventListener('change', applyTheme);
        };

        return {
            getElement: () => container,
            getValue: () => selectedValue,
            setValue: (val) => {
                selectedValue = val;
                updateSelectedDisplay();
            },
            getSelectedOption: () => getSelectedOption(),
            setOptions: (newOptions) => {
                filteredOptions = [...newOptions];

                hiddenSelect.innerHTML = '';
                newOptions.forEach(opt => {
                    const optionEl = document.createElement('option');
                    optionEl.value = opt.value;
                    optionEl.textContent = opt.label;
                    if (opt.disabled) optionEl.disabled = true;
                    hiddenSelect.appendChild(optionEl);
                });

                renderOptions();
                updateSelectedDisplay();
            },
            addOption: (option) => {
                filteredOptions.push(option);

                const optionEl = document.createElement('option');
                optionEl.value = option.value;
                optionEl.textContent = option.label;
                if (option.disabled) optionEl.disabled = true;
                hiddenSelect.appendChild(optionEl);

                renderOptions();
            },
            removeOption: (val) => {
                filteredOptions = filteredOptions.filter(opt => opt.value !== val);

                const optionEl = Array.from(hiddenSelect.options).find(opt => opt.value === val);
                if (optionEl) optionEl.remove();

                if (selectedValue === val) {
                    selectedValue = null;
                    updateSelectedDisplay();
                }
                renderOptions();
            },
            open: openDropdown,
            close: closeDropdown,
            toggle: toggleDropdown,
            isOpen: () => isOpen,
            setLoading,
            setError: (message) => {
                field.classList.add('material-spinner-error');
                if (helperTextEl) {
                    helperTextEl.textContent = message || errorText || 'Error';
                }
            },
            clearError: () => {
                field.classList.remove('material-spinner-error');
                if (helperTextEl) {
                    helperTextEl.textContent = helperText || '';
                }
            },
            setDisabled: (newDisabled) => {
                hiddenSelect.disabled = newDisabled;
                field.classList.toggle('material-spinner-disabled', newDisabled);
                if (newDisabled) closeDropdown();
            },
            reset: () => {
                selectedValue = null;
                updateSelectedDisplay();
                if (searchInput) searchInput.value = '';
                filteredOptions = [...options];
                renderOptions();
                closeDropdown();
            },
            validate: () => {
                const valid = hiddenSelect.checkValidity();
                if (!valid) {
                    field.classList.add('material-spinner-error');
                    if (helperTextEl) {
                        helperTextEl.textContent = hiddenSelect.validationMessage;
                    }
                }
                return valid;
            },
            destroy: cleanup
        };
    };


    // ==========================================
    // MaterialButton
    // ==========================================
    const MaterialButton = (props = {}) => {
        const {
            text = 'Button',
                onClick,
                variant = 'filled', // filled, outlined, text, elevated, tonal
                size = 'medium', // small, medium, large
                leadingIcon,
                trailingIcon,
                iconOnly = false,
                disabled = false,
                fullWidth = false,
                color,
                type = 'button',
                id,
                className,
                margin,
                weight,
                alignSelf
        } = props;

        let isLoading = false;
        let originalContent = null;

        const button = document.createElement('button');
        button.type = type;
        button.disabled = disabled;

        // Build classes
        const classes = ['material-btn', variant];
        if (size !== 'medium') classes.push(size);
        if (iconOnly) classes.push('icon-only');
        if (fullWidth) classes.push('fullwidth');
        if (disabled) classes.push('disabled');
        if (className) classes.push(className);

        button.className = classes.join(' ');

        // Apply custom styles
        const styles = {};
        if (margin) styles.margin = dp(margin);
        if (weight) styles.flex = weight;
        if (alignSelf) styles.alignSelf = alignSelf;
        applyStyles(button, styles);

        if (id) button.id = id;

        // Apply custom color
        const applyCustomColor = (customColor) => {
            button.dataset.color = customColor;
            button.style.setProperty('--md-custom-color', customColor);

            const textColor = getLuminance(customColor) > 0.5 ? '#1a1a1a' : '#ffffff';
            button.style.setProperty('--md-custom-text', textColor);
            button.style.setProperty('--md-custom-container', hexToRgba(customColor, 0.15));

            // Override colors for custom color
            if (variant === 'filled') {
                button.style.background = customColor;
                button.style.color = textColor;
            } else if (variant === 'outlined' || variant === 'text') {
                button.style.color = customColor;
            }
        };

        if (color) applyCustomColor(color);

        // Build content
        const buildContent = () => {
            button.innerHTML = '';

            if (iconOnly) {
                const icon = leadingIcon || trailingIcon;
                if (icon) {
                    button.innerHTML = `<i class="${icon}"></i>`;
                }
            } else {
                if (leadingIcon) {
                    const iconEl = document.createElement('i');
                    iconEl.className = leadingIcon;
                    button.appendChild(iconEl);
                }

                if (text) {
                    const textEl = document.createElement('span');
                    textEl.textContent = text;
                    button.appendChild(textEl);
                }

                if (trailingIcon) {
                    const iconEl = document.createElement('i');
                    iconEl.className = trailingIcon;
                    button.appendChild(iconEl);
                }
            }
        };

        buildContent();

        // Event listeners
        if (!disabled && onClick) {
            button.addEventListener('click', (e) => {
                if (!isLoading) onClick(e);
            });
        }

        return {
            getElement: () => button,
            setText: (newText) => {
                if (!isLoading) {
                    const textSpan = button.querySelector('span');
                    if (textSpan) textSpan.textContent = newText;
                }
            },
            setIcon: (leading, trailing) => {
                if (!isLoading) buildContent();
            },
            setLoading: (loading, loadingText = '') => {
                isLoading = loading;

                if (loading) {
                    originalContent = button.innerHTML;
                    button.classList.add('loading');
                    button.innerHTML = `
            <div class="material-btn-loader">
              <div class="material-spinner"></div>
              ${loadingText ? `<span>${loadingText}</span>` : ''}
            </div>
          `;
                } else {
                    button.classList.remove('loading');
                    if (originalContent) {
                        button.innerHTML = originalContent;
                        originalContent = null;
                    }
                }
            },
            isLoading: () => isLoading,
            setDisabled: (newDisabled) => {
                button.disabled = newDisabled;
                button.classList.toggle('disabled', newDisabled);
            },
            setVariant: (newVariant) => {
                button.classList.remove('filled', 'outlined', 'text', 'elevated', 'tonal');
                button.classList.add(newVariant);
            },
            click: () => button.click()
        };
    };

    // ==========================================
    // MaterialSwitch
    // ==========================================
    const MaterialSwitch = (props = {}) => {
        const {
            checked = false,
                disabled = false,
                label = '',
                labelPosition = 'right', // left, right
                showIcon = true,
                color,
                onChange,
                id,
                className,
                name,
                margin,
                weight,
                alignSelf
        } = props;

        const switchId = id || generateId('material-switch');

        // Container
        const container = document.createElement('label');
        container.htmlFor = switchId;

        const classes = ['material-switch-container'];
        if (disabled) classes.push('disabled');
        if (className) classes.push(className);
        container.className = classes.join(' ');

        // Apply custom styles
        const styles = {};
        if (margin) styles.margin = dp(margin);
        if (weight) styles.flex = weight;
        if (alignSelf) styles.alignSelf = alignSelf;
        applyStyles(container, styles);

        // Custom color
        if (color) {
            container.dataset.color = color;
            container.style.setProperty('--md-custom-color', color);
        }

        // Label (left)
        let labelEl;
        if (label && labelPosition === 'left') {
            labelEl = document.createElement('span');
            labelEl.className = 'material-switch-label';
            labelEl.textContent = label;
            container.appendChild(labelEl);
        }

        // Switch element
        const switchEl = document.createElement('div');
        switchEl.className = 'material-switch';

        // Hidden input
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'material-switch-input';
        input.id = switchId;
        if (name) input.name = name;
        input.checked = checked;
        input.disabled = disabled;

        // Track
        const track = document.createElement('div');
        track.className = 'material-switch-track';

        // Thumb
        const thumb = document.createElement('div');
        thumb.className = 'material-switch-thumb';
        if (showIcon) {
            thumb.innerHTML = '<i class="bx bx-check"></i>';
        }

        switchEl.appendChild(input);
        switchEl.appendChild(track);
        switchEl.appendChild(thumb);
        container.appendChild(switchEl);

        // Label (right)
        if (label && labelPosition === 'right') {
            labelEl = document.createElement('span');
            labelEl.className = 'material-switch-label';
            labelEl.textContent = label;
            container.appendChild(labelEl);
        }

        // Event listeners
        if (onChange) {
            input.addEventListener('change', () => {
                onChange(input.checked);
            });
        }

        return {
            getElement: () => container,
            getChecked: () => input.checked,
            setChecked: (newChecked) => {
                input.checked = newChecked;
            },
            toggle: () => {
                input.checked = !input.checked;
                if (onChange) onChange(input.checked);
            },
            setDisabled: (newDisabled) => {
                input.disabled = newDisabled;
                container.classList.toggle('disabled', newDisabled);
            },
            setLabel: (newLabel) => {
                if (labelEl) labelEl.textContent = newLabel;
            }
        };
    };

    // ==========================================
    // Button (Legacy - keeping for compatibility)
    // ==========================================
    const Button = (props = {}) => {
        const {
            text = 'Button', onClick, background, textColor,
                padding = 12, margin, weight, alignSelf, width, height,
                disabled = false, id, className, variant = 'filled', icon
        } = props;

        const button = document.createElement('button');
        button.disabled = disabled;

        const variantStyles = {
            filled: {
                background: 'var(--md-primary)',
                color: 'var(--md-on-primary)',
                border: 'none',
            },
            outlined: {
                background: 'transparent',
                color: 'var(--md-primary)',
                border: '1px solid var(--md-outline)',
            },
            text: {
                background: 'transparent',
                color: 'var(--md-primary)',
                border: 'none',
            },
            tonal: {
                background: 'var(--md-secondary-container)',
                color: 'var(--md-on-secondary-container)',
                border: 'none',
            },
            elevated: {
                background: 'var(--md-surface-container-low)',
                color: 'var(--md-primary)',
                border: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }
        };

        const baseStyles = {
            padding: dp(padding),
            borderRadius: '20px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
            boxSizing: 'border-box',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: disabled ? 0.5 : 1,
            ...variantStyles[variant]
        };

        if (background) baseStyles.background = background;
        if (textColor) baseStyles.color = textColor;
        if (margin) baseStyles.margin = dp(margin);
        if (weight) baseStyles.flex = weight;
        if (alignSelf) baseStyles.alignSelf = alignSelf;
        if (width === 'match_parent') baseStyles.width = '100%';
        else if (width) baseStyles.width = dp(width);
        if (height) baseStyles.height = dp(height);

        applyStyles(button, baseStyles);
        if (id) button.id = id;
        if (className) button.className = className;

        if (icon) {
            const iconEl = document.createElement('i');
            iconEl.className = icon;
            button.appendChild(iconEl);
        }
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        button.appendChild(textSpan);

        if (!disabled && onClick) button.addEventListener('click', onClick);

        return {
            getElement: () => button,
            setText: (newText) => {
                textSpan.textContent = newText;
            },
            setEnabled: (enabled) => {
                button.disabled = !enabled;
                button.style.opacity = enabled ? '1' : '0.5';
                button.style.cursor = enabled ? 'pointer' : 'not-allowed';
            }
        };
    };

    // ==========================================
    // Enhanced Card Component
    // ==========================================
    const Card = (props = {}, children = []) => {
        const {
            elevation = 1,
                padding = 16,
                margin = 0,
                cornerRadius = 12,
                width,
                height,
                onClick,
                id,
                className,
                variant = 'elevated',
                // New stroke/border properties
                strokeWidth = 0,
                strokeColor = 'var(--md-outline)',
                // New background properties
                backgroundColor,
                // New hover properties
                hoverable = false,
                hoverElevation,
                // New overflow property
                overflow = 'visible',
                // New transition properties
                transition = 'all 0.3s ease',
                // New ripple effect
                ripple = false,
                // New disabled state
                disabled = false,
                // New content alignment
                alignContent = 'flex-start',
                justifyContent = 'flex-start',
                gap = 0
        } = props;

        const card = document.createElement('div');

        const variantStyles = {
            elevated: {
                background: backgroundColor || 'var(--md-surface-container-low)',
                boxShadow: `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.1)`,
            },
            filled: {
                background: backgroundColor || 'var(--md-surface-container-highest)',
                boxShadow: 'none',
            },
            outlined: {
                background: backgroundColor || 'var(--md-surface)',
                border: '1px solid var(--md-outline-variant)',
                boxShadow: 'none',
            }
        };

        const styles = {
            borderRadius: dp(cornerRadius),
            padding: dp(padding),
            margin: dp(margin),
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: alignContent,
            justifyContent: justifyContent,
            gap: dp(gap),
            overflow: overflow,
            transition: transition,
            position: 'relative',
            ...variantStyles[variant]
        };

        // Apply stroke/border with same radius
        if (strokeWidth > 0) {
            styles.border = `${dp(strokeWidth)} solid ${strokeColor}`;
            // Ensure border radius applies to the stroke
            styles.borderRadius = dp(cornerRadius);
        }

        // Width and height handling
        if (width === 'match_parent') styles.width = '100%';
        else if (width) styles.width = dp(width);
        if (height === 'match_parent') styles.height = '100%';
        else if (height) styles.height = dp(height);

        // Disabled state
        if (disabled) {
            styles.opacity = '0.38';
            styles.pointerEvents = 'none';
        }

        // Click and hover handling
        if (onClick && !disabled) {
            styles.cursor = 'pointer';
            card.addEventListener('click', onClick);

            // Hoverable effect
            if (hoverable) {
                const hoverElev = hoverElevation || elevation + 2;
                card.addEventListener('mouseenter', () => {
                    card.style.boxShadow = `0 ${hoverElev}px ${hoverElev * 2}px rgba(0,0,0,0.15)`;
                    card.style.transform = 'translateY(-2px)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.boxShadow = styles.boxShadow;
                    card.style.transform = 'translateY(0)';
                });
            }

            // Ripple effect
            if (ripple) {
                card.style.overflow = 'hidden';
                card.addEventListener('click', (e) => {
                    const rippleEl = document.createElement('span');
                    const rect = card.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;

                    rippleEl.style.width = rippleEl.style.height = `${size}px`;
                    rippleEl.style.left = `${x}px`;
                    rippleEl.style.top = `${y}px`;
                    rippleEl.style.position = 'absolute';
                    rippleEl.style.borderRadius = '50%';
                    rippleEl.style.background = 'rgba(255,255,255,0.4)';
                    rippleEl.style.transform = 'scale(0)';
                    rippleEl.style.animation = 'ripple 0.6s ease-out';
                    rippleEl.style.pointerEvents = 'none';

                    card.appendChild(rippleEl);
                    setTimeout(() => rippleEl.remove(), 600);
                });

                // Add ripple animation
                if (!document.getElementById('ripple-animation')) {
                    const style = document.createElement('style');
                    style.id = 'ripple-animation';
                    style.textContent = `
            @keyframes ripple {
              to {
                transform: scale(2);
                opacity: 0;
              }
            }
          `;
                    document.head.appendChild(style);
                }
            }
        }

        applyStyles(card, styles);
        if (id) card.id = id;
        if (className) card.className = className;

        children.forEach(child => {
            if (child && typeof child.getElement === 'function') {
                card.appendChild(child.getElement());
            } else if (child instanceof HTMLElement) {
                card.appendChild(child);
            }
        });

        return {
            getElement: () => card,
            // Expose methods for dynamic updates
            updateStroke: (width, color) => {
                card.style.border = `${dp(width)} solid ${color}`;
            },
            updateRadius: (radius) => {
                card.style.borderRadius = dp(radius);
            },
            updateElevation: (elev) => {
                card.style.boxShadow = `0 ${elev}px ${elev * 2}px rgba(0,0,0,0.1)`;
            }
        };
    };
    // Helper to render icons (Class string or SVG)
    const renderIcon = (iconData, element) => {
        element.innerHTML = ''; // Clear previous
        if (!iconData) return;

        if (iconData.includes('<svg')) {
            element.innerHTML = iconData;
        } else {
            // Assume it's a class string like 'bx bx-check'
            const i = document.createElement('i');
            i.className = iconData;
            element.appendChild(i);
        }
    };

    // Helper for dp (in case you don't have it globally)
    const safeDp = (val) => typeof dp === 'function' ? dp(val) : (typeof val === 'number' ? `${val}px` : val);
    // ==========================================
    // Material 3 Checkbox Component
    // ==========================================
    const MaterialCheckbox = (props = {}) => {
        const {
            id,
            className,
            checked = false,
            disabled = false,
            indeterminate = false,
            label = '',
            onChange,
            size = 18,
            color = 'var(--md-primary)',
            onColor = 'var(--md-on-primary, white)', // Color of the icon
            borderColor = 'var(--md-outline, #79747e)',
            errorColor = 'var(--md-error)',
            checkedIcon = 'bx bx-check', // Default icon (requires Boxicons loaded) or use SVG
            ripple = true,
            error = false,
            name,
            value
        } = props;

        const container = document.createElement('label');
        const wrapper = document.createElement('div');
        const input = document.createElement('input');
        const checkboxBox = document.createElement('div');
        const iconContainer = document.createElement('div');
        const labelText = document.createElement('span');

        // Input Setup
        input.type = 'checkbox';
        input.checked = checked;
        input.disabled = disabled;
        if (name) input.name = name;
        if (value) input.value = value;
        if (id) input.id = id;

        // Hide native input but keep it accessible
        Object.assign(input.style, {
            position: 'absolute',
            opacity: 0,
            width: 0,
            height: 0,
            margin: 0
        });

        // Container (Label) Styles
        Object.assign(container.style, {
            display: 'inline-flex',
            alignItems: 'center', // Fix vertical alignment
            gap: safeDp(12),
            cursor: disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none',
            opacity: disabled ? '0.38' : '1',
            position: 'relative',
            minHeight: safeDp(size + 16) // Touch target size
        });

        // Wrapper (The Ripple Area)
        Object.assign(wrapper.style, {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: safeDp(40), // M3 Standard touch target
            height: safeDp(40),
            borderRadius: '50%'
        });

        // The Visual Box
        Object.assign(checkboxBox.style, {
            width: safeDp(size),
            height: safeDp(size),
            border: `2px solid ${borderColor}`,
            borderRadius: safeDp(2), // M3 uses 2px radius
            position: 'relative',
            transition: 'background-color 0.2s, border-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            backgroundColor: 'transparent'
        });

        // Icon Container
        Object.assign(iconContainer.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: onColor,
            fontSize: safeDp(size * 0.8), // Scale icon to fit
            opacity: 0,
            transform: 'scale(0.5)',
            transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
            width: '100%',
            height: '100%'
        });

        // Default SVG Checkmark if no Boxicons
        const defaultCheckmark = `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;

        // Determine what icon to render
        const iconToRender = checkedIcon === 'bx bx-check' && !document.querySelector('link[href*="boxicons"]') ?
            defaultCheckmark :
            checkedIcon;

        renderIcon(iconToRender, iconContainer);

        if (label) {
            labelText.textContent = label;
            Object.assign(labelText.style, {
                fontSize: '14px',
                fontFamily: 'inherit',
                color: 'var(--md-on-surface)',
                lineHeight: '1.5'
            });
        }

        const updateState = () => {
            const isChecked = input.checked;
            const isIndeterminate = input.indeterminate;
            const activeColor = error ? errorColor : color;

            if (isChecked || isIndeterminate) {
                // Checked Style: Filled Box
                checkboxBox.style.backgroundColor = activeColor;
                checkboxBox.style.borderColor = activeColor;

                iconContainer.style.opacity = '1';
                iconContainer.style.transform = 'scale(1)';

                if (isIndeterminate) {
                    // M3 Indeterminate is a dash
                    iconContainer.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>`;
                } else {
                    renderIcon(iconToRender, iconContainer);
                }
            } else {
                // Unchecked Style: Transparent with Outline
                checkboxBox.style.backgroundColor = 'transparent';
                checkboxBox.style.borderColor = error ? errorColor : borderColor;

                iconContainer.style.opacity = '0';
                iconContainer.style.transform = 'scale(0.5)';
            }
        };

        input.addEventListener('change', (e) => {
            updateState();
            if (onChange) onChange(e, input.checked);
        });

        // Ripple Effect
        if (ripple && !disabled) {
            wrapper.addEventListener('mousedown', () => {
                const rippleEl = document.createElement('div');
                rippleEl.style.cssText = `
        position: absolute; width: 100%; height: 100%;
        border-radius: 50%; background-color: ${error ? errorColor : color};
        opacity: 0.12; transform: scale(0);
        transition: transform 0.2s; pointer-events: none;
      `;
                wrapper.appendChild(rippleEl);
                requestAnimationFrame(() => rippleEl.style.transform = 'scale(1)');

                const removeRipple = () => {
                    rippleEl.style.opacity = '0';
                    setTimeout(() => rippleEl.remove(), 200);
                    window.removeEventListener('mouseup', removeRipple);
                };
                window.addEventListener('mouseup', removeRipple);
            });
        }

        checkboxBox.appendChild(iconContainer);
        wrapper.appendChild(input);
        wrapper.appendChild(checkboxBox);
        container.appendChild(wrapper);
        if (label) container.appendChild(labelText);

        if (className) container.className = className;

        // Initial State
        if (indeterminate) input.indeterminate = true;
        updateState();

        return {
            getElement: () => container,
            setChecked: (val) => {
                input.checked = val;
                updateState();
            },
            setIndeterminate: (val) => {
                input.indeterminate = val;
                updateState();
            },
            isChecked: () => input.checked,
            setDisabled: (val) => {
                input.disabled = val;
                container.style.opacity = val ? '0.38' : '1';
                container.style.cursor = val ? 'not-allowed' : 'pointer';
            }
        };
    };


    // ==========================================
    // Material 3 Radio Button Component
    // ==========================================
    const MaterialRadioButton = (props = {}) => {
        const {
            id,
            className,
            checked = false,
            disabled = false,
            label = '',
            onChange,
            size = 20,
            color = 'var(--md-primary)',
            borderColor = 'var(--md-outline, #79747e)',
            errorColor = 'var(--md-error)',
            // New Feature: If you pass an icon, it replaces the center dot
            checkedIcon = null,
            ripple = true,
            error = false,
            name,
            value
        } = props;

        const container = document.createElement('label');
        const wrapper = document.createElement('div');
        const input = document.createElement('input');
        const radioOuter = document.createElement('div');
        const radioInner = document.createElement('div');
        const labelText = document.createElement('span');

        input.type = 'radio';
        input.checked = checked;
        input.disabled = disabled;
        if (name) input.name = name;
        if (value) input.value = value;
        if (id) input.id = id;

        Object.assign(input.style, {
            position: 'absolute',
            opacity: 0,
            width: 0,
            height: 0,
            margin: 0
        });

        Object.assign(container.style, {
            display: 'inline-flex',
            alignItems: 'center',
            gap: safeDp(12),
            cursor: disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none',
            opacity: disabled ? '0.38' : '1',
            position: 'relative',
            minHeight: safeDp(size + 16)
        });

        Object.assign(wrapper.style, {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: safeDp(40),
            height: safeDp(40),
            borderRadius: '50%'
        });

        Object.assign(radioOuter.style, {
            width: safeDp(size),
            height: safeDp(size),
            border: `2px solid ${borderColor}`,
            borderRadius: '50%',
            position: 'relative',
            transition: 'border-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
        });

        // If using an icon, we style it differently than the dot
        Object.assign(radioInner.style, {
            width: checkedIcon ? '100%' : safeDp(size * 0.5),
            height: checkedIcon ? '100%' : safeDp(size * 0.5),
            borderRadius: checkedIcon ? '0' : '50%',
            backgroundColor: checkedIcon ? 'transparent' : color,
            color: color, // For the icon font
            transform: 'scale(0)',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: safeDp(size * 0.7) // Icon size
        });

        if (checkedIcon) renderIcon(checkedIcon, radioInner);

        if (label) {
            labelText.textContent = label;
            Object.assign(labelText.style, {
                fontSize: '14px',
                color: 'var(--md-on-surface)',
                fontFamily: 'inherit'
            });
        }

        const updateState = () => {
            const isChecked = input.checked;
            const activeColor = error ? errorColor : color;

            if (isChecked) {
                radioOuter.style.borderColor = activeColor;
                radioInner.style.transform = 'scale(1)';
                if (!checkedIcon) radioInner.style.backgroundColor = activeColor;
                else radioInner.style.color = activeColor;
            } else {
                radioOuter.style.borderColor = error ? errorColor : borderColor;
                radioInner.style.transform = 'scale(0)';
            }
        };

        // 1. Handle Direct Change
        input.addEventListener('change', (e) => {
            updateState();
            if (onChange) onChange(e, input.value);
        });

        // 2. THE FIX: Handle Group Changes (When another radio unchecks this one)
        // We attach a listener to the document to watch for changes on inputs with the same name
        if (name) {
            const groupListener = (e) => {
                // If the changed element has the same name as me, I might have been unchecked
                if (e.target !== input && e.target.name === name) {
                    updateState();
                }
            };
            document.addEventListener('change', groupListener);

            // Cleanup helper attached to element for garbage collection if needed
            container._cleanup = () => document.removeEventListener('change', groupListener);
        }

        // Ripple
        if (ripple && !disabled) {
            wrapper.addEventListener('mousedown', () => {
                const rippleEl = document.createElement('div');
                rippleEl.style.cssText = `
        position: absolute; width: 100%; height: 100%;
        border-radius: 50%; background-color: ${error ? errorColor : color};
        opacity: 0.12; transform: scale(0);
        transition: transform 0.2s; pointer-events: none;
      `;
                wrapper.appendChild(rippleEl);
                requestAnimationFrame(() => rippleEl.style.transform = 'scale(1)');

                const removeRipple = () => {
                    rippleEl.style.opacity = '0';
                    setTimeout(() => rippleEl.remove(), 200);
                    window.removeEventListener('mouseup', removeRipple);
                };
                window.addEventListener('mouseup', removeRipple);
            });
        }

        radioOuter.appendChild(radioInner);
        wrapper.appendChild(input);
        wrapper.appendChild(radioOuter);
        container.appendChild(wrapper);
        if (label) container.appendChild(labelText);
        if (className) container.className = className;

        updateState();

        return {
            getElement: () => container,
            setChecked: (val) => {
                input.checked = val;
                updateState();
                // If programmatically checking, we need to trigger the group logic manually
                if (val && name) {
                    input.dispatchEvent(new Event('change', {
                        bubbles: true
                    }));
                }
            },
            isChecked: () => input.checked,
            getValue: () => input.value,
            setDisabled: (val) => {
                input.disabled = val;
                container.style.opacity = val ? '0.38' : '1';
                container.style.cursor = val ? 'not-allowed' : 'pointer';
            },
            destroy: () => {
                if (container._cleanup) container._cleanup();
                container.remove();
            }
        };
    };

    // ==========================================
    // Material Slider Component (Single/Range)
    // ==========================================
    const MaterialSlider = (props = {}) => {
        const {
            id,
            className,
            min = 0,
            max = 100,
            value = 50, // Single value or [start, end] for range
            step = 1,
            disabled = false,
            color = 'var(--md-primary)',
            trackColor = 'var(--md-surface-variant)',
            thumbSize = 20,
            trackHeight = 4,
            showValue = false,
            showMinMax = false,
            showTicks = false,
            tickStep = null, // If null, uses step value
            formatValue = (val) => val.toString(),
            onChange,
            onChangeCommitted, // Fires when user releases thumb
            marks = [], // Array of {value: number, label: string}
            vertical = false,
            width = 300,
            height = 'auto'
        } = props;

        // Determine if this is a range slider
        const isRange = Array.isArray(value);
        const initialValue = isRange ? [...value] : value;
        let currentValue = initialValue;

        const container = document.createElement('div');
        const sliderWrapper = document.createElement('div');
        const track = document.createElement('div');
        const activeTrack = document.createElement('div');
        const thumb1 = document.createElement('div');
        const thumb2 = isRange ? document.createElement('div') : null;
        const valueDisplay1 = showValue ? document.createElement('div') : null;
        const valueDisplay2 = showValue && isRange ? document.createElement('div') : null;
        const minLabel = showMinMax ? document.createElement('span') : null;
        const maxLabel = showMinMax ? document.createElement('span') : null;

        let isDragging = false;
        let activeThumb = null;

        // Container styles
        applyStyles(container, {
            display: 'flex',
            flexDirection: vertical ? 'row' : 'column',
            alignItems: vertical ? 'center' : 'stretch',
            gap: dp(8),
            width: vertical ? 'auto' : dp(width),
            height: vertical ? dp(height === 'auto' ? width : height) : 'auto',
            opacity: disabled ? '0.38' : '1',
            pointerEvents: disabled ? 'none' : 'auto'
        });

        // Min/Max labels
        if (showMinMax) {
            minLabel.textContent = formatValue(min);
            maxLabel.textContent = formatValue(max);
            applyStyles(minLabel, {
                fontSize: '12px',
                color: 'var(--md-on-surface-variant)',
                userSelect: 'none'
            });
            applyStyles(maxLabel, {
                fontSize: '12px',
                color: 'var(--md-on-surface-variant)',
                userSelect: 'none'
            });
        }

        // Slider wrapper
        applyStyles(sliderWrapper, {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1',
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: vertical ? `${dp(thumbSize / 2)} 0` : `0 ${dp(thumbSize / 2)}`
        });

        // Track styles
        applyStyles(track, {
            position: 'absolute',
            backgroundColor: trackColor,
            borderRadius: dp(trackHeight / 2),
            ...(vertical ? {
                width: dp(trackHeight),
                height: '100%',
                left: '50%',
                transform: 'translateX(-50%)'
            } : {
                height: dp(trackHeight),
                width: '100%',
                top: '50%',
                transform: 'translateY(-50%)'
            })
        });

        // Active track styles
        applyStyles(activeTrack, {
            position: 'absolute',
            backgroundColor: color,
            borderRadius: dp(trackHeight / 2),
            transition: isDragging ? 'none' : 'all 0.1s ease',
            ...(vertical ? {
                width: dp(trackHeight),
                left: '50%',
                transform: 'translateX(-50%)'
            } : {
                height: dp(trackHeight),
                top: '50%',
                transform: 'translateY(-50%)'
            })
        });

        // Thumb styles
        const createThumb = (thumbElement, valueDisplayElement) => {
            applyStyles(thumbElement, {
                position: 'absolute',
                width: dp(thumbSize),
                height: dp(thumbSize),
                backgroundColor: color,
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                cursor: disabled ? 'not-allowed' : 'grab',
                transition: isDragging ? 'none' : 'all 0.1s ease',
                zIndex: '2',
                ...(vertical ? {
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                } : {
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                })
            });

            if (valueDisplayElement) {
                valueDisplayElement.style.cssText = `
        position: absolute;
        background: ${color};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        ${vertical ? 'left: calc(100% + 8px); top: 50%; transform: translateY(-50%);' : 'bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);'}
      `;
                thumbElement.appendChild(valueDisplayElement);
            }
        };

        createThumb(thumb1, valueDisplay1);
        if (thumb2) createThumb(thumb2, valueDisplay2);

        // Add tick marks
        if (showTicks) {
            const tickContainer = document.createElement('div');
            applyStyles(tickContainer, {
                position: 'absolute',
                ...(vertical ? {
                    width: dp(trackHeight * 3),
                    height: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)'
                } : {
                    height: dp(trackHeight * 3),
                    width: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)'
                })
            });

            const actualTickStep = tickStep || step;
            for (let val = min; val <= max; val += actualTickStep) {
                const tick = document.createElement('div');
                const percent = ((val - min) / (max - min)) * 100;

                applyStyles(tick, {
                    position: 'absolute',
                    backgroundColor: 'var(--md-outline-variant)',
                    ...(vertical ? {
                        width: dp(trackHeight * 2),
                        height: '2px',
                        bottom: `${percent}%`,
                        left: '50%',
                        transform: 'translate(-50%, 50%)'
                    } : {
                        height: dp(trackHeight * 2),
                        width: '2px',
                        left: `${percent}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                    })
                });

                tickContainer.appendChild(tick);
            }
            sliderWrapper.appendChild(tickContainer);
        }

        // Add marks
        marks.forEach(mark => {
            const markContainer = document.createElement('div');
            const markLabel = document.createElement('span');
            const percent = ((mark.value - min) / (max - min)) * 100;

            applyStyles(markContainer, {
                position: 'absolute',
                ...(vertical ? {
                    bottom: `${percent}%`,
                    left: '50%',
                    transform: 'translate(-50%, 50%)'
                } : {
                    left: `${percent}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                })
            });

            applyStyles(markLabel, {
                position: 'absolute',
                fontSize: '12px',
                color: 'var(--md-on-surface-variant)',
                whiteSpace: 'nowrap',
                ...(vertical ? {
                    left: 'calc(100% + 16px)',
                    top: '50%',
                    transform: 'translateY(-50%)'
                } : {
                    top: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)'
                })
            });

            markLabel.textContent = mark.label;
            markContainer.appendChild(markLabel);
            sliderWrapper.appendChild(markContainer);
        });

        // Calculate position
        const valueToPercent = (val) => ((val - min) / (max - min)) * 100;
        const percentToValue = (percent) => {
            const rawValue = (percent / 100) * (max - min) + min;
            return Math.round(rawValue / step) * step;
        };

        const updatePosition = () => {
            if (isRange) {
                const [val1, val2] = currentValue;
                const percent1 = valueToPercent(val1);
                const percent2 = valueToPercent(val2);

                if (vertical) {
                    thumb1.style.bottom = `${percent1}%`;
                    thumb2.style.bottom = `${percent2}%`;
                    activeTrack.style.bottom = `${percent1}%`;
                    activeTrack.style.height = `${percent2 - percent1}%`;
                } else {
                    thumb1.style.left = `${percent1}%`;
                    thumb2.style.left = `${percent2}%`;
                    activeTrack.style.left = `${percent1}%`;
                    activeTrack.style.width = `${percent2 - percent1}%`;
                }

                if (valueDisplay1) valueDisplay1.textContent = formatValue(val1);
                if (valueDisplay2) valueDisplay2.textContent = formatValue(val2);
            } else {
                const percent = valueToPercent(currentValue);

                if (vertical) {
                    thumb1.style.bottom = `${percent}%`;
                    activeTrack.style.bottom = '0';
                    activeTrack.style.height = `${percent}%`;
                } else {
                    thumb1.style.left = `${percent}%`;
                    activeTrack.style.left = '0';
                    activeTrack.style.width = `${percent}%`;
                }

                if (valueDisplay1) valueDisplay1.textContent = formatValue(currentValue);
            }
        };

        // Mouse/touch event handlers
        const getPositionFromEvent = (e) => {
            const rect = track.getBoundingClientRect();
            let position;

            if (vertical) {
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                position = ((rect.bottom - clientY) / rect.height) * 100;
            } else {
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                position = ((clientX - rect.left) / rect.width) * 100;
            }

            return Math.max(0, Math.min(100, position));
        };

        const handleMove = (e) => {
            if (!isDragging || disabled) return;
            e.preventDefault();

            const percent = getPositionFromEvent(e);
            const newValue = percentToValue(percent);

            if (isRange) {
                if (activeThumb === thumb1) {
                    currentValue[0] = Math.min(newValue, currentValue[1]);
                } else {
                    currentValue[1] = Math.max(newValue, currentValue[0]);
                }
            } else {
                currentValue = Math.max(min, Math.min(max, newValue));
            }

            updatePosition();
            if (onChange) onChange(isRange ? [...currentValue] : currentValue);
        };

        const handleEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            activeThumb = null;

            if (valueDisplay1) valueDisplay1.style.opacity = '0';
            if (valueDisplay2) valueDisplay2.style.opacity = '0';

            thumb1.style.cursor = 'grab';
            if (thumb2) thumb2.style.cursor = 'grab';

            if (onChangeCommitted) onChangeCommitted(isRange ? [...currentValue] : currentValue);
        };

        const handleStart = (e, thumb) => {
            if (disabled) return;
            e.preventDefault();
            isDragging = true;
            activeThumb = thumb;

            const thumbValueDisplay = thumb === thumb1 ? valueDisplay1 : valueDisplay2;
            if (thumbValueDisplay) thumbValueDisplay.style.opacity = '1';

            thumb.style.cursor = 'grabbing';
            handleMove(e);
        };

        // Click on track to jump
        const handleTrackClick = (e) => {
            if (disabled || isDragging) return;

            const percent = getPositionFromEvent(e);
            const newValue = percentToValue(percent);

            if (isRange) {
                // Determine which thumb is closer
                const [val1, val2] = currentValue;
                const dist1 = Math.abs(newValue - val1);
                const dist2 = Math.abs(newValue - val2);

                if (dist1 < dist2) {
                    currentValue[0] = Math.min(newValue, val2);
                } else {
                    currentValue[1] = Math.max(newValue, val1);
                }
            } else {
                currentValue = newValue;
            }

            updatePosition();
            if (onChange) onChange(isRange ? [...currentValue] : currentValue);
            if (onChangeCommitted) onChangeCommitted(isRange ? [...currentValue] : currentValue);
        };

        // Event listeners
        thumb1.addEventListener('mousedown', (e) => handleStart(e, thumb1));
        thumb1.addEventListener('touchstart', (e) => handleStart(e, thumb1));
        if (thumb2) {
            thumb2.addEventListener('mousedown', (e) => handleStart(e, thumb2));
            thumb2.addEventListener('touchstart', (e) => handleStart(e, thumb2));
        }

        track.addEventListener('click', handleTrackClick);

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);

        // Assembly
        sliderWrapper.appendChild(track);
        sliderWrapper.appendChild(activeTrack);
        sliderWrapper.appendChild(thumb1);
        if (thumb2) sliderWrapper.appendChild(thumb2);

        if (vertical) {
            if (maxLabel) container.appendChild(maxLabel);
            container.appendChild(sliderWrapper);
            if (minLabel) container.appendChild(minLabel);
        } else {
            if (minLabel) container.appendChild(minLabel);
            container.appendChild(sliderWrapper);
            if (maxLabel) container.appendChild(maxLabel);
        }

        if (id) container.id = id;
        if (className) container.className = className;

        updatePosition();

        return {
            getElement: () => container,
            getValue: () => (isRange ? [...currentValue] : currentValue),
            setValue: (val) => {
                currentValue = isRange ? [...val] : val;
                updatePosition();
            },
            setDisabled: (val) => {
                container.style.opacity = val ? '0.38' : '1';
                container.style.pointerEvents = val ? 'none' : 'auto';
            }
        };
    };

    // ==========================================
    // OTP Input Component
    // ==========================================
    const OTPInput = (props = {}) => {
        const {
            id,
            className,
            length = 4,
            value = '',
            onChange,
            onComplete,
            type = 'number', // 'number', 'text', 'password'
            disabled = false,
            error = false,
            autoFocus = true,
            boxWidth = 48,
            boxHeight = 56,
            gap = 8,
            fontSize = 24,
            color = 'var(--md-primary)',
            errorColor = 'var(--md-error)',
            borderWidth = 2,
            cornerRadius = 8,
            placeholder = '·' // Character to show in empty boxes
        } = props;

        const container = document.createElement('div');
        const inputs = [];
        let currentValue = value.split('').slice(0, length);

        // Container styles
        applyStyles(container, {
            display: 'flex',
            gap: dp(gap),
            alignItems: 'center'
        });

        // Create input boxes
        for (let i = 0; i < length; i++) {
            const inputWrapper = document.createElement('div');
            const input = document.createElement('input');

            input.type = type === 'password' ? 'password' : 'text';
            input.maxLength = 1;
            input.disabled = disabled;
            input.value = currentValue[i] || '';
            input.placeholder = placeholder;
            input.inputMode = type === 'number' ? 'numeric' : 'text';

            if (type === 'number') {
                input.pattern = '[0-9]';
            }

            // Input wrapper styles
            applyStyles(inputWrapper, {
                position: 'relative',
                width: dp(boxWidth),
                height: dp(boxHeight)
            });

            // Input styles
            applyStyles(input, {
                width: '100%',
                height: '100%',
                textAlign: 'center',
                fontSize: dp(fontSize),
                fontWeight: '600',
                border: `${dp(borderWidth)} solid ${error ? errorColor : 'var(--md-outline)'}`,
                borderRadius: dp(cornerRadius),
                backgroundColor: disabled ? 'var(--md-surface-variant)' : 'var(--md-surface)',
                color: 'var(--md-on-surface)',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box',
                caretColor: color
            });

            // Focus styles
            input.addEventListener('focus', () => {
                if (!disabled) {
                    input.style.borderColor = error ? errorColor : color;
                    input.style.borderWidth = dp(borderWidth + 1);
                    input.style.boxShadow = `0 0 0 1px ${error ? errorColor : color}`;
                }
            });

            input.addEventListener('blur', () => {
                input.style.borderColor = error ? errorColor : 'var(--md-outline)';
                input.style.borderWidth = dp(borderWidth);
                input.style.boxShadow = 'none';
            });

            // Handle input
            input.addEventListener('input', (e) => {
                let val = e.target.value;

                // Filter non-numeric if type is number
                if (type === 'number') {
                    val = val.replace(/[^0-9]/g, '');
                }

                // Take only first character
                val = val.slice(0, 1);
                input.value = val;
                currentValue[i] = val;

                // Auto-focus next input
                if (val && i < length - 1) {
                    inputs[i + 1].focus();
                }

                // Trigger callbacks
                const fullValue = currentValue.join('');
                if (onChange) onChange(fullValue);

                if (fullValue.length === length && onComplete) {
                    onComplete(fullValue);
                }
            });

            // Handle backspace
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && i > 0) {
                    inputs[i - 1].focus();
                    currentValue[i - 1] = '';
                    inputs[i - 1].value = '';

                    const fullValue = currentValue.join('');
                    if (onChange) onChange(fullValue);
                }

                // Handle arrow keys
                if (e.key === 'ArrowLeft' && i > 0) {
                    e.preventDefault();
                    inputs[i - 1].focus();
                }
                if (e.key === 'ArrowRight' && i < length - 1) {
                    e.preventDefault();
                    inputs[i + 1].focus();
                }
            });

            // Handle paste
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text').slice(0, length);

                for (let j = 0; j < pastedData.length && (i + j) < length; j++) {
                    let char = pastedData[j];
                    if (type === 'number') {
                        char = char.replace(/[^0-9]/g, '');
                    }
                    if (char) {
                        inputs[i + j].value = char;
                        currentValue[i + j] = char;
                    }
                }

                // Focus last filled input
                const lastFilledIndex = Math.min(i + pastedData.length, length - 1);
                inputs[lastFilledIndex].focus();

                const fullValue = currentValue.join('');
                if (onChange) onChange(fullValue);

                if (fullValue.length === length && onComplete) {
                    onComplete(fullValue);
                }
            });

            inputs.push(input);
            inputWrapper.appendChild(input);
            container.appendChild(inputWrapper);
        }

        // Auto-focus first input
        if (autoFocus && !disabled) {
            setTimeout(() => inputs[0].focus(), 0);
        }

        if (id) container.id = id;
        if (className) container.className = className;

        return {
            getElement: () => container,
            getValue: () => currentValue.join(''),
            setValue: (val) => {
                const chars = val.split('').slice(0, length);
                for (let i = 0; i < length; i++) {
                    inputs[i].value = chars[i] || '';
                    currentValue[i] = chars[i] || '';
                }
            },
            clear: () => {
                for (let i = 0; i < length; i++) {
                    inputs[i].value = '';
                    currentValue[i] = '';
                }
                inputs[0].focus();
            },
            focus: () => {
                const firstEmptyIndex = currentValue.findIndex(v => !v);
                inputs[firstEmptyIndex !== -1 ? firstEmptyIndex : 0].focus();
            },
            setDisabled: (val) => {
                inputs.forEach(input => input.disabled = val);
            },
            setError: (val) => {
                const borderColor = val ? errorColor : 'var(--md-outline)';
                inputs.forEach(input => {
                    input.style.borderColor = borderColor;
                });
            }
        };
    };






    // ==========================================
    // Icon
    // ==========================================
    const Icon = (props = {}) => {
        const {
            name,
            size = 24,
            color,
            margin,
            onClick
        } = props;
        const icon = document.createElement('i');
        icon.className = name;

        const styles = {
            fontSize: dp(size),
            color: color || 'var(--md-on-surface)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
        };
        if (margin) styles.margin = dp(margin);
        if (onClick) {
            styles.cursor = 'pointer';
            icon.addEventListener('click', onClick);
        }

        applyStyles(icon, styles);
        return {
            getElement: () => icon
        };
    };

    // ==========================================
    // Divider
    // ==========================================
    const Divider = (props = {}) => {
        const {
            orientation = 'horizontal', thickness = 1, color, margin
        } = props;
        const divider = document.createElement('div');

        const styles = {
            backgroundColor: color || 'var(--md-outline-variant)',
            margin: margin ? dp(margin) : '0',
        };

        if (orientation === 'horizontal') {
            styles.height = dp(thickness);
            styles.width = '100%';
        } else {
            styles.width = dp(thickness);
            styles.height = '100%';
        }

        applyStyles(divider, styles);
        return {
            getElement: () => divider
        };
    };






    // ==========================================
    // MaterialStepView Component
    // ==========================================

    // First, inject the styles for StepView
    const injectStepViewStyles = () => {
        if (document.getElementById('android-components-stepview')) return;

        const style = document.createElement('style');
        style.id = 'android-components-stepview';
        style.textContent = `
    /* Material Step View Styles */
    .material-stepview-container {
      font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
      width: 100%;
    }

    .material-stepview-header {
      margin-bottom: 24px;
    }

    .material-stepview-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--md-on-surface);
      margin: 0 0 8px 0;
    }

    .material-stepview-subtitle {
      font-size: 14px;
      color: var(--md-on-surface-variant);
      margin: 0;
    }

    .material-stepview-steps {
      position: relative;
    }

    .material-stepview-step {
      position: relative;
      display: flex;
      gap: 16px;
      padding-bottom: 32px;
    }

    .material-stepview-step:last-child {
      padding-bottom: 0;
    }

    .material-stepview-step-indicator {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .material-stepview-step-circle {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--md-surface-variant);
      border: 2px solid var(--md-outline);
      color: var(--md-on-surface-variant);
      font-size: 16px;
      font-weight: 500;
      transition: all 0.3s ease;
      z-index: 2;
      position: relative;
    }

    .material-stepview-step.active .material-stepview-step-circle {
      background: var(--md-primary);
      border-color: var(--md-primary);
      color: var(--md-on-primary);
      box-shadow: 0 2px 8px rgba(103, 80, 164, 0.3);
    }

    .material-stepview-step.completed .material-stepview-step-circle {
      background: var(--md-primary);
      border-color: var(--md-primary);
      color: var(--md-on-primary);
    }

    .material-stepview-step.error .material-stepview-step-circle {
      background: var(--md-error);
      border-color: var(--md-error);
      color: var(--md-on-primary);
    }

    .material-stepview-step.warning .material-stepview-step-circle {
      background: #f57c00;
      border-color: #f57c00;
      color: var(--md-on-primary);
    }

    .material-stepview-step.disabled .material-stepview-step-circle {
      background: var(--md-disabled-bg);
      border-color: var(--md-outline-variant);
      color: var(--md-disabled-text);
      opacity: 0.5;
    }

    .material-stepview-step-circle i {
      font-size: 20px;
      line-height: 1;
    }

    .material-stepview-step-number {
      font-size: 16px;
      font-weight: 500;
    }

    .material-stepview-step-line {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: calc(100% - 30px);
      background: var(--md-outline-variant);
      transition: background 0.3s ease;
      z-index: 1;
    }

    .material-stepview-step.completed .material-stepview-step-line {
      background: var(--md-primary);
    }

    .material-stepview-step.active .material-stepview-step-line {
      background: linear-gradient(to bottom, var(--md-primary) 0%, var(--md-outline-variant) 100%);
    }

    .material-stepview-step:last-child .material-stepview-step-line {
      display: none;
    }

    .material-stepview-step-content {
      flex: 1;
      padding-top: 5px;
    }

    .material-stepview-step-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--md-on-surface);
      margin: 0 0 4px 0;
      transition: color 0.3s ease;
    }

    .material-stepview-step.active .material-stepview-step-title {
      color: var(--md-primary);
    }

    .material-stepview-step.disabled .material-stepview-step-title {
      color: var(--md-disabled-text);
    }

    .material-stepview-step-subtitle {
      font-size: 14px;
      color: var(--md-on-surface-variant);
      margin: 0;
      line-height: 1.5;
    }

    .material-stepview-step.disabled .material-stepview-step-subtitle {
      color: var(--md-disabled-text);
    }

    .material-stepview-step-description {
      font-size: 13px;
      color: var(--md-on-surface-variant);
      margin: 8px 0 0 0;
      line-height: 1.5;
    }

    /* Loading spinner for steps */
    .material-stepview-spinner {
      width: 18px;
      height: 18px;
      border: 3px solid var(--md-on-primary);
      border-top-color: transparent;
      border-radius: 50%;
      animation: material-spin 0.8s linear infinite;
    }

    .material-stepview-step.active .material-stepview-spinner {
      border-color: var(--md-on-primary);
      border-top-color: transparent;
    }

    /* Clickable steps */
    .material-stepview-step.clickable {
      
    }

    .material-stepview-step.clickable:hover:not(.disabled) .material-stepview-step-circle {
      transform: scale(1.05);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    }

    .material-stepview-step.clickable:hover:not(.disabled) .material-stepview-step-title {
      color: var(--md-primary);
    }

    /* Compact variant */
    .material-stepview-container.compact .material-stepview-step {
      padding-bottom: 20px;
    }

    .material-stepview-container.compact .material-stepview-step-circle {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }

    .material-stepview-container.compact .material-stepview-step-circle i {
      font-size: 16px;
    }

    .material-stepview-container.compact .material-stepview-step-line {
      top: 30px;
      height: calc(100% - 30px);
    }

    .material-stepview-container.compact .material-stepview-step-content {
      padding-top: 4px;
    }

    .material-stepview-container.compact .material-stepview-step-title {
      font-size: 14px;
    }

    .material-stepview-container.compact .material-stepview-step-subtitle {
      font-size: 12px;
    }

    /* Horizontal variant */
    .material-stepview-container.horizontal {
      overflow-x: auto;
    }

    .material-stepview-container.horizontal .material-stepview-steps {
      display: flex;
      gap: 0;
    }

    .material-stepview-container.horizontal .material-stepview-step {
      flex-direction: column;
      padding-bottom: 0;
      padding-right: 48px;
      min-width: 120px;
    }

    .material-stepview-container.horizontal .material-stepview-step:last-child {
      padding-right: 0;
    }

    .material-stepview-container.horizontal .material-stepview-step-indicator {
      flex-direction: row;
      width: 100%;
    }

    .material-stepview-container.horizontal .material-stepview-step-line {
      top: 50%;
      left: 30px;
      transform: translateY(-50%);
      width: calc(100% - 30px);
      height: 2px;
    }

    .material-stepview-container.horizontal .material-stepview-step-content {
      padding-top: 16px;
      text-align: center;
    }

    /* Animation for adding steps */
    @keyframes stepFadeIn {
      
    }

    .material-stepview-step.animating {
      animation: stepFadeIn 0.3s ease;
    }
  `;
        document.head.appendChild(style);
    };

    // Inject styles immediately
    injectStepViewStyles();

    const MaterialStepView = (props = {}) => {
        const {
            title = '',
                subtitle = '',
                steps = [], // Array of step objects
                orientation = 'vertical', // vertical, horizontal
                variant = 'default', // default, compact
                activeStep = 0,
                clickable = false,
                showNumbers = true,
                onStepClick = null,
                id,
                className,
                margin,
                padding,
                weight,
                alignSelf,
                width
        } = props;

        const stepViewId = id || `material-stepview-${Date.now()}`;
        let currentSteps = [...steps];
        let currentActiveStep = activeStep;

        // Container
        const container = document.createElement('div');
        const containerClasses = ['material-stepview-container'];
        if (variant) containerClasses.push(variant);
        if (orientation) containerClasses.push(orientation);
        if (className) containerClasses.push(className);
        container.className = containerClasses.join(' ');
        container.id = stepViewId;

        // Apply container styles
        const containerStyles = {};
        if (margin) containerStyles.margin = typeof margin === 'number' ? `${margin}px` : margin;
        if (padding) containerStyles.padding = typeof padding === 'number' ? `${padding}px` : padding;
        if (weight) containerStyles.flex = weight;
        if (alignSelf) containerStyles.alignSelf = alignSelf;
        if (width === 'match_parent') containerStyles.width = '100%';
        else if (width) containerStyles.width = typeof width === 'number' ? `${width}px` : width;
        Object.assign(container.style, containerStyles);

        // Header
        let headerEl, titleEl, subtitleEl;
        if (title || subtitle) {
            headerEl = document.createElement('div');
            headerEl.className = 'material-stepview-header';

            if (title) {
                titleEl = document.createElement('h3');
                titleEl.className = 'material-stepview-title';
                titleEl.textContent = title;
                headerEl.appendChild(titleEl);
            }

            if (subtitle) {
                subtitleEl = document.createElement('p');
                subtitleEl.className = 'material-stepview-subtitle';
                subtitleEl.textContent = subtitle;
                headerEl.appendChild(subtitleEl);
            }

            container.appendChild(headerEl);
        }

        // Steps container
        const stepsContainer = document.createElement('div');
        stepsContainer.className = 'material-stepview-steps';
        container.appendChild(stepsContainer);

        // Render a single step
        const renderStep = (step, index) => {
            const {
                title: stepTitle = `Step ${index + 1}`,
                subtitle: stepSubtitle = '',
                description = '',
                status = 'pending', // pending, active, completed, error, warning, disabled
                icon = null,
                loading = false,
                customIcon = null
            } = step;

            // Step element
            const stepEl = document.createElement('div');
            const stepClasses = ['material-stepview-step'];

            // Determine status
            if (status === 'active' || index === currentActiveStep) {
                stepClasses.push('active');
            } else if (status === 'completed') {
                stepClasses.push('completed');
            } else if (status === 'error') {
                stepClasses.push('error');
            } else if (status === 'warning') {
                stepClasses.push('warning');
            } else if (status === 'disabled') {
                stepClasses.push('disabled');
            }

            if (clickable && status !== 'disabled') {
                stepClasses.push('clickable');
            }

            stepEl.className = stepClasses.join(' ');
            stepEl.dataset.index = index;

            // Indicator container
            const indicator = document.createElement('div');
            indicator.className = 'material-stepview-step-indicator';

            // Circle
            const circle = document.createElement('div');
            circle.className = 'material-stepview-step-circle';

            // Determine circle content
            if (loading) {
                const spinner = document.createElement('div');
                spinner.className = 'material-stepview-spinner';
                circle.appendChild(spinner);
            } else if (status === 'completed' && !customIcon) {
                const checkIcon = document.createElement('i');
                checkIcon.className = 'bx bx-check';
                circle.appendChild(checkIcon);
            } else if (status === 'error' && !customIcon) {
                const errorIcon = document.createElement('i');
                errorIcon.className = 'bx bx-x';
                circle.appendChild(errorIcon);
            } else if (status === 'warning' && !customIcon) {
                const warningIcon = document.createElement('i');
                warningIcon.className = 'bx bx-error';
                circle.appendChild(warningIcon);
            } else if (customIcon || icon) {
                const iconEl = document.createElement('i');
                iconEl.className = customIcon || icon;
                circle.appendChild(iconEl);
            } else if (showNumbers) {
                const number = document.createElement('span');
                number.className = 'material-stepview-step-number';
                number.textContent = index + 1;
                circle.appendChild(number);
            }

            indicator.appendChild(circle);

            // Connecting line
            if (index < currentSteps.length - 1) {
                const line = document.createElement('div');
                line.className = 'material-stepview-step-line';
                indicator.appendChild(line);
            }

            stepEl.appendChild(indicator);

            // Content
            const content = document.createElement('div');
            content.className = 'material-stepview-step-content';

            const titleEl = document.createElement('h4');
            titleEl.className = 'material-stepview-step-title';
            titleEl.textContent = stepTitle;
            content.appendChild(titleEl);

            if (stepSubtitle) {
                const subtitleEl = document.createElement('p');
                subtitleEl.className = 'material-stepview-step-subtitle';
                subtitleEl.textContent = stepSubtitle;
                content.appendChild(subtitleEl);
            }

            if (description) {
                const descEl = document.createElement('p');
                descEl.className = 'material-stepview-step-description';
                descEl.textContent = description;
                content.appendChild(descEl);
            }

            stepEl.appendChild(content);

            // Click handler
            if (clickable && status !== 'disabled') {
                stepEl.addEventListener('click', () => {
                    if (onStepClick) {
                        onStepClick(index, step);
                    }
                    setActiveStep(index);
                });
            }

            return stepEl;
        };

        // Render all steps
        const renderSteps = () => {
            stepsContainer.innerHTML = '';
            currentSteps.forEach((step, index) => {
                const stepEl = renderStep(step, index);
                stepEl.classList.add('animating');
                stepsContainer.appendChild(stepEl);
            });
        };

        // Initial render
        renderSteps();

        // Public API
        return {
            getElement: () => container,

            // Step management
            addStep: (step, animate = true) => {
                currentSteps.push(step);
                const stepEl = renderStep(step, currentSteps.length - 1);
                if (animate) stepEl.classList.add('animating');
                stepsContainer.appendChild(stepEl);
            },

            insertStep: (index, step, animate = true) => {
                currentSteps.splice(index, 0, step);
                renderSteps();
            },

            removeStep: (index) => {
                if (index >= 0 && index < currentSteps.length) {
                    currentSteps.splice(index, 1);
                    renderSteps();
                }
            },

            updateStep: (index, updates) => {
                if (index >= 0 && index < currentSteps.length) {
                    currentSteps[index] = {
                        ...currentSteps[index],
                        ...updates
                    };
                    renderSteps();
                }
            },

            getStep: (index) => {
                return currentSteps[index];
            },

            getAllSteps: () => {
                return [...currentSteps];
            },

            clearSteps: () => {
                currentSteps = [];
                stepsContainer.innerHTML = '';
            },

            setSteps: (newSteps) => {
                currentSteps = [...newSteps];
                renderSteps();
            },

            // Step status management
            setStepStatus: (index, status) => {
                if (index >= 0 && index < currentSteps.length) {
                    currentSteps[index].status = status;
                    renderSteps();
                }
            },

            setStepLoading: (index, loading) => {
                if (index >= 0 && index < currentSteps.length) {
                    currentSteps[index].loading = loading;
                    renderSteps();
                }
            },

            completeStep: (index) => {
                if (index >= 0 && index < currentSteps.length) {
                    currentSteps[index].status = 'completed';
                    renderSteps();
                }
            },

            setStepError: (index, errorMessage) => {
                if (index >= 0 && index < currentSteps.length) {
                    currentSteps[index].status = 'error';
                    if (errorMessage) {
                        currentSteps[index].subtitle = errorMessage;
                    }
                    renderSteps();
                }
            },

            // Active step management
            setActiveStep: (index) => {
                if (index >= 0 && index < currentSteps.length) {
                    currentActiveStep = index;
                    renderSteps();
                }
            },

            getActiveStep: () => currentActiveStep,

            nextStep: () => {
                if (currentActiveStep < currentSteps.length - 1) {
                    currentActiveStep++;
                    renderSteps();
                }
                return currentActiveStep;
            },

            previousStep: () => {
                if (currentActiveStep > 0) {
                    currentActiveStep--;
                    renderSteps();
                }
                return currentActiveStep;
            },

            // Header management
            setTitle: (newTitle) => {
                if (titleEl) {
                    titleEl.textContent = newTitle;
                } else if (headerEl) {
                    titleEl = document.createElement('h3');
                    titleEl.className = 'material-stepview-title';
                    titleEl.textContent = newTitle;
                    headerEl.insertBefore(titleEl, headerEl.firstChild);
                }
            },

            setSubtitle: (newSubtitle) => {
                if (subtitleEl) {
                    subtitleEl.textContent = newSubtitle;
                } else if (headerEl) {
                    subtitleEl = document.createElement('p');
                    subtitleEl.className = 'material-stepview-subtitle';
                    subtitleEl.textContent = newSubtitle;
                    headerEl.appendChild(subtitleEl);
                }
            },

            // Utility
            reset: () => {
                currentActiveStep = 0;
                currentSteps = currentSteps.map(step => ({
                    ...step,
                    status: 'pending',
                    loading: false
                }));
                renderSteps();
            },

            getTotalSteps: () => currentSteps.length,

            isLastStep: () => currentActiveStep === currentSteps.length - 1,

            isFirstStep: () => currentActiveStep === 0
        };
    };


    // ==========================================
    // Avatar
    // ==========================================
    const Avatar = (props = {}) => {
        const {
            size = 40, icon, text, background, color, margin
        } = props;
        const avatar = document.createElement('div');

        const styles = {
            width: dp(size),
            height: dp(size),
            borderRadius: '50%',
            background: background || 'var(--md-primary-container)',
            color: color || 'var(--md-on-primary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: dp(size * 0.45),
            fontWeight: '500',
            flexShrink: 0,
        };
        if (margin) styles.margin = dp(margin);

        applyStyles(avatar, styles);

        if (icon) {
            const iconEl = document.createElement('i');
            iconEl.className = icon;
            avatar.appendChild(iconEl);
        } else if (text) {
            avatar.textContent = text.charAt(0).toUpperCase();
        }

        return {
            getElement: () => avatar
        };
    };

    return {
        TextView,
        Button,
        Card,
        Icon,
        Divider,
        Avatar,
        MaterialButton,
        MaterialSwitch,
        MaterialInput,
        MaterialSpinner,
        MaterialImage,
        MaterialStepView,
        OTPInput,
        MaterialRadioButton,
        MaterialCheckbox,
        MaterialSlider,
        utils: {
            injectStyles,
            injectedStyles,
            generateId,
            hexToRgba,
            getLuminance
        }
    };

})();

window.AndroidComponents = AndroidComponents;