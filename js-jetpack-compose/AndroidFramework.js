// Android-style Activity and Fragment Framework
// Enhanced with ViewModel + LiveData and Fragment BackStack
// FIXED: Z-index and DOM stacking issues

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
  // LiveData - Reactive State Management
  // ============================================================================
  class LiveData {
    constructor(initialValue = null) {
      this._value = initialValue;
      this._observers = new Set();
      this._version = 0;
    }

    getValue() {
      return this._value;
    }

    setValue(newValue) {
      if (this._value !== newValue) {
        this._value = newValue;
        this._version++;
        this._notifyObservers();
      }
    }

    postValue(newValue) {
      // Simulate posting to main thread
      requestAnimationFrame(() => this.setValue(newValue));
    }

    observe(lifecycleOwner, observer) {
      const wrappedObserver = {
        owner: lifecycleOwner,
        callback: observer,
        lastVersion: -1
      };
      
      this._observers.add(wrappedObserver);
      
      // Immediately call with current value if lifecycle is active
      if (this._isLifecycleActive(lifecycleOwner)) {
        observer(this._value);
        wrappedObserver.lastVersion = this._version;
      }
      
      return () => this._observers.delete(wrappedObserver);
    }

    observeForever(observer) {
      const wrappedObserver = {
        owner: null,
        callback: observer,
        lastVersion: this._version
      };
      
      this._observers.add(wrappedObserver);
      observer(this._value);
      
      return () => this._observers.delete(wrappedObserver);
    }

    removeObservers(lifecycleOwner) {
      this._observers.forEach(observer => {
        if (observer.owner === lifecycleOwner) {
          this._observers.delete(observer);
        }
      });
    }

    _notifyObservers() {
      this._observers.forEach(observer => {
        if (observer.lastVersion < this._version) {
          if (!observer.owner || this._isLifecycleActive(observer.owner)) {
            observer.callback(this._value);
            observer.lastVersion = this._version;
          }
        }
      });
    }

    _isLifecycleActive(owner) {
      return owner.lifecycleState === LifecycleState.STARTED || 
             owner.lifecycleState === LifecycleState.RESUMED;
    }
  }

  // MutableLiveData - convenience class
  class MutableLiveData extends LiveData {
    constructor(initialValue = null) {
      super(initialValue);
    }
  }

  // MediatorLiveData - combines multiple LiveData sources
  class MediatorLiveData extends MutableLiveData {
    constructor() {
      super();
      this._sources = new Map();
    }

    addSource(source, onChanged) {
      const unsubscribe = source.observeForever(onChanged);
      this._sources.set(source, unsubscribe);
    }

    removeSource(source) {
      const unsubscribe = this._sources.get(source);
      if (unsubscribe) {
        unsubscribe();
        this._sources.delete(source);
      }
    }
  }

  // ============================================================================
  // ViewModel - Survives configuration changes
  // ============================================================================
  class ViewModel {
    constructor() {
      this._cleared = false;
    }

    onCleared() {
      console.log(`${this.constructor.name} - onCleared`);
    }

    _clear() {
      if (!this._cleared) {
        this._cleared = true;
        this.onCleared();
      }
    }
  }

  // ============================================================================
  // ViewModelStore - Manages ViewModel lifecycle
  // ============================================================================
  class ViewModelStore {
    constructor() {
      this._store = new Map();
    }

    put(key, viewModel) {
      const existing = this._store.get(key);
      if (existing) {
        existing._clear();
      }
      this._store.set(key, viewModel);
    }

    get(key) {
      return this._store.get(key);
    }

    clear() {
      this._store.forEach(vm => vm._clear());
      this._store.clear();
    }
  }

  // Global ViewModel store (survives activity recreation)
  const globalViewModelStore = new ViewModelStore();

  // ============================================================================
  // ViewModelProvider - Creates/retrieves ViewModels
  // ============================================================================
  class ViewModelProvider {
    constructor(owner, factory = null) {
      this.owner = owner;
      this.factory = factory;
      
      // Use global store for Activities, local for Fragments
      if (owner instanceof Activity) {
        this.store = globalViewModelStore;
        this.keyPrefix = owner.constructor.name;
      } else if (owner instanceof Fragment) {
        if (!owner._viewModelStore) {
          owner._viewModelStore = new ViewModelStore();
        }
        this.store = owner._viewModelStore;
        this.keyPrefix = owner.constructor.name;
      }
    }

    get(ViewModelClass, key = null) {
      const actualKey = key || `${this.keyPrefix}:${ViewModelClass.name}`;
      
      let viewModel = this.store.get(actualKey);
      
      if (!viewModel) {
        if (this.factory) {
          viewModel = this.factory.create(ViewModelClass);
        } else {
          viewModel = new ViewModelClass();
        }
        this.store.put(actualKey, viewModel);
      }
      
      return viewModel;
    }
  }

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

  Intent.FLAG_ACTIVITY_CLEAR_TOP = 'FLAG_ACTIVITY_CLEAR_TOP';
  Intent.FLAG_ACTIVITY_SINGLE_TOP = 'FLAG_ACTIVITY_SINGLE_TOP';
  Intent.FLAG_ACTIVITY_NEW_TASK = 'FLAG_ACTIVITY_NEW_TASK';
  Intent.FLAG_ACTIVITY_CLEAR_TASK = 'FLAG_ACTIVITY_CLEAR_TASK';

  // ============================================================================
  // Bundle
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
      this.fragmentBackStack = [];
      this.fragmentContainerId = null;
      this.resultCode = null;
      this.resultData = null;
    }

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
      this.fragmentBackStack = [];
      console.log(`${this.constructor.name} - onDestroy`);
    }

    onSaveInstanceState(outState) {
      console.log(`${this.constructor.name} - onSaveInstanceState`);
    }

    onRestoreInstanceState(savedInstanceState) {
      console.log(`${this.constructor.name} - onRestoreInstanceState`);
    }

    onNewIntent(intent) {
      this.intent = intent;
      console.log(`${this.constructor.name} - onNewIntent`);
    }

    onBackPressed() {
      // Check if fragment manager can handle back
      if (this.fragmentBackStack.length > 0) {
        this.popBackStack();
        return true;
      }
      
      // Default behavior: finish activity
      ActivityManager.finishActivity();
      return true;
    }

    onActivityResult(requestCode, resultCode, data) {
      console.log(`${this.constructor.name} - onActivityResult`, { requestCode, resultCode, data });
    }

    setContentView(view) {
      if (view instanceof HTMLElement) {
        this.rootView = view;
      } else if (view && typeof view.getElement === 'function') {
        this.rootView = view.getElement();
      } else {
        throw new Error('setContentView requires an HTMLElement or component with getElement() method');
      }
      
      // Add data attribute to identify this as an activity root view
      this.rootView.setAttribute('data-activity-view', 'true');
      this.rootView.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: var(--activity-background, transparent);
      `;
      
      const container = document.getElementById('app');
      if (container) {
        // Hide all previous activity views
        Array.from(container.children).forEach(child => {
          if (child.hasAttribute('data-activity-view')) {
            child.style.display = 'none';
            child.style.visibility = 'hidden';
            child.style.pointerEvents = 'none';
            child.style.zIndex = '0';
          }
        });
        
        // Add and show new activity view
        container.appendChild(this.rootView);
        this.rootView.style.display = 'block';
        this.rootView.style.visibility = 'visible';
        this.rootView.style.pointerEvents = 'auto';
        this.rootView.style.zIndex = '1';
      }
    }

    findViewById(id) {
      return document.getElementById(id);
    }

    runOnUiThread(callback) {
      requestAnimationFrame(callback);
    }

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

    getSupportFragmentManager() {
      return {
        beginTransaction: () => new FragmentTransaction(this),
        popBackStack: () => this.popBackStack(),
        getBackStackEntryCount: () => this.fragmentBackStack.length
      };
    }

    popBackStack() {
      if (this.fragmentBackStack.length === 0) return false;
      
      const entry = this.fragmentBackStack.pop();
      entry.rollback();
      return true;
    }

    setFragmentContainer(containerId) {
      this.fragmentContainerId = containerId;
    }

    // ViewModel support
    getViewModelProvider() {
      return new ViewModelProvider(this);
    }

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
      this._viewModelStore = null;
    }

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
      console.log(`${this.constructor.name} - onCreateView`);
      return null;
    }

    onViewCreated(view, savedInstanceState) {
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
      if (this._viewModelStore) {
        this._viewModelStore.clear();
      }
      console.log(`${this.constructor.name} - onDestroy`);
    }

    onDetach() {
      this.activity = null;
      console.log(`${this.constructor.name} - onDetach`);
    }

    onSaveInstanceState(outState) {
      console.log(`${this.constructor.name} - onSaveInstanceState`);
    }

    getView() {
      return this.rootView;
    }

    findViewById(id) {
      return this.rootView ? this.rootView.querySelector(`#${id}`) : null;
    }

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

    getParentFragmentManager() {
      return this.activity ? this.activity.getSupportFragmentManager() : null;
    }

    // ViewModel support
    getViewModelProvider() {
      return new ViewModelProvider(this);
    }
  }

  // ============================================================================
  // BackStack Entry
  // ============================================================================
  class BackStackEntry {
    constructor(transaction, name) {
      this.transaction = transaction;
      this.name = name;
      this.savedStates = new Map();
    }

    rollback() {
      this.transaction.reverse();
    }
  }

  // ============================================================================
  // Fragment Transaction
  // ============================================================================
  class FragmentTransaction {
    constructor(activity) {
      this.activity = activity;
      this.operations = [];
      this.backStackName = undefined;
      this.committed = false;
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
      if (this.committed) {
        throw new Error('Transaction already committed');
      }
      
      this.committed = true;
      const previousFragments = new Map(this.activity.fragments);
      
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
        const entry = new BackStackEntry(this, this.backStackName);
        entry.previousFragments = previousFragments;
        this.activity.fragmentBackStack.push(entry);
      }

      this.operations = [];
    }

    commitNow() {
      this.commit();
    }

    reverse() {
      // Restore previous fragment state
      const currentFragments = new Map(this.activity.fragments);
      
      // Remove all current fragments
      currentFragments.forEach(fragment => {
        this._removeFragment(fragment);
      });

      // Restore previous fragments
      const entry = this.activity.fragmentBackStack[this.activity.fragmentBackStack.length - 1];
      if (entry && entry.previousFragments) {
        entry.previousFragments.forEach((fragment, id) => {
          this.activity.fragments.set(id, fragment);
          
          if (fragment.rootView) {
            const container = document.getElementById(fragment.rootView.parentElement?.id || 'app');
            if (container && !container.contains(fragment.rootView)) {
              container.appendChild(fragment.rootView);
            }
            fragment.rootView.style.display = '';
          }
          
          fragment.onStart();
          fragment.onResume();
        });
      }
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

      // Pause and hide existing fragments in this container
      this.activity.fragments.forEach((frag, id) => {
        if (frag.rootView && container.contains(frag.rootView)) {
          if (this.backStackName !== undefined) {
            // If adding to backstack, just hide
            frag.onPause();
            frag.onStop();
            this._hideFragment(frag);
          } else {
            // Otherwise remove completely
            this._removeFragment(frag);
          }
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
        fragment.rootView.style.visibility = 'hidden';
        fragment.rootView.style.pointerEvents = 'none';
      }
    }

    _showFragment(fragment) {
      if (fragment.rootView) {
        fragment.rootView.style.display = '';
        fragment.rootView.style.visibility = 'visible';
        fragment.rootView.style.pointerEvents = 'auto';
      }
    }
  }

  // ============================================================================
  // Activity Manager
  // ============================================================================
  const ActivityManager = (() => {
    let activityStack = [];
    let currentActivity = null;
    let isProcessingNavigation = false;

    const renderActivity = (activity) => {
      const container = document.getElementById('app');
      if (!container) return;
      
      // Hide all existing activity views
      Array.from(container.children).forEach(child => {
        if (child.hasAttribute('data-activity-view')) {
          child.style.display = 'none';
          child.style.visibility = 'hidden';
          child.style.pointerEvents = 'none';
          child.style.zIndex = '0';
        }
      });
      
      // Show/add current activity view
      if (activity.rootView) {
        if (!container.contains(activity.rootView)) {
          container.appendChild(activity.rootView);
        }
        activity.rootView.style.display = 'block';
        activity.rootView.style.visibility = 'visible';
        activity.rootView.style.pointerEvents = 'auto';
        activity.rootView.style.zIndex = '1';
      }
    };

    const startActivity = (intent) => {
      if (!(intent instanceof Intent)) {
        throw new Error('startActivity requires an Intent object');
      }

      const ActivityClass = intent.targetActivity;

      if (intent.hasFlag(Intent.FLAG_ACTIVITY_CLEAR_TOP)) {
        const index = activityStack.findIndex(a => a instanceof ActivityClass);
        if (index !== -1) {
          while (activityStack.length > index + 1) {
            const removed = activityStack.pop();
            removed.onPause();
            removed.onStop();
            removed.onDestroy();
            
            // Remove view from DOM
            if (removed.rootView && removed.rootView.parentNode) {
              removed.rootView.parentNode.removeChild(removed.rootView);
            }
          }
          currentActivity = activityStack[activityStack.length - 1];
          currentActivity.onNewIntent(intent);
          renderActivity(currentActivity);
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
          
          // Remove view from DOM
          if (removed.rootView && removed.rootView.parentNode) {
            removed.rootView.parentNode.removeChild(removed.rootView);
          }
        }
      }

      if (currentActivity) {
        currentActivity.onPause();
        currentActivity.onStop();
        
        // Hide the current activity view instead of removing it
        if (currentActivity.rootView) {
          currentActivity.rootView.style.display = 'none';
          currentActivity.rootView.style.visibility = 'hidden';
          currentActivity.rootView.style.pointerEvents = 'none';
          currentActivity.rootView.style.zIndex = '0';
        }
      }

      const newActivity = new ActivityClass();
      newActivity.setIntent(intent);
      
      activityStack.push(newActivity);
      currentActivity = newActivity;

      newActivity.onCreate(null);
      newActivity.onStart();
      newActivity.onResume();
    };

    const finishActivity = () => {
      if (!currentActivity || isProcessingNavigation) {
        return;
      }

      isProcessingNavigation = true;

      const resultCode = currentActivity.resultCode;
      const resultData = currentActivity.resultData;
      const requestCode = currentActivity.intent ? currentActivity.intent.requestCode : undefined;

      currentActivity.onPause();
      currentActivity.onStop();
      currentActivity.onDestroy();
      
      // Remove the current activity's view from DOM
      if (currentActivity.rootView && currentActivity.rootView.parentNode) {
        currentActivity.rootView.parentNode.removeChild(currentActivity.rootView);
      }
      
      activityStack.pop();

      if (activityStack.length > 0) {
        currentActivity = activityStack[activityStack.length - 1];
        
        if (requestCode !== undefined && currentActivity.onActivityResult) {
          currentActivity.onActivityResult(requestCode, resultCode || 0, resultData || {});
        }
        
        renderActivity(currentActivity);
        currentActivity.onStart();
        currentActivity.onResume();
      } else {
        currentActivity = null;
        const container = document.getElementById('app');
        if (container) {
          container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No active activities</div>';
        }
      }

      setTimeout(() => {
        isProcessingNavigation = false;
      }, 50);
    };

    const handleBackButton = () => {
      if (isProcessingNavigation) {
        return;
      }
      
      if (currentActivity) {
        if (currentActivity.onBackPressed) {
          currentActivity.onBackPressed();
        }
      }
    };

    const getCurrentActivity = () => currentActivity;
    const getActivityStack = () => [...activityStack];

    const clearAllActivities = () => {
      isProcessingNavigation = true;
      
      while (activityStack.length > 0) {
        const activity = activityStack.pop();
        activity.onPause();
        activity.onStop();
        activity.onDestroy();
        
        // Remove view from DOM
        if (activity.rootView && activity.rootView.parentNode) {
          activity.rootView.parentNode.removeChild(activity.rootView);
        }
      }
      
      currentActivity = null;
      const container = document.getElementById('app');
      if (container) {
        container.innerHTML = '';
      }
      
      isProcessingNavigation = false;
    };

    return {
      startActivity,
      finishActivity,
      getCurrentActivity,
      getActivityStack,
      clearAllActivities,
      handleBackButton
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

    setupBackButton: () => {
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          ActivityManager.handleBackButton();
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
    
    // ViewModel Architecture
    ViewModel,
    LiveData,
    MutableLiveData,
    MediatorLiveData,
    ViewModelProvider,
    
    // Result codes
    RESULT_OK: -1,
    RESULT_CANCELED: 0
  };
})();

window.AndroidFramework = AndroidFramework;

// Styles
const style = document.createElement('style');
style.textContent = `
  :root {
    --activity-background: transparent;
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    :root {
      --activity-background: #121212;
    }
  }

  #app {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: var(--activity-background);
  }

  [data-activity-view] {
    background-color: var(--activity-background);
  }

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
