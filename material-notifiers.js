// ============================================
// AndroidComponents Overlay Components (Dialog & Snackbar)
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
  // MaterialDialog Styles
  // ==========================================
  const DIALOG_STYLES = `
    .md-dialog-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.32);
      display: flex; align-items: center; justify-content: center;
      z-index: 10000; opacity: 0; visibility: hidden;
      transition: opacity 200ms ease-out, visibility 200ms ease-out;
      padding: 24px;
    }
    .md-dialog-overlay.md-visible { opacity: 1; visibility: visible; }
    .md-dialog {
      background: var(--md-surface-container-high, #ECE6F0);
      border-radius: 28px; min-width: 280px; max-width: 560px; width: 100%;
      max-height: calc(100vh - 48px); overflow: hidden;
      display: flex; flex-direction: column;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.14);
      transform: scale(0.9) translateY(20px); opacity: 0;
      transition: transform 250ms cubic-bezier(0.2, 0, 0, 1), opacity 200ms ease-out;
    }
    .md-dialog-overlay.md-visible .md-dialog { transform: scale(1) translateY(0); opacity: 1; }
    .md-dialog-overlay.md-closing .md-dialog {
      transform: scale(0.95) translateY(10px); opacity: 0;
      transition: transform 150ms cubic-bezier(0.4, 0, 1, 1), opacity 150ms ease-in;
    }
    .md-dialog-icon { display: flex; justify-content: center; padding: 24px 24px 0; }
    .md-dialog-icon i { font-size: 24px; color: var(--md-secondary, #625B71); }
    .md-dialog-header { padding: 24px 24px 16px; }
    .md-dialog-header.md-with-icon { padding-top: 16px; text-align: center; }
    .md-dialog-title { font-size: 1.5rem; font-weight: 500; color: var(--md-on-surface); line-height: 1.3; margin: 0; }
    .md-dialog-content { padding: 0 24px 24px; overflow-y: auto; flex: 1; }
    .md-dialog-message { font-size: 0.875rem; color: var(--md-on-surface-variant); line-height: 1.5; margin: 0; }
    .md-dialog-content.md-with-icon { text-align: center; }
    .md-dialog-custom-view { margin-top: 16px; }
    .md-dialog-input {
      width: 100%; padding: 16px; border: 1px solid var(--md-outline);
      border-radius: 4px; font-size: 1rem; font-family: inherit;
      background: transparent; color: var(--md-on-surface);
      outline: none; transition: border-color 0.2s; margin-top: 16px; box-sizing: border-box;
    }
    .md-dialog-input:focus { border-color: var(--md-primary); border-width: 2px; padding: 15px; }
    .md-dialog-input::placeholder { color: var(--md-on-surface-variant); }
    .md-dialog-actions { display: flex; justify-content: flex-end; gap: 8px; padding: 16px 24px 24px; flex-wrap: wrap; }
    .md-dialog-btn {
      padding: 10px 24px; border-radius: 20px; border: none; font-family: inherit;
      font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
      min-width: 64px; display: inline-flex; align-items: center; justify-content: center;
      gap: 8px; background: transparent; color: var(--md-primary);
    }
    .md-dialog-btn:hover { background: rgba(103, 80, 164, 0.08); }
    .md-dialog-btn.md-filled { background: var(--md-primary); color: var(--md-on-primary); }
    .md-dialog-btn.md-filled:hover { box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
    .md-dialog-btn.md-tonal { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
    .md-dialog-btn.md-error { color: var(--md-error); }
    .md-dialog-btn.md-error:hover { background: rgba(179, 38, 30, 0.08); }
    .md-dialog-btn.md-error.md-filled { background: var(--md-error); color: var(--md-on-error); }
    @media (max-width: 600px) {
      .md-dialog { min-width: unset; max-width: unset; width: calc(100% - 32px); }
      .md-dialog-actions { flex-direction: column; }
      .md-dialog-btn { width: 100%; }
    }
  `;

  // ==========================================
  // MaterialDialog
  // ==========================================
  const MaterialDialog = (props = {}) => {
    _injectStyles('dialog', DIALOG_STYLES);

    const state = {
      title: '', message: '', icon: props.icon || null, type: props.type || 'alert',
      dismissOnBackdrop: props.dismissOnBackdrop !== false, customView: null,
      inputValue: props.inputValue || '', inputPlaceholder: props.inputPlaceholder || '',
      buttons: { positive: null, negative: null, neutral: null },
      overlay: null, dialog: null, inputElement: null, isOpen: false, keydownHandler: null
    };

    const createButton = (config) => {
      const btn = document.createElement('button');
      btn.className = 'md-dialog-btn';
      btn.textContent = config.text;
      if (config.style === 'filled') btn.classList.add('md-filled');
      else if (config.style === 'tonal') btn.classList.add('md-tonal');
      if (config.error) btn.classList.add('md-error');
      btn.addEventListener('click', () => {
        const inputVal = state.inputElement ? state.inputElement.value : null;
        instance.dismiss();
        if (config.callback) config.callback(inputVal);
      });
      return btn;
    };

    const build = () => {
      state.overlay = document.createElement('div');
      state.overlay.className = 'md-dialog-overlay';
      state.dialog = document.createElement('div');
      state.dialog.className = 'md-dialog';
      state.dialog.setAttribute('role', 'dialog');
      state.dialog.setAttribute('aria-modal', 'true');

      if (state.icon) {
        const iconContainer = document.createElement('div');
        iconContainer.className = 'md-dialog-icon';
        iconContainer.innerHTML = `<i class="${state.icon}"></i>`;
        state.dialog.appendChild(iconContainer);
      }

      if (state.title) {
        const header = document.createElement('div');
        header.className = 'md-dialog-header';
        if (state.icon) header.classList.add('md-with-icon');
        const titleEl = document.createElement('h2');
        titleEl.className = 'md-dialog-title';
        titleEl.textContent = state.title;
        header.appendChild(titleEl);
        state.dialog.appendChild(header);
      }

      const content = document.createElement('div');
      content.className = 'md-dialog-content';
      if (state.icon) content.classList.add('md-with-icon');

      if (state.message) {
        const messageEl = document.createElement('p');
        messageEl.className = 'md-dialog-message';
        messageEl.textContent = state.message;
        content.appendChild(messageEl);
      }

      if (state.type === 'prompt') {
        state.inputElement = document.createElement('input');
        state.inputElement.type = 'text';
        state.inputElement.className = 'md-dialog-input';
        state.inputElement.placeholder = state.inputPlaceholder;
        state.inputElement.value = state.inputValue;
        content.appendChild(state.inputElement);
      }

      if (state.customView) {
        const viewContainer = document.createElement('div');
        viewContainer.className = 'md-dialog-custom-view';
        viewContainer.appendChild(state.customView);
        content.appendChild(viewContainer);
      }

      state.dialog.appendChild(content);

      const actions = document.createElement('div');
      actions.className = 'md-dialog-actions';

      if (state.buttons.neutral) {
        const neutralBtn = createButton(state.buttons.neutral);
        neutralBtn.style.marginRight = 'auto';
        actions.appendChild(neutralBtn);
      }
      if (state.buttons.negative) actions.appendChild(createButton(state.buttons.negative));
      if (state.buttons.positive) actions.appendChild(createButton(state.buttons.positive));

      if (actions.children.length > 0) state.dialog.appendChild(actions);

      state.overlay.appendChild(state.dialog);

      if (state.dismissOnBackdrop) {
        state.overlay.addEventListener('click', (e) => {
          if (e.target === state.overlay) instance.dismiss();
        });
      }

      state.keydownHandler = (e) => {
        if (e.key === 'Escape' && state.dismissOnBackdrop) instance.dismiss();
      };
      document.addEventListener('keydown', state.keydownHandler);
    };

    const instance = {
      setTitle(title) { state.title = title; return this; },
      setMessage(message) { state.message = message; return this; },
      setIcon(iconClass) { state.icon = iconClass; return this; },
      setType(type) { state.type = type; return this; },
      setView(element) {
        if (typeof element === 'string') {
          const container = document.createElement('div');
          container.innerHTML = element;
          state.customView = container;
        } else if (element && typeof element.getElement === 'function') {
          state.customView = element.getElement();
        } else {
          state.customView = element;
        }
        return this;
      },
      setInputPlaceholder(placeholder) { state.inputPlaceholder = placeholder; return this; },
      setInputValue(value) { state.inputValue = value; return this; },
      setPositiveButton(text, callback = null, options = {}) {
        state.buttons.positive = { text, callback, style: options.style || 'text', error: options.error || false };
        return this;
      },
      setNegativeButton(text, callback = null, options = {}) {
        state.buttons.negative = { text, callback, style: options.style || 'text', error: options.error || false };
        return this;
      },
      setNeutralButton(text, callback = null, options = {}) {
        state.buttons.neutral = { text, callback, style: options.style || 'text', error: options.error || false };
        return this;
      },
      setDismissOnBackdrop(value) { state.dismissOnBackdrop = value; return this; },
      show() {
        if (state.isOpen) return this;
        build();
        document.body.appendChild(state.overlay);
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          state.overlay.classList.add('md-visible');
          if (state.inputElement) setTimeout(() => state.inputElement.focus(), 100);
        });
        state.isOpen = true;
        return this;
      },
      dismiss() {
        if (!state.isOpen) return;
        state.overlay.classList.add('md-closing');
        state.overlay.classList.remove('md-visible');
        setTimeout(() => {
          if (state.overlay?.parentNode) state.overlay.parentNode.removeChild(state.overlay);
          document.body.style.overflow = '';
          if (state.keydownHandler) document.removeEventListener('keydown', state.keydownHandler);
        }, 200);
        state.isOpen = false;
      },
      isShowing() { return state.isOpen; },
      getElement() { return state.dialog; }
    };

    return instance;
  };

  // Static helper methods
  MaterialDialog.alert = (title, message, options = {}) => {
    return MaterialDialog({ type: 'alert', icon: options.icon })
      .setTitle(title).setMessage(message)
      .setPositiveButton(options.buttonText || 'OK', options.onConfirm, { style: 'text' })
      .show();
  };

  MaterialDialog.confirm = (title, message, options = {}) => {
    return MaterialDialog({ type: 'confirm', icon: options.icon })
      .setTitle(title).setMessage(message)
      .setNegativeButton(options.cancelText || 'Cancel', options.onCancel)
      .setPositiveButton(options.confirmText || 'Confirm', options.onConfirm, {
        style: options.confirmStyle || 'text', error: options.confirmError || false
      })
      .show();
  };

  MaterialDialog.prompt = (title, message, options = {}) => {
    return MaterialDialog({ type: 'prompt', icon: options.icon })
      .setTitle(title).setMessage(message)
      .setInputPlaceholder(options.placeholder || '')
      .setInputValue(options.defaultValue || '')
      .setNegativeButton(options.cancelText || 'Cancel', options.onCancel)
      .setPositiveButton(options.confirmText || 'OK', options.onConfirm, { style: 'text' })
      .show();
  };

  // ==========================================
  // Snackbar Styles
  // ==========================================
  const SNACKBAR_STYLES = `
    .msb-snackbar-container {
      position: fixed; left: 50%; transform: translateX(-50%); z-index: 9999;
      display: flex; flex-direction: column; gap: 8px;
      pointer-events: none; padding: 16px; max-width: 100%; width: 100%;
    }
    .msb-snackbar-container.msb-bottom { bottom: 0; }
    .msb-snackbar-container.msb-top { top: 0; flex-direction: column-reverse; }
    .msb-snackbar {
      background: var(--md-inverse-surface, #322F35);
      color: var(--md-inverse-on-surface, #F5EFF7);
      border-radius: 4px; min-height: 48px;
      display: flex; align-items: center; padding: 0 8px 0 16px;
      box-shadow: 0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14);
      pointer-events: auto; max-width: 672px; width: fit-content; margin: 0 auto;
      transform: translateY(100%); opacity: 0;
      transition: transform 250ms cubic-bezier(0.2, 0, 0, 1), opacity 200ms ease-out;
    }
    .msb-snackbar-container.msb-top .msb-snackbar { transform: translateY(-100%); }
    .msb-snackbar.msb-visible { transform: translateY(0); opacity: 1; }
    .msb-snackbar.msb-hiding {
      transform: translateY(100%); opacity: 0;
      transition: transform 200ms cubic-bezier(0.4, 0, 1, 1), opacity 150ms ease-in;
    }
    .msb-snackbar-container.msb-top .msb-snackbar.msb-hiding { transform: translateY(-100%); }
    .msb-snackbar.msb-error { background: var(--md-error-container); color: var(--md-on-error-container); }
    .msb-snackbar.msb-success { background: #c8e6c9; color: #1b5e20; }
    .msb-snackbar-icon { margin-right: 12px; font-size: 1.25rem; display: flex; align-items: center; }
    .msb-snackbar-message { flex: 1; font-size: 0.875rem; line-height: 1.4; padding: 14px 0; word-break: break-word; }
    .msb-snackbar-action {
      background: transparent; border: none; color: var(--md-inverse-primary);
      font-family: inherit; font-size: 0.875rem; font-weight: 500;
      padding: 10px 12px; margin-left: 8px; border-radius: 4px;
      cursor: pointer; transition: background-color 0.2s; white-space: nowrap;
    }
    .msb-snackbar-action:hover { background: rgba(208, 188, 255, 0.08); }
    .msb-snackbar.msb-error .msb-snackbar-action { color: var(--md-error); }
    .msb-snackbar.msb-success .msb-snackbar-action { color: #1b5e20; }
    .msb-snackbar-close {
      background: transparent; border: none; color: inherit; opacity: 0.7;
      padding: 8px; margin-left: 4px; border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.2s, background-color 0.2s;
    }
    .msb-snackbar-close:hover { opacity: 1; background: rgba(255, 255, 255, 0.08); }
    @media (max-width: 600px) {
      .msb-snackbar-container { padding: 8px; }
      .msb-snackbar { width: 100%; max-width: none; border-radius: 8px; }
    }
  `;

  // Snackbar queue management
  const snackbarQueues = { bottom: [], top: [] };
  const activeSnackbars = { bottom: [], top: [] };
  const containers = {};

  const getSnackbarContainer = (position) => {
    if (!containers[position]) {
      const container = document.createElement('div');
      container.className = `msb-snackbar-container msb-${position}`;
      document.body.appendChild(container);
      containers[position] = container;
    }
    return containers[position];
  };

  const processSnackbarQueue = (position) => {
    const queue = snackbarQueues[position];
    const active = activeSnackbars[position];
    while (queue.length > 0 && active.length < 3) {
      const snackbar = queue.shift();
      active.push(snackbar);
      snackbar._display();
    }
  };

  // ==========================================
  // Snackbar
  // ==========================================
  const Snackbar = (props = {}) => {
    _injectStyles('snackbar', SNACKBAR_STYLES);

    const state = {
      message: props.message || '',
      duration: props.duration !== undefined ? props.duration : 4000,
      position: props.position || 'bottom',
      action: props.action || null,
      showClose: props.showClose || false,
      icon: props.icon || null,
      type: props.type || 'default',
      onDismiss: props.onDismiss || null,
      element: null, timeoutId: null, isVisible: false
    };

    const build = () => {
      state.element = document.createElement('div');
      state.element.className = 'msb-snackbar';
      if (state.type === 'error') state.element.classList.add('msb-error');
      else if (state.type === 'success') state.element.classList.add('msb-success');

      if (state.icon) {
        const icon = document.createElement('span');
        icon.className = 'msb-snackbar-icon';
        icon.innerHTML = `<i class="${state.icon}"></i>`;
        state.element.appendChild(icon);
      }

      const messageEl = document.createElement('span');
      messageEl.className = 'msb-snackbar-message';
      messageEl.textContent = state.message;
      state.element.appendChild(messageEl);

      if (state.action) {
        const actionBtn = document.createElement('button');
        actionBtn.className = 'msb-snackbar-action';
        actionBtn.textContent = state.action.text;
        actionBtn.addEventListener('click', () => {
          if (state.action.onClick) state.action.onClick();
          instance.dismiss();
        });
        state.element.appendChild(actionBtn);
      }

      if (state.showClose) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'msb-snackbar-close';
        closeBtn.innerHTML = '<i class="bx bx-x"></i>';
        closeBtn.addEventListener('click', () => instance.dismiss());
        state.element.appendChild(closeBtn);
      }
    };

    const instance = {
      _display() {
        build();
        const container = getSnackbarContainer(state.position);
        container.appendChild(state.element);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { state.element.classList.add('msb-visible'); });
        });
        state.isVisible = true;
        if (state.duration > 0) {
          state.timeoutId = setTimeout(() => instance.dismiss(), state.duration);
        }
      },
      show() {
        if (state.isVisible) return this;
        snackbarQueues[state.position].push(this);
        processSnackbarQueue(state.position);
        return this;
      },
      dismiss() {
        if (!state.isVisible || !state.element) return;
        if (state.timeoutId) { clearTimeout(state.timeoutId); state.timeoutId = null; }
        state.element.classList.remove('msb-visible');
        state.element.classList.add('msb-hiding');
        setTimeout(() => {
          if (state.element?.parentNode) state.element.parentNode.removeChild(state.element);
          const active = activeSnackbars[state.position];
          const index = active.indexOf(this);
          if (index > -1) active.splice(index, 1);
          if (state.onDismiss) state.onDismiss();
          processSnackbarQueue(state.position);
        }, 200);
        state.isVisible = false;
      },
      setMessage(message) {
        state.message = message;
        if (state.element) {
          const msgEl = state.element.querySelector('.msb-snackbar-message');
          if (msgEl) msgEl.textContent = message;
        }
        return this;
      },
      isShowing() { return state.isVisible; },
      getElement() { return state.element; }
    };

    return instance;
  };

  // Static helper methods
  Snackbar.show = (message, options = {}) => Snackbar({ message, ...options }).show();
  Snackbar.error = (message, options = {}) => Snackbar({ message, type: 'error', icon: 'bx bx-error-circle', ...options }).show();
  Snackbar.success = (message, options = {}) => Snackbar({ message, type: 'success', icon: 'bx bx-check-circle', ...options }).show();
  Snackbar.dismissAll = () => {
    ['bottom', 'top'].forEach(position => {
      snackbarQueues[position] = [];
      activeSnackbars[position].forEach(s => s.dismiss());
    });
  };

  // ==========================================
  // Extend AndroidComponents with overlay components
  // ==========================================
  if (window.AndroidComponents) {
    window.AndroidComponents.MaterialDialog = MaterialDialog;
    window.AndroidComponents.Snackbar = Snackbar;
  } else {
    window.AndroidComponents = { MaterialDialog, Snackbar };
  }
})();
