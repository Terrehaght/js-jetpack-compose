// MainActivity.js - Main activity with drawer, toolbar, and bottom navigation
const { Activity, Intent, Bundle, Application } = AndroidFramework;
const { Column, Row } = AndroidLayouts;
const { MaterialToolbar, MaterialDrawer, BottomNavigation, TabLayout, Card , TextView} = AndroidComponents;

class MainActivity extends Activity {
    constructor() {
        super();
        this.drawer = null;
        this.toolbar = null;
        this.bottomNav = null;
        this.fragmentContainer = null;
        this.currentFragmentId = 'tasks';
    }

    onCreate(savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Create the main layout
        const mainLayout = Column({
            width: 'match_parent',
            height: 'match_parent',
            background: '#f5f5f5'
        }, []);

        // Create and add toolbar
        this.toolbar = this.createToolbar();
        mainLayout.getElement().appendChild(this.toolbar.getElement());

        // Create fragment container for bottom nav content
        this.fragmentContainer = document.createElement('div');
        this.fragmentContainer.id = 'fragment-container';
        this.fragmentContainer.style.flex = '1';
        this.fragmentContainer.style.overflow = 'auto';
        this.fragmentContainer.style.paddingBottom = '80px'; // Space for bottom nav
        mainLayout.getElement().appendChild(this.fragmentContainer);

        // Create drawer with TabLayout
        this.drawer = this.createDrawer();

        // Create bottom navigation
        this.bottomNav = this.createBottomNavigation();

        this.setContentView(mainLayout);

        // Load initial fragment
        this.loadFragment('tasks');
    }

    createToolbar() {
        return MaterialToolbar({
            title: 'Tasks',
            navigationIcon: 'bx bx-menu',
            onNavigationClick: () => {
                this.drawer.open();
            },
            actions: [
                {
                    icon: 'bx bx-search',
                    label: 'Search',
                    onClick: () => this.toast('Search clicked')
                },
                {
                    icon: 'bx bx-bell',
                    label: 'Notifications',
                    badge: '3',
                    onClick: () => this.toast('You have 3 notifications')
                }
            ],
            overflowMenu: [
                {
                    text: 'Settings',
                    icon: 'bx bx-cog',
                    onClick: () => this.toast('Settings clicked')
                },
                {
                    text: 'Help',
                    icon: 'bx bx-help-circle',
                    onClick: () => this.toast('Help clicked')
                },
                {
                    text: 'About',
                    icon: 'bx bx-info-circle',
                    onClick: () => this.toast('About clicked')
                }
            ]
        });
    }

    createDrawer() {
        // Create TabLayout for drawer
        const tabLayout = TabLayout({
            tabs: [
                { text: 'Application', icon: 'bx bx-mobile' },
                { text: 'Posts', icon: 'bx bx-file' },
                { text: 'Employees', icon: 'bx bx-group' }
            ],
            pages: [
                this.createApplicationTab(),
                this.createPostsTab(),
                this.createEmployeesTab()
            ],
            mode: 'fixed',
            style: 'primary',
            swipeable: true,
            onTabSelected: (index, tab) => {
                console.log(`Selected tab: ${tab.text}`);
            }
        });

        return MaterialDrawer({
            position: 'left',
            header: {
                title: 'Navigation',
                subtitle: 'Select a section'
            },
            items: [
                {
                    type: 'layout',
                    layout: tabLayout
                }
            ],
            dismissOnItemClick: false
        });
    }

    createApplicationTab() {
        return Column({
            padding: 16,
            gap: 12,
            width: 'match_parent'
        }, [
            TextView({
                text: 'Application Settings',
                textSize: 18,
                textStyle: 'bold',
                textColor: '#1d1b20'
            }),
            Card({
                variant: 'outlined',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    TextView({
                        text: 'App Version: 1.0.0',
                        textSize: 14
                    }),
                    TextView({
                        text: 'Build: 2024.01.05',
                        textSize: 12,
                        textColor: '#666'
                    })
                ])
            ]),
            Card({
                variant: 'outlined',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    TextView({
                        text: 'Theme',
                        textSize: 14,
                        textStyle: 'bold'
                    }),
                    TextView({
                        text: 'Customize your app appearance',
                        textSize: 12,
                        textColor: '#666'
                    })
                ])
            ])
        ]);
    }

    createPostsTab() {
        return Column({
            padding: 16,
            gap: 12,
            width: 'match_parent'
        }, [
            TextView({
                text: 'Recent Posts',
                textSize: 18,
                textStyle: 'bold',
                textColor: '#1d1b20'
            }),
            Card({
                variant: 'filled',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    TextView({
                        text: 'Post Title 1',
                        textSize: 16,
                        textStyle: 'bold'
                    }),
                    TextView({
                        text: 'This is a sample post content...',
                        textSize: 14,
                        textColor: '#666'
                    }),
                    TextView({
                        text: '2 hours ago',
                        textSize: 12,
                        textColor: '#999'
                    })
                ])
            ]),
            Card({
                variant: 'filled',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    TextView({
                        text: 'Post Title 2',
                        textSize: 16,
                        textStyle: 'bold'
                    }),
                    TextView({
                        text: 'Another interesting post...',
                        textSize: 14,
                        textColor: '#666'
                    }),
                    TextView({
                        text: '5 hours ago',
                        textSize: 12,
                        textColor: '#999'
                    })
                ])
            ])
        ]);
    }

    createEmployeesTab() {
        return Column({
            padding: 16,
            gap: 12,
            width: 'match_parent'
        }, [
            TextView({
                text: 'Employee Directory',
                textSize: 18,
                textStyle: 'bold',
                textColor: '#1d1b20'
            }),
            Card({
                variant: 'outlined',
                padding: 16
            }, [
                Row({ gap: 12, gravity: 'center_vertical' }, [
                    Column({ gap: 4 }, [
                        TextView({
                            text: 'John Doe',
                            textSize: 16,
                            textStyle: 'bold'
                        }),
                        TextView({
                            text: 'Software Engineer',
                            textSize: 14,
                            textColor: '#666'
                        })
                    ])
                ])
            ]),
            Card({
                variant: 'outlined',
                padding: 16
            }, [
                Row({ gap: 12, gravity: 'center_vertical' }, [
                    Column({ gap: 4 }, [
                        TextView({
                            text: 'Jane Smith',
                            textSize: 16,
                            textStyle: 'bold'
                        }),
                        TextView({
                            text: 'Product Manager',
                            textSize: 14,
                            textColor: '#666'
                        })
                    ])
                ])
            ]),
            Card({
                variant: 'outlined',
                padding: 16
            }, [
                Row({ gap: 12, gravity: 'center_vertical' }, [
                    Column({ gap: 4 }, [
                        TextView({
                            text: 'Mike Johnson',
                            textSize: 16,
                            textStyle: 'bold'
                        }),
                        TextView({
                            text: 'UX Designer',
                            textSize: 14,
                            textColor: '#666'
                        })
                    ])
                ])
            ])
        ]);
    }

    createBottomNavigation() {
        return BottomNavigation()
            .setItems([
                { id: 'tasks', name: 'Tasks', icon: 'bx bx-task' },
                { id: 'completed', name: 'Completed', icon: 'bx bx-check-circle' },
                { id: 'groups', name: 'Groups', icon: 'bx bx-group' },
                { id: 'wallet', name: 'Wallet', icon: 'bx bx-wallet' },
                { id: 'profile', name: 'Profile', icon: 'bx bx-user' }
            ])
            .setOnItemSelect((id) => {
                this.loadFragment(id);
            })
            .show();
    }

    loadFragment(fragmentId) {
        this.currentFragmentId = fragmentId;
        
        // Update toolbar title based on fragment
        const titles = {
            'tasks': 'Tasks',
            'completed': 'Completed',
            'groups': 'Groups',
            'wallet': 'Wallet',
            'profile': 'Profile'
        };
        
        this.toolbar.setTitle(titles[fragmentId] || 'App');

        // Clear fragment container
        this.fragmentContainer.innerHTML = '';

        // Create fragment content
        let fragmentContent;
        
        switch(fragmentId) {
            case 'tasks':
                fragmentContent = this.createTasksFragment();
                break;
            case 'completed':
                fragmentContent = this.createCompletedFragment();
                break;
            case 'groups':
                fragmentContent = this.createGroupsFragment();
                break;
            case 'wallet':
                fragmentContent = this.createWalletFragment();
                break;
            case 'profile':
                fragmentContent = this.createProfileFragment();
                break;
            default:
                fragmentContent = this.createTasksFragment();
        }

        this.fragmentContainer.appendChild(fragmentContent.getElement());
    }

    createTasksFragment() {
        return Column({
            width: 'match_parent',
            padding: 16,
            gap: 12
        }, [
            TextView({
                text: 'Active Tasks',
                textSize: 20,
                textStyle: 'bold'
            }),
            Card({
                variant: 'elevated',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    TextView({
                        text: 'Complete project documentation',
                        textSize: 16,
                        textStyle: 'bold'
                    }),
                    TextView({
                        text: 'Due: Tomorrow',
                        textSize: 14,
                        textColor: '#d32f2f'
                    }),
                    TextView({
                        text: 'Priority: High',
                        textSize: 12,
                        textColor: '#666'
                    })
                ])
            ]),
            Card({
                variant: 'elevated',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    TextView({
                        text: 'Review code changes',
                        textSize: 16,
                        textStyle: 'bold'
                    }),
                    TextView({
                        text: 'Due: In 3 days',
                        textSize: 14,
                        textColor: '#f57c00'
                    }),
                    TextView({
                        text: 'Priority: Medium',
                        textSize: 12,
                        textColor: '#666'
                    })
                ])
            ]),
            Card({
                variant: 'elevated',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    TextView({
                        text: 'Update dependencies',
                        textSize: 16,
                        textStyle: 'bold'
                    }),
                    TextView({
                        text: 'Due: Next week',
                        textSize: 14,
                        textColor: '#388e3c'
                    }),
                    TextView({
                        text: 'Priority: Low',
                        textSize: 12,
                        textColor: '#666'
                    })
                ])
            ])
        ]);
    }

    createCompletedFragment() {
        return Column({
            width: 'match_parent',
            padding: 16,
            gap: 12
        }, [
            TextView({
                text: 'Completed Tasks',
                textSize: 20,
                textStyle: 'bold'
            }),
            Card({
                variant: 'filled',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    Row({ gap: 8, gravity: 'center_vertical' }, [
                        TextView({
                            text: '✓',
                            textSize: 20,
                            textColor: '#388e3c'
                        }),
                        TextView({
                            text: 'Setup development environment',
                            textSize: 16
                        })
                    ]),
                    TextView({
                        text: 'Completed: Yesterday',
                        textSize: 12,
                        textColor: '#666'
                    })
                ])
            ]),
            Card({
                variant: 'filled',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    Row({ gap: 8, gravity: 'center_vertical' }, [
                        TextView({
                            text: '✓',
                            textSize: 20,
                            textColor: '#388e3c'
                        }),
                        TextView({
                            text: 'Write unit tests',
                            textSize: 16
                        })
                    ]),
                    TextView({
                        text: 'Completed: 2 days ago',
                        textSize: 12,
                        textColor: '#666'
                    })
                ])
            ]),
            Card({
                variant: 'filled',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    Row({ gap: 8, gravity: 'center_vertical' }, [
                        TextView({
                            text: '✓',
                            textSize: 20,
                            textColor: '#388e3c'
                        }),
                        TextView({
                            text: 'Design mockups',
                            textSize: 16
                        })
                    ]),
                    TextView({
                        text: 'Completed: Last week',
                        textSize: 12,
                        textColor: '#666'
                    })
                ])
            ])
        ]);
    }

    createGroupsFragment() {
        return Column({
            width: 'match_parent',
            padding: 16,
            gap: 12
        }, [
            TextView({
                text: 'Your Groups',
                textSize: 20,
                textStyle: 'bold'
            }),
            Card({
                variant: 'outlined',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    TextView({
                        text: 'Development Team',
                        textSize: 16,
                        textStyle: 'bold'
                    }),
                    TextView({
                        text: '12 members · 5 active tasks',
                        textSize: 14,
                        textColor: '#666'
                    })
                ])
            ]),
            Card({
                variant: 'outlined',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    TextView({
                        text: 'Design Team',
                        textSize: 16,
                        textStyle: 'bold'
                    }),
                    TextView({
                        text: '8 members · 3 active tasks',
                        textSize: 14,
                        textColor: '#666'
                    })
                ])
            ]),
            Card({
                variant: 'outlined',
                padding: 16
            }, [
                Column({ gap: 8 }, [
                    TextView({
                        text: 'Marketing Team',
                        textSize: 16,
                        textStyle: 'bold'
                    }),
                    TextView({
                        text: '6 members · 2 active tasks',
                        textSize: 14,
                        textColor: '#666'
                    })
                ])
            ])
        ]);
    }

    createWalletFragment() {
        return Column({
            width: 'match_parent',
            padding: 16,
            gap: 12
        }, [
            TextView({
                text: 'Wallet',
                textSize: 20,
                textStyle: 'bold'
            }),
            Card({
                variant: 'elevated',
                padding: 20,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }, [
                Column({ gap: 12 }, [
                    TextView({
                        text: 'Total Balance',
                        textSize: 14,
                        textColor: '#ffffff'
                    }),
                    TextView({
                        text: '$2,459.50',
                        textSize: 32,
                        textStyle: 'bold',
                        textColor: '#ffffff'
                    }),
                    TextView({
                        text: '+$124.50 this month',
                        textSize: 12,
                        textColor: '#b3d9ff'
                    })
                ])
            ]),
            TextView({
                text: 'Recent Transactions',
                textSize: 16,
                textStyle: 'bold'
            }),
            Card({
                variant: 'outlined',
                padding: 16
            }, [
                Row({ gap: 12, gravity: 'space_between' }, [
                    Column({ gap: 4 }, [
                        TextView({
                            text: 'Salary Deposit',
                            textSize: 16
                        }),
                        TextView({
                            text: 'Jan 1, 2026',
                            textSize: 12,
                            textColor: '#666'
                        })
                    ]),
                    TextView({
                        text: '+$2,500.00',
                        textSize: 16,
                        textStyle: 'bold',
                        textColor: '#388e3c'
                    })
                ])
            ]),
            Card({
                variant: 'outlined',
                padding: 16
            }, [
                Row({ gap: 12, gravity: 'space_between' }, [
                    Column({ gap: 4 }, [
                        TextView({
                            text: 'Grocery Shopping',
                            textSize: 16
                        }),
                        TextView({
                            text: 'Dec 30, 2025',
                            textSize: 12,
                            textColor: '#666'
                        })
                    ]),
                    TextView({
                        text: '-$156.40',
                        textSize: 16,
                        textStyle: 'bold',
                        textColor: '#d32f2f'
                    })
                ])
            ])
        ]);
    }

    createProfileFragment() {
        return Column({
            width: 'match_parent',
            padding: 16,
            gap: 16
        }, [
            Card({
                variant: 'elevated',
                padding: 20
            }, [
                Column({ gap: 16, gravity: 'center_horizontal' }, [
                    TextView({
                        text: '👤',
                        textSize: 48
                    }),
                    TextView({
                        text: 'John Doe',
                        textSize: 24,
                        textStyle: 'bold'
                    }),
                    TextView({
                        text: 'john.doe@example.com',
                        textSize: 14,
                        textColor: '#666'
                    })
                ])
            ]),
            TextView({
                text: 'Account Settings',
                textSize: 16,
                textStyle: 'bold'
            }),
            Card({
                variant: 'outlined',
                padding: 16
            }, [
                Column({ gap: 12 }, [
                    Row({ gap: 12, gravity: 'center_vertical' }, [
                        TextView({
                            text: '📧',
                            textSize: 20
                        }),
                        TextView({
                            text: 'Edit Profile',
                            textSize: 16
                        })
                    ]),
                    Row({ gap: 12, gravity: 'center_vertical' }, [
                        TextView({
                            text: '🔒',
                            textSize: 20
                        }),
                        TextView({
                            text: 'Change Password',
                            textSize: 16
                        })
                    ]),
                    Row({ gap: 12, gravity: 'center_vertical' }, [
                        TextView({
                            text: '🔔',
                            textSize: 20
                        }),
                        TextView({
                            text: 'Notifications',
                            textSize: 16
                        })
                    ]),
                    Row({ gap: 12, gravity: 'center_vertical' }, [
                        TextView({
                            text: '🌙',
                            textSize: 20
                        }),
                        TextView({
                            text: 'Dark Mode',
                            textSize: 16
                        })
                    ])
                ])
            ])
        ]);
    }

    onBackPressed() {
        // Close drawer if open
        if (this.drawer && this.drawer.isShowing()) {
            this.drawer.close();
            return;
        }

        // Otherwise, navigate back to previous activity
        const intent = new Intent(WelcomeActivity); // Replace with your previous activity
        this.startActivity(intent);
        this.finish();
    }

    onDestroy() {
        super.onDestroy();
        
        // Cleanup
        if (this.drawer) {
            this.drawer.destroy();
        }
        if (this.bottomNav) {
            this.bottomNav.destroy();
        }
    }
}

// If you want to launch directly (for testing)
// Application.setupBackButton();
Application.launch(MainActivity);