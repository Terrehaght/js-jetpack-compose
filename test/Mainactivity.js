const { Activity, Fragment, Intent, Bundle, ActivityManager, Application } = AndroidFramework;
const { Column, Row, GridLayout, ScrollView, FrameLayout, mount } = AndroidLayouts;
      const {
        TextView, MaterialButton, MaterialSwitch, MaterialInput,
        Card, Icon, Divider, Avatar, RecyclerView,
        MaterialToolbar, MaterialDrawer, BottomNavigation,
        MaterialDialog, Snackbar, TabLayout
      } = AndroidComponents;
class MainActivity extends Activity {

  onCreate(savedInstanceState) {
    super.onCreate(savedInstanceState);

    const root = Column(
      {
        width: 'match_parent',
        height: 'match_parent',
        padding: 20,
        gap: 16
      },
      [
        TextView({
          text: 'Demo App',
          textSize: 24,
          textStyle: 'bold',
          textColor: 'var(--md-primary)'
        }),

        TextView({
          text: 'Android-like SPA using JS + Compose-style layouts',
          textSize: 14
        }),

        

        MaterialButton({
          text: 'Open Settings',
          variant: 'filled',
          fullWidth: true,
          onClick: () => {
            const intent = new Intent(SettingsActivity);
            this.startActivity(intent);
          }
        })
      ]
    ); 
 
    this.setContentView(root);
  }

  buildCard() {
    return Card(
      {
        padding: 16,
        elevation: 2
      },
      [
        TextView({
          text: 'Welcome 👋',
          textSize: 18,
          textStyle: 'bold'
        }),
        TextView({
          text: 'This UI is built entirely with AndroidLayouts and Material Views.',
          margin: '8 0 0 0'
        })
      ]
    );
  }}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initApp() {
  // Setup back button handler
  //Application.setupBackButton();
  
  // Launch MainActivity
  Application.launch(MainActivity);
}
