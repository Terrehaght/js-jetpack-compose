

class SettingsActivity extends AndroidFramework.Activity {

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
          text: 'Settings',
          textSize: 22,
          textStyle: 'bold'
        }),

        Divider({ margin: '8 0' }),

        this.buildDarkModeSwitch(),

        MaterialButton({
          text: 'Back',
          variant: 'outlined',
          onClick: () =>{ const intent = new Intent(MainActivity);
            this.startActivity(intent);}
        })
      ]
    );

    this.setContentView(root);
  }

  buildDarkModeSwitch() {
    return MaterialSwitch({
      label: 'Dark Mode',
      checked: document.documentElement.classList.contains('dark'),
      onChange: (enabled) => {
        document.documentElement.classList.toggle('dark', enabled);
        this.toast(enabled ? 'Dark mode enabled' : 'Dark mode disabled');
      }
    });
  }
}