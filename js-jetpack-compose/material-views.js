// ============================================
// AndroidComponents Core & Basic UI Components
// ============================================
const AndroidComponents = (() => {
  const { dp, applyStyles } = window.AndroidLayouts?.utils || {};
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
      cursor: pointer;
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
      cursor: pointer;
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
      cursor: pointer;
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
      cursor: pointer;
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
  // TextView
  // ==========================================
  const TextView = (props = {}) => {
    const {
      text = '', textSize = 14, textColor, textStyle = 'normal',
      gravity, padding, margin, weight, alignSelf, width, height,
      maxLines, ellipsize = false, id, className
    } = props;

    const textView = document.createElement('div');
    textView.textContent = text;

    const styles = {
      fontSize: dp(textSize),
      color: textColor || 'var(--md-on-surface)',
      fontWeight: textStyle === 'bold' ? 'bold' : 'normal',
      fontStyle: textStyle === 'italic' ? 'italic' : 'normal',
      boxSizing: 'border-box',
    };

    if (gravity === 'center') styles.textAlign = 'center';
    else if (gravity === 'end' || gravity === 'right') styles.textAlign = 'right';
    if (padding) styles.padding = dp(padding);
    if (margin) styles.margin = dp(margin);
    if (weight) styles.flex = weight;
    if (alignSelf) styles.alignSelf = alignSelf;
    if (width === 'match_parent') styles.width = '100%';
    else if (width === 'wrap_content') styles.width = 'fit-content';
    else if (width) styles.width = dp(width);
    if (height === 'match_parent') styles.height = '100%';
    else if (height) styles.height = dp(height);
    if (maxLines) {
      styles.display = '-webkit-box';
      styles.webkitLineClamp = maxLines;
      styles.webkitBoxOrient = 'vertical';
      styles.overflow = 'hidden';
    }
    if (ellipsize && !maxLines) {
      styles.overflow = 'hidden';
      styles.textOverflow = 'ellipsis';
      styles.whiteSpace = 'nowrap';
    }

    applyStyles(textView, styles);
    if (id) textView.id = id;
    if (className) textView.className = className;

    return {
      getElement: () => textView,
      setText: (newText) => { textView.textContent = newText; },
      getText: () => textView.textContent
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
    cursor: pointer;
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
    cursor: pointer;
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
dropdown.style. background = 'white';
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
    
    const { scrollTop, scrollHeight, clientHeight } = optionsContainer;
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
      setText: (newText) => { textSpan.textContent = newText; },
      setEnabled: (enabled) => {
        button.disabled = !enabled;
        button.style.opacity = enabled ? '1' : '0.5';
        button.style.cursor = enabled ? 'pointer' : 'not-allowed';
      }
    };
  };

  // ==========================================
  // Card
  // ==========================================
  const Card = (props = {}, children = []) => {
    const {
      elevation = 1, padding = 16, margin = 0, cornerRadius = 12,
      width, height, onClick, id, className, variant = 'elevated'
    } = props;

    const card = document.createElement('div');

    const variantStyles = {
      elevated: {
        background: 'var(--md-surface-container-low)',
        boxShadow: `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.1)`,
      },
      filled: {
        background: 'var(--md-surface-container-highest)',
        boxShadow: 'none',
      },
      outlined: {
        background: 'var(--md-surface)',
        border: '1px solid var(--md-outline-variant)',
        boxShadow: 'none',
      }
    };

    const styles = {
      borderRadius: dp(cornerRadius),
      padding: dp(padding),
      margin: dp(margin),
      boxSizing: 'border-box',
      ...variantStyles[variant]
    };

    if (width === 'match_parent') styles.width = '100%';
    else if (width) styles.width = dp(width);
    if (height === 'match_parent') styles.height = '100%';
    else if (height) styles.height = dp(height);
    if (onClick) {
      styles.cursor = 'pointer';
      card.addEventListener('click', onClick);
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

    return { getElement: () => card };
  };

  // ==========================================
  // Icon
  // ==========================================
  const Icon = (props = {}) => {
    const { name, size = 24, color, margin, onClick } = props;
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
    return { getElement: () => icon };
  };

  // ==========================================
  // Divider
  // ==========================================
  const Divider = (props = {}) => {
    const { orientation = 'horizontal', thickness = 1, color, margin } = props;
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
    return { getElement: () => divider };
  };

  // ==========================================
  // Avatar
  // ==========================================
  const Avatar = (props = {}) => {
    const { size = 40, icon, text, background, color, margin } = props;
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

    return { getElement: () => avatar };
  };

  return {
  TextView, Button, Card, Icon, Divider, Avatar,
  MaterialButton, MaterialSwitch, MaterialInput, MaterialSpinner,
  utils: { injectStyles, injectedStyles, generateId, hexToRgba, getLuminance }
};

})();

window.AndroidComponents = AndroidComponents;
