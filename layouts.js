// Enhanced Android-style Layout Framework
// Comprehensive layouts for organizing UI components

const AndroidLayouts = (() => {
  // Utility: Convert dp to pixels
  const dp = (value) => {
    if (typeof value === 'number') return `${value}px`;
    if (typeof value === 'string' && value.includes('px')) return value;
    return `${value}px`;
  };

  // Utility: Apply styles to an element
  const applyStyles = (element, styles) => {
    Object.assign(element.style, styles);
  };

  // Process layout params for children
  const processLayoutParams = (element, layoutParams, parentOrientation = 'vertical') => {
    if (!layoutParams) return;

    const { weight, gravity, margin, zIndex } = layoutParams;

    if (weight !== undefined) {
      element.style.flex = weight;
    }

    if (gravity) {
      const gravityMap = {
        center: { alignSelf: 'center' },
        start: { alignSelf: 'flex-start' },
        end: { alignSelf: 'flex-end' },
        stretch: { alignSelf: 'stretch' },
      };
      Object.assign(element.style, gravityMap[gravity] || {});
    }

    if (margin) {
      if (typeof margin === 'object') {
        const { top, right, bottom, left, horizontal, vertical, all } = margin;
        if (all !== undefined) element.style.margin = dp(all);
        if (vertical !== undefined) {
          element.style.marginTop = dp(vertical);
          element.style.marginBottom = dp(vertical);
        }
        if (horizontal !== undefined) {
          element.style.marginLeft = dp(horizontal);
          element.style.marginRight = dp(horizontal);
        }
        if (top !== undefined) element.style.marginTop = dp(top);
        if (right !== undefined) element.style.marginRight = dp(right);
        if (bottom !== undefined) element.style.marginBottom = dp(bottom);
        if (left !== undefined) element.style.marginLeft = dp(left);
      } else {
        element.style.margin = dp(margin);
      }
    }

    if (zIndex !== undefined) {
      element.style.zIndex = zIndex;
    }
  };

  // LinearLayout (Column/Row)
  const LinearLayout = (props = {}, children = []) => {
    const { 
      orientation = 'vertical', 
      gravity, 
      padding, 
      margin, 
      background,
      gap = 0,
      width,
      height,
      id,
      className,
      wrap = false,
      weightSum
    } = props;
    
    const container = document.createElement('div');
    const styles = {
      display: 'flex',
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      boxSizing: 'border-box',
      gap: dp(gap),
    };

    if (wrap) styles.flexWrap = 'wrap';

    if (width === 'match_parent') styles.width = '100%';
    else if (width === 'wrap_content') styles.width = 'fit-content';
    else if (width) styles.width = dp(width);

    if (height === 'match_parent') styles.height = '100%';
    else if (height === 'wrap_content') styles.height = 'fit-content';
    else if (height) styles.height = dp(height);

    if (gravity) {
      const gravityMap = {
        center: { justifyContent: 'center', alignItems: 'center' },
        start: { justifyContent: 'flex-start', alignItems: 'flex-start' },
        end: { justifyContent: 'flex-end', alignItems: 'flex-end' },
        'center_horizontal': { alignItems: 'center' },
        'center_vertical': { justifyContent: 'center' },
        'space_between': { justifyContent: 'space-between' },
        'space_around': { justifyContent: 'space-around' },
        'space_evenly': { justifyContent: 'space-evenly' },
      };
      Object.assign(styles, gravityMap[gravity] || {});
    }

    if (padding) {
      if (typeof padding === 'object') {
        const { top, right, bottom, left, horizontal, vertical, all } = padding;
        if (all !== undefined) styles.padding = dp(all);
        if (vertical !== undefined) {
          styles.paddingTop = dp(vertical);
          styles.paddingBottom = dp(vertical);
        }
        if (horizontal !== undefined) {
          styles.paddingLeft = dp(horizontal);
          styles.paddingRight = dp(horizontal);
        }
        if (top !== undefined) styles.paddingTop = dp(top);
        if (right !== undefined) styles.paddingRight = dp(right);
        if (bottom !== undefined) styles.paddingBottom = dp(bottom);
        if (left !== undefined) styles.paddingLeft = dp(left);
      } else {
        styles.padding = dp(padding);
      }
    }
    
    if (margin) styles.margin = dp(margin);
    if (background) styles.background = background;

    applyStyles(container, styles);

    if (id) container.id = id;
    if (className) container.className = className;

    children.forEach(child => {
      if (child && typeof child.getElement === 'function') {
        const childEl = child.getElement();
        processLayoutParams(childEl, child.layoutParams, orientation);
        container.appendChild(childEl);
      } else if (child instanceof HTMLElement) {
        container.appendChild(child);
      }
    });

    return {
      getElement: () => container,
      addChild: (child) => {
        const el = child && typeof child.getElement === 'function' ? child.getElement() : child;
        if (child.layoutParams) {
          processLayoutParams(el, child.layoutParams, orientation);
        }
        container.appendChild(el);
      },
      removeChild: (child) => {
        const el = child && typeof child.getElement === 'function' ? child.getElement() : child;
        container.removeChild(el);
      },
      clear: () => {
        container.innerHTML = '';
      }
    };
  };

  // Shorthand for vertical LinearLayout
  const Column = (props, children) => LinearLayout({ ...props, orientation: 'vertical' }, children);

  // Shorthand for horizontal LinearLayout
  const Row = (props, children) => LinearLayout({ ...props, orientation: 'horizontal' }, children);

  // GridLayout
  const GridLayout = (props = {}, children = []) => {
    const {
      columns = 2,
      rows,
      gap = 0,
      columnGap,
      rowGap,
      padding,
      margin,
      background,
      width = 'match_parent',
      height,
      id,
      className,
      autoFlow = 'row' // 'row' | 'column' | 'dense'
    } = props;

    const container = document.createElement('div');
    const styles = {
      display: 'grid',
      boxSizing: 'border-box',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: dp(gap),
      gridAutoFlow: autoFlow
    };

    if (columnGap !== undefined) styles.columnGap = dp(columnGap);
    if (rowGap !== undefined) styles.rowGap = dp(rowGap);
    if (rows) styles.gridTemplateRows = `repeat(${rows}, 1fr)`;

    if (width === 'match_parent') styles.width = '100%';
    else if (width) styles.width = dp(width);

    if (height === 'match_parent') styles.height = '100%';
    else if (height) styles.height = dp(height);

    if (padding) styles.padding = dp(padding);
    if (margin) styles.margin = dp(margin);
    if (background) styles.background = background;

    applyStyles(container, styles);

    if (id) container.id = id;
    if (className) container.className = className;

    children.forEach(child => {
      const childEl = child && typeof child.getElement === 'function' ? child.getElement() : child;
      
      // Handle grid-specific layout params
      if (child.gridParams) {
        const { columnSpan, rowSpan, column, row } = child.gridParams;
        if (columnSpan) childEl.style.gridColumn = `span ${columnSpan}`;
        if (rowSpan) childEl.style.gridRow = `span ${rowSpan}`;
        if (column) childEl.style.gridColumnStart = column;
        if (row) childEl.style.gridRowStart = row;
      }

      container.appendChild(childEl);
    });

    return {
      getElement: () => container,
      addChild: (child) => {
        const el = child && typeof child.getElement === 'function' ? child.getElement() : child;
        if (child.gridParams) {
          const { columnSpan, rowSpan, column, row } = child.gridParams;
          if (columnSpan) el.style.gridColumn = `span ${columnSpan}`;
          if (rowSpan) el.style.gridRow = `span ${rowSpan}`;
          if (column) el.style.gridColumnStart = column;
          if (row) el.style.gridRowStart = row;
        }
        container.appendChild(el);
      }
    };
  };

  // ConstraintLayout
  const ConstraintLayout = (props = {}, children = []) => {
    const {
      padding,
      margin,
      background,
      width = 'match_parent',
      height = 'match_parent',
      id,
      className
    } = props;

    const container = document.createElement('div');
    const styles = {
      position: 'relative',
      boxSizing: 'border-box',
    };

    if (width === 'match_parent') styles.width = '100%';
    else if (width === 'wrap_content') styles.width = 'fit-content';
    else if (width) styles.width = dp(width);

    if (height === 'match_parent') styles.height = '100%';
    else if (height === 'wrap_content') styles.height = 'fit-content';
    else if (height) styles.height = dp(height);

    if (padding) styles.padding = dp(padding);
    if (margin) styles.margin = dp(margin);
    if (background) styles.background = background;

    applyStyles(container, styles);

    if (id) container.id = id;
    if (className) container.className = className;

    children.forEach(child => {
      const childEl = child && typeof child.getElement === 'function' ? child.getElement() : child;
      childEl.style.position = 'absolute';

      if (child.constraints) {
        const {
          top, right, bottom, left,
          topToTop, topToBottom,
          bottomToTop, bottomToBottom,
          leftToLeft, leftToRight,
          rightToLeft, rightToRight,
          centerHorizontally, centerVertically,
          width, height,
          horizontalBias, verticalBias
        } = child.constraints;

        // Direct positioning
        if (top !== undefined) childEl.style.top = dp(top);
        if (right !== undefined) childEl.style.right = dp(right);
        if (bottom !== undefined) childEl.style.bottom = dp(bottom);
        if (left !== undefined) childEl.style.left = dp(left);

        // Constraint-based positioning
        if (topToTop !== undefined) childEl.style.top = dp(topToTop);
        if (bottomToBottom !== undefined) childEl.style.bottom = dp(bottomToBottom);
        if (leftToLeft !== undefined) childEl.style.left = dp(leftToLeft);
        if (rightToRight !== undefined) childEl.style.right = dp(rightToRight);

        // Centering
        if (centerHorizontally) {
          childEl.style.left = '50%';
          childEl.style.transform = 'translateX(-50%)';
        }
        if (centerVertically) {
          childEl.style.top = '50%';
          childEl.style.transform = 'translateY(-50%)';
        }
        if (centerHorizontally && centerVertically) {
          childEl.style.transform = 'translate(-50%, -50%)';
        }

        // Bias (for positioning between constraints)
        if (horizontalBias !== undefined && left !== undefined && right !== undefined) {
          childEl.style.left = `${horizontalBias * 100}%`;
        }
        if (verticalBias !== undefined && top !== undefined && bottom !== undefined) {
          childEl.style.top = `${verticalBias * 100}%`;
        }

        // Size
        if (width === 'match_parent') childEl.style.width = '100%';
        else if (width === 'match_constraint') {
          if (left !== undefined && right !== undefined) {
            childEl.style.width = 'auto';
          }
        } else if (width) childEl.style.width = dp(width);

        if (height === 'match_parent') childEl.style.height = '100%';
        else if (height === 'match_constraint') {
          if (top !== undefined && bottom !== undefined) {
            childEl.style.height = 'auto';
          }
        } else if (height) childEl.style.height = dp(height);
      }

      container.appendChild(childEl);
    });

    return {
      getElement: () => container
    };
  };

  // ScrollView
  const ScrollView = (props = {}, children = []) => {
    const {
      orientation = 'vertical',
      padding,
      margin,
      background,
      width = 'match_parent',
      height = 'match_parent',
      id,
      className
    } = props;

    const container = document.createElement('div');
    const styles = {
      overflowX: orientation === 'horizontal' ? 'auto' : 'hidden',
      overflowY: orientation === 'vertical' ? 'auto' : 'hidden',
      boxSizing: 'border-box',
    };

    if (width === 'match_parent') styles.width = '100%';
    else if (width) styles.width = dp(width);

    if (height === 'match_parent') styles.height = '100%';
    else if (height) styles.height = dp(height);

    if (padding) styles.padding = dp(padding);
    if (margin) styles.margin = dp(margin);
    if (background) styles.background = background;

    applyStyles(container, styles);

    if (id) container.id = id;
    if (className) container.className = className;

    children.forEach(child => {
      if (child && typeof child.getElement === 'function') {
        container.appendChild(child.getElement());
      } else if (child instanceof HTMLElement) {
        container.appendChild(child);
      }
    });

    return {
      getElement: () => container,
      scrollTo: (x, y) => {
        container.scrollTo(x, y);
      },
      scrollToTop: () => {
        container.scrollTop = 0;
      },
      scrollToBottom: () => {
        container.scrollTop = container.scrollHeight;
      }
    };
  };

  // FrameLayout (overlapping children)
  const FrameLayout = (props = {}, children = []) => {
    const { 
      padding, 
      margin, 
      background, 
      width, 
      height,
      id,
      className 
    } = props;
    
    const container = document.createElement('div');
    const styles = {
      position: 'relative',
      boxSizing: 'border-box',
    };

    if (width === 'match_parent') styles.width = '100%';
    else if (width === 'wrap_content') styles.width = 'fit-content';
    else if (width) styles.width = dp(width);
    
    if (height === 'match_parent') styles.height = '100%';
    else if (height === 'wrap_content') styles.height = 'fit-content';
    else if (height) styles.height = dp(height);

    if (padding) styles.padding = dp(padding);
    if (margin) styles.margin = dp(margin);
    if (background) styles.background = background;

    applyStyles(container, styles);

    if (id) container.id = id;
    if (className) container.className = className;

    children.forEach((child) => {
      const childEl = child && typeof child.getElement === 'function' ? child.getElement() : child;
      
      const childStyles = {
        position: 'absolute',
      };

      if (child.frameLayoutPosition) {
        const { top, right, bottom, left, gravity, zIndex } = child.frameLayoutPosition;
        
        if (top !== undefined) childStyles.top = dp(top);
        if (right !== undefined) childStyles.right = dp(right);
        if (bottom !== undefined) childStyles.bottom = dp(bottom);
        if (left !== undefined) childStyles.left = dp(left);
        if (zIndex !== undefined) childStyles.zIndex = zIndex;

        if (gravity) {
          const gravityMap = {
            center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
            top: { top: '0', left: '50%', transform: 'translateX(-50%)' },
            bottom: { bottom: '0', left: '50%', transform: 'translateX(-50%)' },
            left: { left: '0', top: '50%', transform: 'translateY(-50%)' },
            right: { right: '0', top: '50%', transform: 'translateY(-50%)' },
            top_left: { top: '0', left: '0' },
            top_right: { top: '0', right: '0' },
            bottom_left: { bottom: '0', left: '0' },
            bottom_right: { bottom: '0', right: '0' },
          };
          Object.assign(childStyles, gravityMap[gravity] || {});
        }
      }

      applyStyles(childEl, childStyles);
      container.appendChild(childEl);
    });

    return {
      getElement: () => container
    };
  };

  // Helper for adding layout params to children
  const LayoutParams = (params, child) => {
    const result = child;
    if (typeof child.getElement === 'function') {
      result.layoutParams = params;
    } else if (child instanceof HTMLElement) {
      child.layoutParams = params;
    }
    return result;
  };

  // Helper for grid positioning
  const GridParams = (params, child) => {
    const result = child;
    if (typeof child.getElement === 'function') {
      result.gridParams = params;
    } else if (child instanceof HTMLElement) {
      child.gridParams = params;
    }
    return result;
  };

  // Helper for FrameLayout positioning
  const Positioned = (positionProps, child) => {
    const result = child;
    if (typeof child.getElement === 'function') {
      result.frameLayoutPosition = positionProps;
    } else if (child instanceof HTMLElement) {
      child.frameLayoutPosition = positionProps;
    }
    return result;
  };

  // Helper for constraint positioning
  const Constrained = (constraints, child) => {
    const result = child;
    if (typeof child.getElement === 'function') {
      result.constraints = constraints;
    } else if (child instanceof HTMLElement) {
      child.constraints = constraints;
    }
    return result;
  };

  // Mount function
  const mount = (component, targetId = 'app') => {
    const target = document.getElementById(targetId);
    if (!target) {
      console.error(`Target element with id "${targetId}" not found`);
      return;
    }
    
    if (component instanceof HTMLElement) {
      target.appendChild(component);
    } else if (component && typeof component.getElement === 'function') {
      target.appendChild(component.getElement());
    }
  };

  // Export utilities for use by other modules
  return {
    LinearLayout,
    Column,
    Row,
    GridLayout,
    ConstraintLayout,
    ScrollView,
    FrameLayout,
    LayoutParams,
    GridParams,
    Positioned,
    Constrained,
    mount,
    // Export utilities for other modules
    utils: { dp, applyStyles }
  };
})();

// Make available globally
window.AndroidLayouts = AndroidLayouts;