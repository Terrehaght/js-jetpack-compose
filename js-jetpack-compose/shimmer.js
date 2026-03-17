// ============================================
// Shimmer Component — drop-in for AndroidComponents
// ============================================
// Usage:
//   const shimmer = AndroidComponents.Shimmer({
//       width: 200,
//       height: 20,
//       borderRadius: 4,
//       color: '#e0e0e0',          // base background
//       highlightColor: '#f5f5f5', // sweep highlight
//       duration: 1400,            // ms per sweep
//       angle: 30,                 // gradient angle in deg
//       intensity: 0.6,            // highlight opacity 0–1
//       margin: [8, 0],            // reuses dp()
//       className: ''              // extra CSS class
//   });
//   parent.appendChild(shimmer.getElement());
//
// Preset helper (builds a group of shimmers for common skeletons):
//   const card = AndroidComponents.ShimmerPreset.card();
//   parent.appendChild(card.getElement());
//
// ============================================

(function attachShimmer(root) {
    // -----------------------------------------------
    // Guard: only attach when AndroidComponents exists
    // -----------------------------------------------
    if (!root.AndroidComponents) {
        console.warn('[Shimmer] AndroidComponents not found on window. Attach after AndroidComponents loads.');
        return;
    }

    const { dp, applyStyles } = root.AndroidLayouts?.utils || {};
    const { injectStyles } = root.AndroidComponents.utils;

    // -----------------------------------------------
    // Inject the keyframe animation once
    // -----------------------------------------------
    injectStyles('shimmer', `
        @keyframes android-shimmer-sweep {
            0%   { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        /* utility: stack multiple shimmers vertically with a gap */
        .shimmer-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
        }
        .shimmer-group-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
            width: 100%;
        }
    `);

    // -----------------------------------------------
    // Core Shimmer factory
    // -----------------------------------------------
    const Shimmer = (props = {}) => {
        const {
            width        = 100,          // number (dp) or 'match_parent'
            height       = 16,           // number (dp)
            borderRadius = 4,            // number (dp) or [tl, tr, br, bl]
            color        = 'var(--md-surface-variant)',   // base bg
            highlightColor = 'var(--md-surface-container-highest)', // sweep color
            duration     = 1400,         // animation duration ms
            angle        = 30,           // gradient angle deg
            intensity    = 0.7,          // 0–1, highlight opacity
            margin,                      // number or array → dp()
            weight,                      // flex weight
            alignSelf,
            className    = '',
            id
        } = props;

        // --- element ---
        const el = document.createElement('div');
        if (id) el.id = id;
        if (className) el.className = className;

        // --- border-radius ---
        let radiusCSS;
        if (Array.isArray(borderRadius)) {
            radiusCSS = borderRadius.map(v => dp(v)).join(' ');
        } else {
            radiusCSS = dp(borderRadius);
        }

        // --- inline styles applied via applyStyles (mirrors rest of lib) ---
        const styles = {
            borderRadius: radiusCSS,
            overflow:     'hidden',
            flexShrink:   '0',
            height:       dp(height),
            // background and animation are set below as raw style
        };

        if (width === 'match_parent') {
            styles.width = '100%';
        } else {
            styles.width = dp(width);
        }

        if (margin)     styles.margin    = dp(margin);
        if (weight)     styles.flex      = weight;
        if (alignSelf)  styles.alignSelf = alignSelf;

        applyStyles(el, styles);

        // --- shimmer gradient + animation (set directly; applyStyles doesn't handle
        //     multi-value background shorthand or animation cleanly) ---
        const rad = angle;
        el.style.background = [
            `linear-gradient(`,
            `  ${rad}deg,`,
            `  ${color} 0%,`,
            `  ${color} 35%,`,
            `  ${highlightColor} 50%,`,
            `  ${color} 65%,`,
            `  ${color} 100%`,
            `)`
        ].join('');
        el.style.backgroundSize  = '200% 100%';
        el.style.animation       = `android-shimmer-sweep ${duration}ms linear infinite`;

        // --- public API ---
        return {
            getElement: () => el,

            /** live-update any prop; re-applies everything that changed */
            update(newProps) {
                // simple recursive merge then re-render is cheap for a single div
                Object.assign(props, newProps);

                // re-derive
                const w = props.width ?? 100;
                const h = props.height ?? 16;
                const br = props.borderRadius ?? 4;
                const c = props.color ?? 'var(--md-surface-variant)';
                const hc = props.highlightColor ?? 'var(--md-surface-container-highest)';
                const dur = props.duration ?? 1400;
                const ang = props.angle ?? 30;

                el.style.width          = w === 'match_parent' ? '100%' : dp(w);
                el.style.height         = dp(h);
                el.style.borderRadius   = Array.isArray(br) ? br.map(v => dp(v)).join(' ') : dp(br);
                el.style.background     = `linear-gradient(${ang}deg, ${c} 0%, ${c} 35%, ${hc} 50%, ${c} 65%, ${c} 100%)`;
                el.style.backgroundSize = '200% 100%';
                el.style.animationDuration = `${dur}ms`;
            },

            /** pause / resume the animation */
            setPaused(paused) {
                el.style.animationPlayState = paused ? 'paused' : 'running';
            }
        };
    };

    // -----------------------------------------------
    // ShimmerPreset  —  ready-made skeleton layouts
    // -----------------------------------------------
    const ShimmerPreset = {
        /**
         * A typical card skeleton:
         *   ┌─────────────────────┐
         *   │  ████████████████   │  <- image area
         *   │  ██████             │  <- title line
         *   │  ████████████       │  <- subtitle line
         *   └─────────────────────┘
         */
        card({ width = 'match_parent', color, highlightColor } = {}) {
            const shared = {};
            if (color)          shared.color          = color;
            if (highlightColor) shared.highlightColor = highlightColor;

            const group = document.createElement('div');
            group.className = 'shimmer-group';
            if (width === 'match_parent') group.style.width = '100%';
            else                          group.style.width  = dp(width);

            // image block
            group.appendChild(Shimmer({ ...shared, width: 'match_parent', height: 160, borderRadius: 8 }).getElement());
            // title
            group.appendChild(Shimmer({ ...shared, width: '60%',          height: 18,  borderRadius: 4 }).getElement());
            // subtitle
            group.appendChild(Shimmer({ ...shared, width: '85%',          height: 14,  borderRadius: 4 }).getElement());

            return { getElement: () => group };
        },

        /**
         * A row of avatar + two text lines (common list-item skeleton)
         *   ○  ████████████
         *      ██████
         */
        listItem({ width = 'match_parent', color, highlightColor } = {}) {
            const shared = {};
            if (color)          shared.color          = color;
            if (highlightColor) shared.highlightColor = highlightColor;

            const row = document.createElement('div');
            row.className = 'shimmer-group-row';
            if (width === 'match_parent') row.style.width = '100%';
            else                          row.style.width  = dp(width);

            // avatar circle
            row.appendChild(Shimmer({ ...shared, width: 44, height: 44, borderRadius: 22 }).getElement());

            // text column
            const col = document.createElement('div');
            col.className = 'shimmer-group';
            col.style.flex = '1';
            col.appendChild(Shimmer({ ...shared, width: '70%', height: 16, borderRadius: 4 }).getElement());
            col.appendChild(Shimmer({ ...shared, width: '45%', height: 12, borderRadius: 4 }).getElement());
            row.appendChild(col);

            return { getElement: () => row };
        },

        /**
         * A single text-line skeleton (handy for inline use)
         */
        textLine({ width = '100%', height = 14, color, highlightColor } = {}) {
            const shared = {};
            if (color)          shared.color          = color;
            if (highlightColor) shared.highlightColor = highlightColor;

            return Shimmer({ ...shared, width, height, borderRadius: 4 });
        },

        /**
         * A grid of equal-size card shimmers
         *   ┌────┐ ┌────┐ ┌────┐
         *   │    │ │    │ │    │
         *   └────┘ └────┘ └────┘
         */
        grid({ columns = 2, cardHeight = 180, gap = 12, color, highlightColor } = {}) {
            const shared = {};
            if (color)          shared.color          = color;
            if (highlightColor) shared.highlightColor = highlightColor;

            const grid = document.createElement('div');
            grid.style.display        = 'grid';
            grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            grid.style.gap            = dp(gap);
            grid.style.width          = '100%';

            for (let i = 0; i < columns; i++) {
                grid.appendChild(Shimmer({ ...shared, width: 'match_parent', height: cardHeight, borderRadius: 12 }).getElement());
            }

            return { getElement: () => grid };
        }
    };

    // -----------------------------------------------
    // Attach to AndroidComponents
    // -----------------------------------------------
    root.AndroidComponents.Shimmer        = Shimmer;
    root.AndroidComponents.ShimmerPreset  = ShimmerPreset;

})(window);
