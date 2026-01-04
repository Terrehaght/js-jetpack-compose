// Android-style Activity and Fragment Framework
// Works seamlessly with AndroidLayouts and Compose-like components

const AndroidFramework = (() => {
  // ============================================================================
  // Lifecycle States
  // ============================================================================
  const LifecycleState = {
    CREATED: 'CREATED',
    STARTED: 'STARTED',
    RESUMED: 'RESUMED',
    PAUSED: 'PAUSED',
    STOPPED: 'STOPPED',
    DESTROYED: 'DESTROYED'
  };

  // ============================================================================
  // Intent System
  // ============================================================================
  class Intent {
    constructor(targetActivity, extras = {}) {
      this.targetActivity = targetActivity;
      this.extras = extras;
      this.flags = [];
    }

    putExtra(key, value) {
      this.extras[key] = value;
      return this;
    }

    getExtra(key, defaultValue = null) {
      return this.extras.hasOwnProperty(key) ? this.extras[key] : defaultValue;
    }

    getExtras() {
      return { ...this.extras };
    }

    addFlags(...flags) {
      this.flags.push(...flags);
      return this;
    }

    hasFlag(flag) {
      return this.flags.includes(flag);
    }
  }

  // Intent Flags
  Intent.FLAG_ACTIVITY_CLEAR_TOP = 'FLAG_ACTIVITY_CLEAR_TOP';
  Intent.FLAG_ACTIVITY_SINGLE_TOP = 'FLAG_ACTIVITY_SINGLE_TOP';
  Intent.FLAG_ACTIVITY_NEW_TASK = 'FLAG_ACTIVITY_NEW_TASK';
  Intent.FLAG_ACTIVITY_CLEAR_TASK = 'FLAG_ACTIVITY_CLEAR_TASK';

  // ============================================================================
  // Bundle - for saving/restoring state
  // ============================================================================
  class Bundle {
    constructor(data = {}) {
      this.data = { ...data };
    }

    put(key, value) {
      this.data[key] = value;
    }

    get(key, defaultValue = null) {
      return this.data.hasOwnProperty(key) ? this.data[key] : defaultValue;
    }

    has(key) {
      return this.data.hasOwnProperty(key);
    }

    remove(key) {
      delete this.data[key];
    }

    clear() {
      this.data = {};
    }

    getData() {
      return { ...this.data };
    }
  }

  // ============================================================================
  // Base Activity Class
  // ============================================================================
  class Activity {
    constructor() {
      this.lifecycleState = null;
      this.intent = null;
      this.savedInstanceState = null;
      this.rootView = null;
      this.fragments = new Map();
      this.fragmentContainerId = null;
    }

    // ========== Lifecycle Methods ==========
    onCreate(savedInstanceState = null) {
      this.lifecycleState = LifecycleState.CREATED;
      this.savedInstanceState = savedInstanceState;
      console.log(`${this.constructor.name} - onCreate`);
    }

    onStart() {
      this.lifecycleState = LifecycleState.STARTED;
      console.log(`${this.constructor.name} - onStart`);
    }

    onResume() {
      this.lifecycleState = LifecycleState.RESUMED;
      console.log(`${this.constructor.name} - onResume`);
    }

    onPause() {
      this.lifecycleState = LifecycleState.PAUSED;
      console.log(`${this.constructor.name} - onPause`);
    }

    onStop() {
      this.lifecycleState = LifecycleState.STOPPED;
      console.log(`${this.constructor.name} - onStop`);
    }

    onDestroy() {
      this.lifecycleState = LifecycleState.DESTROYED;
      this.fragments.clear();
      console.log(`${this.constructor.name} - onDestroy`);
    }

    onSaveInstanceState(outState) {
      // Override to save state
      console.log(`${this.constructor.name} - onSaveInstanceState`);
    }

    onRestoreInstanceState(savedInstanceState) {
      // Override to restore state
      console.log(`${this.constructor.name} - onRestoreInstanceState`);
    }

    onNewIntent(intent) {
      // Called when activity receives a new intent (single top mode)
      this.intent = intent;
      console.log(`${this.constructor.name} - onNewIntent`);
    }

    onBackPressed() {
      // Override to handle back button
      ActivityManager.finishActivity();
    }

    // ========== View Methods ==========
    setContentView(view) {
      if (view instanceof HTMLElement) {
        this.rootView = view;
      } else if (view && typeof view.getElement === 'function') {
        this.rootView = view.getElement();
      } else {
        throw new Error('setContentView requires an HTMLElement or component with getElement() method');
      }
      
      const container = document.getElementById('app');
      if (container) {
        container.innerHTML = '';
        container.appendChild(this.rootView);
      }
    }

    findViewById(id) {
      return document.getElementById(id);
    }

    runOnUiThread(callback) {
      requestAnimationFrame(callback);
    }

    // ========== Intent/Navigation Methods ==========
    getIntent() {
      return this.intent;
    }

    setIntent(intent) {
      this.intent = intent;
    }

    startActivity(intent) {
      ActivityManager.startActivity(intent);
    }

    startActivityForResult(intent, requestCode) {
      intent.requestCode = requestCode;
      ActivityManager.startActivity(intent);
    }

    setResult(resultCode, data = {}) {
      this.resultCode = resultCode;
      this.resultData = data;
    }

    finish() {
      ActivityManager.finishActivity();
    }

    // ========== Fragment Methods ==========
    getSupportFragmentManager() {
      return {
        beginTransaction: () => new FragmentTransaction(this)
      };
    }

    setFragmentContainer(containerId) {
      this.fragmentContainerId = containerId;
    }

    // ========== Helper Methods ==========
    toast(message, duration = 3000) {
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        animation: slideUp 0.3s ease;
      `;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  }

  // ============================================================================
  // Fragment Class
  // ============================================================================
  class Fragment {
    constructor() {
      this.lifecycleState = null;
      this.activity = null;
      this.rootView = null;
      this.arguments = null;
      this.savedInstanceState = null;
      this.fragmentId = null;
    }

    // ========== Lifecycle Methods ==========
    onAttach(activity) {
      this.activity = activity;
      console.log(`${this.constructor.name} - onAttach`);
    }

    onCreate(savedInstanceState = null) {
      this.lifecycleState = LifecycleState.CREATED;
      this.savedInstanceState = savedInstanceState;
      console.log(`${this.constructor.name} - onCreate`);
    }

    onCreateView(savedInstanceState = null) {
      // Override this to return your view
      console.log(`${this.constructor.name} - onCreateView`);
      return null;
    }

    onViewCreated(view, savedInstanceState) {
      // Override to initialize view components
      console.log(`${this.constructor.name} - onViewCreated`);
    }

    onStart() {
      this.lifecycleState = LifecycleState.STARTED;
      console.log(`${this.constructor.name} - onStart`);
    }

    onResume() {
      this.lifecycleState = LifecycleState.RESUMED;
      console.log(`${this.constructor.name} - onResume`);
    }

    onPause() {
      this.lifecycleState = LifecycleState.PAUSED;
      console.log(`${this.constructor.name} - onPause`);
    }

    onStop() {
      this.lifecycleState = LifecycleState.STOPPED;
      console.log(`${this.constructor.name} - onStop`);
    }

    onDestroyView() {
      console.log(`${this.constructor.name} - onDestroyView`);
      this.rootView = null;
    }

    onDestroy() {
      this.lifecycleState = LifecycleState.DESTROYED;
      console.log(`${this.constructor.name} - onDestroy`);
    }

    onDetach() {
      this.activity = null;
      console.log(`${this.constructor.name} - onDetach`);
    }

    onSaveInstanceState(outState) {
      console.log(`${this.constructor.name} - onSaveInstanceState`);
    }

    // ========== View Methods ==========
    getView() {
      return this.rootView;
    }

    findViewById(id) {
      return this.rootView ? this.rootView.querySelector(`#${id}`) : null;
    }

    // ========== Arguments/Context Methods ==========
    setArguments(bundle) {
      this.arguments = bundle;
    }

    getArguments() {
      return this.arguments;
    }

    getActivity() {
      return this.activity;
    }

    requireActivity() {
      if (!this.activity) {
        throw new Error('Fragment not attached to activity');
      }
      return this.activity;
    }

    // ========== Navigation Methods ==========
    getParentFragmentManager() {
      return this.activity ? this.activity.getSupportFragmentManager() : null;
    }
  }

  // ============================================================================
  // Fragment Transaction
  // ============================================================================
  class FragmentTransaction {
    constructor(activity) {
      this.activity = activity;
      this.operations = [];
    }

    add(containerId, fragment, tag = null) {
      this.operations.push({ type: 'add', containerId, fragment, tag });
      return this;
    }

    replace(containerId, fragment, tag = null) {
      this.operations.push({ type: 'replace', containerId, fragment, tag });
      return this;
    }

    remove(fragment) {
      this.operations.push({ type: 'remove', fragment });
      return this;
    }

    hide(fragment) {
      this.operations.push({ type: 'hide', fragment });
      return this;
    }

    show(fragment) {
      this.operations.push({ type: 'show', fragment });
      return this;
    }

    addToBackStack(name = null) {
      this.backStackName = name;
      return this;
    }

    commit() {
      this.operations.forEach(op => {
        switch (op.type) {
          case 'add':
            this._addFragment(op.containerId, op.fragment, op.tag);
            break;
          case 'replace':
            this._replaceFragment(op.containerId, op.fragment, op.tag);
            break;
          case 'remove':
            this._removeFragment(op.fragment);
            break;
          case 'hide':
            this._hideFragment(op.fragment);
            break;
          case 'show':
            this._showFragment(op.fragment);
            break;
        }
      });

      if (this.backStackName !== undefined) {
        // Add to back stack logic here
      }

      this.operations = [];
    }

    commitNow() {
      this.commit();
    }

    _addFragment(containerId, fragment, tag) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
      }

      fragment.onAttach(this.activity);
      fragment.onCreate(null);
      
      const view = fragment.onCreateView(null);
      if (view) {
        if (view instanceof HTMLElement) {
          fragment.rootView = view;
        } else if (view && typeof view.getElement === 'function') {
          fragment.rootView = view.getElement();
        }
        
        container.appendChild(fragment.rootView);
        fragment.onViewCreated(fragment.rootView, null);
      }

      fragment.onStart();
      fragment.onResume();

      const fragmentId = tag || `fragment_${Date.now()}_${Math.random()}`;
      fragment.fragmentId = fragmentId;
      this.activity.fragments.set(fragmentId, fragment);
    }

    _replaceFragment(containerId, fragment, tag) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
      }

      // Remove existing fragments in this container
      this.activity.fragments.forEach((frag, id) => {
        if (frag.rootView && container.contains(frag.rootView)) {
          this._removeFragment(frag);
        }
      });

      // Add new fragment
      this._addFragment(containerId, fragment, tag);
    }

    _removeFragment(fragment) {
      fragment.onPause();
      fragment.onStop();
      fragment.onDestroyView();
      
      if (fragment.rootView && fragment.rootView.parentNode) {
        fragment.rootView.parentNode.removeChild(fragment.rootView);
      }
      
      fragment.onDestroy();
      fragment.onDetach();

      if (fragment.fragmentId) {
        this.activity.fragments.delete(fragment.fragmentId);
      }
    }

    _hideFragment(fragment) {
      if (fragment.rootView) {
        fragment.rootView.style.display = 'none';
      }
    }

    _showFragment(fragment) {
      if (fragment.rootView) {
        fragment.rootView.style.display = '';
      }
    }
  }

  // ============================================================================
  // Activity Manager
  // ============================================================================
  const ActivityManager = (() => {
    let activityStack = [];
    let currentActivity = null;

    const startActivity = (intent) => {
      if (!(intent instanceof Intent)) {
        throw new Error('startActivity requires an Intent object');
      }

      const ActivityClass = intent.targetActivity;

      // Handle intent flags
      if (intent.hasFlag(Intent.FLAG_ACTIVITY_CLEAR_TOP)) {
        const index = activityStack.findIndex(a => a instanceof ActivityClass);
        if (index !== -1) {
          // Clear activities above this one
          while (activityStack.length > index + 1) {
            const removed = activityStack.pop();
            removed.onPause();
            removed.onStop();
            removed.onDestroy();
          }
          currentActivity = activityStack[activityStack.length - 1];
          currentActivity.onNewIntent(intent);
          currentActivity.onResume();
          return;
        }
      }

      if (intent.hasFlag(Intent.FLAG_ACTIVITY_SINGLE_TOP)) {
        if (currentActivity instanceof ActivityClass) {
          currentActivity.onNewIntent(intent);
          return;
        }
      }

      if (intent.hasFlag(Intent.FLAG_ACTIVITY_CLEAR_TASK)) {
        while (activityStack.length > 0) {
          const removed = activityStack.pop();
          removed.onPause();
          removed.onStop();
          removed.onDestroy();
        }
      }

      // Pause current activity
      if (currentActivity) {
        currentActivity.onPause();
        currentActivity.onStop();
      }

      // Create and start new activity
      const newActivity = new ActivityClass();
      newActivity.setIntent(intent);
      
      activityStack.push(newActivity);
      currentActivity = newActivity;

      // Lifecycle: onCreate -> onStart -> onResume
      newActivity.onCreate(null);
      newActivity.onStart();
      newActivity.onResume();
    };

    const finishActivity = () => {
      if (!currentActivity) return;

      // Save result if any
      const result = {
        resultCode: currentActivity.resultCode,
        data: currentActivity.resultData
      };

      // Destroy current activity
      currentActivity.onPause();
      currentActivity.onStop();
      currentActivity.onDestroy();
      
      activityStack.pop();

      // Resume previous activity
      if (activityStack.length > 0) {
        currentActivity = activityStack[activityStack.length - 1];
        
        // Deliver result if there was a request code
        if (currentActivity.intent && currentActivity.intent.requestCode !== undefined) {
          if (currentActivity.onActivityResult) {
            currentActivity.onActivityResult(
              currentActivity.intent.requestCode,
              result.resultCode,
              result.data
            );
          }
        }
        
        currentActivity.onStart();
        currentActivity.onResume();
      } else {
        currentActivity = null;
        // Clear app container
        const container = document.getElementById('app');
        if (container) {
          container.innerHTML = '';
        }
      }
    };

    const getCurrentActivity = () => currentActivity;

    const getActivityStack = () => [...activityStack];

    const clearAllActivities = () => {
      while (activityStack.length > 0) {
        finishActivity();
      }
    };

    return {
      startActivity,
      finishActivity,
      getCurrentActivity,
      getActivityStack,
      clearAllActivities
    };
  })();

  // ============================================================================
  // Application Entry Point
  // ============================================================================
  const Application = {
    launch: (MainActivityClass, extras = {}) => {
      const intent = new Intent(MainActivityClass, extras);
      ActivityManager.startActivity(intent);
    },

    // Global back button handler
    setupBackButton: () => {
      window.addEventListener('popstate', () => {
        const currentActivity = ActivityManager.getCurrentActivity();
        if (currentActivity && currentActivity.onBackPressed) {
          currentActivity.onBackPressed();
        }
      });

      // Optional: Add keyboard back button (ESC key)
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const currentActivity = ActivityManager.getCurrentActivity();
          if (currentActivity && currentActivity.onBackPressed) {
            currentActivity.onBackPressed();
          }
        }
      });
    }
  };

  // ============================================================================
  // Export Public API
  // ============================================================================
  return {
    Activity,
    Fragment,
    Intent,
    Bundle,
    ActivityManager,
    Application,
    LifecycleState,
    
    // Result codes
    RESULT_OK: -1,
    RESULT_CANCELED: 0
  };
})();

// Make available globally
window.AndroidFramework = AndroidFramework;

// Add toast animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      transform: translate(-50%, 100px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%);
      opacity: 1;
    }
  }
  
  @keyframes slideDown {
    from {
      transform: translateX(-50%);
      opacity: 1;
    }
    to {
      transform: translate(-50%, 100px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
