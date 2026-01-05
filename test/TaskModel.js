
        /**
         * Simple Data Store to simulate a backend
         */
        const TaskRepository = {
            tasks: [
                { id: 1, title: 'Review AndroidLayouts Docs', desc: 'Check the new API endpoints', date: 'Today' },
                { id: 2, title: 'Buy Groceries', desc: 'Milk, Eggs, Coffee', date: 'Tomorrow' },
                { id: 3, title: 'Team Meeting', desc: 'Discuss Q1 Roadmap', date: 'Mon, 10:00 AM' }
            ],
            addTask(title, desc) {
                this.tasks.unshift({
                    id: Date.now(),
                    title,
                    desc,
                    date: 'Just now'
                });
            },
            deleteTask(id) {
                this.tasks = this.tasks.filter(t => t.id !== id);
            }
        };

        // Destructure Framework Globals
        const { Activity, Intent, Application, ActivityManager } = AndroidFramework;
        const { LinearLayout, Column, Row, FrameLayout, Positioned, ConstraintLayout, Constrained } = AndroidLayouts;
        const { 
            TextView, MaterialButton, MaterialInput, Card, RecyclerView, 
            MaterialToolbar, BottomNavigation, Icon, Avatar, MaterialDialog, 
            Snackbar, MaterialSwitch 
        } = AndroidComponents;

        /**
         * Activity 1: Add Task Screen
         * Demonstrates: MaterialInput, MaterialButton (loading state), Validation
         */
        class AddTaskActivity extends Activity {
            onCreate(savedInstanceState) {
                super.onCreate(savedInstanceState);

                // Inputs
                this.titleInput = MaterialInput({
                    label: 'Task Title',
                    leadingIcon: 'bx bx-task',
                    required: true
                });

                this.descInput = MaterialInput({
                    label: 'Description',
                    leadingIcon: 'bx bx-detail',
                    type: 'textarea'
                });

                // Save Button
                this.saveBtn = MaterialButton({
                    text: 'Save Task',
                    leadingIcon: 'bx bx-save',
                    fullWidth: true,
                    onClick: () => this.handleSave()
                });

                // Layout
                const content = Column({
                    padding: 20,
                    gap: 16,
                    height: 'match_parent'
                }, [
                    this.titleInput,
                    this.descInput,
                    this.saveBtn
                ]);

                // Toolbar
                const toolbar = MaterialToolbar({
                    title: 'New Task',
                    navigationIcon: 'bx bx-arrow-back',
                    onNavigationClick: () => this.finish()
                });

                this.setContentView(Column({}, [toolbar, content]));
            }

            async handleSave() {
                const title = this.titleInput.getValue();
                const desc = this.descInput.getValue();

                if (!title) {
                    this.titleInput.setError('Title is required');
                    return;
                }

                // Simulate network delay
                this.saveBtn.setLoading(true, 'Saving...');
                
                await new Promise(r => setTimeout(r, 800));

                TaskRepository.addTask(title, desc);
                
                this.saveBtn.setLoading(false);
                Snackbar.success('Task created successfully!');
                
                // Return to previous screen
                this.finish();
            }
        }

        /**
         * Activity 2: Profile Screen
         * Demonstrates: Card, Switch (Dark Mode), Avatar
         */
        class ProfileActivity extends Activity {
            onCreate(savedInstanceState) {
                super.onCreate(savedInstanceState);

                const toolbar = MaterialToolbar({ title: 'Profile' });

                const profileCard = Card({
                    variant: 'outlined',
                    padding: 20
                }, [
                    Column({ gap: 10, gravity: 'center' }, [
                        Avatar({ text: 'JS', size: 80 }),
                        TextView({ text: 'JS Developer', textSize: 20, textStyle: 'bold' }),
                        TextView({ text: 'dev@androidlayouts.js', textColor: '#666' })
                    ])
                ]);

                const settingsSection = Column({ gap: 16, padding: { top: 20 } }, [
                    TextView({ text: 'Settings', textStyle: 'bold', textSize: 18 }),
                    
                    Row({ gravity: 'space_between', width: 'match_parent' }, [
                        Row({ gap: 10, gravity: 'center_vertical' }, [
                            Icon({ name: 'bx bx-moon', size: 24 }),
                            TextView({ text: 'Dark Mode' })
                        ]),
                        MaterialSwitch({
                            onChange: (isChecked) => {
                                document.documentElement.classList.toggle('dark', isChecked);
                                const app = document.getElementById('app');
                                if(isChecked) {
                                    app.style.backgroundColor = '#1e1e1e';
                                    app.style.color = '#fff';
                                } else {
                                    app.style.backgroundColor = '#fff';
                                    app.style.color = '#000';
                                }
                            }
                        })
                    ]),
                    
                    MaterialButton({
                        text: 'Log Out',
                        variant: 'outlined',
                        fullWidth: true,
                        textColor: '#ff4444',
                        onClick: () => {
                            MaterialDialog.confirm('Log Out', 'Are you sure you want to exit?', {
                                confirmText: 'Log Out',
                                confirmError: true,
                                onConfirm: () => {
                                    Snackbar.show('Logged out (Demo)');
                                }
                            });
                        }
                    })
                ]);

                const content = Column({ padding: 20 }, [profileCard, settingsSection]);

                // Bottom Nav
                const bottomNav = BottomNavigation()
                    .setItems([
                        { id: 'home', name: 'Tasks', icon: 'bx bx-list-ul' },
                        { id: 'profile', name: 'Profile', icon: 'bx bx-user' }
                    ])
                    .setOnItemSelect((id) => {
                        if (id === 'home') {
                            const intent = new Intent(MainActivity);
                            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                            this.startActivity(intent);
                        }
                    });
                
                // Manually set active item for visual consistency
                setTimeout(() => {
                    // Accessing internal element for demo purposes to set active state
                    const nav = bottomNav.element.querySelector('[data-id="profile"]');
                    if(nav) nav.click(); 
                }, 50);

                this.setContentView(Column({ height: 'match_parent', gravity: 'space_between' }, [
                    Column({}, [toolbar, content]),
                    bottomNav
                ]));
            }
        }

        /**
         * Activity 3: Main Activity (Home)
         * Demonstrates: RecyclerView, FAB, Navigation, Dialogs
         */
        class MainActivity extends Activity {
            onCreate(savedInstanceState) {
                super.onCreate(savedInstanceState);
                this.renderUI();
            }

            // Called when returning to this activity
            onResume() {
                super.onResume();
                // Refresh list to show new tasks
                if (this.recyclerView) {
                    this.renderUI(); 
                }
            }

            renderUI() {
                // Toolbar
                const toolbar = MaterialToolbar({
                    title: 'Task Master',
                    actions: [
                        { icon: 'bx bx-search', onClick: () => this.toast('Search clicked') },
                        { icon: 'bx bx-dots-vertical-rounded', onClick: () => {} }
                    ]
                });

                // Task List
                this.recyclerView = RecyclerView({
                    data: TaskRepository.tasks,
                    divider: true,
                    emptyText: 'No tasks yet. Add one!',
                    emptyIcon: 'bx bx-coffee',
                    adapter: (task) => {
                        return Card({
                            variant: 'filled', 
                            padding: 12,
                            onClick: () => this.showTaskOptions(task)
                        }, [
                            Row({ gap: 12, gravity: 'center_vertical' }, [
                                Icon({ name: 'bx bx-check-circle', color: '#6750a4', size: 24 }),
                                Column({ gap: 4, width: 'match_parent' }, [
                                    TextView({ text: task.title, textStyle: 'bold' }),
                                    TextView({ text: task.desc, textSize: 12, textColor: '#666' }),
                                    TextView({ text: task.date, textSize: 10, textColor: '#999' })
                                ])
                            ])
                        ]);
                    }
                });

                // Floating Action Button (FAB)
                const fab = Positioned({
                    gravity: 'bottom_right',
                    zIndex: 10
                }, MaterialButton({
                    iconOnly: true,
                    leadingIcon: 'bx bx-plus',
                    size: 'large',
                    onClick: () => {
                        const intent = new Intent(AddTaskActivity);
                        this.startActivity(intent);
                    }
                }));

                // Main Content Area with FAB overlay
                const contentArea = FrameLayout({
                    width: 'match_parent',
                    height: '100%', // Take remaining space
                    padding: 16
                }, [
                    this.recyclerView,
                    fab
                ]);

                // Bottom Navigation
                const bottomNav = BottomNavigation()
                    .setItems([
                        { id: 'home', name: 'Tasks', icon: 'bx bx-list-ul' },
                        { id: 'profile', name: 'Profile', icon: 'bx bx-user' }
                    ])
                    .setOnItemSelect((id) => {
                        if (id === 'profile') {
                            const intent = new Intent(ProfileActivity);
                            this.startActivity(intent);
                        }
                    });

                // Root Layout
                const root = Column({
                    width: 'match_parent',
                    height: 'match_parent'
                }, [
                    toolbar,
                    // We need the content area to grow to fill space between toolbar and nav
                    Object.assign(contentArea.getElement(), { style: 'flex: 1; position: relative;' }) && contentArea,
                    bottomNav
                ]);

                this.setContentView(root);
            }

            showTaskOptions(task) {
                MaterialDialog.confirm(
                    'Delete Task?', 
                    `Are you sure you want to delete "${task.title}"?`, 
                    {
                        confirmText: 'Delete',
                        confirmError: true,
                        onConfirm: () => {
                            TaskRepository.deleteTask(task.id);
                            Snackbar.show('Task deleted');
                            this.renderUI(); // Re-render list
                        }
                    }
                );
            }
        }

        // Initialize App
        Application.setupBackButton();
        Application.launch(MainActivity);
