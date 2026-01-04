// ========================================================it it====================
// EXAMPLE USAGE: Activities and Fragments with AndroidLayouts
// ============================================================================

// Destructure what we need
const { Column, Row, GridLayout, ScrollView, FrameLayout, mount } = AndroidLayouts;
      const {
        TextView, MaterialButton, MaterialSwitch, MaterialInput,
        Card, Icon, Divider, Avatar, RecyclerView,
        MaterialToolbar, MaterialDrawer, BottomNavigation,
        MaterialDialog, Snackbar, TabLayout
      } = AndroidComponents;
// ============================================================================
// Example 1: MainActivity with Compose-like UI
// ============================================================================
class MainActivity extends Activity {
  onCreate(savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Build UI using your Compose-like layout system
    const view = Column({ 
      width: 'match_parent', 
      height: 'match_parent',
      padding: 20,
      background: '#f5f5f5',
      gap: 16
    }, [
      // Header
      this.buildHeader(),
      
      // Content
      this.buildContent(),
      
      // Bottom Navigation
      this.buildBottomNav()
    ]);


const dialogsSection = Column({ padding: 20, gap: 16, className: 'demo-section' }, [
        Column({ gap: 4 }, [
          Row({ gap: 8 }, [
            Icon({ name: 'bx bx-message-rounded', size: 20, color: 'var(--md-primary)' }),
            TextView({ text: 'Dialogs & Snackbars', textSize: 18, textStyle: 'bold', textColor: 'var(--demo-section-title)' })
          ]),
          TextView({ text: 'Modal dialogs and toast notifications', textSize: 13, textColor: 'var(--demo-subtitle)' })
        ]),

        Row({ gap: 8, wrap: true }, [
          MaterialButton({
            text: 'Alert',
            variant: 'outlined',
            leadingIcon: 'bx bx-info-circle',
            onClick: () => MaterialDialog.alert('Information', 'This is an alert dialog with a simple message.')
          }),
          MaterialButton({
            text: 'Confirm',
            variant: 'outlined',
            leadingIcon: 'bx bx-question-mark',
            onClick: () => MaterialDialog.confirm(
              'Confirm Action',
              'Are you sure you want to proceed with this action?',
              {
                onConfirm: () => Snackbar.success('Action confirmed!'),
                onCancel: () => Snackbar.show('Action cancelled')
              }
            )
          }),
          MaterialButton({
            text: 'Prompt',
            variant: 'outlined',
            leadingIcon: 'bx bx-edit',
            onClick: () => MaterialDialog.prompt(
              'Enter Name',
              'What would you like to be called?',
              {
                placeholder: 'Your name',
                onConfirm: (value) => value && Snackbar.show(`Hello, ${value}!`)
              }
            )
          })
        ]),

        Divider({ margin: 8 }),

        Row({ gap: 8, wrap: true }, [
          MaterialButton({
            text: 'Success',
            variant: 'tonal',
            color: '#2e7d32',
            onClick: () => Snackbar.success('Operation completed successfully!')
          }),
          MaterialButton({
            text: 'Error',
            variant: 'tonal',
            color: '#c62828',
            onClick: () => Snackbar.error('Something went wrong!')
          }),
          MaterialButton({
            text: 'With Action',
            variant: 'tonal',
            onClick: () => Snackbar.show('Item deleted', {
              action: { text: 'UNDO', onClick: () => Snackbar.show('Restored!') },
              duration: 5000
            })
          })
        ])
      ]);


    this.setContentView(dialogsSection);
  }

  buildHeader() {
    const header = Row({
      width: 'match_parent',
      height: 'wrap_content',
      gravity: 'space_between',
      padding: { all: 16 },
      background: '#6200ea',
      gap: 12
    }, []);

    const headerElement = header.getElement();
    
    const title = document.createElement('h1');
    title.textContent = 'Main Activity';
    title.style.cssText = 'color: white; margin: 0; font-size: 24px;';
    
    const button = document.createElement('button');
    button.textContent = 'Settings';
    button.style.cssText = 'padding: 8px 16px; background: white; border: none; border-radius: 4px; cursor: pointer;';
    button.onclick = () => {
      const intent = new Intent(SettingsActivity);
      intent.putExtra('from', 'MainActivity');
      this.startActivity(intent);
    };
    
    headerElement.appendChild(title);
    headerElement.appendChild(button);
    
    return header;
  }

  buildContent() {
    const content = Column({
      width: 'match_parent',
      height: 0,
      gap: 12,
      id: 'main-content'
    }, []);

    content.layoutParams = { weight: 1 };

    const contentElement = content.getElement();

    // Add cards
    ['Home', 'Profile', 'Messages', 'Notifications'].forEach(item => {
      const card = this.createCard(item);
      contentElement.appendChild(card);
    });

    return content;
  }

  createCard(title) {
    const card = document.createElement('div');
    card.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s;
    `;
    card.onmouseover = () => card.style.transform = 'translateY(-2px)';
    card.onmouseout = () => card.style.transform = 'translateY(0)';
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.cssText = 'margin: 0 0 8px 0; color: #333;';
    
    const desc = document.createElement('p');
    desc.textContent = `This is the ${title} section`;
    desc.style.cssText = 'margin: 0; color: #666; font-size: 14px;';
    
    card.appendChild(titleEl);
    card.appendChild(desc);

    card.onclick = () => {
      const intent = new Intent(DetailActivity);
      intent.putExtra('title', title);
      intent.putExtra('description', `Details about ${title}`);
      this.startActivity(intent);
    };
    
    return card;
  }

  buildBottomNav() {
    const nav = Row({
      width: 'match_parent',
      height: 'wrap_content',
      gravity: 'space_around',
      padding: 16,
      background: 'white',
      className: 'bottom-nav'
    }, []);

    const navElement = nav.getElement();
    navElement.style.boxShadow = '0 -2px 8px rgba(0,0,0,0.1)';

    ['Home', 'Search', 'Profile'].forEach(item => {
      const btn = document.createElement('button');
      btn.textContent = item;
      btn.style.cssText = `
        padding: 12px 24px;
        background: none;
        border: none;
        color: #6200ea;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        border-radius: 4px;
      `;
      btn.onmouseover = () => btn.style.background = '#f0f0f0';
      btn.onmouseout = () => btn.style.background = 'none';
      btn.onclick = () => this.toast(`Clicked ${item}`);
      navElement.appendChild(btn);
    });

    return nav;
  }

  onBackPressed() {
    // Override back button behavior
    this.toast('Press back again to exit');
  }
}

// ============================================================================
// Example 2: DetailActivity with Intent Data
// ============================================================================
class DetailActivity extends Activity {
  onCreate(savedInstanceState) {
    super.onCreate(savedInstanceState);

    const intent = this.getIntent();
    const title = intent.getExtra('title', 'No Title');
    const description = intent.getExtra('description', 'No Description');

    const view = Column({
      width: 'match_parent',
      height: 'match_parent',
      background: '#ffffff'
    }, []);

    const viewElement = view.getElement();

    // Back button header
    const header = Row({
      width: 'match_parent',
      padding: 16,
      background: '#6200ea',
      gravity: 'start',
      gap: 12
    }, []);

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back';
    backBtn.style.cssText = 'background: none; border: none; color: white; font-size: 18px; cursor: pointer;';
    backBtn.onclick = () => this.finish();
    
    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    titleEl.style.cssText = 'color: white; margin: 0;';
    
    header.getElement().appendChild(backBtn);
    header.getElement().appendChild(titleEl);

    // Content
    const content = Column({
      padding: 24,
      gap: 16,
      width: 'match_parent'
    }, []);

    const descEl = document.createElement('p');
    descEl.textContent = description;
    descEl.style.cssText = 'font-size: 16px; color: #333; line-height: 1.6;';
    
    const fragmentBtn = document.createElement('button');
    fragmentBtn.textContent = 'Load Fragment';
    fragmentBtn.style.cssText = `
      padding: 12px 24px;
      background: #6200ea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 16px;
    `;
    fragmentBtn.onclick = () => this.loadFragment();
    
    content.getElement().appendChild(descEl);
    content.getElement().appendChild(fragmentBtn);

    // Fragment container
    const fragmentContainer = document.createElement('div');
    fragmentContainer.id = 'fragment-container';
    fragmentContainer.style.cssText = 'width: 100%; flex: 1; background: #f5f5f5; border-radius: 8px; margin-top: 16px;';

    viewElement.appendChild(header.getElement());
    viewElement.appendChild(content.getElement());
    viewElement.appendChild(fragmentContainer);

    this.setContentView(view);
  }

  loadFragment() {
    const fragment = new ExampleFragment();
    
    const bundle = new Bundle();
    bundle.put('message', 'Hello from Activity!');
    bundle.put('timestamp', Date.now());
    fragment.setArguments(bundle);

    this.getSupportFragmentManager()
      .beginTransaction()
      .replace('fragment-container', fragment, 'example-fragment')
      .commit();
  }
}

// ============================================================================
// Example 3: SettingsActivity with Fragments
// ============================================================================
class SettingsActivity extends Activity {
  onCreate(savedInstanceState) {
    super.onCreate(savedInstanceState);

    const view = Column({
      width: 'match_parent',
      height: 'match_parent',
      background: '#f5f5f5'
    }, []);

    const viewElement = view.getElement();

    // Header
    const header = Row({
      width: 'match_parent',
      padding: 16,
      background: '#6200ea',
      gravity: 'start',
      gap: 12
    }, []);

    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back';
    backBtn.style.cssText = 'background: none; border: none; color: white; font-size: 18px; cursor: pointer;';
    backBtn.onclick = () => this.finish();
    
    const titleEl = document.createElement('h2');
    titleEl.textContent = 'Settings';
    titleEl.style.cssText = 'color: white; margin: 0;';
    
    header.getElement().appendChild(backBtn);
    header.getElement().appendChild(titleEl);

    // Tab Navigation
    const tabRow = Row({
      width: 'match_parent',
      background: 'white',
      gap: 0
    }, []);

    const tabs = ['General', 'Account', 'Privacy'];
    this.currentTab = 'General';

    tabs.forEach(tab => {
      const tabBtn = document.createElement('button');
      tabBtn.textContent = tab;
      tabBtn.style.cssText = `
        flex: 1;
        padding: 16px;
        background: ${this.currentTab === tab ? '#6200ea' : 'white'};
        color: ${this.currentTab === tab ? 'white' : '#666'};
        border: none;
        border-bottom: ${this.currentTab === tab ? '3px solid #6200ea' : '3px solid transparent'};
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      `;
      tabBtn.onclick = () => this.switchTab(tab, tabBtn, tabs);
      tabRow.getElement().appendChild(tabBtn);
    });

    // Fragment container
    const fragmentContainer = document.createElement('div');
    fragmentContainer.id = 'settings-fragment-container';
    fragmentContainer.style.cssText = 'width: 100%; flex: 1; overflow: auto;';

    viewElement.appendChild(header.getElement());
    viewElement.appendChild(tabRow.getElement());
    viewElement.appendChild(fragmentContainer);

    this.setContentView(view);

    // Load default fragment
    this.loadSettingsFragment('General');
  }

  switchTab(tab, button, allTabs) {
    this.currentTab = tab;
    
    // Update button styles
    const buttons = button.parentElement.querySelectorAll('button');
    buttons.forEach((btn, idx) => {
      const isActive = allTabs[idx] === tab;
      btn.style.background = isActive ? '#6200ea' : 'white';
      btn.style.color = isActive ? 'white' : '#666';
      btn.style.borderBottom = isActive ? '3px solid #6200ea' : '3px solid transparent';
    });

    this.loadSettingsFragment(tab);
  }

  loadSettingsFragment(tab) {
    let fragment;
    switch(tab) {
      case 'General':
        fragment = new GeneralSettingsFragment();
        break;
      case 'Account':
        fragment = new AccountSettingsFragment();
        break;
      case 'Privacy':
        fragment = new PrivacySettingsFragment();
        break;
      default:
        fragment = new GeneralSettingsFragment();
    }

    this.getSupportFragmentManager()
      .beginTransaction()
      .replace('settings-fragment-container', fragment)
      .commit();
  }
}

// ============================================================================
// Example Fragment Implementations
// ============================================================================

class ExampleFragment extends Fragment {
  onCreateView(savedInstanceState) {
    const args = this.getArguments();
    const message = args ? args.get('message', 'No message') : 'No message';

    const view = Column({
      padding: 24,
      gap: 16,
      width: 'match_parent',
      height: 'match_parent'
    }, []);

    const viewElement = view.getElement();

    const title = document.createElement('h3');
    title.textContent = 'Example Fragment';
    title.style.cssText = 'color: #6200ea; margin: 0;';

    const messageEl = document.createElement('p');
    messageEl.textContent = `Message: ${message}`;
    messageEl.style.cssText = 'color: #333; font-size: 16px;';

    const button = document.createElement('button');
    button.textContent = 'Close Fragment';
    button.style.cssText = `
      padding: 12px 24px;
      background: #ff5252;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;
    button.onclick = () => {
      this.getParentFragmentManager()
        .beginTransaction()
        .remove(this)
        .commit();
    };

    viewElement.appendChild(title);
    viewElement.appendChild(messageEl);
    viewElement.appendChild(button);

    return view;
  }

  onViewCreated(view, savedInstanceState) {
    super.onViewCreated(view, savedInstanceState);
    this.requireActivity().toast('Fragment loaded!');
  }
}

class GeneralSettingsFragment extends Fragment {
  onCreateView(savedInstanceState) {
    const view = Column({
      padding: 24,
      gap: 16,
      width: 'match_parent'
    }, []);

    const viewElement = view.getElement();

    const settings = [
      { label: 'Notifications', value: true },
      { label: 'Dark Mode', value: false },
      { label: 'Auto-save', value: true }
    ];

    settings.forEach(setting => {
      const row = this.createSettingRow(setting.label, setting.value);
      viewElement.appendChild(row);
    });

    return view;
  }

  createSettingRow(label, checked) {
    const row = Row({
      width: 'match_parent',
      gravity: 'space_between',
      padding: 16,
      background: 'white',
      gap: 16
    }, []).getElement();
    
    row.style.borderRadius = '8px';
    row.style.marginBottom = '8px';

    const labelEl = document.createElement('span');
    labelEl.textContent = label;
    labelEl.style.cssText = 'font-size: 16px; color: #333;';

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = checked;
    toggle.style.cssText = 'width: 48px; height: 24px; cursor: pointer;';

    row.appendChild(labelEl);
    row.appendChild(toggle);

    return row;
  }
}

class AccountSettingsFragment extends Fragment {
  onCreateView(savedInstanceState) {
    const view = Column({
      padding: 24,
      gap: 16,
      width: 'match_parent'
    }, []);

    const viewElement = view.getElement();

    const title = document.createElement('h3');
    title.textContent = 'Account Settings';
    title.style.cssText = 'color: #333; margin: 0;';

    const fields = ['Username', 'Email', 'Password'];
    
    fields.forEach(field => {
      const fieldRow = this.createInputField(field);
      viewElement.appendChild(fieldRow);
    });

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save Changes';
    saveBtn.style.cssText = `
      padding: 12px 24px;
      background: #6200ea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 16px;
    `;
    saveBtn.onclick = () => {
      this.requireActivity().toast('Settings saved!');
    };

    viewElement.appendChild(title);
    viewElement.appendChild(saveBtn);

    return view;
  }

  createInputField(label) {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.style.cssText = 'font-size: 14px; color: #666; font-weight: 600;';

    const input = document.createElement('input');
    input.type = label === 'Password' ? 'password' : 'text';
    input.placeholder = `Enter ${label.toLowerCase()}`;
    input.style.cssText = `
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    `;

    container.appendChild(labelEl);
    container.appendChild(input);

    return container;
  }
}

class PrivacySettingsFragment extends Fragment {
  onCreateView(savedInstanceState) {
    const view = Column({
      padding: 24,
      gap: 16,
      width: 'match_parent'
    }, []);

    const viewElement = view.getElement();

    const title = document.createElement('h3');
    title.textContent = 'Privacy Settings';
    title.style.cssText = 'color: #333; margin: 0;';

    const description = document.createElement('p');
    description.textContent = 'Manage your privacy and data settings';
    description.style.cssText = 'color: #666; font-size: 14px; margin: 0;';

    const options = [
      'Share usage data',
      'Allow analytics',
      'Show online status',
      'Allow friend requests'
    ];

    options.forEach(option => {
      const checkbox = this.createCheckbox(option);
      viewElement.appendChild(checkbox);
    });

    viewElement.appendChild(title);
    viewElement.appendChild(description);

    return view;
  }

  createCheckbox(label) {
    const container = Row({
      width: 'match_parent',
      padding: 16,
      background: 'white',
      gap: 12
    }, []).getElement();

    container.style.borderRadius = '8px';
    container.style.marginBottom = '8px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.cssText = 'width: 20px; height: 20px; cursor: pointer;';

    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.style.cssText = 'font-size: 16px; color: #333; cursor: pointer;';

    container.appendChild(checkbox);
    container.appendChild(labelEl);

    container.onclick = () => checkbox.checked = !checkbox.checked;

    return container;
  }
}

// ============================================================================
// Launch the application
// ============================================================================

// Wait for DOM to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initApp() {
  // Setup back button handler
  Application.setupBackButton();
  
  // Launch MainActivity
  Application.launch(MainActivity);
}
